// Import dependencies
require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const axios = require("axios");

// DB Configuration
const pgConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

// Middleware Configuration
app.use(
  express.static("public", {
    setHeaders: function (res, path, stat) {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "text/javascript");
      }
    },
  })
);

app.use(
  session({
    secret: "paolodicanioamogus",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

// Functions
let latestNews = [];
let allNews = [];

async function fetchAllNews() {
  const client = new Client(pgConfig);
  try {
    console.log("\n[fetchAllNews] Connecting to the database...");
    await client.connect();
    const query = "SELECT * FROM news ORDER BY id DESC";
    console.log("[fetchAllNews] Querying the database...");
    const result = await client.query(query);
    allNews = result.rows;
    latestNews = allNews.slice(0, 4).reverse();
  } catch (error) {
    console.error("[fetchAllNews] Error during retrieval from DB:", error);
  } finally {
    console.log("[fetchAllNews] Closing database connection...");
    await client.end();
  }
}

async function saveUserToDB(email, firstName, lastName, hashedPassword, res) {
  const client = new Client(pgConfig);

  try {
    console.log("\n[saveUserToDB] Connecting to the database...");
    await client.connect();
    const query = "INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)";
    console.log("[saveUserToDB] Executing query on the database...");
    await client.query(query, [email, firstName, lastName, hashedPassword]);
    console.log("\n[saveUserToDB] User inserted!");
  } catch (error) {
    console.error("[saveUserToDB] Error during database insertion:", error);
    throw new Error("Internal server error");
  } finally {
    console.log("[saveUserToDB] Closing database connection...");
    await client.end();
  }
}

async function isUserInDB(email) {
  const client = new Client(pgConfig);

  try {
    console.log("\n[isUserInDB] Connecting...");
    await client.connect();
    const query = "SELECT email FROM users";
    console.log("[isUserInDB] Querying the database...");
    const result = await client.query(query);
    console.log(result.rows);
    result.rows.forEach((row) => {
      console.log(row.email + " == " + email);
      if (row.email == email) return true;
    });
    return false;
  } catch (error) {
    console.error("[isUserInDB] Error during retrieval from DB:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    console.log("[isUserInDB] Disconnecting...");
    await client.end();
  }
}

// Fetch initial news data
fetchAllNews();

// Routes
// Serve JavaScript files
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

app.get("/client-login.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/client-login.js");
});

app.get("/dateTime.js", function (req, res) {
  res.type("application/javascript");
  res.sendFile(__dirname + "/dateTime.js");
});

// Routes for data retrieval
app.get("/index", async (req, res) => {
  const response = {
    loggedIn: req.session.loggedIn,
    latestNews: latestNews,
  };
  res.json(response);
});

app.get("/archive", async (req, res) => {
  res.json(allNews);
});

app.get("/topnews", async (req, res) => {
  res.json(latestNews);
});

// User registration
app.post("/subscribe", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  if (await isUserInDB(email)) {
    console.log("\n!!!EmailInUse!!!\n");
    return res.status(409).send("Email already used");
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error during password hashing:", err);
      return res.sendStatus(500);
    }

    saveUserToDB(email, firstName, lastName, hashedPassword, res);

    // Autentica l'utente dopo la registrazione
    req.session.loggedIn = true;
    req.session.email = email;
    // Imposta altre variabili di sessione, se necessario

    res.json({ success: true }); // Invia una risposta JSON al client
  });
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const client = new Client(pgConfig);
  console.log("\n[/login] Connecting...");
  await client.connect();
  const query = "SELECT * FROM users WHERE email = ($1)";
  console.log("[/login] Querying the database...");
  const result = await client.query(query, [email]);
  console.log(result.rows[0]);
  if (result.rows[0]) {
    const storedPassword = result.rows[0].password;
    bcrypt.compare(password, storedPassword, (err, resultCompare) => {
      if (err) {
        console.error("Error in password verification:", err);
        return res.sendStatus(500);
      }
      console.log("\n", result.rows);
      if (resultCompare) {
        console.log("\nRES:true");
        req.session.loggedIn = true;
        req.session.userId = result.rows[0].email;

        const { email, first_name, last_name } = result.rows[0];
        res.json({ loggedIn: true, email, firstName: first_name, lastName: last_name });
      } else {
        console.log("\nRES:false");
        res.json({ loggedIn: false });
      }
    });
  } else {
    console.log("Not registered!");
    res.json({ loggedIn: false });
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/amogus", async (req, res) => {
  console.log("CIAO");
  res.json({ loggedIn: false });
});

// Weather data
let weatherData = "";
async function getWeather(lat, lon) {
  const apiKey = "1c1c8bb4564fa4482b830ffbe7daed37";
  const url = `https://api.openweathermap.org/data/2.5/weather`;
  const params = {
    lat: lat,
    lon: lon,
    appid: apiKey,
    units: "metric",
  };

  console.log(params);

  console.log("[getWeather] Getting weather for " + lat + ", " + lon + " ...");

  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    weatherData += data.name + ", " + data.weather[0].description + " " + data.main.temp + "°C";
    console.log("Weather Data: " + weatherData);
  } catch (error) {
    console.error("Error getting weather data:", error);
  }
}

app.post("/weather", async (req, res) => {
  const { lat, lon } = req.body;
  if (weatherData == "") await getWeather(lat, lon);
  res.send(weatherData);
});

const PORT = 51555;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
