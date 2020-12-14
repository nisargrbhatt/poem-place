const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

const userRoutes = require("./routes/user");
const poemRoutes = require("./routes/poem");

const app = express();

// Database Connections
mongoose
  .connect("mongodb://127.0.0.1:27017/poem-place", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection Failed.");
  });

// Body Parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
// Logger
app.use(morgan("dev"));
//Statics

app.use("/images", express.static(path.join("images")));
app.use("/pdfs", express.static(path.join("pdfs")));

// CORS Controls
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requestes-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, OPTIONS, DELETE"
  );
  next();
});

//Tests
// console.log(process.env.JWT_KEY);

// Routes
app.use("/user", userRoutes);
app.use("/poem", poemRoutes);

module.exports = app;
