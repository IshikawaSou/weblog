var log4js = require("log4js");
var levels = require("log4js/lib/levels")().levels;
var config = require("../../config/log4js.config");
var console, system, application, access;

log4js.configure(config);

console = log4js.getLogger();

system = log4js.getLogger("system");

var ApplicationLogger = function () {
  this.logger = log4js.getLogger("application");
};
var proto = ApplicationLogger.prototype;
for (var level of levels) {
  level = level.toLowerCase();
  proto[level] = (function (level) {
    return function (key, message) {
      var logger = this.logger;
      logger.addContext("key", key);
      logger[level](message);
    };
  })(level);
}
application = new ApplicationLogger();

access = log4js.getLogger("access");

module.exports = {
  console,
  system,
  application,
  access
};