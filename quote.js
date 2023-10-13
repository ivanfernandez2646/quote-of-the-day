const { ZenRows } = require("zenrows");
const cheerio = require("cheerio");
const { Translate } = require("@google-cloud/translate").v2;

async function getQuote() {
  const client = new ZenRows(process.env.ZEN_ROW_API_KEY);
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

module.exports = { getQuote };
