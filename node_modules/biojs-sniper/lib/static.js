var q = require("bluebird");
var fsp = q.promisifyAll(require("fs"));
var path = require('path');
var join = path.join;
var minilog = require('minilog');
var log = minilog("static");

var readConfig = require('./read_config');
var Sniper = require('./sniper');

module.exports = function(opts) {

  var dirname = opts.dirname || __dirname;
  var self = this;

  var filename = join(dirname, opts.config);
  var dirOpts = {
    dirname: dirname,
    filename: filename
  };
  var templates = opts.templates;

  var parsed = readConfig(dirOpts);
  if (!parsed) {
    console.log("invalid package.json - see https://github.com/biojs/biojs-sniper for more help");
    process.exit(1);
  }

  var snippetFolder = parsed.snippetFolder;
  var outputDir = opts.outputDir || snippetFolder + "-out";

  fsp.mkdir(outputDir, function(err){
    // for now we ignore errors to create a folder
  });

  log.debug("opening snipper dir:" + snippetFolder);
  log.debug("opening snipper out dir:" + outputDir);
  var sniper = new Sniper({
    snippetFolder: snippetFolder,
  });

  // custom absolute folder (one folder higher)
  sniper.makeAbsolute = function(path) {
    var firstChar = path.charAt(0);
    // check whether it is http or https
    if (path.indexOf(":") >= 0) {
      return path;
    }
    // defined path
    if (firstChar === "/") {
      return ".." + path;
    }
    return "../" + path;
  };

  return fsp.readdirAsync(snippetFolder).filter(function(name) {
    return name.indexOf(".js") >= 0;
  }).map(function(name) {
    var snippet = name.split(".")[0];
    var buffer = sniper.buildSnippet(snippet, parsed);
    var text = sniper.renderHead(templates.snip, parsed);
    text += buffer;
    return fsp.writeFileAsync(join(outputDir,snippet + ".html"), text, "utf8");
  }).all().then(function(){
    console.log("Have a look in " + outputDir);
  });

};
