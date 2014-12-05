var tnt_theme_tree_tree_annotation_simple = function () {

    // The height of tree labels and tracks
    var height = 20;

    // Create tree and annot
    var tree = tnt.tree();
    var annot = tnt.board();


    var theme = function (ta, div) {

	// helper function
	var get_highest_val = function (node, prop) {
	    var highest = 0;
	    node.apply(function (n) {
		if (n.property(prop) === "") {
		    return;
		}
		var val = parseInt (n.property(prop));
		if (val > highest) {
		    highest = val;
		}
	    });
	    return highest;
	};
	
	// Swap tracks
	var swap_sel = d3.select(div)
	    .append("select")
	    .on("change", function () {
		var cond;
		if (this.value === 'Forward') {
		    cond = function (node1, node2) {
			var highest1 = get_highest_val(node1, '_id');
			var highest2 = get_highest_val(node2, '_id');
			return highest1 - highest2;
		    }
		}
		if (this.value === 'Reverse') {
		    cond = function (node1, node2) {
			var highest1 = get_highest_val(node1, '_id');
			var highest2 = get_highest_val(node2, '_id');
			return highest2 - highest1;
		    }
		}

		tree.root().sort (cond);
		ta.update();
	    });

	swap_sel
	    .append("option")
	    .attr("selected", 1)
	    .text("Forward");

	swap_sel
	    .append("option")
	    .text("Reverse");

	var subtree_sel = d3.select (div)
	    .append("select")
	    .on("change", function () {
		switch (this.value) {
		case 'more' :
		    var sel_tree = tree.subtree(all_nodes);
		    ta.tree(sel_tree);
		    break;
		case 'few' :
		    var sel_tree = tree.subtree(selected_nodes);
		    ta.tree(sel_tree);
		    break;
		}
		ta.update();
	    });


	subtree_sel
	    .append("option")
	    .attr("selected", 1)
	    .attr("value", "more")
	    .text("All Species");

	subtree_sel
	    .append("option")
	    .attr("value", "few")
	    .text("Selected Species");


	
	// TREE SIDE
	// Configure the tree
	var newick = "(((((homo_sapiens:9,pan_troglodytes:9)207598:34,callithrix_jacchus:43)314293:52,mus_musculus:95)314146:215,taeniopygia_guttata:310)32524:107,danio_rerio:417)117571:135;";

	tree
	    .data (tnt.tree.parse_newick (newick))
	    .layout (tnt.tree.layout.vertical()
		     .width(430)
		     .scale(false))
	    .label (tnt.tree.label.text()
		    .height(height));


	// Subtree
	var selected_leaves = ["homo_sapiens", "pan_troglodytes", "mus_musculus", "danio_rerio"];
	var all_nodes = tree.root().get_all_leaves();
	var selected_nodes = [];
	for (var i=0; i<selected_leaves.length; i++) {
	    var leaf = tree.root().find_node_by_name(selected_leaves[i]);
	    if (leaf !== undefined) {
		selected_nodes.push(leaf);
	    }
	}

	// collapse nodes on click
        tree.on_click (function(node){
            node.toggle()
            ta.update();
        });

	// TRACK SIDE
	annot
	    .from(0)
	    .to(1000)
	    .width(300)
	    .right(1000);

	var track = function (leaf) {
	    var sp = leaf.name;
	    return tnt.track()
		.background_color("#EBF5FF")
		.data (tnt.track.data()
		       .update (tnt.track.retriever.sync()
				.retriever (function () {
				    return data[sp] || [];
				})
			       )
		      )
		.display(tnt.track.feature.ensembl()
			 .foreground_color("steelblue")
			 .index(function (d) {
			     return d.start;
			 }));
	};


	ta.tree(tree);
	ta.annotation(annot);
	ta.ruler("both");
	ta.track(track);

	ta(div);
    };

    return theme;
};


var data = {
    'homo_sapiens' : [
	{
	    type  : 'high',
	    start : 233,
	    end   : 260
	},
	{
	    start : 350,
	    end   : 423
	}
    ],
    'pan_troglodytes' : [
	{
	    start : 153,
	    end   : 160
	},
	{
	    start : 250,
	    end   : 333
	},
	{
	    start : 550,
	    end   : 633
	}
    ],
    'callithrix_jacchus' : [
	{
	    type  : 'high',
	    start : 250,
	    end   : 333
	}
    ],
    'mus_musculus' : [
	{
	    type  : 'high',
	    start : 24,
	    end   : 123
	},
	{
	    start : 553,
	    end   : 564
	}
    ],
    'taeniopygia_guttata' : [
	{
	    start : 450,
	    end   : 823
	}
    ],
    'danio_rerio' : [
	{
	    start : 153,
	    end   : 165
	}
    ]

};