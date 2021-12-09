import express from "express";

var app = express();
const port = 3000;

app.use(express.static("src"));

app.listen(port, () => {
  console.log("app listening on port " + port);
});
