var treefam_theme = function() {

	// The height of tree labels and tracks
	var height = 12;
	var pics_path = "http://www.treefam.org/static/images/species_pictures/species_files/";
	// Create tree and annot
	var tree = tnt.tree();
	var annot = tnt.board();
	var info_div;

	var theme = function(ta, div) {

		// helper function
		var get_highest_val = function(node, prop) {
			var highest = 0;
			node.apply(function(n) {
				if (n.property(prop) === "") {
					return;
				}
				var val = parseInt(n.property(prop));
				if (val > highest) {
					highest = val;
				}
			});
			return highest;
		};
		info_div = d3.select(div).append("div").attr("id", "info_div");


		// Allow switching between full and model tree
		add_tree_type_drop_down({
			ta: ta,
			div: div
		});
		add_scale_drop_down({
			ta: ta,
			div: div
		});

		// Swap tracks
		var sel = d3.select(div)
			.append("select")
			.on("change", function() {
				var cond;
				if (this.value === 'Forward') {
					cond = function(node1, node2) {
						var highest1 = get_highest_val(node1, '_id');
						var highest2 = get_highest_val(node2, '_id');
						return highest1 - highest2;
					}
				}
				if (this.value === 'Reverse') {
					cond = function(node1, node2) {
						var highest1 = get_highest_val(node1, '_id');
						var highest2 = get_highest_val(node2, '_id');
						return highest2 - highest1;
					}
				}

				tree.root().sort(cond);
				ta.update();
			});

		sel
			.append("option")
			.attr("selected", 1)
			.text("Forward");
		sel
			.append("option")
			.text("Reverse");

		// LABELS
		var label = tnt.tree.label.text()
			.text(function(node) {

				if (node.is_collapsed()) {
					return "[" + node.n_hidden() + ' hidden taxa]';
				}
				if (node.data().children) {
					return "";
				} else {
					if (node.data().taxonomy) {
						if (node.data().taxonomy.common_name) {
							return node.data().taxonomy.common_name;
						} else {
							return node.data().taxonomy.scientific_name;
							for (var i = 0, len = node.data().id.length; i < len; i++) {
								if (node.data().id[i].source === 'EnsEMBL') {
									return node.data().id[i].accession
								}
							}
						}
					}

				}
			})
			.fontsize(10)
			.height(height);

		var ensembl_label = tnt.tree.label.text()
			.text(function(node) {
				if (node.data().children) {
					return "";
				} else {
					if (node.data().id && node.data().id) {
						return node.data().id.accession
					} else {
						return "N/A";
					}

				}
			})
			.fontsize(10)
			.height(height);

		var uniprot_label = tnt.tree.label.text()
			.text(function(node) {
				if (node.data().children) {
					return "";
				} else {
					if (node.data().id && node.data().id.uniprot) {
						return node.data().id.uniprot;
					} else {
						return "N/A";
					}

				}
			})
			.fontsize(10)
			.height(height);
		var image_label = tnt.tree.label.img()
			.src(function(d) {
				if (!d.children && !d._children && d.taxonomy && d.taxonomy.scientific_name) {
					var changed_name = d.taxonomy.scientific_name.replace(/ /g, '_');
					return pics_path + "/thumb_" + changed_name + ".png";
				} else {
					var test = d;
				}
			})
			.width(function() {
				return 10;
			})
			.height(function() {
				return 10;
			});
		var joined_label = tnt.tree.label.composite()
			.add_label(label)
			.add_label(image_label);


		// The menu to change the labels dynamically
		var menu_pane = d3.select(div)
			.append("div")
			.append("span")
			.text("Label display:   ");


		var label_type_menu = menu_pane
			.append("select")
			.on("change", function(d) {
				switch (this.value) {
					case "common_name":
						ta.tree().label(label);
						break;
					case "uniprot":
						ta.tree().label(uniprot_label);
						break;
				}
				ta.update();
			});
		label_type_menu
			.append("option")
			.attr("value", "common_name")
			.text("common name");

		label_type_menu
			.append("option")
			.attr("value", "uniprot")
			.attr("selected", 1)
			.text("uniprot");

		var species_info = {};
		d3.json('/themes/tree_annot/treefam_tree/tree.json',
			function(err, resp) {
				console.log("have read tree, will deploy it");
				d3.json('/themes/tree_annot/treefam_tree/e75.json',
					function(err, species_list) {
						console.log("got species list for " + species_list.species.length + " species");
						for (var i = 0, len = species_list.species.length; i < len; i++) {
							var datum = species_list.species[i];
							species_info[datum.taxon_id] = {
								name: datum.name,
								common_name: datum.common_name,
								division: datum.division,
								taxon_id: datum.taxon_id
							}
						}

						// console.log(species_info['homo_sapiens']);
						// console.log(species_list.species);
						deploy_vis(resp);

					})
			})

		// TREE SIDE
		// Configure the tree
		// var newick = "(((((homo_sapiens:9,pan_troglodytes:9)207598:34,callithrix_jacchus:43)314293:52,mus_musculus:95)314146:215,taeniopygia_guttata:310)32524:107,danio_rerio:417)117571:135;";

		// TREE SIDE
		var deploy_vis = function(tree_obj) {
			// console.log("value is " + tree_obj.proposed_GA_bitscore_threshold);
			// proposed_TC_bitscore_threshold = tree_obj.proposed_TC_bitscore_threshold;
			// proposed_GA_bitscore_threshold = tree_obj.proposed_GA_bitscore_threshold;
			// info_div.html("TC: " + proposed_TC_bitscore_threshold + " | GA: " + proposed_GA_bitscore_threshold);
			// // console.log(tree_obj.tree);
			unflattened_tree = tree_obj.tree;

			tree
				.data(tree_obj.tree)
				.layout(tnt.tree.layout.vertical()
					.width(430)
					.scale(false))
				.label(ensembl_label
				)
				.node_circle_size(3)
				.on_click(node_tooltip)
				.node_color(function(node) {
					// console.log(node.data());
					// console.log(node.data().events.type);
					if (node.is_collapsed()) {
						return 'grey';
					}
					if (node.data().events && node.data().events.type) {
						if (node.data().events.type === 'speciation') {
							return 'green';
						} else if (node.data().events.type === 'duplication') {
							return 'red';
						} else {
							return 'brown';
						}
					} else {
						return '';
					}
				});
			// collapse nodes on click
			// tree.on_click(function(node) {
			// 	node.toggle_node();
			// 	ta.update();
			// });

			// TRACK SIDE
			// annot
			// 	.from(0)
			// 	.to(4000)
			// 	.width(300)
			// 	.zoom_out(4000)
			// 	.right(4000);

			// annot
			// 	.from(0)
			// 	.to(max_val)
			// 	.right(max_val)
			// 	.width(300)
			// 	.zoom_out(max_val)
			// 	.zoom_in(30);
			annot
				.from(0)
				.width(300)
				.allow_drag(false);

			var set_retriever = function(leaf, value) {
				return function() {
					return data[leaf.property('name')][value];
				}
			};
			var leaves = tree.root().get_all_leaves();
			var display_select = d3.select(div)
				.append("select")
				.on("change", function() {
					var tracks = ta.annotation().tracks();
					switch (this.value) {
						case 'blocks':
							for (var i = 1; i < tracks.length - 1; i++) {
								tracks[i]
									.display(tnt.track.feature.ensembl()
										.foreground_color('steelblue')
										.index(function(d) {
											return d.start;
										}));
							}
							break;

						case 'line':
							for (var i = 1; i < tracks.length - 1; i++) {
								tracks[i]
									.display(tnt.track.feature.area()
										.foreground_color('steelblue')
										.index(function(d) {
											return d.pos;
										}));
							}
							break;
					}

					// var leaves = tree.root().get_all_leaves();
					for (var i = 0; i < leaves.length; i++) {
						var track = ta.annotation().find_track_by_id(leaves[i].id());
						track
							.data()
							.update()
							.retriever(set_retriever(leaves[i], this.value))
					}

					ta.annotation().start();
					ta.update();
				});

			display_select
				.append("option")
				.attr("value", "line")
				.text("lines")
				.attr("selected", 1);

			display_select
				.append("option")
				.attr("value", "blocks")
				.text("blocks");



			var conservation = get_conservation(leaves);
			var hmm_match_boundaries; // = get_hmm_match_boundaries(leaves);
			var pfam_match_boundaries = get_pfam_match_boundaries(leaves);
			// var exon_boundaries = get_boundaries(leaves);
			var aln_gaps = get_aln_gaps(leaves);



			function rightRoundedRect(args) {
				var x = args.x, y = args.y, width = args.width, height = args.height, match_start = args.match_start, match_end = args.match_end;
				var string = "M" + x + "," + y
					       + "h" + width
					       + "a" + 5 + "," + 5 + " 0 0 "+ match_end+" " + 0 + "," + height
					       + "h" + -width
					       + "v" + -height
					       + "z";
					  return "M" + x + "," + y
					       + "h" + width
					       + "a" + 5 + "," + 5 + " 0 0 "+match_end+" " + 0 + "," + height
					       + "h" + -width
					       + "a" + 5 + "," + 5 + " 0 0 "+match_start+" " + 0 + "," + -height
					       + "z";
			}
			// ok we add a new feature
			// TnT doesn't have a square feature, so we are creating one
			// in the theme using the tnt.track.featur interface
			var domain_features = tnt.track.feature()
				.create(function(new_elems, x_scale) {
					var track = this;
					 var padding = ~~ (track.height() - (track.height() * 0.6)) / 2;
					 // new_elems.append("path").attr("d", rightRoundedRect(x_scale(d.start), padding, x_scale(d.end - d.start), track.height() - ~~(padding * 2)))
					 // .attr("fill", "grey");

					 new_elems.append("path")
    						.attr("d", function(d){
    							var match_start = (d.hmm_start > 10)? 0:1;
    							var match_end = (d.hmm_start > 10)? 0:1;
    							console.log("have "+match_start+" ("+d.hmm_start+") and "+match_end)+" ("+d.hmm_end+")";
    							return rightRoundedRect({x:x_scale(d.start), y:padding, width:x_scale(d.end - d.start), height:track.height() - ~~(padding * 2), 
    							match_start : match_start, match_end : match_end })
    							})
    						.attr("fill", "grey");



					// new_elems
					// 	.append("rect")
					// 	.attr("x", function(d) {
					// 		return x_scale(d.start);
					// 	})
					// 	.attr("y", padding)
					// 	.attr("rx", function(d){
					// 		if(d.hmm_start <5){
					// 			return 0;
					// 		}
					// 		return 3;

					// 	})
					// 	.attr("width", function(d){
					// 		return x_scale(d.end - d.start);
					// 	})
					// 	.attr("height", track.height() - ~~(padding * 2))
					// 	.attr("fill", "grey")
				})
				// .on_click(hog_tooltip);



			track = function(leaf) {
				var id = leaf._id;
				return tnt.track()
					.background_color("#EBF5FF")
					.data(tnt.track.data()
						.update(tnt.track.retriever.sync()
							.retriever(function(loc) {
								// var seq_range = (loc.to - loc.from) <= 50 ? seq_info[id].slice(loc.from, loc.to) : [];
								return {
									// 'conservation': conservation[id] || [],
									// 'gaps': reduce_gaps(aln_gaps[id], loc) || [],
									// 'pfam_match': filter_pfam_matches(pfam_match_boundaries[id], loc) || [],
									 'domains': filter_pfam_matches(pfam_match_boundaries[id], loc) || [],
									// 'boundaries': filter_exon_boundaries(exon_boundaries[id], loc) || [],
									// 'sequence': seq_range
								}
							})
						)
					)
					.display(tnt.track.feature.composite()
						// .add('conservation', tnt.track.feature.area()
						// 	.foreground_color("steelblue")
						// 	.index(function(d) {
						// 		return d.pos;
						// 	})
						// )

						 .add('domains', domain_features
						 	.index(function(d) {
								return d.start;
							}))
						// .add('gaps', tnt.track.feature.ensembl()
						// 	.foreground_color('green')
						// 	.index(function(d) {
						// 		return d.start;
						// 	})
						// )
						// .add('gaps', tnt.track.feature.ensembl()
						// 	.foreground_color('green')
						// 	.index(function(d) {
						// 		return d.start;
						// 	})
						// )
						// .add('pfam_match', tnt.track.feature.ensembl()
						// 	.foreground_color('blue')
						// 	.index(function(d) {
						// 		return d.start;
						// 	})
						// )
						// .add('boundaries', tnt.track.feature.vline()
						// 	.foreground_color("red")
						// 	.index(function(d) {
						// 		return d.loc;
						// 	})
						// )
						// .add('sequence', tnt.track.feature.sequence()
						// 	.foreground_color("black")
						// 	.sequence(function(d) {
						// 		return d.nt;
						// 	})
						// 	.index(function(d) {
						// 		return d.pos;
						// 	})
						// )
					);
			};

			// var track = function(leaf) {
			// 	var sp = leaf.name;
			// 	return tnt.track()
			// 		.background_color("#EBF5FF")
			// 		.data(tnt.track.data()
			// 			.update(tnt.track.retriever.sync()
			// 				.retriever(function() {
			// 					return data[sp] ? data[sp].line : [];
			// 				})
			// 			)
			// 		)
			// 		.display(tnt.track.feature.area()
			// 			.foreground_color("steelblue")
			// 			.index(function(d) {
			// 				return d.pos;
			// 			}));
			// };

			var max_val = d3.max(leaves, function(d) {
				var test = d.data();
				if (d.data().sequence && d.data().sequence.mol_seq && d.data().sequence.mol_seq.seq && d.data().sequence.mol_seq.seq.length) {
					return d.data().sequence.mol_seq.seq.length;
				} else {
					return 0;
				}
			});
			console.log("max val is: " + max_val);

			var division_gene_counter = {},
				duplicate_genes = {};
			var division_species_counter = {
				"Ensembl": 0,
				"EnsemblMetazoa": 0,
				"EnsemblFungi": 0,
				"EnsemblProtists": 0,
				"EnsemblPlants": 0,
				"EnsemblBacteria": 0
			};
			var division_order = ["Ensembl", "EnsemblMetazoa", "EnsemblFungi", "EnsemblProtists", "EnsemblPlants", "EnsemblBacteria"];
			for (var i = 0; i < leaves.length; i++) {
				var node = leaves[i].data();
				var node_name;
				if (node.taxonomy && node.taxonomy.id) {
					node_name = node.taxonomy.id;
					if (species_info.hasOwnProperty(node_name)) {
						var node_info = species_info[node_name];
						if (node_info.division) {
							if (division_species_counter.hasOwnProperty(node_info.division)) {

								division_species_counter[node_info.division] = division_species_counter[node_info.division] + 1;

								if (!duplicate_genes[node.taxonomy.id]) {
									if (division_gene_counter.hasOwnProperty(node_info.division)) {
										division_gene_counter[node_info.division] = division_gene_counter[node_info.division] + 1;
									} else {
										division_gene_counter[node_info.division] = 1;
									}
								}
								duplicate_genes[node.taxonomy.id] = 1;
							} else {
								division_species_counter[node_info.division] = 1;
							}

						}
					}
				}
			};
			var species_html = '',
				genes_html = '';
			// var speciesorder = ["man","mouse", "frog", "zebrafish","fly", "worm","plant", "yeast"];
			console.log(division_species_counter);
			console.log(division_gene_counter);

			for (var i = 0, len = division_order.length; i < len; i++) {
				var division = division_order[i];
				console.log("checking " + division);
				if (division_species_counter.hasOwnProperty(division)) {
					var print_style = (division_species_counter[division] === 0) ? "style='opacity:0.3;'" : "";
					species_html += "<span " + print_style + " class='found_species_label' >" + division + ":" + division_species_counter[division] + "</span> ";
				}
			}
			for (var i = 0, len = division_order.length; i < len; i++) {
				var division = division_order[i];
				// for (var key in division_gene_counter) {
				if (division_gene_counter.hasOwnProperty(division)) {
					// if(division !== ''){
					// genes_html += division+":"+division_gene_counter[division]+" ";
					var print_style = (division_gene_counter[division] === 0) ? "style='opacity:0.3;'" : "";
					genes_html += "<span " + print_style + " class='found_species_label' >" + division + ":" + division_gene_counter[division] + "</span> ";
					// }
				}
			}
			info_div.html("Genes: " + species_html + " <br> Species: " + genes_html);

			// console.log(division_species_counter);
			// console.log(division_gene_counter);
			console.log("done");

			ta.tree(tree);
			ta.annotation(annot
				.to(max_val)
				.right(max_val)
				.zoom_out(max_val)
				.zoom_in(30)
			);

			ta.ruler("both");
			ta.track(track);
			// ta.on_click(ta.tooltip());
			ta(div);


			// color_tree(ta.tree().root().get_all_descendents());

		}


		// Tooltips
		var node_tooltip = function(node) {
			var obj = {};
			obj.header = {
				label: "Name",
				value: node.node_name()
			};
			obj.rows = [];
			obj.rows.push({
				label: 'Distance to root',
				value: node.root_dist()
			});

			if (node.is_collapsed()) {
				obj.rows.push({
					label: 'Action',
					link: function(node) {
						node.toggle();
						ta.update();
					},
					obj: node,
					value: "Uncollapse subtree"
				});
			}

			if (!node.is_leaf()) {
				obj.rows.push({
					label: 'Action',
					link: function(node) {
						node.toggle();
						ta.update();
					},
					obj: node,
					value: "Collapse subtree"
				});
				obj.rows.push({
					label: 'Action',
					link: function(node) {
						var leaves = node.get_all_leaves();
						selected_leaves = _.map(leaves, function(leaf) {
							return leaf.node_name();
						});
						tree.node_circle_size(function(n) {
							if (node.id() === n.id()) {
								return 6
							}
							return node_size(n);
						});
						tree.node_color(function(n) {
							if (node.id() === n.id()) {
								return "brown";
							}
							return node_color(n);
						});

						ta.update();
						ta.track(track);
					},
					obj: node,
					value: 'Show Annotation'
				});
			}

			tnt.tooltip.table().call(this, obj);
		};
	};

	return theme;
};

