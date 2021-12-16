import express from "express";
import { createConnection, createPool } from "mysql2";

// same port exposed in Dockerfile
const port = 3001;
const cors = require("cors");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = createConnection({
  host: "mysql",
  user: "root",
  password: "admin",
  database: "portfolio",
});

app.get("/get", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("app listening on port " + port);
});
