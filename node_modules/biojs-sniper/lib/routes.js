var swig = require('swig');
var q = require('bluebird');
var Minilog = require('minilog');
var fs = q.promisifyAll(require("fs"));
var path = require('path');
var join = path.join;

var SnippetDemo = require("biojs-util-snippets").demo;
var Sniper = require('./sniper');

var services = {};
services.browserifyCDN = "https://wzrd.in/bundle/";
services.rawgit = "https://cdn.rawgit.com/";
services.parcelifyCDN = "http://parce.li/bundle/";

module.exports = function(opts) {
  var self = this;
  var router = opts.router;
  this.parsed = opts.parsed;
  this.snippetFolderName = opts.parsed.snippetFolderName;
  var dirOpts = opts.dirOpts;

  opts.evt.on("config:update", function(config) {
    console.log("new config");
    self.parsed = config;
  });

  var templates = opts.templates;
  var sniper = new Sniper({
    snippetFolder: this.parsed.snippetFolder
  });

  // detail view
  router.get("/" + this.snippetFolderName + "/:name", function(name) {
    this.res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    var buffer = sniper.buildSnippet(name, self.parsed);
    this.res.write(sniper.renderHead(templates.snip, self.parsed));
    this.res.end(buffer);
  });

  router.get("/" + "emu-" + this.snippetFolderName + "/:name", function(name) {
    var r = this;

    var log = Minilog("emu");

    log.debug("loading package.json");
    var config = fs.readFileAsync(dirOpts.filename, "utf8");
    config.error(function(err) {
      if (err) {
        r.res.writeHead(500);
        return r.res.end(JSON.stringify(err));
      }
    });
    config.then(function(body) {
      var pkg = JSON.parse(body);
      log.debug("checking json");

      // check for correct git repo
      if (!pkg.repository || pkg.repository.type !== "git" || !pkg.repository.url) {
        r.res.writeHead(500);
        return r.res.end("no github url found in the package.json");
      }
      // TODO: more error-prone splitting
      var gitLine = pkg.repository.url.split("/");
      var githubOwner = gitLine[gitLine.length - 2];
      var githubRepo = gitLine[gitLine.length - 1];
      var githubBranch = "master";
      pkg.github = {
        full_name: githubOwner + "/" + githubRepo,
        default_branch: githubBranch
      };
      pkg.sniper.srcs = {};
      pkg.sniper.srcs[name] = {};
      return pkg;
    }).then(function(pkg) {
      var fileTypes = ["js", "json", "html"];

      log.debug("trying to read the different file types");

      return q.settle(fileTypes.map(function(type) {
        return fs.readFileAsync(self.parsed.snippetFolder + "/" + name + "." + type, "utf8");
      })).spread(function(js, json, html) {

        if (!js.isFulfilled()) {
          r.res.writeHead(500);
          return r.res.end("could not find a snippet example");
        }

        pkg.sniper.srcs[name].js = {
          content: js.value(),
        };
        if (html.isFulfilled()) {
          pkg.sniper.srcs[name].html = {
            content: html.value(),
          };
        }
        if (json.isFulfilled()) {
          pkg.sniper.extra = {};
          pkg.sniper.extra[name] = JSON.parse(json.value());
        }

        // to enable github mode
        //html_url: "https://github.com/" + pkg.github.full_name + "/" + pkg.github.default_branch + "/blob/snippets/fer1.js"

        var obj = {
          snippetName: name,
          pkg: pkg,
          services: services
        };

        // TODO: load extra config
        // TODO: load html

        log.debug("send snippet info to the snippet assembler");
        var d = new SnippetDemo(obj);
        d.then(function(example) {
          r.res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          r.res.write("<div style='background-color: rgba(240,0,0,0.7); margin-bottom: 10px;'><b>Warning</b>: The local emulation of the BioJS registry is in alpha</div>");
          r.res.write(sniper.renderHead(templates.snip, example));
          r.res.write(example.inlineBody);
          r.res.end("<script>" + example.inlineScript + "</script>");
        });
        return d;
      }).error(function(e) {
          r.res.writeHead(500);
          return r.res.end(JSON.stringify(e));
        });
    });
  });


  // overview listing
  router.get(new RegExp(this.snippetFolderName + "(\/)?"), function() {
    this.res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    var template = swig.compileFile(templates.list);
    var snippetFolder = self.snippetFolderName;
    this.res.end(template({
      snips: sniper.getSnippets(),
      baseHref: snippetFolder
    }));
  });

  // display all snippets in one page
  router.get("/" + this.snippetFolderName + "/all", function() {
    this.res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    var snips = sniper.getSnippets();
    var snipStr = [];

    var snippetFolder = self.snippetFolderName;
    snips.forEach(function(snip) {
      snipStr.push({
        content: sniper.buildSnippet(snip, self.parsed),
        name: snip,
        baseHref: snippetFolder
      });
    });
    this.res.write(sniper.renderHead(templates.snip, self.parsed));
    var template = swig.compileFile(templates.all);
    this.res.end(template({
      snips: snipStr,
      baseHref: snippetFolder
    }));
  });

};
