var request = require("request");
var q = require('bluebird');
var utils = require("./utils");
var Minilog = require('minilog');
var log = Minilog("js-assem");

function bWrapper(resolve, reject, snip, baseLocal) {
  this.addBody = function(content) {
    if (!content || content.length < 10) {
      return reject("no snippets found");
    }
    content = utils.translateRelative(content, baseLocal, snip.snippets[0]);
    snip.inlineScript = content;
    return resolve();
  };
}


module.exports = function(snip, currentSnip, baseLocal) {
  return new q.Promise(function(resolve, reject) {
    var addBody = new bWrapper(resolve, reject, snip, baseLocal).addBody;
    if (snip.srcs[currentSnip].js === undefined) {
      log.warn("no js resources found.");
      return reject("no js found for the snippet");
    } else {
      // the local emulation might directly provide the file content
      if (snip.srcs[currentSnip].js.content) {
        log.debug("js resources provided by the sniper");
        return addBody(snip.srcs[currentSnip].js.content);
      } else {
        var jsURL = utils.convertGithubToRaw(snip.srcs[currentSnip].js.html_url);

        request.get(jsURL, function(err, response, body) {
          if (err) {
            log.error("js resources failed to download");
            return reject(err);
          }
          log.debug("js resources successfully downloaded");
          addBody(body);
          return resolve();
        });
      }
    }
  });
};
