var tnt_theme_tree_ensembl_genetree_annot = function() {
    "use strict";

    var height = 30;

    var tree = tnt.tree();
    var annot = tnt.board();

    var theme = function (ta, div) {

        var label = tnt.tree.label.text()
            .text(function (node) {
                if (node.children) {
                    return "";
                } else {
                    return node.id.accession
                }
            })
            .fontsize(10)
	    .height(height);

	var rest = tnt.eRest();

	// var gene_tree_id = "ENSGT00390000003602";
	// var gene_tree_url = rest.url.gene_tree ({
	//     id : gene_tree_id,
	//     aligned : true
	// });


	d3.json('/themes/tree_annot/ensembl_genetree_annot/ENSGT00390000003602.json',
		function (err, resp) {
		    deploy_vis(resp);
		});

	// rest.call ({url : gene_tree_url,
	// 	    success : function (resp) {
	// 		deploy_vis(resp)
	// 	    }
	// 	   });

	// TREE SIDE
	var deploy_vis = function (tree_obj) {
	    tree
		.data (tree_obj.tree)
		.layout (tnt.tree.layout.vertical()
			 .width(430)
			 .scale(false)
			)
		.label (label);

	    // var reduce_row = function (row) {
	    //     var data = [];
	    // 	var curr = {
	    // 	    streak : 0,
	    // 	    val    : undefined,
	    // 	    start  : 1
	    // 	};
	    // 	var curr_streak = 0;
	    // 	for (var i=0; i<row.length; i++) {
	    // 	    if (curr.val === undefined) {
	    // 		curr.val = row[i];
	    // 	    }
	    // 	    if (row[i] === curr.val) {
	    // 		curr.streak++;
	    // 	    } else {
	    // 		if (curr.val > 0 && curr.streak > 5) {
	    // 		    data.push ({ start : curr.start,
	    // 				 end   : i,
	    // 				 type  : (curr.val > 1) ? 'high' : 'low'
	    // 			       });
	    // 		}
	    // 		curr.streak = 1;
	    // 		curr.val    = row[i];
	    // 		curr.start  = i;
	    // 	    }
	    // 	}
	    // 	if (curr.val > 0) {
	    // 	    data.push ({ start : curr.start,
	    // 			 end   : row.length,
	    // 			 type  : (curr.val > 1) ? 'high' : 'low'
	    // 		       });
	    // 	}
	    // 	return data;
	    // };

            var reduce = tnt.utils.reduce.line()
		.smooth(4)
		.redundant(function (a, b) {
		    return Math.abs (a-b) < 0.2
		})
		.value("val");

	    var reduce_all = function (rows) {
	    	var obj = {};
	    	for (var id in rows) {
	    	    if (rows.hasOwnProperty (id)) {
	    		// obj[id] = reduce_row(rows[id]);
	    		obj[id] = reduce(rows[id]);
	    	    }
	    	}
	    	return obj;
	    };

	    var filter_exon_boundaries = function (data, loc) {
		var sub_data = [];
		var from = loc.from;
		var to = loc.to;
		for (var i=0; i<data.length; i++) {
		    var item = data[i];
		    if (item.loc >= loc.from && item.loc <= loc.to) {
			sub_data.push(item);
		    }
		}
		return sub_data;
	    };

            var reduce_gaps = function (data, loc) {
		if (!data || data.length === 0) {
		    return data;
		}
		var sub_data = [];
		var from = loc.from;
		var to = loc.to;
		for (var i=0; i<data.length; i++) {
                    var item = data[i];
                    if ((item.start >= loc.from && item.start <= loc.to) ||
			(item.end >= loc.from && item.end <= loc.to)){
			sub_data.push(item);
                    }
		}

		if ((loc.to - loc.from) < 100) {
                    reduce
			.redundant (function (a, b) {
                            return false
			});
		} else if ((loc.to - loc.from) < 200) {
                    reduce
			.redundant(function (a, b) {
                            return Math.abs(a-b)<=3;
			});
		} else {
                    reduce
			.redundant(function (a, b) {
                            return Math.abs(a-b)<=10;
			});
		}

		return reduce (sub_data);
            // return sub_data;
            };

	    var get_conservation = function (seqs) {
	    	var conservation = {};

	    	for (var i=0; i<seqs.length; i++) {
	    	    conservation[seqs[i].data()._id] = [];
	    	}

	    	for (var i=0; i<seqs[0].data().sequence.mol_seq.seq.length; i++) {
	    	    var cons = {};
	    	    for (var j=0; j<seqs.length; j++) {
	    	    	var p = seqs[j].data();
	    	    	if (cons[p.sequence.mol_seq.seq[i]] === undefined) {
	    	    	    cons[p.sequence.mol_seq.seq[i]] = 0;
	    	    	}
	    	    	cons[p.sequence.mol_seq.seq[i]]++;
	    	    }

	    	    for (var j=0; j<seqs.length; j++) {
	    		var val = cons[seqs[j].data().sequence.mol_seq.seq[i]] / seqs.length;
	    		conservation[seqs[j].data()._id].push({
	    		    pos : i,
	    		    val : val
	    		})
	    	    }
	    	}

	    	return reduce_all (conservation);
	    };

	    var get_boundaries = function (nodes) {
		var boundaries = {};
		for (var i=0; i<nodes.length; i++) {
		    var leaf = nodes[i];
		    var this_boundaries = [];
		    var bs = leaf.data().exon_boundaries.boundaries;
		    for (var j=0; j<bs.length; j++) {
			this_boundaries.push({loc: bs[j]});
		    }
		    boundaries[leaf.id()] = this_boundaries;
		}
		return boundaries;
	    };

	    var get_aln_gaps = function (nodes) {
		var gaps_info = {};
		for (var i=0; i<nodes.length; i++) {
		    var leaf = nodes[i];
		    var this_no_gap_start = undefined;
		    var this_no_gaps = [];
		    var g = leaf.data().sequence.mol_seq.seq;
		    for (var j=0; j<g.length; j++) {
			if (g[j] !== '-') {
			    if (this_no_gap_start === undefined) {
				this_no_gap_start = j;
			    }
			} else {
			    if (this_no_gap_start !== undefined) {
				this_no_gaps.push( {start : this_no_gap_start,
						    end   : j
						   });
				this_no_gap_start = undefined;
			    }
			}
		    }
		    gaps_info[leaf.id()] = this_no_gaps;
		}
		return gaps_info;
	    };

	    var get_seq_info = function (nodes) {
		var seq_info = {};
		for (var i=0; i<nodes.length; i++) {
		    var leaf = nodes[i];
		    var this_seq = [];
		    var s = leaf.data().sequence.mol_seq.seq;
		    for (var j=0; j<s.length; j++) {
			this_seq.push({pos : j,
				       nt  : s[j]
				      });
		    }
		    seq_info[leaf.id()] = this_seq;
		}
		return seq_info;
	    };

	    var leaves = tree.root().get_all_leaves();
	    var conservation = get_conservation(leaves);
	    var exon_boundaries = get_boundaries(leaves);
	    var aln_gaps = get_aln_gaps(leaves);
	    var seq_info = get_seq_info(leaves);
	    // TRACK SIDE
	    annot
		.from(0)
		.width(300);

	    var track = function (leaf) {
		var id = leaf._id;
		return tnt.track()
                    .background_color("#EBF5FF")
                    .data (tnt.track.data()
			   .update ( tnt.track.retriever.sync()
				     .retriever (function (loc) {
					 var seq_range = (loc.to - loc.from) <= 50 ? seq_info[id].slice(loc.from, loc.to) : [];
					 return {
					     //'conservation' : function (d) {return conservation[id] || []}, 
					     'gaps'         : reduce_gaps(aln_gaps[id], loc) || [],
					     // 'boundaries'   : filter_exon_boundaries(exon_boundaries[id], loc) || [],
					     'sequence'     : seq_range
					 }
				     })
				   )
			  )
		    .display( tnt.track.feature.composite()
			      // .add ('conservation', tnt.track.feature.area()
			      // 	    .foreground_color("steelblue")
			      // 	    .index(function (d) {
			      // 		return d.pos;
			      // 	    })
			      // 	   )
			      .add ('gaps', tnt.track.feature.ensembl()
			      	    .foreground_color('green')
			      	    .index(function (d) {
			      		return d.start;
			      	    })
			      	   )
			      // .add ('boundaries', tnt.track.feature.vline()
			      // 	    .foreground_color("red")
			      // 	    .index(function (d) {
			      // 		return d.loc;
			      // 	    })
			      // 	   )
			      .add ('sequence', tnt.track.feature.sequence()
				    .foreground_color("black")
				    .sequence(function (d) {
					return d.nt;
				    })
				    .index(function (d) {
					return d.pos;
				    })
				   )
			    );
	    };

	    var max_val = d3.max(leaves, function (d) {
		return d.data().sequence.mol_seq.seq.length
	    });

	    ta.tree(tree);
	    ta.annotation(annot
			  .to(max_val)
			  .right(max_val)
			  .zoom_out(max_val)
			  .zoom_in(30)
			 );
	    ta.ruler("both");
	    ta.track(track);
	    
	    ta(div);
	}
    }

    return theme;
};
