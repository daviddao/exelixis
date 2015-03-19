var pics = require("./pics").ensembl_pics;

//Options structure for the tree
var exeOpts = {

		el : document.getElementById("yourDiv"),
		tree : {
			data : "(homo_sapiens:12,(mus_musculus:12,(danio_rerio:13,(pan_troglodytes:9,(taeniopygia_guttata:10,callithrix_jacchus:11):12):12):10);",	
			width : 500,
			height : 12,
			scale : false,
			layoutInput : "vertical",
		},
		label : {
			fontsize : 12,
			usePics : false, 
			pics : {
				pictureSource : pics,
				pictureWidth : 30,
				pictureHeight : 40,
			},
		},
		nodes : {
			toggle : false, //allows onClickEvent
			select: false, //allows selections
			size : 5,
			fill : "grey",
			stroke : "black",
			selectedFill : "steelblue",
			selectedSize : 4,
		},
};



/**
* @parse user input and save it into exe.opts
*	
*/
var parseOpts = function(opts, savedOpts) {

	if(savedOpts === undefined) {
		savedOpts = exeOpts;
	} 

	if(opts === undefined) {
		opts = exeOpts;
	}

	if(opts.tree === undefined) {
		opts.tree = exeOpts.tree;
	}

	if(opts.label === undefined) {
		opts.label = exeOpts.label;
	}

	if(opts.label.pics === undefined) {
		opts.label.pics = exeOpts.label.pics;
	}

	if(opts.nodes === undefined) {
		opts.nodes = exeOpts.nodes;
	}

	//tree stuff
	var data = opts.tree.data || savedOpts.tree.data;	
	var width = opts.tree.width || savedOpts.tree.width;
	var height = opts.tree.height || savedOpts.tree.height;
	var scale = opts.tree.scale || false;
	var layoutInput = opts.tree.layoutInput || savedOpts.tree.layoutInput;

	var tree = {
		data : data,
		width : width,
		height : height,
		scale : scale,
		layoutInput : layoutInput,
	}

	//el stuff
	var el = opts.el || document.getElementById("yourDiv");
	var el = el;

	//label stuff
	var fontsize = opts.label.fontsize || savedOpts.label.fontsize;
	var usePics = opts.label.usePics || false;

	//pics stuff
	var exePics = savedOpts.label.pics;
	var optsPics = opts.label.pics; //reducing long strings

	var pictureHeight = optsPics.pictureHeight || exePics.pictureHeight;
	var pictureWidth = optsPics.pictureWidth || exePics.pictureWidth;
	var pictureSource = optsPics.pictureSource || exePics.pictureSource;

	var pics = {
		pictureHeight : pictureHeight,
		pictureSource : pictureSource,
		pictureWidth : pictureWidth,
	}

	//nodes stuff

	var size = opts.nodes.size || savedOpts.nodes.size;	
	var fill = opts.nodes.fill || savedOpts.nodes.fill;
	var stroke = opts.nodes.stroke || savedOpts.nodes.stroke;
	var selectedSize = opts.nodes.selectedSize || savedOpts.nodes.selectedSize;	
	var selectedFill = opts.nodes.selectedFill || savedOpts.nodes.selectedFill;
	var toggle = opts.nodes.toggle || false;
	var select = opts.nodes.select || false;

	var nodes = {
		size : size,
		stroke : stroke,
		fill : fill,
		selectedFill : selectedFill,
		selectedSize : selectedSize,
		toggle : toggle,
		select : select,
	}

	var parsedOpts = {
		tree : tree,
		el : el,
		label : {
			fontsize : fontsize,
			usePics : usePics,
			pics : pics,
		},
		nodes : nodes,
	};

	return parsedOpts;
}

module.exports = {
	opts : exeOpts,
	parseOpts : parseOpts,
};
