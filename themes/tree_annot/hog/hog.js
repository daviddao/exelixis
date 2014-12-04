var tnt_theme_tree_hog = function () {

    // height for nodes and tracks
    var height = 30;

    var newick = "(((((Otaria_byronia:0.2, Arctocephalus_pusillus:0.2):0.6, ((Neophoca_cinerea:0.2, Phocarctos_hookeri:0.2):0.3, (extra_taxon1:0.1, extra_taxon2:0.1):0.4):0.7):0.2, (Eumetopias_jubatus:0.3, Zalophus_californianus:0.3):0.9, Callorhinus_ursinus:1.2):0.1, Odobenus_rosmarus:1.5, (extra_taxon3:0.2, extra_taxon4:0.2):1.3):0.2, (extra_taxon5:0.2, extra_taxon6:0.2):1.1):0.2";

    var theme = function (ta, div) {

	/////////////////////////
	// TREE /////////////////
	/////////////////////////

	// Tooltips
	var node_tooltip = function (node) {
	    var obj = {};
	    obj.header = {
		label : "Name",
		value : node.node_name()
	    };
	    obj.rows = [];
	    obj.rows.push ({
		label : 'Distance to root',
		value : node.root_dist()
	    });

	    if (node.is_collapsed()) {
		obj.rows.push ({
		    label : 'Action',
		    link : function (node) {
			node.toggle();
			ta.update();
		    },
		    obj : node,
		    value : "Uncollapse subtree"
		});
	    }

	    if (!node.is_leaf()) {
		obj.rows.push ({
		    label : 'Action',
		    link : function (node) {
			node.toggle();
			ta.update();
		    },
		    obj : node,
		    value : "Collapse subtree"
		});
		obj.rows.push ({
		    label : 'Action',
		    link : function (node) {
			var leaves = node.get_all_leaves();
			selected_leaves = _.map(leaves, function (leaf) {
			    return leaf.node_name();
			});
			tree.node_circle_size (function (n) {
			    if (node.id() === n.id()) {
				return 6
			    }
			    return node_size(n);
			});
			tree.node_color (function (n) {
			    if (node.id() === n.id()) {
				return "brown";
			    }
			    return node_color(n);
			});

			ta.update();
			ta.track(track);
		    },
		    obj : node,
		    value : 'Show Annotation'
		});
	    }

	    tnt.tooltip.table().call (this, obj);
	};

	var node_color = function (node) {
	    if (node.is_collapsed()) {
		return "grey";
	    }
	    return "black";
	};

	var node_size = function (node) {
	    if (node.is_leaf()) {
		return 4;
	    }
	    return 2;
	}

	// Define the tree part
	var tree = tnt.tree()
	    .data (tnt.tree.parse_newick (newick))
	    .layout (tnt.tree.layout.vertical()
		     .width (400)
		     .scale (true))
	    .label (tnt.tree.label.text()
		    .fontsize (12)
		    .height (height)
		    .text (function (node) {
			if (typeof (node) !== 'function') {
			    throw(node);
			}
			var data = node.data();
			if (node.is_collapsed()) {
			    return "[" + node.n_hidden() + ' hidden taxa]';
			}
			return data.name.replace(/_/g, ' ');
		    })
		    .color (function (node) {
		    	if (node.is_collapsed()) {
		    	    return 'grey';
		    	}
		    	return 'black';
		    })
		   )
	    .node_color(node_color)
	    .link_color("black")
	    .node_circle_size (node_size)
	    .on_click (node_tooltip);

	var selected_leaves = _.map (tree.root().get_all_leaves(), function (leaf) {
	    return leaf.node_name();
	});
	tree.node_color (function (node) {
	    if (node.id() === tree.root().id()) {
		return "brown";
	    }
	    return node_color(node);
	});
	tree.node_circle_size (function (node) {
	    if (node.id() === tree.root().id()) {
		return 6;
	    }
	    return node_size(node);
	});

	/////////////////////////
	// TRACKS ///////////////
	/////////////////////////

	// Annotation select
	var select = d3.select(div)
	    .append("select")
	    .on ("change", function () {
		var track = setup_annotation (annot, this.value);
		ta.track(track);
		ta.update();
	    });

	select
	    .append("option")
	    .attr("selected", 1)
	    .attr("value", "oma")
	    .text("OMA");

	select
	    .append("option")
	    .attr("value", "ensembl")
	    .text("Ensembl Compara");


	// Tooltips on HOGs
	var hog_tooltip = function (hog) {
	    var obj = {};
	    obj.header = {
		label : "Name",
		value : hog.name
	    };
	    obj.rows = [];
	    obj.rows.push ({
		label : "Desc",
		value : hog.desc
	    });

	    tnt.tooltip.table().call (this, obj);
	};


	// TnT doesn't have a square feature, so we are creating one
	// in the theme using the tnt.track.featur interface
	var square_features = tnt.track.feature()
	    .create (function (new_elems, x_scale) {
		var track = this;
		var padding = ~~(track.height() - (track.height() * 0.8)) / 2;

		new_elems
		    .append("rect")
		    .attr("x", function (d,i) {
			return x_scale (i) + padding;
		    })
		    .attr("y", padding)
		    .attr("width", track.height() - ~~(padding * 2))
		    .attr("height", track.height() - ~~(padding * 2))
		    .attr("fill", "grey")
	    })
	    .on_click (hog_tooltip);

	var annot = tnt.board()
	    .from(0)
	    .zoom_in(1)
	    .allow_drag(false);

	var setup_annotation = function (annot, source) {

	    var max_items = _.max(data[source], function (d) {
		return d.length;
	    });
	    var l = max_items.length;
 
	    // Define the annotation part
	    annot
		.to(l)
		.width(l * height)
		.right(l);

	    track = function (leaf) {
		var sp = leaf.name;
		return tnt.track()
		    .background_color('#E8E8E8')
		    .data (tnt.track.data()
			   .update (tnt.track.retriever.sync()
				    .retriever (function () {
					if (_.indexOf(selected_leaves, sp) < 0) {
				    	    return [];
					}
					return data[source][sp] || [];
				    })
				   )
			  )
		    .display (square_features);
	    };
	    return track
	}

	// We start with OMA annotation
	var track = setup_annotation(annot, 'oma');

	/////////////////////////
	// TREES + ANNOT ////////
	/////////////////////////
	ta.tree(tree);
	ta.annotation(annot);
	ta.track(track);
	ta (div);
    };

    return theme;
};

