if (typeof tnt === "undefined") {
    module.exports = tnt = {}
}
require("d3");
var eventsystem = require("biojs-events");
eventsystem.mixin(tnt);
tnt.utils = require("tnt.utils");
tnt.tooltip = require("tnt.tooltip");
tnt.tree = require("./treeWrapper.js");

d3.selection.prototype.selectAncestor = function(type) {

    type = type.toLowerCase();

    var selfNode = this.node();
    if (selfNode.parentNode === null) {
	console.log("No more parents");
	return undefined;
    }

    var tagName = selfNode.parentNode.tagName;

    if ((tagName !== undefined) && (tagName.toLowerCase() === type)) {
	return d3.select(selfNode.parentNode);
    } else {
	return d3.select(selfNode.parentNode).selectAncestor(type);
    }
};