color_tree = function(all_descendents) {
	var target = "tnt_groupDiv";
	// d3.select("." + target).selectAll(".clade_tax_rect").remove();

	var nodes2color = {
		"Sauria": 1,
		"Glires": 1,
		"Mammalia": 1,
		"Arthropoda": 1,
		"Metazoa": 1,
		"Euarchontoglires": 1,
		// "Tracheophyta": 1
	};


	var rect_nodes = color_nodes(all_descendents, nodes2color);

	var color_codes = color_subtrees({
		subtree_colors: rect_nodes,
		visibility: "",
		target: target
	});
	// var color_rects = color_subtree_rects({
	// 	subtree_colors: rect_nodes,
	// 	target: "second_div",
	// 	visibility: "",
	// 	right_border: this.opt.tree_div_width
	// });


}


color_nodes = function(nodes, nodes2color) {
	// go through all nodes [ root -> leaves ]
	// if node found, get highest+lowest leaf coordinates
	// a rect should be drawn from the current 
	console.log("coloring nodes");
	var previous_taxon = "";
	var rect_data = new Array;
	for (var i = 0; i < nodes.length; i++) {
		var d = nodes[i].data();
		var node_depth = d.depth;
		var node_name = "";
		var node_id = d._id;
		var curr_node_x = d.x;
		var curr_node_y = d.y;
		// console.log("has "+d.children.length+" children");
		// if (node_depth > 0) {
		// node_name = d.taxonomy.scientific_name;
		if (d.taxonomy && d.taxonomy.scientific_name) {
			node_name = d.taxonomy.scientific_name;
		} else {
			node_name = "test";
		}
		// }
		console.log("name: " + node_name + " depth: " + node_depth + " id: " + node_id);
		// var exists
		if (
			nodes2color.hasOwnProperty(node_name) ||
			// (node_depth === 1) || 
			(node_depth === 0)

		) {
			// console.log("ok, taking id "+d.id());
			// if (previous_taxon == node_name) {
			//console.log("well, it is equal. do nothing for "+d.name+"!!!");
			// break;
			// }else {
			var all_children = get_all_children(d);

			var min_x = 9000,
				max_x = 0,
				min_y = 9000,
				max_y = 0,
				max_y;
			console.log("looking at " + all_children.length + " children");
			all_children.forEach(function(node) {
				var node_x = node.x;
				var node_y = node.y;
				// console.log("node_y: " + node_y + " node_x" + node_x);

				// if (node.name === node_name) {
				//console.log(node.name+" has coord: x:"+node.x+" and y:"+node.y);
				// } else {
				//console.log(node.name+" has coord: x:"+node.x+" and y:"+node.y);
				if (node_x < min_x) {
					min_x = node_x;
				}
				if (node_x > max_x) {
					max_x = node_x;
				}
				if (node_y < min_y) {
					min_y = node_y;
				}
				if (node_y > max_y) {
					max_y = node_y;
				}

				// max_y = node_y;
				// }
			})
			var rect_y = 0;
			var rect_width = max_x - min_x + 16;
			var rect_height = max_y - curr_node_y + 550;
			var rect_x = max_x - curr_node_x + 8;
			rect_x = -rect_x;
			console.log(max_y + " - " + min_y);
			console.log(max_x + " - " + min_x);

			console.log("plot for " + node_name + " level " + node_depth + "from " + rect_y + " heigth: " + rect_height + "(" + max_y + "-) width: " + rect_width + " min_x:" + min_x + " max_x:" + max_x + " min_y: " + min_y + " and max_y: " + max_y);

			rect_data[node_id] = {
				"rect_x": rect_x,
				"rect_y": rect_y,
				"min_y": min_y,
				"max_y": max_y,
				"rect_height": rect_height,
				"rect_width": rect_width,
				min_x: min_x,
				max_x: max_x,
				name: node_name,
			};

		}
	}
	// console.log(rect_data);
	return rect_data;
}


