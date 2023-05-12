const express = require("express");
const app = express();
const { Client } = require("pg");

// DB Configuration
const pgConfig = {
  user: "dxeyhugp",
  host: "horton.db.elephantsql.com",
  database: "dxeyhugp",
  password: "vdjLLvMZ83wlx6ilmDs20fx0DplSq_Wg",
  port: 5432,
};

// ### ### ###
app.use(
  express.static("public", {
    setHeaders: function (res, path, stat) {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "text/javascript");
      }
    },
  })
);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/newsApp.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/newsApp.js");
});

app.get("/weatherApp.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/weatherApp.js");
});

app.get("/client-archive.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/client-archive.js");
});

app.get("/client-index.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/client-index.js");
});

app.get("/index", async (req, res) => {
  const client = new Client(pgConfig);
  try {
    console.log("Connessione al db...");
    await client.connect();
    const query = "SELECT * FROM (SELECT * FROM news n ORDER BY date) news LIMIT 5";
    console.log("Query sul db...");
    const result = await client.query(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error("Error during retrieval from DB: ", error);
  } finally {
    console.log("Chiudo db...");
    await client.end();
  }
});

app.get("/archive", async (req, res) => {
  const client = new Client(pgConfig);
  try {
    console.log("Connessione al db...");
    await client.connect();
    const query = "SELECT * FROM news";
    console.log("Query sul db...");
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error during retrieval from DB: ", error);
  } finally {
    console.log("Chiudo db...");
    await client.end();
  }
});

const PORT = 51555;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
