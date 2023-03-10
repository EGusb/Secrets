require("dotenv").config();

const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // Required to parse requests
app.use(express.static("public"));

app.route("/").get(function (req, res) {
  res.render("home");
});

app.route("/login").get(function (req, res) {
  res.render("login");
});

app.route("/register").get(function (req, res) {
  res.render("register");
});

// HTTPS config
const httpsPort = process.env.HTTPS_PORT || 443;
const hostname = process.env.HOST || "localhost";
const fullHttpsUrl = `https://${hostname}:${httpsPort}`;
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./server.key"),
    cert: fs.readFileSync("./server.cert"),
  },
  app
);

httpsServer.listen(httpsPort, hostname, function () {
  console.log(`HTTPS server started on ${fullHttpsUrl}`);
});

// HTTP config
const httpApp = express();
httpApp.all("*", function (req, res) {
  res.redirect(301, fullHttpsUrl);
});
const httpPort = process.env.HTTP_PORT || 80;
const fullHttpUrl = `http://${hostname}:${httpPort}`;

const httpServer = http.createServer(httpApp);
httpServer.listen(httpPort, hostname, function () {
  console.log(`HTTP  server started on ${fullHttpUrl}`);
});