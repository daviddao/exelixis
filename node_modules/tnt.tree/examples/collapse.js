var tnt = require("tnt.tree");

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

var theme = function() {
    "use strict";

    var tree_theme = function(tree_vis, div) {

        var newick = "(((((homo_sapiens:9,pan_troglodytes:9)207598:34,callithrix_jacchus:43)314293:52,(mus_musculus:95, rat:100)rodents:55)314146:215,taeniopygia_guttata:310)32524:107,danio_rerio:417)117571:135;"

        var data = tnt.tree.parse_newick(newick);

	// Show different node shapes for collapsed/non-collapsed nodes
	var node_size = 5;
	var node_fill="grey";
	var node_stroke="black";
	var expanded_node = tnt.tree.node_display.circle()
	    .size(node_size)
	    .fill(node_fill)
	    .stroke(node_stroke);
	var collapsed_node = tnt.tree.node_display.triangle()
	    .size(node_size)
	    .fill(node_fill)
	    .stroke(node_stroke)

	var node_display = tnt.tree.node_display.cond()
	    .add("collapsed", function (node) {
		return node.is_collapsed()
	    }, collapsed_node)
	    .add("rest", function () {
		return true
	    }, expanded_node);

        tree_vis
	    .node_display(node_display)
            .data(data)
            .duration(500)
            .layout(tnt.tree.layout.vertical()
		    .width(600)
		    .scale(false));
            
        // var tree = tree_vis.tree();
        tree_vis.on_click (function(node){
            // sT
                node.toggle()
                tree_vis.update();
        });

        // The visualization is started at this point
        tree_vis(div);
        

    };

    return tree_theme;
};

var tree_vis = tnt.tree();
var mytheme = theme();
mytheme(tree_vis, yourDiv);
