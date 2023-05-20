require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");

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

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

/*app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (req.session.loggedIn) {
    // L'utente è connesso, puoi passare alla prossima route
    next();
  } else {
    // L'utente non è connesso, reindirizza alla pagina di login
    res.redirect("/login");
  }
});*/

// Functions

function getWeather() {

}


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
    latestNews = allNews.slice(0, 4).reverse();
  } catch (error) {
    console.error("[fetchAllNews] Error during retrieval from DB: ", error);
  } finally {
    console.log("[fetchAllNews] Chiudo db...");
    await client.end();
  }
}

async function saveUserToDB(req) {
  const { email, firstName, lastName, hashedPassword } = req.body;

  const client = new Client(pgConfig);

  try {
    console.log("\n[saveUserToDB] Connessione al db...");
    await client.connect();
    const query = "INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)";
    console.log("[saveUserToDB] Esecuzione della query sul db...");
    await client.query(query, [email, firstName, lastName, hashedPassword]);
    res.json({ message: "Iscrizione avvenuta con successo!" });
  } catch (error) {
    console.error("[saveUserToDB] Errore durante l'inserimento nel DB:", error);
    res.status(500).json({ error: "Errore interno del server" });
  } finally {
    console.log("[saveUserToDB] Chiusura connessione al db...");
    await client.end();
  }
}

async function isUserInDB(email) {
  const client = new Client(pgConfig);

  try {
    console.log("\n[isUserInDB] Connection...");
    await client.connect();
    const query = "SELECT email FROM users";
    console.log("[isUserInDB] Query sul db...");
    const result = await client.query(query);
    console.log(result.rows);
    result.rows.forEach((em) => {
      console.log(em + " == " + email);
      if (em == email) return true;
    });
    return false;
  } catch (error) {
    console.error("[isUserInDB] Errore during retrieval from DB:", error);
    res.status(500).json({ error: "Errore interno del server" });
  } finally {
    console.log("[isUserInDB] Disconnecting...");
    await client.end();
  }
}

fetchAllNews();

// Routes
app.post("/subscribe", (req, res) => {
  console.log(req.body);
  const { email, firstName, lastName, password } = req.body;

  if (isUserInDB(email)) {
    console.log("Yoo");
    return res.status(409).send("Email already used");
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Errore during password hashing:", err);
      return res.sendStatus(500);
    }

    saveUserToDB(email, firstName, lastName, hashedPassword);

    //res.redirect("/login");
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const storedPassword = "$2b$10$ivJ4uX3...";
  bcrypt.compare(password, storedPassword, (err, result) => {
    if (err) {
      console.error("Errore nella verifica della password:", err);
      return res.sendStatus(500);
    }

    if (result) {
      req.session.loggedIn = true;
      req.session.email = email;
      res.redirect("/dashboard");
    } else {
      res.sendStatus(401);
    }
  });
});

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

app.get("/topnews", async (req, res) => {
  res.json(latestNews);
});

const PORT = 51555;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