function color_subtrees(args) {
	var subtree_colors = args.subtree_colors;
	var target = args.target;
	var visibility = args.visibility;
	var SwissProt2colorDictionary = new Object();
	var Taxa2colorDictionary = new Object();
	var p = d3.scale.category20c();
	var r = p.range(); // ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
	// "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
	var p_taxa = d3.scale.category10();
	var r_taxa = p_taxa.range();

	var i = 0;
	var i_taxa = 0;
	var html = "";
	var previous_taxon = "";

	//console.log("one color is "+p(0));
	//d3.select("#tree svg").selectAll(".leaf_label")
	console.log(subtree_colors);
	// var all_available_node = d3.select("svg").selectAll(".subtree_color_rects").data(subtree_colors);
	// var all_available_node = d3.select("svg").selectAll(".subtree_color_rects").data(subtree_colors);
	var all_available_node = d3.select("." + target).selectAll(".tnt_tree_node").filter(function(d) {

		return subtree_colors.hasOwnProperty(d._id);
	});

	all_available_node.append("rect")
	//.on('mouseover', show_gene_information)
	.attr("x", function(d) {
		return subtree_colors[d._id].rect_x;
		console.log("rect_x is " + d.rect_x);
		return d.rect_x;
	})
		.attr("y", 0)
		.attr("id", function(d) {
			return "subtree_color_rect_" + d._id;
		})
		.attr("class", "clade_tax_rect")
	// .attr("display", "none")
	//.attr("visibility",visibility)
	.attr("width", function(d) {
		return subtree_colors[d._id].rect_width;
		return d.rect_width;
	})
		.attr("height", function(d) {
			return subtree_colors[d._id].rect_height;
			return d.rect_height;
		})
		.attr("transform", function(d) {
			return "rotate(-90)";
		})
		.attr("fill", function(d) {
			//console.log("looking at "+d.swissprot_protein_name);
			// avoid duplicates
			// var name_copy = d.name;
			// name_copy=name_copy.replace(/_\d+/g, '');
			//console.log("check if "+previous_taxon+" == "+name_copy);
			if (Taxa2colorDictionary[d._id] === undefined) {
				Taxa2colorDictionary[d._id] = p_taxa(i_taxa % p_taxa.range().length);
				i_taxa++;
			}

			//console.log("setting "+previous_taxon+" == "+name_copy);
			return Taxa2colorDictionary[d._id];
		})
		.attr("fill-opacity", function(d) {
			return 0.2;
		});

	return Taxa2colorDictionary;
}

