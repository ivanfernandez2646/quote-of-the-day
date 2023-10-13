const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

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

module.exports = { sendMail };
