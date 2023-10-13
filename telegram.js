const TelegramBot = require("node-telegram-bot-api");

async function sendTelegram(quote) {
  const token = process.env.TELEGRAM_TOKEN_ID,
    chatId = process.env.TELEGRAM_CHAT_ID,
    bot = new TelegramBot(token, { polling: false });

  bot.sendMessage(
    chatId,
    `<b>${quote.text}</b>\n\n<i>${quote.spanishText}</i>`,
    {
      parse_mode: "HTML",
    }
  );
}

module.exports = { sendTelegram };
