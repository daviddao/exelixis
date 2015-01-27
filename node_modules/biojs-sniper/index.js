var fs = require('fs');
var union = require('union');
var director = require('director');
var swig = require('swig');
var ecstatic = require('ecstatic');
var router = new director.http.Router();
var path = require('path');
var join = path.join;
var deepcopy = require('deepcopy');
var favicon = require('serve-favicon');

var Sniper = require('./sniper');

var Server = module.exports = function(opts){

  var dirname = opts.dirname || __dirname;
  var self = this;
  this.port = opts.port || 9090;

  // all templates
  var templateDir = join(__dirname, "templates");
  var snipTemplate = join(templateDir, "template.html");
  var listTemplate = join(templateDir, "list.html");
  var allTemplate = join(templateDir, "all.html");


  // loads the config
  var readConfig = function(){
    var filename = join(dirname,opts.config);

    try{
      var parsed = JSON.parse(fs.readFileSync(filename, 'utf8')).sniper;
    }catch(err){
      console.log('Invalid package.json');
      return;
    }
    if(parsed.snippets){
      this.snippetFolderName = parsed.snippets[0];
    }else{
      this.snippetFolderName = "examples";
    }
    this.snippetFolder = join(dirname,this.snippetFolderName);
    console.log("parsed", parsed);
    if(parsed == undefined){
      throw("please define a sniper section in your package.json");
    }
    return parsed;
  }

  // init the server
  if(readConfig() == undefined){
    process.exit(1);
  }
  var sniper = new Sniper({snippetFolder: snippetFolder});

  var errorHandler = function (err, req, res) {
    res.statusCode = err.status;
    if(err.status = 404){
      console.log("404: ", req.url);
    }else{
      console.log(err);
    }
    res.end();
  };

  var options = {
    onError: errorHandler,
    before: [
      favicon(__dirname + '/favicon.ico'),
      function (req, res) {
        var found = router.dispatch(req, res);
        if (!found) {
          res.emit('next');
        }
      },
      ecstatic({
        root: dirname,
        showDir : true,
      })
    ]
  };

  this.server = union.createServer(options);
  
  // detail view
  router.get("/"+ this.snippetFolderName + "/:name", function (name) {
    this.res.writeHead(200, { 'Content-Type': 'text/html' });
    try{
      var parsed = readConfig();
    }catch(err){
      this.res.status(400).send('Invalid package.json');
      return;
    }
    var buffer = sniper.buildSnippet(name,parsed); 
    this.res.write(sniper.renderHead(snipTemplate,parsed));
    this.res.end(buffer);
  });

  // overview listing
  router.get(new RegExp(this.snippetFolderName + "(\/)?"), function (name) {
    this.res.writeHead(200, { 'Content-Type': 'text/html' });
    var template = swig.compileFile(listTemplate);
    var snippetFolder = self.snippetFolderName;
    this.res.end(template({snips: sniper.getSnippets(), baseHref: snippetFolder}));
  });

  // display all snippets in one page
  router.get("/" + this.snippetFolderName + "/all", function (name) {
    this.res.writeHead(200, { 'Content-Type': 'text/html' });
    var snips = sniper.getSnippets();
    var snipStr = [];
    try{
      var parsed = readConfig();
    }catch(err){
      this.res.status(400).send('Invalid package.json');
      return;
    }
    var snippetFolder = self.snippetFolderName;
    snips.forEach(function(snip){
      snipStr.push({ content: sniper.buildSnippet(snip,parsed),
        name: snip,
        baseHref: snippetFolder});
    });
    this.res.write(sniper.renderHead(snipTemplate,parsed));
    var template = swig.compileFile(allTemplate);
    this.res.end(template({snips: snipStr, baseHref: snippetFolder}));
  });

  this.server.on("error",function(err){
    console.log(err);
    if(err.code){
      console.log("");
      console.log("Another biojs-sniper is running. Terminate it or use -p to run on another port");
    }else{
      console.log(err);
    }
  });

  this.server.listen(this.port);
};
