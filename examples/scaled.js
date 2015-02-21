var exe = require("exelixis");

var createTree = exe.createTree;

updateTree = exe.updateTree;


/* Try to change the opts in your console */

opts = {

		el : document.getElementById("yourDiv"),
		tree : {
			data : "(homo_sapiens:12,(mus_musculus:12,(danio_rerio:13,(pan_troglodytes:9,(taeniopygia_guttata:10,callithrix_jacchus:11):12):12):10);",	
			width : 700,
			height : 12,
			scale : true,
			layoutInput : "vertical",
		},
		label : {
			fontsize : 10,
			usePics : true, 
			pics : {
				pictureWidth : 30,
				pictureHeight : 40,
			},
		},
		nodes : {
			toggle : false, //allows onClickEvent
			select: false, //allows selections
			size : 5,
			fill : "black",
			stroke : "black",
			selectedFill : "steelblue",
			selectedSize : 4,
		},
};

tree = createTree(opts);

//updateTree(tree,opts);