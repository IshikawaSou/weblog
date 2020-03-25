var { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config");
var router = require("express").Router();
var MongoClient = require("mongodb").MongoClient;
var tokens = new (require("csrf"))();

var validateRegistData = function (body) {
  var isValidated = true, errors = {};

  if (!body.url) {
    isValidated = false;
    errors.url = "url is not entered. please input letters starting with '/'.";
  }

  if (body.url && /^\//.test(body.url) === false) {
    isValidated = false;
    errors.url = "please input latter starting with '/'";
  }

  if (!body.title) {
    isValidated = false;
    errors.title = "title is not entered. please input letters.";
  }

  return isValidated ? undefined : errors;
};

var createRegistData = function (body) {
  var datetime = new Date();
  return {
    url: body.url,
    published: datetime,
    updated: datetime,
    title: body.title,
    content: body.content,
    keywords: (body.keywords || "").split(","),
    authors: (body.authors || "").split(","),
  };
};

router.get("/", (req, res) => {
  tokens.secret((error, secret)=>{
    var token = tokens.create(secret);
    req.session._csrf = secret;
    res.cookie("_csrf", token);
    res.render("./account/index.ejs");
  });
});

router.get("/posts/regist", (req, res) => {
  res.render("./account/posts/regist-form.ejs");
});

router.post("/posts/regist/input", (req, res) => {
  var original = createRegistData(req.body);
  res.render("./account/posts/regist-form.ejs", { original });
});

router.post("/posts/regist/confirm", (req, res) => {
  var original = createRegistData(req.body);
  var errors = validateRegistData(req.body);
  if (errors) {
    res.render("./account/posts/regist-form.ejs", { errors, original });
    return;
  }
  res.render("./account/posts/regist-confirm.ejs", { original });
});

router.post("/posts/regist/execute", (req, res) => {
  var secret = req.session._csrf;
  var token = req.cookies._csrf;

  if(tokens.verify(secret, token) === false) {
    throw new Error("Invalid Token");
  }

  var original = createRegistData(req.body);
  var errors = validateRegistData(req.body);
  if (errors) {
    res.render("./account/posts/regist-form.ejs", { errors, original });
    return;
  }

  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    var db = client.db(DATABASE);
    db.collection("posts")
      .insertOne(original)
      .then(() => {
        delete req.session._csrf;
        res.clearCookie("_csrf");
        res.render("./account/posts/regist-complete.ejs");
      }).catch((error)=>{
        throw error;
      }).then(()=>{
        client.close();
      });
  });

});

module.exports = router;