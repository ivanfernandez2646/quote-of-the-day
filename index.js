const { ZenRows } = require("zenrows");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { Translate } = require("@google-cloud/translate").v2;
const functions = require("@google-cloud/functions-framework");

require("dotenv").config();

functions.http("quoteOfTheDay", async (req, res) => {
  try {
    const quote = await getQuote();
    await sendMail(quote);

    res.status(200).send({ quote });
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

// (async () => {
//   const quote = await getQuote();
//   await sendMail(quote);
// })();

async function getQuote() {
  const client = new ZenRows("c11c0e859174095dbbbe6e14e9f2523b2300db6c");
  const url = "https://www.brainyquote.com/quote_of_the_day";

  try {
    const { data } = await client.get(url, {}),
      $ = cheerio.load(data),
      quote = $(".mblCenterPhot").text().trim().replaceAll("\n", ""),
      formatQuote = async (value) => {
        const lastPointIndex = value.lastIndexOf("."),
          author = value.slice(lastPointIndex + 1),
          text = value.slice(0, lastPointIndex + 1),
          spanishText = await getTranslatedTextInSpanish(text);

        return {
          author,
          text,
          spanishText,
        };
      };

    return formatQuote(quote);
  } catch (error) {
    console.error(error.message);
    if (error.response) {
      console.error(error.response.data);
    }

    return await getQuote();
  }
}

async function getTranslatedTextInSpanish(text) {
  const translate = new Translate(
      !process.env.FUNCTION_TARGET
        ? {
            projectId: process.env.GOOGLE_PROJECT_ID,
            keyFilename: process.env.GOOGLE_KEY_FILENAME_PATH,
          }
        : undefined
    ),
    target = "es",
    [translation] = await translate.translate(text, target);

  return translation;
}

async function sendMail(quote) {
  const transporter = await createTransporter(),
    currentDateFormatted = new Date(Date.now()).toLocaleDateString("es-ES");

  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: ["ivansurveys26@gmail.com", process.env.MAIL_USERNAME],
    subject: `Quote del día - ${currentDateFormatted}`,
    text: `Author: ${quote.author} Text: ${quote.text} Spanish text: ${quote.spanishText}`,
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Quote del Día - ${currentDateFormatted}</title>
        </head>
        <body>
            <div style="text-align: center; background-color: #f0f0f0; padding: 20px;">
                <h1>${currentDateFormatted}</h1>
                <p style="font-size: 20px;"><i>"${quote.text}"</i></p>
                <p style="font-size: 10px;"><i>"${quote.spanishText}"</i></p>
            </div>
            <div style="text-align: center; background-color: #f0f0f0; padding: 10px;">
                <p style="font-style: italic;">- ${quote.author}</p>
            </div>
        </body>
        </html>`,
  };

  return transporter.sendMail(mailOptions);
}

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.error(err);
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  return transporter;
};
