const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS ?? process.env.TELEGRAM_CHAT_ID ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

export async function sendTelegramMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    console.warn('Telegram env vars are not configured')
    return
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  await Promise.all(
    CHAT_IDS.map((chatId) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      }),
    ),
  )
}
