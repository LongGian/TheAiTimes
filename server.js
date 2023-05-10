const express = require("express");
const app = express();

// DB Connection
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'the-ai-times',
  password: 'password',
  port: 5432,
});

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

app.get('/newsApp.js', function(req, res) {
  res.type('application/javascript');
  res.sendFile(__dirname + '/newsApp.js');
});

app.get('/weatherApp.js', function(req, res) {
  res.type('application/javascript');
  res.sendFile(__dirname + '/weatherApp.js');
});

app.get('/client-archive.js', function(req, res) {
  res.type('application/javascript');
  res.sendFile(__dirname + '/client-archive.js');
});

app.get('/archive', (req, res) => {
  pool.query('SELECT * FROM news', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(result.rows);
    }
  });
});

const PORT = 51555;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
