import express from "express";

var app = express();
// same port exposed in Dockerfile
const port = 3001;

app.use(express.static("src"));

app.listen(port, () => {
  console.log("app listening on port " + port);
});
