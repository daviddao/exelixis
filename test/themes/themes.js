describe ("Themes", function () {
    describe ("Track", function () {

	var delay = 1500;

	describe ("Minimal", function () {

	    it ("Loads", function (done) {
		var board = tnt.board.genome().gene("BRCA2");
		var theme = tnt_theme_track_minimal();
		theme(board, document.getElementById("minimal"));
		setTimeout(done, delay);
	    });

	});

	describe ("Legend", function () {

	    it ("Loads", function (done) {
		var board = tnt.board.genome();
		var theme = tnt_theme_track_legend();
		theme (board, document.getElementById("legend"));
		setTimeout (done, delay);
	    });

	});

	describe("Tooltips", function () {

	    it("Loads", function (done) {
		var board = tnt.board.genome().gene("BRCA2");
		var theme = tnt_theme_track_tooltips();
		theme (board, document.getElementById("tooltips"));
		setTimeout (done, delay);
	    });

	    // it ("Doesn't break when clicking nodes", function () {

	    // 	var e = document.createEvent('UIEvents');
	    // 	e.initUIEvent('click', true, true);
	    // 	var elems = d3.select("#tooltips").selectAll(".tnt_elem").node().dispatchEvent(e);
	    // });
	});

	describe ("Resizable Div", function () {

	    it ("Loads", function (done) {
		var board = tnt.board.genome().gene("BRCA2");
		var theme = tnt_theme_track_resizable_div();
		theme (board, document.getElementById ("resizable-div"));
		setTimeout (done, delay);
	    });

	});

	describe ("Resize", function () {

	    it ("Loads", function (done) {
		var board = tnt.board.genome().gene("BRCA2");
		var theme = tnt_theme_track_resize();
		theme (board, document.getElementById ("resize"));
		setTimeout (done, delay);
	    });
	});

	describe ("Compact", function () {

	    it ("Loads", function (done) {
		var board = tnt.board.genome().gene("BRCA2").width(950);
		var theme = tnt_theme_track_compact()
		    .show_title(false)
		    .foreground_color("#586471")
		    .background_color("#DDDDDD");
		theme (board, document.getElementById ("compact"));
		setTimeout (done, delay);
	    });

	});

	describe ("Buttons", function () {

	    it("Loads", function (done) {
		var board = tnt.board.genome().gene("BRCA2");
		var theme = tnt_theme_track_buttons();
		theme (board, document.getElementById("buttons"));
		setTimeout (done, delay);
	    });

	});


	// describe ("Mobile", function () {
	//     it ("Loads", function (done) {
	// 	var st = tnt.track.genome();
	// 	var theme = tnt_theme_track_mobile();
	// 	theme (st, document.getElementById("mobile"));
	// 	setTimeout (done, delay);
	//     });
	// });

	describe ("Comparative", function () {

	    it ("Loads", function (done) {
		var width   = 800;
		var gene    = "BRCA2";
		var bgColor = "#DCE6E6";
		var fgColor = "#0099CC";

		var gBs = [ tnt.board.genome().species("human").width(width).gene(gene).allow_drag(false),
			    tnt.board.genome().species("mouse").width(width).gene(gene).allow_drag(false)];
		var theme = tnt_theme_track_comparative();
		theme (gBs, document.getElementById("comparative"));
		setTimeout (done, delay);
	    });

	});

	// describe("Orthologues Tree", function () {
	//     it("Loads", function () {
	// 	var st = tnt.track.genome();
	// 	var theme = tnt_theme_track_orthologues_tree();
	// 	theme(st, document.getElementById("TestID"));
	//     });
	// });


	describe ("Minimal Track", function () {

	    it ("Loads", function () {
		var board = tnt.board().from(0).to(500);
		var theme = tnt_theme_track_track_minimal();
		theme (board, document.getElementById ("track_minimal"));
	    });

	});

	describe ("Sequence Track", function () {

	    it ("Loads", function () {
		var board = tnt.board().from(0).to(500);
		var theme = tnt_theme_track_sequence_track();
		theme (board, document.getElementById("sequence_track"));
	    });

	});

	describe ("Line Track", function () {

	    it ("Loads", function () {
		var board = tnt.board().from(0).to(220);
		var theme = tnt_theme_track_line_track();
		theme (board, document.getElementById("line_track"));
	    });

	});

	describe ("Swap Tracks", function () {

	    it ("Loads", function () {
		var board = tnt.board().from(0).to(500);
		var theme = tnt_theme_track_swap_tracks();
		theme (board, document.getElementById("swap_tracks"));
	    });

	});

	describe ("Switch Tracks", function () {

	    it ("Loads", function () {
		var board = tnt.board().from(0).to(220);
		var theme = tnt_theme_track_switch_track();
		theme (board, document.getElementById("switch_tracks"));
	    });

	});

	describe ("Dynamic Track", function () {

	    it ("Loads", function () {
		var board = tnt.board().from(0).to(500);
		var theme = tnt_theme_track_dynamic_track();
		theme (board, document.getElementById("dynamic_track"));
	    });

	});

	describe ("2 Data and Features", function () {

	    it ("Loads", function () {
		var board = tnt.board().from(0).to(1000);
		var theme = tnt_theme_track_2_data_and_features();
		theme (board, document.getElementById("2_data_and_features"));
	    });
	});

    });

    describe("Trees", function () {

	describe("Ensembl Species", function () {
	    var st = tnt.tree();
	    var theme = tnt_theme_tree_ensembl_species();

	    it ("Loads", function () {
		theme (st, document.getElementById("ensembl_species"));
	    });

	    it ("Doesn't break when selecting different releases", function () {
		var sel = d3.select("#ensembl_species").select("select");
		var cbak = sel.on("change");
		var node = sel.node();
		node.value = 13;
		cbak.call(node);
	    });

	});

	describe ("Sort Nodes", function () {
	    var st = tnt.tree();
	    var theme = tnt_theme_tree_sort_nodes();

	    it ("Loads", function () {
		theme (st, document.getElementById("sort_nodes"));
	    });

	    it ("Doesn't break when selecting different sorting/coloring criteria", function () {
		var sels = d3.select ("#sort_nodes").selectAll ("select")[0];

		var this_test = function () {
		    for (var i=0; i<sels.length; i++) {
			var sel = sels[i];
			var cbak = d3.select(sel).on("change");
			sel.value = "Protein-coding genes";
			cbak.call(sel);
		    }
		};
		assert.doesNotThrow (this_test);

	    });
	});

	describe ("Swap Nodes", function () {
	    it ("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_swap_nodes();
		theme (st, document.getElementById("swap_nodes"));
	    });
	});

	describe ("Tooltips", function () {
	    it ("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_tooltip();
		theme (st, document.getElementById("tree_tooltips"));
	    });
	});

	describe ("Ensembl Gene Tree", function () {
	    var st = tnt.tree();
	    var theme = tnt_theme_tree_ensembl_gene_tree();
	    it ("Loads", function () {
		theme(st, document.getElementById("ensembl_gene_tree"));
	    });
	});

	describe ("Scaled Branches", function () {
	    it ("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_scaled_branches();
		theme(st, document.getElementById("scaled_branches"));
	    });
	});

	describe ("Labels", function () {
	    it ("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_labels();
		theme(st, document.getElementById("labels"));
	    });
	});

	describe ("Colors", function () {
	    it("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_colors();
		theme(st, document.getElementById("colors"));
	    });
	});

	describe ("Treefam", function () {
	    it ("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_treefam_tree();
		theme(st, document.getElementById("treefam_tree"));
	    });	    
	});

	describe ("Collapse Nodes", function () {
	    it ("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_collapse_nodes();
		theme(st, document.getElementById("collapse_nodes"));
	    });
	});

	describe ("Layout Transition", function () {
	    it ("Loads", function () {
		var st = tnt.tree();
		var theme = tnt_theme_tree_layout_transition();
		theme(st, document.getElementById("layout_transition"));
	    });
	});

	describe ("Simple Annotation", function () {
	    it ("Loads", function () {
		var st = tnt.tree_annot();
		var theme = tnt_theme_tree_tree_annotation_simple();
		theme (st, document.getElementById("simple_annotation"));
	    });
	});
	
    });
});
