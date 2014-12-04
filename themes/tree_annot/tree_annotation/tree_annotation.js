var tnt_theme_tree_tree_annotation = function () {

    var theme = function (div) {

	// The height of tree labels and tracks
	var height = 20;

	// Create tree and annot
	var tree = tnt.tree();
	var annot = tnt.board();

	// Create sub-divs for tree and annot
	var tree_div = d3.select(div)
	    .append("div")
	    .attr("class", "tree_pane");

	var annot_div = d3.select(div)
	    .append("div")
	    .attr("class", "annot_pane");

	// TREE SIDE
	// Configure the tree
	var newick = "(((((homo_sapiens:9,pan_troglodytes:9)207598:34,callithrix_jacchus:43)314293:52,mus_musculus:\95)314146:215,taeniopygia_guttata:310)32524:107,danio_rerio:417)117571:135;";
	tree
	    .data (tnt.tree.parse_newick (newick))
	    .layout (tnt.tree.layout.vertical()
		     .width(430)
		     .scale(false))
	    .label (tnt.tree.label.text()
		    .height(height));

	// Plot the tree
	tree(tree_div.node());

	// TRACK SIDE
	var leaves = tree.root().get_all_leaves();

	var tracks = [];
	for (var i=0; i<leaves.length; i++) {
            // Block Track1
	    var block_track = tnt.track()
		.height(height)
		.background_color("#EBF5FF")
		.data(tnt.track.data()
		      .update(
			  tnt.track.retriever.sync()
			      .retriever (function () {
				  return [
				      {
					  start : 233,
					  end   : 260
				      },
				      {
					  start : 350,
					  end   : 423
				      }
				  ]
			      })
		      )
		     )
		.display(tnt.track.feature.block()
			 .foreground_color("steelblue")
			 .index (function (d) {
			     return d.start;
			 }));

	    tracks.push (block_track);
	}

	annot.right (1000);

	// An axis track
	var axis = tnt.track()
            .height(20)
            .background_color("white")
            .display(tnt.track.feature.axis()
                     .orientation("bottom")
                    );


	// We add the tracks
	annot
	    .from(0)
	    .to(1000)
	    .width(300)
	    .add_track(tracks)
	    .add_track(axis);
	annot(annot_div.node());
	annot.start();
    };

    return theme;
};
