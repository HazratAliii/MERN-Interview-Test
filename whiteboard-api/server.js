const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const port = process.env.PORT || 8000;
const app = express();

app.get("/", (req, res) => {
  res.json("Hello world");
});

// routes
const whiteboardRoutes = require("./routes/whiteboard.routes");

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", whiteboardRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // app.listen(port, () => {
    // });
    if (process.env.PROD !== "production") {
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    }
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = app;
