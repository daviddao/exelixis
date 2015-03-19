var request = require("request");
var q = require('bluebird');
var utils = require("./utils");
var Minilog = require('minilog');
var log = Minilog("html-assem");

function addHTML(snip, body, baseLocal) {
  body = utils.translateRelative(body, baseLocal, snip.snippets[0]);
  snip.inlineBody = body;
}

module.exports = function(snip, currentSnip, baseLocal) {
  return new q.Promise(function(resolve, reject) {
    if (snip.srcs[currentSnip].html !== undefined) {
      if (snip.srcs[currentSnip].html.content) {
        log.debug("html resources provided by the sniper");
        addHTML(snip, snip.srcs[currentSnip].html.content, baseLocal);
        resolve();
      } else {
        var htmlURL = utils.convertGithubToRaw(snip.srcs[currentSnip].html.html_url);
        request.get(htmlURL, function(err, response, body) {
          if (err) {
            log.error("html resources failed to download");
            return reject(err);
          }
          log.debug("html resources successfully downloaded");
          addHTML(snip, body, baseLocal);
          resolve();
        });
      }
    } else {
      log.debug("no html resources provided");
      snip.inlineBody = "<div id='" + snip.divName + "'></div>";
      snip.hasNoHTML = true;
      resolve("no html");
    }
  });
};