function color_subtree_rects(args) {
	var subtree_colors = args.subtree_colors;
	var target = args.target;
	var visibility = args.visibility;
	var right_border = args.right_border;
	var SwissProt2colorDictionary = new Object();
	var Taxa2colorDictionary = new Object();
	var p = d3.scale.category20c();
	var r = p.range(); // ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
	// "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
	var p_taxa = d3.scale.category20b();
	var r_taxa = p_taxa.range();

	var i = 0;
	var i_taxa = 0;
	var html = "";
	var previous_taxon = "";
	var previous_y;
	var previous_x;
	var already_plotted_rects = {};

	var rect2level = new Object;
	//console.log("one color is "+p(0));
	//d3.select("#tree svg").selectAll(".leaf_label")
	var all_available_node = d3.select("#" + target).selectAll("g.node").filter(function(d) {
		return subtree_colors.hasOwnProperty(d.name)
	});



	var color_rects = all_available_node.append("text")
		//.attr("y",function(d,i){ return +(i*-40);})
		//.style("font-size","10px")
		// .attr("transform", function(d){ return "rotate(-90)"})
		//.attr("x", "10")
		.attr("class", "taxonomy_rect_text")
		.attr("transform", function(d, i) {
			level = get_no_overlaps({
				current_item_name: d.name,
				current_item: subtree_colors[d.name],
				subtree_colors: already_plotted_rects
			}) + 1;
			var translateVariableX = right_border - subtree_colors[d.name].min_y - level * 20 + 14;
			var translateVariableY = 0;
			console.log("for " + d.name + ": maxy : " + subtree_colors[d.name].max_y + " miny: " + subtree_colors[d.name].min_y);
			var rotate_value = -90;
			already_plotted_rects[d.name] = subtree_colors[d.name];
			return "translate(" + translateVariableX + ", " + translateVariableY + ") rotate(" + rotate_value + ")"
		})
		.text(function(d) {
			var name_copy = d.name;
			name_copy = name_copy.replace(/_\d+/g, '');
			return name_copy;
		})

	.attr("font-size", function(d) {
		var allowed_space = subtree_colors[d.name].rect_width;
		var name_copy = d.name;
		var print_text = name_copy.replace(/_\d+/g, '');
		var calculated_space = Math.floor(allowed_space / print_text.length);
		if (calculated_space < 10) {
			return "9px";
		} else {
			if (calculated_space > 16) {
				return "12px";
			}
			if (print_text == "N/A") {
				return "9px";
			} else {
				return calculated_space + "px";
			}
		}
	});

	already_plotted_rects = {};

	var color_rects = all_available_node.append("rect")
		//.on('mouseover', show_gene_information)
		.attr("x", function(d) {
			return subtree_colors[d.name].rect_x;
		})
		.attr("y", function(d, i) {
			var level;
			//var level = i+1;
			// if(rect2level.hasOwnProperty(level) ){
			// 	// check if there is an overlap
			// }
			// else{
			//level = i+1;
			// }
			level = get_no_overlaps({
				current_item_name: d.name,
				current_item: subtree_colors[d.name],
				subtree_colors: already_plotted_rects
			}) + 1;
			console.log("level for " + d.name + " has " + level);
			already_plotted_rects[d.name] = subtree_colors[d.name];
			return right_border - subtree_colors[d.name].min_y - (level) * 20;
		})
		.attr("id", function(d) {

			return "color_rect_" + d.name;
		})
		.attr("class", "clade_tax_rect")
		.attr("visibility", visibility)
		.attr("width", function(d) {
			//return 50;
			return subtree_colors[d.name].rect_width;
		})
		.attr("height", function(d) {
			return 20;
			return subtree_colors[d.name].rect_height;
		})
		.attr("transform", function(d) {
			return "rotate(-90)";
		})
		.attr("fill", function(d) {
			//console.log("looking at "+d.swissprot_protein_name);
			// avoid duplicates
			var name_copy = d.name;
			name_copy = name_copy.replace(/_\d+/g, '');
			//console.log("check if "+previous_taxon+" == "+name_copy);
			if (Taxa2colorDictionary[d.name] === undefined) {
				Taxa2colorDictionary[d.name] = p_taxa(i_taxa % p_taxa.range().length);
				i_taxa++;
			}

			//console.log("setting "+previous_taxon+" == "+name_copy);
			return Taxa2colorDictionary[d.name];
		})
		.attr("fill-opacity", function(d) {
			return 0.1;
		})
		.on('mouseover', function(d) {
			jQuery("#subtree_color_rect_" + d.name).show();

		})
		.on('mouseout', function(d) {
			jQuery("#subtree_color_rect_" + d.name).hide();

		});


	return color_rects;
}

