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

if ($phone === '' && $email === '') {
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

foreach ($chatIds as $chatId) {
    $ch = curl_init('https://api.telegram.org/bot' . $botToken . '/sendMessage');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
        CURLOPT_POSTFIELDS => http_build_query([
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ]),
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error !== '') {
        error_log('[contact] Telegram curl error: ' . $error);
        continue;
    }

    $telegramData = json_decode((string)$response, true);
    if (($telegramData['ok'] ?? false) === true) {
        $sent = true;
    } else {
        error_log('[contact] Telegram API error: ' . (string)$response);
    }
}

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Telegram error'], JSON_UNESCAPED_UNICODE);
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
        $documentRoot !== '' ? $documentRoot . '/.env' : '',
        $documentRoot !== '' ? dirname($documentRoot) . '/.env' : '',
        __DIR__ . '/../../../.env',
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

        return;
    }
}

function stringLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
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
