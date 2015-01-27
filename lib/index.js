/*
 * exelixisjs
 * https://github.com/daviddao/exelixisjs
 *
 * Copyright (c) 2015 David
 * Licensed under the Apache 2 license.
 */

/**
@class exelixis
 */

var exe = {};

/*
 * Private Methods
 */

/**
* Import tnt tree library 
*/

var tnt = require("tnt.tree");

/**
* @Default settings and memory of the tree
*/

exe.opts = {
	data : "(homo_sapiens:1,(mus_musculus:2,(danio_rerio:13,(pan_troglodytes:9,taeniopygia_guttata:10,callithrix_jacchus:1):12):4);",	
	width : 500,
	height : 12,
	scale : false,
	el : document.getElementById("yourDiv"),
	layout_input : "vertical",
};

/**
* @Create layout by deciding between vertical and radial
*/ 

function createLayout(string, width, scale) {
	
	var layout;
	if(string === "vertical") {
		layout = tnt.tree.layout.vertical().width(width).scale(scale);
	}
	else if(string === "radial") {
		layout = tnt.tree.layout.radial().width(width).scale(scale);
	} 
	else {
		console.log("Unknown Layout Parameter: Please choose between 'vertical' and 'radial' layout");
	}
	return layout;
}

/**
* @parse user input and save it into exe.opts
*	
*/

function parseOpts(opts) {

	var data = opts.data || exe.opts.data;	
	var width = opts.width || exe.opts.width;
	var height = opts.height || exe.opts.height;
	var scale = opts.scale || exe.opts.scale;
	var el = opts.el || document.getElementById("yourDiv");
	var layout_input = opts.layout || exe.opts.layout_input;

	var parsedOpts = {
		data : data,
		width : width,
		height : height,
		scale : scale,
		el : el,
		layout_input : layout_input,
	}

	exe.opts = parsedOpts;

	return parsedOpts;
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

	var parsedOpts = parseOpts(opts);
	var data = parsedOpts.data;
	var width = parsedOpts.width;
	var height = parsedOpts.height;
	var scale = parsedOpts.scale;
	var el = parsedOpts.el;
	var layout_input = parsedOpts.layout_input;

	//Create a layout
	var layout;
	layout = createLayout(layout_input, width, scale);

	//Create a label
	var label;
	label = tnt.tree.label.text().height(height);
	
	//Create a tree
	var tree = tnt.tree();

	tree.data(tnt.tree.parse_newick(data))
		.layout(layout)

	tree.label(label);

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
	var parsedOpts = parseOpts(opts);
	var data = parsedOpts.data;
	var width = parsedOpts.width;
	var height = parsedOpts.height;
	var scale = parsedOpts.scale;
	var el = parsedOpts.el;
	var layout_input = parsedOpts.layout_input;

	//Create a layout
	var layout;
	layout = createLayout(layout_input, width, scale);

	//Create a label
	var label;
	label = tnt.tree.label.text().height(height);

	tree.data(tnt.tree.parse_newick(data))
		.layout(layout)

	tree.label(label);

	tree.update();
}

/**
* @exports the functionalities
*/

module.exports = {
	createTree : exe.createTree,
	updateTree : exe.updateTree,
};