function get_no_overlaps(args) {
	var subtree_colors = args.subtree_colors;
	var current_item = args.current_item;
	var current_item_name = args.current_item_name;

	// var min_y = current_item.min_y;
	// var max_y = current_item.max_y;
	var min_x = current_item.min_x;
	var max_x = current_item.max_x;

	var no_overlaps = 0;
	// console.log("name: "+current_item_name+" min_y: "+min_y+" max_y: "+max_y);
	for (var name in subtree_colors) {
		d = subtree_colors[name];
		//jQuery.each(subtree_colors, function(d){
		if (name === current_item_name) {;
		} else {

			// var current_min_y = d.min_y;
			// var current_max_y = d.max_y;
			var current_min_x = d.min_x;
			var current_max_x = d.max_x;
			// console.log("name: "+name+" min_y: "+current_min_y+" max_y: "+current_max_y);
			if (current_min_x === undefined || current_max_x === undefined) {} else {
				if (current_min_x <= min_x && current_max_x >= min_x) {
					// console.log("Overlap with "+name+": "+current_min_x+" <= "+min_x+" && "+current_max_x+" >= "+min_x);
					no_overlaps++;
				} else if (current_min_x > min_x && current_min_x <= max_x) {
					//console.log("Overlap with "+name+": "+current_min_x+" > "+min_x+" && "+current_min_x+" <= "+max_x);
					no_overlaps++;
				}
			}
		}
	};
	return no_overlaps;
}


