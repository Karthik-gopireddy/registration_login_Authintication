const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");

const port = 3002;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "students",
});

const connection_3 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user",
});

// Create users table if it doesn't exist
const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL
    )
  `;
  connection_3.query(createTableQuery, (error) => {
    if (error) {
      console.error("Error creating 'users' table:", error);
    } else {
      console.log("'users' table is ready");
    }
  });
};

// Initialize DB and server
const initializeDbAndServer = async () => {
  try {
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL database: ", err);
        return;
      }
      console.log("Connected to MySQL database");
    });

    connection_3.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL database: ", err);
        return;
      }
      console.log("Connected to MySQL database for user operations");
      createUsersTable(); // Ensure the users table is created
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Database Error: ${error}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// Middleware functions
const checkUserPresent = async (request, response, next) => {
  const { username } = request.body;
  const getUserQuery = "SELECT * FROM users WHERE username = ?";

  connection_3.query(getUserQuery, [username], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      response.status(500).send("Internal Server Error");
      return;
    }

    if (results.length > 0) {
      response.status(400).send("User already exists");
    } else {
      next();
    }
  });
};

const checkUserName = async (request, response, next) => {
  const { username } = request.body;
  const userPresentQuery = "SELECT username FROM users WHERE username = ?";

  connection_3.query(userPresentQuery, [username], (error, results) => {
    if (error) {
      console.error("Error executing user presence query:", error);
      response.status(500).send("Internal Server Error");
      return;
    }

    if (!results[0]) {
      response.status(400).send("Invalid user");
    } else {
      request.username = username;
      next();
    }
  });
};

const checkPassword = async (request, response, next) => {
  const { username } = request;
  const { password } = request.body;
  const getPasswordQuery = "SELECT password FROM users WHERE username = ?";

  connection_3.query(getPasswordQuery, [username], async (error, results) => {
    if (error) {
      console.error("Error executing get password query:", error);
      response.status(500).send("Internal Server Error");
      return;
    }

    if (!results[0] || !results[0].password) {
      response.status(400).send({ text: "Invalid password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, results[0].password);
    if (isPasswordValid) {
      request.password = password;
      next();
    } else {
      response.status(400).send("Invalid password");
    }
  });
};

const verifyToken = async (request, response, next) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    response.status(401).send("Invalid JWT Token: Token missing");
    return;
  }

  const jwtToken = authHeader.split(" ")[1];

  if (!jwtToken) {
    response.status(401).send("Invalid JWT Token: Token missing");
    return;
  }

  try {
    const payload = await jwt.verify(jwtToken, "SECRET_KEY");
    request.username = payload.username;
    next();
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    response.status(401).send("Invalid JWT Token");
  }
};

// User Registration API
app.post("/register", checkUserPresent, async (request, response) => {
  const { username, password, email } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (password.length < 6) {
    response.status(400).send("Password is too short");
    return;
  }

  const createQuery =
    "INSERT INTO users(username, password, email) VALUES (?, ?, ?)";

  connection_3.query(
    createQuery,
    [username, hashedPassword, email],
    async (error) => {
      if (error) {
        console.error("Error executing registration query:", error);
        response.status(500).send("Internal Server Error");
        return;
      }

      const payload = { username: username };
      const jwtToken = await jwt.sign(payload, "SECRET_KEY");

      response.json({ message: "User created successfully", jwtToken });
    }
  );
});

// User login API
app.post("/login", checkUserName, checkPassword, async (req, res) => {
  const { username } = req.body;
  const query = "SELECT username, password FROM users WHERE username = ?";

  connection_3.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error executing login query: ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      const dbPassword = results[0].password;

      const isPasswordValid = await bcrypt.compare(req.password, dbPassword);

      if (isPasswordValid) {
        const payload = { username: username };
        const jwtToken = jwt.sign(payload, "SECRET_KEY");
        return res.json({ jwtToken });
      } else {
        return res.status(400).json({ error: "Invalid username or password" });
      }
    } else {
      return res.status(400).json({ error: "Invalid username or password" });
    }
  });
});

app.post("/login/dart", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  connection_3.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (error, results) => {
      if (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "User not found or incorrect credentials" });
      }

      return res.status(200).json({ message: "Login successful" });
    }
  );
});

app.get("/", (req, res) => {
  res.send({ hello: "you are done" });
});
