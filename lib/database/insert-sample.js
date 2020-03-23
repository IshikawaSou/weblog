var { CONNECTION_URL, DATABASE, OPTIONS } = require("../../config/mongodb.config");
var MongoClient = require("mongodb").MongoClient;

var insertPosts = function (db) {
  return Promise.all([
    db.collection("posts").insertMany([{
      url: "/2020/03/hello-nodejs.html",
      published: new Date(2020, 3, 2),
      updated: new Date(2020, 3, 2),
      title: "ようこそ Node.js",
      content: "Node.js は おもしろい！",
      keywords: ["Node.js"],
      authors: ["Ishikawa Sou"]
    }, {
      url: "/2020/03/nodejs-basic.html",
      published: new Date(2020, 3, 12),
      updated: new Date(2020, 3, 12),
      title: "Node.js とは",
      content: "だからどうしたと",
      keywords: ["Node.js"],
      authors: ["Yamada Taro"]
    }, {
      url: "/2020/03/advanced-nodejs.html",
      published: new Date(2020, 3, 8),
      updated: new Date(2020, 3, 8),
      title: "Node.js 応用",
      content: "Node.js で Excel ファイル",
      keywords: ["Node.js"],
      authors: ["Suzuki Muneo"]
    }]),
    db.collection("posts").createIndex({ url: 1 }, { unique: true, background: true })
  ]);
};

var insertUsers = function (db) {
  return Promise.all([
    db.collection("users").insertOne({
      email: "ishikawa.sou@sample.com",
      name: "Ishikawa Sou",
      password: "aaaaaa",
      role: "owner"
    }),
    db.collection("users")
      .createIndex({ email: 1 }, { unique: true, background: true })
  ]);
};

var insertPrivilages = function (db) {
  return Promise.all([
    db.collection("privileges").insertMany([
      { role: "default", permissions: ["read"] },
      { role: "owner", permissions: ["readWrite"] }
    ]),
    db.collection("privileges")
      .createIndex({ role: 1 }, { unique: true, background: true })
  ]);
};

MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
  var db = client.db(DATABASE);
  
  if (db == null) console.log("null");
  else {
    Promise.all([
      insertPosts(db),
      insertUsers(db),
      insertPrivilages(db)
    ]).catch((error) => {
      console.log(error);
    }).then(() => {
      client.close();
    });
  }
});