function get_all_children(d) {
	var temp_array = new Array;
	// console.log(d);
	// console.log()
	//console.log("in the get_all_childs for "+d.name+" with id: "+d.id);
	if (d.children) {
		var children = d.children;
		for (var i = 0; i < children.length; i++) {
			var temp_array_child = new Array;
			if (temp_array_child != null) {
				temp_array_child = get_all_children(children[i]);
				// console.log("got from child: : "+temp_array_child.length+" children");
				temp_array_child.forEach(function(elem) {
					//console.log(elem);
					temp_array.push(elem);
				})
			}
			//temp_array.push(temp_array_child);
		}
		temp_array.push(d);
	} else {
		//console.log("well, this is a child, return its name: "+d);
		temp_array.push(d);
		return temp_array;
	}
	return temp_array;
}

var reduce_gaps = function(data, loc) {
	if (!data || data.length === 0) {
		return data;
	}
	var sub_data = [];
	var from = loc.from;
	var to = loc.to;
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		if ((item.start >= loc.from && item.start <= loc.to) ||
			(item.end >= loc.from && item.end <= loc.to)) {
			sub_data.push(item);
		}
	}

	if ((loc.to - loc.from) < 100) {
		reduce
			.redundant(function(a, b) {
				return false
			});
	} else if ((loc.to - loc.from) < 200) {
		reduce
			.redundant(function(a, b) {
				return Math.abs(a - b) <= 3;
			});
	} else {
		reduce
			.redundant(function(a, b) {
				return Math.abs(a - b) <= 10;
			});
	}

	return reduce(sub_data);
	// return sub_data;
};
var get_aln_gaps = function(nodes) {
	var gaps_info = {};
	for (var i = 0; i < nodes.length; i++) {
		var leaf = nodes[i];
		var this_no_gap_start = undefined;
		var this_no_gaps = [];
		var g = leaf.data().sequence.mol_seq.seq;
		if (!g) {
			console.log("missing sequence info for " + leaf.name + " number " + i);
		} else {
			for (var j = 0; j < g.length; j++) {
				if (g[j] === '-') {
					if (this_no_gap_start === undefined) {
						this_no_gap_start = j;
					}
				} else {
					if (this_no_gap_start !== undefined) {
						this_no_gaps.push({
							start: this_no_gap_start,
							end: j
						});
						this_no_gap_start = undefined;
					}
				}
			}
		}
		gaps_info[leaf.id()] = this_no_gaps;
	}
	return gaps_info;
};