var data = {
    'oma' : {
	'Otaria_byronia' : [
	    {
		name : 'NU4LM_ARCPU-OB1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OB2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OB3',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Arctocephalus_pusillus' : [
	    {
		name : 'NU4LM_ARCPU-AP1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-AP2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-AP3',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	],
	'Neophoca_cinerea' : [
	    {
		name : 'NU4LM_ARCPU-NC1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-NC2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Phocarctos_hookeri' : [
	    {
		name : 'NU4LM_ARCPU-PH1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-PH1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon1' : [
	    {
		name : 'NU4LM_ARCPU-ET1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon2' : [
	    {
		name : 'NU4LM_ARCPU-ET2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Eumetopias_jubatus' : [
	    {
		name : 'NU4LM_ARCPU-EJ1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-EJ2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Zalophus_californianus' : [
	    {
		name : 'NU4LM_ARCPU-ZF1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Callorhinus_ursinus' : [
	    {
		name : 'NU4LM_ARCPU-CU1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-CU2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Odobenus_rosmarus' : [
	    {
		name : 'NU4LM_ARCPU-OR1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OR2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }	
	],
	'extra_taxon3' : [
	    {
		name : 'NU4LM_ARCPU-ET3',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon4' : [
	    {
		name : 'NU4LM_ARCPU-ET4',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon5' : [
	    {
		name : 'NU4LM_ARCPU-ET5',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon6' : [
	    {
		name : 'NU4LM_ARCPU-ET6',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	]
    },
    'ensembl' : {
	'Otaria_byronia' : [
	    {
		name : 'NU4LM_ARCPU-OB1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OB2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OB3',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OB4',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OB5',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Arctocephalus_pusillus' : [
	    {
		name : 'NU4LM_ARCPU-AP1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-AP2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-AP3',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-AP4',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-AP5',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Neophoca_cinerea' : [
	    {
		name : 'NU4LM_ARCPU-NC1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-NC2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-NC3',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-NC4',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Phocarctos_hookeri' : [
	    {
		name : 'NU4LM_ARCPU-PH1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-PH1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon1' : [
	    {
		name : 'NU4LM_ARCPU-ET1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon2' : [
	    {
		name : 'NU4LM_ARCPU-ET2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Eumetopias_jubatus' : [
	    {
		name : 'NU4LM_ARCPU-EJ1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-EJ2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Zalophus_californianus' : [
	    {
		name : 'NU4LM_ARCPU-ZF1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Callorhinus_ursinus' : [
	    {
		name : 'NU4LM_ARCPU-CU1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-CU2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'Odobenus_rosmarus' : [
	    {
		name : 'NU4LM_ARCPU-OR1',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    },
	    {
		name : 'NU4LM_ARCPU-OR2',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }	
	],
	'extra_taxon3' : [
	    {
		name : 'NU4LM_ARCPU-ET3',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon4' : [
	    {
		name : 'NU4LM_ARCPU-ET4',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon5' : [
	    {
		name : 'NU4LM_ARCPU-ET5',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	],
	'extra_taxon6' : [
	    {
		name : 'NU4LM_ARCPU-ET6',
		desc : 'NADH-ubiquinone oxidoreductase chain 4L'
	    }
	]
    }
};