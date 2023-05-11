const axios = require("axios");
const { Client } = require("pg");

// DB Configuration
const pgConfig = {
  user: "postgres",
  host: "localhost",
  database: "the-ai-times",
  password: "password",
  port: 5432,
};

// OpenAI API Calls
const temperature = 1;
const model = "text-davinci-003";
const apiKey = "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";

let apiUrl = "https://api.openai.com/v1/completions";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

// GENERATE TITLE
async function generateTitle(category) {
  const params = {
    model: model,
    prompt: "Write a title for a " + category + "news: ",
    temperature: temperature,
    max_tokens: 30,
  };

  return await axios
    .post(apiUrl, params, { headers: headers })
    .then((response) => {
      return response.data.choices[0].text.trim();
    })
    .catch((error) => {
      console.error("Error during title generation: ", error);
    });
}

// GENERATE CONTENT
async function generateContent(titlePrompt) {
  const contentParams = {
    model: model,
    prompt: "Write the content for the news '" + titlePrompt + "':",
    temperature: temperature,
    max_tokens: 100,
  };
  return await axios
    .post(apiUrl, contentParams, { headers: headers })
    .then((response) => {
      return response.data.choices[0].text.trim();
    })
    .catch((error) => {
      console.error("Error during content genderation: ", error);
    });
}

// GENERATE IMAGE
async function generateImage(titlePrompt) {
  const imageApiUrl = "https://api.openai.com/v1/images/generations";

  const imageParams = {
    prompt: titlePrompt.replace(/[^a-zA-Z]/g, ""),
    n: 1,
    size: "400x250",
  };

  console.log("AXIOS IMG");
  return await axios
    .post(imageApiUrl, imageParams, { headers: headers })
    .then((response) => {
      console.log("RICEVUTO: " + response.data + "\n\n");
      return response.data.data[0].url;
    })
    .catch((error) => {
      console.error("Error during image generation:", error);
    });
}

// INSERT DATA INTO DB
async function insertIntoDB(title, content, category, imageUrl) {
  const client = new Client(pgConfig);
  try {
    console.log("Connessione al db...");
    await client.connect();
    const query =
      "INSERT INTO news (title, content, category, imageurl) VALUES ($1, $2, $3, $4)";
    const values = [title, content, category, imageUrl];
    console.log("Query sul db...");
    await client.query(query, values);
  } catch (error) {
    console.error("Error during data insertion into DB: ", error);
  } finally {
    console.log("Chiudo db...");
    await client.end();
  }
}

// CALL ALL FUNCTIONS TO GENERATA NEWS DATA AND INSERT INTO DB
async function generateNewsData(category) {
  try {
    const title = await generateTitle(category);
    const content = await generateContent(title);
    const imageUrl = await generateImage(title);

    console.log(
      "Notizia generata: \n\n" +
        title +
        "\n\n" +
        content +
        "\n\n" +
        imageUrl +
        "\n\n\n"
    );

    await insertIntoDB(title, content, category, imageUrl);
  } catch (error) {
    console.error("Error generating news data:", error);
  }
}

const categories = ["politics", "economy", "science", "sport"];

(async () => {
  for (const category of categories) {
    await generateNewsData(category);
  }
})();
