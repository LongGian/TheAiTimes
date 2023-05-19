const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { Client } = require("pg");
require("dotenv").config();

// DB Configuration
const pgConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

// Express Configuration
app.use(
  express.static("public", {
    setHeaders: function (res, path, stat) {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "text/javascript");
      }
    },
  })
);

app.use(bodyParser.json());

// Functions
let latestNews = [];
let allNews = [];

async function fetchAllNews() {
  const client = new Client(pgConfig);
  try {
    console.log("\n[fetchAllNews] Connessione al db...");
    await client.connect();
    const query = "SELECT * FROM news ORDER BY id DESC";
    console.log("[fetchAllNews] Query sul db...");
    const result = await client.query(query);
    allNews = result.rows;
    latestNews = allNews.slice(0,4).reverse();;
  } catch (error) {
    console.error("[fetchAllNews] Error during retrieval from DB: ", error);
  } finally {
    console.log("[fetchAllNews] Chiudo db...");
    await client.end();
  }
}
fetchAllNews();

// Routes
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/newsApp.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/newsApp.js");
});

app.get("/weather.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/weather.js");
});

app.get("/client-archive.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/client-archive.js");
});

app.get("/client-index.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/client-index.js");
});

app.get("/client-subscribe.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/client-subscribe.js");
});

app.get("/client-topNews.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/client-topNews.js");
});

app.get("/index", async (req, res) => {
  res.json(latestNews);
});

app.get("/archive", async (req, res) => {
  res.json(allNews);
});

app.post("/subscribe", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  const client = new Client(pgConfig);

  try {
    console.log("\n[subscribe] Connessione al db...");
    await client.connect();
    const query =
      "INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)";
    console.log("[subscribe] Esecuzione della query sul db...");
    await client.query(query, [email, firstName, lastName, password]);
    res.json({ message: "Iscrizione avvenuta con successo!" });
  } catch (error) {
    console.error("[subscribe] Errore durante l'inserimento nel DB:", error);
    res.status(500).json({ error: "Errore interno del server" });
  } finally {
    console.log("[subscribe] Chiusura connessione al db...");
    await client.end();
  }
});

app.get("/topnews", async (req, res) => {
  res.json(latestNews);
});

const PORT = 51555;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
