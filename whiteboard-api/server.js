const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 8000;
const app = express();

app.get("/", (req, res) => {
  res.json("Hello world");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = app;
