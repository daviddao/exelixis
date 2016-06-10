/*
 * 
 * https://github.com/daviddao/exelixis
 *
 * Copyright (c) 2015 David
 * Licensed under the Apache 2 license.
 */

/**
@class exelixis
 */

/**
* Get biojs-io-newick parser
*/
var parser = require("biojs-io-newick");

exe = {};

var pics = require("./pics").ensembl_pics;

/*
 * Private Methods
 */

/**
* Import tnt tree library 
*/

var tnt_tree = require("tnt.tree");

/**
* @Default settings, data structure and memory of the tree
*/

exe.opts = require("./opts").opts;

var savedOpts = exe.opts;

var parseOpts = require("./opts").parseOpts; 

/**
* @Default label creator
*/
function createLabel(opts) {

//Translating opts
var pics = opts.label.pics.pictureSource;
var pictureWidth = opts.label.pics.pictureWidth;
var pictureHeight = opts.label.pics.pictureHeight;
var fontsize = opts.label.fontsize;
var usePics = opts.label.usePics;

if(usePics) {
	var image_label = tnt_tree.label.img()
            .src(function(node) {
		if(node.is_leaf()) {
		    var sp_name = node.node_name();
		    // ucfirst
		    return (pics[sp_name.substr(0,1).toUpperCase() + sp_name.substr(1)]);
		}
            })
            .width(function() {
		return pictureWidth;
            })
            .height(function() {
		return pictureHeight;
            });
}

var original_label = tnt_tree.label.text()
    	.text(function (node) {
	if(node.is_leaf()) {
		return node.node_name();
	}
        }).fontsize(fontsize);

	

if(usePics) {

	var joined_label = tnt_tree.label.composite()
            .add_label(image_label)
            .add_label(original_label);
	
	return joined_label;

} else {

	return original_label;
}

}

/**
* @Create layout by deciding between vertical and radial
*/ 

function createLayout(opts) {
	
	var string = opts.tree.layoutInput;
	var width = opts.tree.width;
	var scale = opts.tree.scale;

	var layout;
	if(string === "vertical") {
		layout = tnt_tree.layout.vertical().width(width).scale(scale);
	}
	else if(string === "radial") {
		layout = tnt_tree.layout.radial().width(width).scale(scale);
	} 
	else {
		console.log("Unknown Layout Parameter: Please choose between 'vertical' and 'radial' layout");
	}
	return layout;
}

/**
* @Create node display which switches between triangle and circle nodes
*/ 

function createNodeDisplay(opts) {
	
	var node_size = opts.nodes.size;
	var node_fill = opts.nodes.fill;
	var node_stroke = opts.nodes.stroke;

	var selected_node_size = opts.nodes.selectedSize;
	var selected_node_fill = opts.nodes.selectedFill;


	var expanded_node = tnt_tree.node_display.circle()
	    .size(node_size)
	    .fill(node_fill)
	    .stroke(node_stroke);

	var collapsed_node = tnt_tree.node_display.triangle()
	    .size(node_size)
	    .fill(node_fill)
	    .stroke(node_stroke)

	var selected_node = tnt_tree.node_display.circle()
		.size(selected_node_size)
		.fill(selected_node_fill)
		.stroke(node_stroke)

	// VR 20160610
	/*
	var node_display = tnt_tree.node_display.cond()
	    .add("collapsed", function (node) {
			return node.is_collapsed()
	    }, collapsed_node)
	    .add("selected", function (node) {
	    	return node.property('selected')
	    }, selected_node)
	    .add("rest", function () {
			return true
	    }, expanded_node);
	*/

	var node_display = tnt_tree.node_display()
        .display (function (node) {
		            if (node.is_collapsed()) {
		                collapsed_node.display().call(this, node);
		            } 
		            else if (node.property('selected')) {
		            	selected_node.display().call(this, node);
		            }
		            else {
		                expanded_node.display().call(this, node);
		            }
        });

	return node_display;
}

//creates default eventFunction for toggle and select
function createNodeEvent(opts) {

	var eventFunction = {};

	if(opts.nodes.toggle) {
		eventFunction = function(node) {
      	if(!node.is_leaf() || (node.n_hidden() > 0)) {
        	node.toggle();
        	tree.update();
      	} else {
      		if(opts.nodes.select) {
      			toggleClick(node);
      		}
      		tree.update();
      		}
    	}
	} else {
		if(opts.nodes.select) {
			eventFunction = function(node) {
				toggleClick(node);
				tree.update();
			}
		}
	}

	if(opts.nodes.select) {
		function toggleClick(node) {
    	if(node.property('selected')) {
    		node.property('selected',false);
    	} else {
    		node.property('selected',true);
    	}
    } 
	} 

	return eventFunction;

}


/*
 * Public Methods
 */

/**
* @create a default tree
*	
*	exe.createTree(opts);
*	
*	@method createTree
*	@param {object} a config json
*	@return {tree object} a tree object
*/

exe.createTree = function (opts) {

	var parsedOpts = parseOpts(opts, savedOpts);

	savedOpts = parsedOpts; //Saves state

	var data = parsedOpts.tree.data;
	var el = parsedOpts.el;

	//Create a layout
	var layout;
	layout = createLayout(parsedOpts);

	//Create a label
	var label;
	label = createLabel(parsedOpts);

	//Create a nodedisplay
	var nodeDisplay;
	nodeDisplay = createNodeDisplay(parsedOpts);
	
	//Create a tree
	var tree = tnt_tree();

	tree.data(parser.parse_newick(data))
		.layout(layout)
		.node_display(nodeDisplay);

	tree.label(label);

	var nodeEvent = createNodeEvent(parsedOpts);
	tree.on("click", nodeEvent);

	tree(el);

	return tree;
} 

/**
* @updates a tree
*	
*	exe.updateTree(tree,opts);
*	
*	@method updateTree
*	@param {tree object} a given tree, {object} a config json
*	@return void
*/

exe.updateTree = function(tree, opts) {

	//get the tree object and update the opts
	var parsedOpts = parseOpts(opts, savedOpts);

	savedOpts = parsedOpts;

	var data = parsedOpts.tree.data;

	//Create a layout
	var layout;
	layout = createLayout(parsedOpts);

	//Create a label
	var label;
	label = createLabel(parsedOpts);

	//Create a nodedisplay
	var nodeDisplay;
	nodeDisplay = createNodeDisplay(parsedOpts);

	tree.data(parser.parse_newick(data))
		.layout(layout)
		.node_display(nodeDisplay);
		
	tree.label(label);

	var nodeEvent = createNodeEvent(parsedOpts);
	tree.on_click(nodeEvent);

	tree.update();
}

/**
* @exports the functionalities
*/

module.exports = {
	createTree : exe.createTree,
	updateTree : exe.updateTree,
};

