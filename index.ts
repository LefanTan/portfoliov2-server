import express from "express";

var app = express();
const port = 3000;

app.get("/", function (req, res) {
  res.send("H??ello world!");
});

app.listen(port, () => {
  console.log("app listening on port " + port);
});
