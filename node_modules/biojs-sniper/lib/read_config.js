var fs = require('fs');
var path = require('path');
var join = path.join;

// loads the config
var readConfig = function(opts) {
  var parsed;

  try {
    parsed = JSON.parse(fs.readFileSync(opts.filename, 'utf8')).sniper;
  } catch (err) {
    console.log('Invalid package.json');
    return;
  }
  if (!parsed) {
    console.error("please define a sniper section in your package.json");
    return;
  }
  if (parsed.snippets) {
    parsed.snippetFolderName = parsed.snippets[0];
  } else {
    parsed.snippetFolderName = "examples";
  }
  parsed.snippetFolder = join(opts.dirname, parsed.snippetFolderName);
  return parsed;
};

module.exports = readConfig;
