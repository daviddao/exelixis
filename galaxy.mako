var xhr = require("xhr");
xhr(jsonURL, function(err, response,text){
	var data = JSON.parse(text).data;
	
	var exe = require("exelixis");
	var createTree = exe.createTree;
	
	var opts = {
		el : galaxyDiv,
		tree : {
			data : data,	
			width : 500,
			height : 12,
			scale : false,
			layoutInput : "vertical",
		},
		label : {
			fontsize : 12,
			usePics : true, 
			pics : {
				pictureWidth : 30,
				pictureHeight : 40,
			},
		},
		nodes : {
			toggle : true, //allows onClickEvent
			select: true, //allows selections
			size : 5,
			fill : "grey",
			stroke : "black",
			selectedFill : "steelblue",
			selectedSize : 4,
		},
	};

	tree = createTree(opts);

});