var get_conservation = function(seqs) {
	var conservation = {};

	for (var i = 0; i < seqs.length; i++) {
		conservation[seqs[i].data()._id] = [];
	}

	for (var i = 0; i < seqs[0].data().sequence.mol_seq.seq.length; i++) {
		var cons = {};
		for (var j = 0; j < seqs.length; j++) {
			var p = seqs[j].data();
			if (cons[p.sequence.mol_seq.seq[i]] === undefined) {
				cons[p.sequence.mol_seq.seq[i]] = 0;
			}
			cons[p.sequence.mol_seq.seq[i]]++;
		}

		for (var j = 0; j < seqs.length; j++) {
			var val = cons[seqs[j].data().sequence.mol_seq.seq[i]] / seqs.length;
			conservation[seqs[j].data()._id].push({
				pos: i,
				val: val
			})
		}
	}

	return reduce_all(conservation);
};
var reduce_all = function(rows) {
	var obj = {};
	for (var id in rows) {
		if (rows.hasOwnProperty(id)) {
			// obj[id] = reduce_row(rows[id]);
			obj[id] = reduce(rows[id]);
		}
	}
	return obj;
};

var get_pfam_match_boundaries = function(nodes) {
	var boundaries = {};
	for (var i = 0; i < nodes.length; i++) {
		var leaf = nodes[i];
		var this_boundaries = [];
		var bs = leaf.data().pfam_hits;
		if (bs) {
			for (var j = 0; j < bs.length; j++) {
				this_boundaries.push({
					start: bs[j].ali_from,
					end: bs[j].ali_to,
					hmm_start: bs[j].hmm_from,
					hmm_end: bs[j].hmm_to,
				});
			}
		} else {
			this_boundaries.push({
				start: 2,
				end: 130
			});

		}
		boundaries[leaf.id()] = this_boundaries;
	}
	return boundaries;
};
var filter_pfam_matches = function(data, loc) {
	var sub_data = [];
	var from = loc.from;
	var to = loc.to;
	if (data) {
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			// if (item.loc >= loc.hmmfrom && item.loc <= loc.hmmto) {
			sub_data.push(item);
			// }
		}
	}
	return sub_data;
};

