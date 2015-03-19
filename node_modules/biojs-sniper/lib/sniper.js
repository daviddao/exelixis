var fs = require('fs');
var path = require('path');
var join = path.join;
var swig = require('swig');
var Minilog = require('minilog');
var log = Minilog("sniper");

var helper = require("biojs-util-snippets").helper;

module.exports = function(opts) {

  this.opts = opts;
  var self = this;

  // adds an optional slash to relative paths
  this.makeAbsolute = function(path) {
    var firstChar = path.charAt(0);
    // check whether it is http or https
    if (path.indexOf(":") >= 0) {
      return path;
    }
    // defined path
    if (firstChar === "/") {
      return path;
    }
    if (firstChar === ".") {
      return path.slice(1);
    }
    return "/" + path;
  };

  // removes the extension and filters duplicates
  this.getSnippets = function() {
    var snips = fs.readdirSync(self.opts.snippetFolder);
    var snipsFiltered = [];
    snips.forEach(function(entry) {
      var file = entry.split(".")[0];
      if (snipsFiltered.indexOf(file) < 0) {
        snipsFiltered.push(file);
      }
    });
    return snipsFiltered;
  };

  // merges non-duplicate entries of an array (remote) 
  // into a array (origin)
  this.mergeStuff = function(origin, remote) {
    if (remote !== undefined && origin !== undefined) {
      remote.forEach(function(entry) {
        // no duplicates
        if (origin.indexOf(entry) < 0) {
          origin.push(entry);
        }
      });
    }
  };

  // parses and add a special config for each snippet
  this.addJSON = function(name, parsedD) {
    var parsedConfig = JSON.parse(fs.readFileSync(name, 'utf8'));
    this.mergeStuff(parsedD.js, parsedConfig.js);
    this.mergeStuff(parsedD.css, parsedConfig.css);
  };

  // displays the script tags
  this.renderHead = function(snipTemplate, parsedD) {
    var template = swig.compileFile(snipTemplate);
    var css = {};
    if (parsedD.css) {
      css = parsedD.css.map(self.makeAbsolute);
    }
    var js = parsedD.js.map(self.makeAbsolute);
    var head = template({
      css: css,
      scripts: js
    });
    return head;
  };

  // warn the user that script and link tags are bad
  function checkHTML(content) {
    var tags = ["script", "body", "link", "html"];
    var errors = [];
    tags.forEach(function(tag) {
      if (content.indexOf("<" + tag) >= 0) {
        errors.push("Please do not include &lt;" + tag + "&gt; tags in your html - use the .js file. Pleast list your dependenciesin the package.json");
      }
    });
    var head = "<div style='background-color: rgba(240,0,0,0.7); margin-bottom: 10px;'><b>Warning</b>: ";
    var foot = "</div>";
    var errorMSG = errors.map(function(err) {
      log.warn(err);
      return head + err + foot;
    });
    return errorMSG.join("");
  }

  // builds the snippet html
  // - reads the js & html (same name)
  // - searches for a extra config file (same name.json)
  this.buildSnippet = function(name, parsedD) {
    var jsFile = join(self.opts.snippetFolder, name + ".js");
    var extraFile = join(self.opts.snippetFolder, name + ".json");

    var buffer = "";

    if (fs.existsSync(extraFile)) {
      log.info("found extra config: " + extraFile);
      this.addJSON(extraFile, parsedD);
    }

    if (fs.existsSync(jsFile)) {
      var htmlFile = join(self.opts.snippetFolder, name + ".html");
      var htmlExists = fs.existsSync(htmlFile);
      var divName;
      if (htmlExists) {
        var htmlContent = fs.readFileSync(htmlFile, "utf8");
        buffer += checkHTML(htmlContent);
        buffer += htmlContent;
      } else {
        // insert auto div
        divName = Math.random().toString(36).substring(7);
        buffer += "<div id='" + divName + "'></div>";
      }
      buffer += ("<script>");
      var jsContent = fs.readFileSync(jsFile, 'utf8');
      if (!htmlExists) {
        buffer += "(function(){\n";
        var mainVar = helper.findMainVar(jsContent);
        log.debug("selected main var: " + mainVar);
        buffer += "var " + mainVar + " = document.getElementById('" + divName + "');\n";
      }
      buffer += jsContent;
      if (!htmlExists) {
        buffer += "})();";
      }
      buffer += "</script>";
    } else {
      buffer += "Please make sure you add .html and .js for " + name;
    }
    return buffer;
  };
}
