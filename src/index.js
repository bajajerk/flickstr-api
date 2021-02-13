const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");
const engines = require("consolidate");
var bodyParser = require("body-parser");
const app = express();

// middleware setup
app.use(helmet());
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(logger("dev"));
app.set("views", __dirname + "/public");
app.engine("html", engines.mustache);
app.set("view engine", "html");
// routes
app.use("/api/movie", require("./movies/routes"));
app.use("/api/user", require("./user/routes"));
app.use("/api/search", require("./search/routes"));
app.use("/api/auth", require("./auth/routes"));
app.use("/api/category", require("./category/routes"));
app.use("/api/home", require("./home/routes"));
app.use("/api/recommendations", require("./recommendations/routes"));

module.exports = app;