var get_tree_nodes_by_names = function(tree, names) {
	var nodes = []
	for (var i = 0; i < names.length; i++) {
		console.log("looking for name " + names[i]);
		var node = tree.find_node_by_field(names[i], (function(node) {
			if (node.taxonomy && node.taxonomy.scientific_name) {
				return node.taxonomy.scientific_name;
			}
		}));
		if (node !== undefined) {
			nodes.push(node);
		}
	}
	return nodes;
};

var add_tree_type_drop_down = function(args) {
	var div = args.div;
	var ta = args.ta;
	//	plot drop-down menues
	var species_menu_pane = d3.select(div)
		.append("div")
		.append("span")
		.text("Species view:  ");
	var spec_sel = species_menu_pane
		.append("select")
		.on("change", function(d) {
			switch (this.value) {
				case "all":
					ta.tree().data(ta.tree().data());
					// .update();
					// color_tree(sT);
					break;
				case "restore":
					ta.tree().data(ta.tree().data());
					// .update();
					// color_tree(sT);
					break;
				case "model":
					// tree_vis.subtree (get_tree_nodes_by_names (tree_vis.root(), ensembl_species[this.value]));
					// tree_vis.update();
					var nodes = get_tree_nodes_by_names(ta.tree().root(), ["Mus musculus", "Rattus norvegicus", "Homo sapiens", "Gallus gallus", "Drosophila melanogaster", "Dictyostelium discoideum", "Escherichia coli", "Arabidopsis thaliana", "Caenorhabditis elegans", "Schizosaccharomyces pombe", "Saccharomyces cerevisiae"]);
					var test;
					var new_tree = ta.tree().subtree(nodes);
					ta.tree(new_tree);
					console.log("found " + nodes.length + " model orga");
					break;
			};
			ta.update();
		});
	spec_sel
		.append("option")
		.attr("value", "all")
		.attr("selected", 1)
		.text("Full tree");
	spec_sel
		.append("option")
		.attr("value", "model")
		.text("Model species");
	spec_sel
		.append("option")
		.attr("value", "restore")
		.text("restore_tree");
};



function add_scale_drop_down(args) {
	var div = args.div;
	var ta = args.ta;
	var menu_pane = d3.select(div)
		.append("div")
		.append("span")
		.text("Layout:  ");
	var sel = menu_pane
		.append("select")
		.on("change", function(d) {
			switch (this.value) {
				case "unscaled":
					ta.tree().layout().scale(false);
					break;
				case "scaled":
					ta.tree().layout().scale(true);
					break;
			};
			ta.update();
		});
	sel
		.append("option")
		.attr("value", "unscaled")
		.attr("selected", 1)
		.text("Unscaled");
	sel
		.append("option")
		.attr("value", "scaled")
		.text("Scaled");
}

// var reduce = tnt.utils.reduce.block()
// 	.smooth(0)
// 	.value("start")
// 	.value2("end");


var reduce = tnt.utils.reduce.line()
	.smooth(4)
	.redundant(function(a, b) {
		return Math.abs(a - b) < 0.2
	})
	.value("val");