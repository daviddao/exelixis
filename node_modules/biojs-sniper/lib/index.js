var union = require('union');
var director = require('director');
var ecstatic = require('ecstatic');
var router = new director.http.Router();
var path = require('path');
var join = path.join;
var favicon = require('serve-favicon');
var EventEmitter = require('events').EventEmitter;
var Minilog = require('minilog');
var deepcopy = require('deepcopy');

var Routes = require('./routes');
var readConfig = require('./read_config');

module.exports = function(opts) {

  var dirname = opts.dirname || __dirname;
  var self = this;
  this.port = opts.port || 9090;

  var filename = join(dirname, opts.config);
  var dirOpts = {
    dirname: dirname,
    filename: filename
  };

  var log = Minilog("index");

  this.evt = new EventEmitter();

  // init the server
  this.parsed = readConfig(dirOpts);
  if (!this.parsed) {
    console.log("see https://github.com/biojs/biojs-sniper for more help");
    process.exit(1);
  }

  var errorHandler = function(err, req, res) {
    res.statusCode = err.status;
    if (err.status === 404) {
      console.log("404: ", req.url);
    } else {
      console.log(err);
    }
    res.end();
  };

  // reload the config on every request
  function refreshMiddleware(req, res) {
    try {
      var newParsed = readConfig(dirOpts);
      if (JSON.stringify(self.parsed) !== JSON.stringify(newParsed)) {
        self.parsed = deepcopy(newParsed);
        self.evt.emit("config:update", newParsed);
      }
      res.emit('next');
      return true;
    } catch (err) {
      res.writeHead(400);
      console.warn(err);
      res.end('Invalid package.json');
      return false;
    }
  }

  var options = {
    onError: errorHandler,
    before: [
      favicon(__dirname + '/../favicon.ico'),
      function(req, res) {
        var found = router.dispatch(req, res);
        if (!found) {
          res.emit('next');
        }
      },
      refreshMiddleware,
      ecstatic({
        root: dirname,
        showDir: true,
      })
    ]
  };

  // init the server
  this.server = union.createServer(options);
  this.server.on("error", function(err) {
    if (err.code === "EADDRINUSE") {
      console.log("");
      console.log("Another biojs-sniper is running. Terminate it or use -p to run on another port");
    } else {
      console.log(err);
    }
  });

  // init the routes
  this.routes = new Routes({
    router: router,
    parsed: deepcopy(self.parsed),
    evt: self.evt,
    dirOpts: dirOpts,
    templates: opts.templates
  });

  this.server.listen(this.port);
};
