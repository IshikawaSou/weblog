var systemlogger = require("./lib/log/systemlogger");
var accesslogger = require("./lib/log/accesslogger");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.disable("x-powered-by");

app.use("/public", express.static(__dirname + "/public/" + (process.env.NODE_ENV === "development" ? "development" : "production")));

app.use(accesslogger());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/", require("./routes/index.js"));
app.use("/posts/", require("./routes/posts.js"));
app.use("/search/", require("./routes/search.js"));
app.use("/account/", require("./routes/account.js"));

app.use(systemlogger());


app.listen(3000);