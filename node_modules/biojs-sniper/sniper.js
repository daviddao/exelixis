var fs = require('fs');
var path = require('path');
var join = path.join;
var swig = require('swig');

var Sniper = module.exports = function(opts){
  
  this.opts = opts;
  var self = this;

  // removes the extension and filters duplicates
  this.getSnippets = function(){
    var snips = fs.readdirSync(self.opts.snippetFolder);
    var snipsFiltered = [];
    snips.forEach(function(entry){
      var file = entry.split(".")[0];
      if(snipsFiltered.indexOf(file) < 0){
        snipsFiltered.push(file);
      }
    });
    return snipsFiltered;
  };

  // merges non-duplicate entries of an array (remote) 
  // into a array (origin)
  this.mergeStuff = function(origin,remote){
  if( remote  !== undefined && origin !== undefined){
      remote.forEach(function(entry){
        // no duplicates
        if(origin.indexOf(entry) < 0){
          origin.push(entry);
        }
      });
    }
  }

  // parses and add a special config for each snippet
  this.addJSON = function(name,parsedD){
    var parsedConfig = JSON.parse(fs.readFileSync(name, 'utf8'));
    this.mergeStuff(parsedD.js,parsedConfig.js);
    this.mergeStuff(parsedD.css,parsedConfig.css);
  };

  // displays the script tags
  this.renderHead = function(snipTemplate,parsedD){
    var template = swig.compileFile(snipTemplate);
    var head = template({ css: parsedD.css,
      scripts: parsedD.js});
    return head;
  };

  // builds the snippet html
  // - reads the js & html (same name)
  // - searches for a extra config file (same name.json)
  this.buildSnippet = function(name,parsedD){
    var jsFile = join(self.opts.snippetFolder,name+".js");
    var tomlFile = join(self.opts.snippetFolder,name+".json");

    var buffer = "";

    if (fs.existsSync(tomlFile)) {
      console.log("found extra config:", tomlFile);
      this.addJSON(tomlFile, parsedD);
    }

    if (fs.existsSync(jsFile)) {
      var htmlFile = join(self.opts.snippetFolder,name+".html");
      var htmlExists = fs.existsSync(htmlFile);
      if (htmlExists) {
        buffer += fs.readFileSync(htmlFile);
      } else{
        // insert auto div
        var divName = Math.random().toString(36).substring(7);
        buffer += "<div id='"+divName+"'></div>";
      }
      buffer += ("<script>");
      if( !htmlExists){
        buffer += "(function(){\n";
        buffer += "var yourDiv = document.getElementById('"+divName+"');\n";
      }
      buffer += fs.readFileSync(jsFile,'utf8');
      if( !htmlExists){
        buffer += "})();";
      }
      buffer += "</script>";
    }else{
      buffer += "Please make sure you add .html and .js for " + name;
    }
    return buffer;
  };
}
