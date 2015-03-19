var u = {};

// TODO: apply dirty hacks on the snippets
// problem: access files from the snipper
u.translateRelative = function(body, baseLocal, path) {
  if (body.indexOf("./") >= 0) {
    //var rawURL = "https://cors-anywhere.herokuapp.com/" + pkg.github.raw_url;
    var htmlUrl = baseLocal + "/" + path + "/";
    body = body.replace(/\.\.\//g, baseLocal + "/");
    body = body.replace(/\.\//g, htmlUrl);
  }
  return body;
};

u.convertGithubToRaw = function(contentURL) {
  contentURL = contentURL.replace("github.com", "raw.githubusercontent.com");
  contentURL = contentURL.replace("blob/", "");
  return contentURL;
};
u.translateURL = function(obj, base) {
  // fix CDN urls
  if (obj.substring(0, 2) === "//") {
    return "https:" + obj;
  }

  // translate root urls to github
  if (obj.charAt(0) === "/") {
    return base + obj;
  }
  return obj;
};

// adds a leading slash if needed
u.makeAbsolute = function(path) {
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

module.exports = u;
