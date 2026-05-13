<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

loadEnv();

$rawBody = file_get_contents('php://input') ?: '';
$body = json_decode($rawBody, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!empty($body['_honeypot'])) {
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim((string)($body['name'] ?? ''));
$phone = trim((string)($body['phone'] ?? ''));
$email = trim((string)($body['email'] ?? ''));
$contact = trim((string)($body['contact'] ?? ''));
$service = trim((string)($body['service'] ?? ''));
$message = trim((string)($body['message'] ?? ''));
$page = trim((string)($body['_page'] ?? ''));

$errors = [];

$nameLength = stringLength($name);
if ($nameLength < 2 || $nameLength > 100) {
    $errors['name'] = ['Введите имя'];
}

if ($phone !== '' && !preg_match('/^\+?[\d\s\-()]{7,20}$/u', $phone)) {
    $errors['phone'] = ['Некорректный номер'];
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = ['Некорректный email'];
}

if (stringLength($contact) > 100) {
    $errors['contact'] = ['Контакт слишком длинный'];
}

if ($phone === '' && $email === '' && $contact === '') {
    $errors['phone'] = ['Укажите телефон или email'];
}

if (stringLength($message) > 1000) {
    $errors['message'] = ['Сообщение слишком длинное'];
}

if ($errors !== []) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors], JSON_UNESCAPED_UNICODE);
    exit;
}

$botToken = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$chatIds = getenv('TELEGRAM_CHAT_IDS') ?: getenv('TELEGRAM_CHAT_ID') ?: '';
if (getenv('TELEGRAM_CHAT_ID_2')) {
    $chatIds .= ',' . getenv('TELEGRAM_CHAT_ID_2');
}
$chatIds = array_values(array_filter(array_map('trim', explode(',', $chatIds))));

if ($botToken === '' || $chatIds === []) {
    error_log('[contact] Telegram env vars are not configured');
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$now = (new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow')))->format('d.m.Y H:i');
$lines = [
    '📬 <b>Новая заявка — Project 42</b>',
    '',
    '👤 <b>Имя:</b> ' . escapeHtml($name),
];

if ($phone !== '') {
    $lines[] = '📞 <b>Телефон:</b> ' . escapeHtml($phone);
}
if ($email !== '') {
    $lines[] = '✉️ <b>Email:</b> ' . escapeHtml($email);
}
if ($contact !== '') {
    $lines[] = '💬 <b>Контакт:</b> ' . escapeHtml($contact);
}
if ($service !== '') {
    $lines[] = '🎯 <b>Услуга:</b> ' . escapeHtml($service);
}
if ($message !== '') {
    $lines[] = '💬 <b>Сообщение:</b> ' . escapeHtml($message);
}
if ($page !== '') {
    $lines[] = '🌐 <b>Страница:</b> ' . escapeHtml($page);
}

$lines[] = '';
$lines[] = '🕒 <b>Время:</b> ' . $now . ' МСК';
$text = implode("\n", $lines);

$sent = false;
$lastTelegramError = '';

foreach ($chatIds as $chatId) {
    [$response, $error] = sendTelegramMessage($botToken, $chatId, $text);

    if ($error !== '') {
        $lastTelegramError = sanitizeTelegramError($error, $botToken);
        error_log('[contact] Telegram transport error: ' . $lastTelegramError);
        continue;
    }

    $telegramData = json_decode((string)$response, true);
    if (($telegramData['ok'] ?? false) === true) {
        $sent = true;
    } else {
        $lastTelegramError = getTelegramErrorDescription($telegramData, (string)$response, $botToken);
        error_log('[contact] Telegram API error: ' . $lastTelegramError);
    }
}

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Telegram error',
        'details' => $lastTelegramError,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function loadEnv(): void
{
    $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    $paths = array_filter([
        $documentRoot !== '' ? $documentRoot . '/.env.local' : '',
        $documentRoot !== '' ? $documentRoot . '/.env' : '',
        $documentRoot !== '' ? dirname($documentRoot) . '/.env.local' : '',
        $documentRoot !== '' ? dirname($documentRoot) . '/.env' : '',
        __DIR__ . '/../../../.env.local',
        __DIR__ . '/../../../.env',
        __DIR__ . '/../../../../.env.local',
        __DIR__ . '/../../../../.env',
    ]);

    foreach ($paths as $path) {
        if (!is_readable($path)) {
            continue;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            continue;
        }

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || startsWith($line, '#') || strpos($line, '=') === false) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            if (
                (startsWith($value, '"') && endsWith($value, '"')) ||
                (startsWith($value, "'") && endsWith($value, "'"))
            ) {
                $value = substr($value, 1, -1);
            }

            if (getenv($key) === false) {
                putenv($key . '=' . $value);
                $_ENV[$key] = $value;
            }
        }
    }
}

function stringLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
}

/**
 * @param mixed $telegramData
 */
function getTelegramErrorDescription($telegramData, string $rawResponse, string $botToken): string
{
    if (is_array($telegramData)) {
        $code = $telegramData['error_code'] ?? null;
        $description = $telegramData['description'] ?? null;

        if ($code !== null || $description !== null) {
            return trim('code=' . (string)$code . ' ' . (string)$description);
        }
    }

    return sanitizeTelegramError($rawResponse, $botToken);
}

function sanitizeTelegramError(string $error, string $botToken): string
{
    $sanitized = str_replace($botToken, '[telegram-token]', $error);

    return substr($sanitized, 0, 500);
}

/**
 * @return array{0: string, 1: string}
 */
function sendTelegramMessage(string $botToken, string $chatId, string $text): array
{
    $apiBase = rtrim(getenv('TELEGRAM_API_BASE') ?: 'https://api.telegram.org', '/');
    $url = $apiBase . '/bot' . $botToken . '/sendMessage';
    $timeout = max(1, (int)(getenv('TELEGRAM_TIMEOUT') ?: 20));
    $connectTimeout = max(1, (int)(getenv('TELEGRAM_CONNECT_TIMEOUT') ?: 10));
    $payload = http_build_query([
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML',
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_CONNECTTIMEOUT => $connectTimeout,
            CURLOPT_POSTFIELDS => $payload,
        ]);

        $ipResolve = getenv('TELEGRAM_IPRESOLVE') ?: '';
        if ($ipResolve === '4') {
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        } elseif ($ipResolve === '6') {
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V6);
        }

        $response = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        return [(string)$response, $error];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => $timeout,
        ],
    ]);

    $response = @file_get_contents($url, false, $context);

    if ($response === false) {
        $error = error_get_last();
        return ['', (string)($error['message'] ?? 'file_get_contents failed')];
    }

    return [$response, ''];
}

function startsWith(string $value, string $prefix): bool
{
    return substr($value, 0, strlen($prefix)) === $prefix;
}

function endsWith(string $value, string $suffix): bool
{
    if ($suffix === '') {
        return true;
    }

    return substr($value, -strlen($suffix)) === $suffix;
}
