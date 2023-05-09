const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

// app.js
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();

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

app.get('/newsApp.js', function(req, res) {
  res.type('application/javascript');
  res.sendFile(__dirname + '/newsApp.js');
});

app.get('/weatherApp.js', function(req, res) {
  res.type('application/javascript');
  res.sendFile(__dirname + '/weatherApp.js');
});

const PORT = 51555;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
