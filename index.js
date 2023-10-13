const { getQuote } = require("./quote");
const { sendMail } = require("./mail");
const { sendTelegram } = require("./telegram");
const functions = require("@google-cloud/functions-framework");

require("dotenv").config();

functions.http("quoteOfTheDay", async (req, res) => {
  try {
    const quote = await getQuote();
    await Promise.all([sendMail(quote), sendTelegram(quote)]);

    res.status(200).send({ quote });
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

// (async () => {
//   const quote = await getQuote();
//   await Promise.all([sendMail(quote), sendTelegram(quote)]);
// })();
