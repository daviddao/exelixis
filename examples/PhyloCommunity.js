var exe = require("exelixis");

var createTree = exe.createTree;

updateTree = exe.updateTree;
updateLabelHistogram = exe.updateLabelHistogram;

d3.select("#nRadius").on("click", function() {
  //updateCircleRadius(+this.value);
  updateRadius(+this.value, tree, opts);
});

d3.select("#labelHistogramK").on("click", function() {
    opts.table_hist.labelHistogramK = +this.value;
    updateLabelHistogram(tree, opts);
});

initHoverTooltip();

opts = {

		el : document.getElementById("yourDiv"),
		tree : {
			data : "();",	
			width : 2000,
			scale : true,
			layoutInput : "phylocommunity",
		},
		label : {
			fontsize : 12,
			useHists : true,
		},
		nodes : {
			toggle : true, //allows onClickEvent
			select: true, //allows selections
			size : 5,
			fill : "orange",
			stroke : "yellow",
			selectedFill : "steelblue",
			selectedSize : 4,
		},
		histograms: {
			full_length: 70
		},
		upstream: []
};

opts.root_chain = d3.select("#root_chain")
                    .append("svg")
                    .attr("width", window.innerWidth)
                    .attr("height", 100);

tree = createTree(opts);
updateRadius(0.8, tree, opts);

window.onload = onload_cbak;
