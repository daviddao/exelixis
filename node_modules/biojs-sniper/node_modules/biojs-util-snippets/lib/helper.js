var helper = {};
module.exports = helper;

// sets the main var, defaults to rootDiv
helper.findMainVar = function(content) {
  var tags = ["yourDiv", "mainDiv", "rootDiv", "masterDiv", "biojsDiv"];
  var defaultDiv = tags[0];
  tags.forEach(function(tag) {
    if (content.indexOf(tag) >= 0) {
      defaultDiv = tag;
    }
  });
  return defaultDiv;
};
