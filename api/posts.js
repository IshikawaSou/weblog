var { CONNECTION_URL, OPTIONS, DATABASE } = require("../config/mongodb.config");
var MongoClient = require("mongodb").MongoClient;
var router = require("express").Router();

router.get("/*", (req, res) => {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    var db = client.db(DATABASE);
    db.collection("posts").findOne({
      url: req.url
    }, {
      projection: { _id: 0 }
    }).then((doc) => {
      res.json(doc);
    }).catch((error) => {
      throw error;
    }).then(() => {
      client.close();
    });
  });
});

module.exports = router;