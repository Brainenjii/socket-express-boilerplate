"use strict";
var app, managers = require("manager"), session = require("express-session"),
  bodyParser = require("body-parser"), cookieParser = require("cookie-parser"),
  serverConfig = require("./serverConfig"), config = require("helper/config"),
  serverHelper = require("helper/server"),
//  db = require("helpers/db"),
  express = require("express"),
  socketIO = require("socket.io"),
  _ = require("lodash"), async = require("async");

app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(serverHelper.corsHandler);

_.extend(config, serverConfig);

serverHelper.init({
  app: app,
  io: socketIO
});

async.series([function (callback) {
//  db.init(callback);
  callback();
}, function (callback) {
  async.each(_.sortBy(managers.toArray(), "initWeight"),
    function (manager, callback) {
      if (manager.init) {manager.init(); }
      if (manager.load) {
        manager.load(null, callback);
      } else {
        callback();
      }
    }, callback);
}], function (err) {
  if (err) {console.log(err); process.exit(); }

  app.listen(config.port, function () {
    console.log("all your request are belong to us");
  });
});