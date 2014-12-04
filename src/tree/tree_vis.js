tnt.tree = function () {
 "use strict";

    var conf = {
	duration         : 500,      // Duration of the transitions
	label            : tnt.tree.label.text(),
	layout           : tnt.tree.layout.vertical(),
	on_click         : function () {},
	on_dbl_click     : function () {},
	link_color       : 'steelblue',
	node_color       : 'steelblue',
	node_circle_size : 4.5,
    };

    // Extra delay in the transitions (TODO: Needed?)
    var delay = 0;

    // Ease of the transitions
    var ease = "cubic-in-out";

    // If labels should be skipped
    // TODO: Replace this with a valid tnt.tree.label that does nothing
    // var skip_labels = false;

    // TODO: Don't know if this is useful or not
    // Probably this can go and see if this can be set with the API
    var curr_species = "Homo_sapiens";

    // By node data
    var sp_counts = {};
 
    var scale = false;

    // The id of the tree container
    var div_id;

    // The tree visualization (svg)
    var svg;
    var vis;

    // TODO: For now, counts are given only for leaves
    // but it may be good to allow counts for internal nodes
    var counts = {};

    // The full tree
    var base = {
	tree : undefined,
	data : undefined,	
	nodes : undefined,
	links : undefined
    };

    // The curr tree. Needed to re-compute the links / nodes positions of subtrees
    var curr = {
	tree : undefined,
	data : undefined,
	nodes : undefined,
	links : undefined
    };

    // The cbak returned
    var tree = function (div) {
	div_id = d3.select(div).attr("id");

        var tree_div = d3.select(div)
            .append("div")
	    .attr("class", "tnt_groupDiv");

	var cluster = conf.layout.cluster;

	var n_leaves = curr.tree.get_all_leaves().length;

	var max_leaf_label_length = function (tree) {
	    var max = 0;
	    var leaves = tree.get_all_leaves();
	    for (var i=0; i<leaves.length; i++) {
		var label_width = conf.label.width()(leaves[i]);
		if (label_width > max) {
		    max = label_width;
		}
	    }
	    return max;
	};


	var max_label_length = max_leaf_label_length(curr.tree);
	conf.layout.max_leaf_label_width(max_label_length);

	// Cluster size is the result of...
	// total width of the vis - transform for the tree - max_leaf_label_width - horizontal transform of the label
	// TODO: Substitute 15 by the horizontal transform of the nodes
	var cluster_size_params = {
	    n_leaves : n_leaves,
	    label_height : d3.functor(conf.label.height())(),
	    label_padding : 15
	};

// 	cluster.size([n_leaves * conf.label.height()(),
// 		      (conf.layout.width() - conf.layout.max_leaf_label_width() - conf.layout.translate_vis[0]) - 15]);

	conf.layout.adjust_cluster_size(cluster_size_params);

	var diagonal = conf.layout.diagonal();
	var transform = conf.layout.transform_node;

	svg = tree_div
	    .append("svg")
	    .attr("width", conf.layout.width())
//	    .attr("height", (n_leaves * label.height()()) + 20)
	    .attr("height", conf.layout.height(cluster_size_params) + 30)
	    .attr("fill", "none");

	vis = svg
	    .append("g")
	    .attr("id", "tnt_st_" + div_id)
	    .attr("transform",
		  "translate(" +
		  conf.layout.translate_vis()[0] +
		  "," +
		  conf.layout.translate_vis()[1] +
		  ")");

	curr.nodes = cluster.nodes(curr.data);
	conf.layout.scale_branch_lengths(curr);
	curr.links = cluster.links(curr.nodes);

	// LINKS
	var link = vis.selectAll("path.tnt_tree_link")
	    .data(curr.links, function(d){return d.target._id});
	
	link
	    .enter()
	    .append("path")
	    .attr("class", "tnt_tree_link")
	    .attr("id", function(d) {
	    	return "tnt_tree_link_" + div_id + "_" + d.target._id;
	    })
	    // .attr("fill", "none")
	    .style("stroke", function (d) {
		return d3.functor(conf.link_color)(tnt.tree.node(d.source), tnt.tree.node(d.target));
	    })
	    .attr("d", diagonal);	    

	// NODES
	var node = vis.selectAll("g.tnt_tree_node")
	    .data(curr.nodes, function(d) {return d._id});

	var new_node = node
	    .enter().append("g")
	    .attr("class", function(n) {
		if (n.children) {
		    if (n.depth == 0) {
			return "root tnt_tree_node"
		    } else {
			return "inner tnt_tree_node"
		    }
		} else {
		    return "leaf tnt_tree_node"
		}
	    })
	    .attr("id", function(d) {
		return "tnt_tree_node_" + div_id + "_" + d._id
	    })
	    .attr("transform", transform);

	// new_node.on("click", tree.node_info_callback);

	new_node
	    .append('circle')
	    .attr("r", function (d) {
		return d3.functor(conf.node_circle_size)(tnt.tree.node(d));
	    })	 
	    .attr('fill', function (d) {
		return d3.functor(conf.node_color)(tnt.tree.node(d));
	    })
	    .attr('stroke', function (d) {
		return d3.functor(conf.node_color)(tnt.tree.node(d));
	    })
	    .attr('stroke-width', '2px');

	new_node.on("click", function (node) {
	    conf.on_click.call(this, tnt.tree.node(node));
	});

	new_node.on("dblclick", function (node) {
	    conf.on_dbl_click.call(this, tnt.tree.node(node));
	});

	new_node
	    // .eachconf.label);
	    .each (function (d) {
	    	conf.label.call(this, tnt.tree.node(d));
	    });

	// Node labels only on leaves
	// But only if skip_labels is false
// 	if (!skip_labels) {
// 	    // LABELS
// 	    new_node
// 		.append("text")
// 		.attr("class", "tnt_tree_label")
// 		.style("fill", function(d) {return d.children === undefined ? fgColor : bgColor})
// 	    // .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
// 	    // .attr("transform", function(d) {return "translate(10 5)" + layout === "vertical" ? "" : ("rotate(" + (d.x < 180 ? 0 : 180) + ")")})
// 		.attr("transform", function(d) { return "translate(10 5)" })
// 		.text(function(d) {var label = d.name.replace(/_/g, ' ');
// 				   var species_name = d.name.charAt(0).toLowerCase() + d.name.slice(1);
// 				   label = label + ((sp_counts[species_name] !== undefined)  ?
// 						    " [" + (sp_counts[species_name].length) + "]" :
// 						    "");
// 				   return label;})
	    
// 	}

	// Update plots an updated tree
	api.method ('update', function() {
	    var cluster = conf.layout.cluster;
	    var diagonal = conf.layout.diagonal();
	    var transform = conf.layout.transform_node;

	    // var max_leaf_label_length = function (tree) {
	    // 	var max = 0;
	    // 	var leaves = tree.get_all_leaves();
	    // 	for (var i=0; i<leaves.length; i++) {
	    // 	    var label_width = conf.label.width()(leaves[i].data());
	    // 	    if (label_width > max) {
	    // 		max = label_width;
	    // 	    }
	    // 	}
	    // 	return max;
	    // };


	    var max_label_length = max_leaf_label_length(curr.tree);
	    conf.layout.max_leaf_label_width(max_label_length);

	    // Cluster size is the result of...
	    // total width of the vis - transform for the tree - max_leaf_label_width - horizontal transform of the label
	// TODO: Substitute 15 by the transform of the nodes (probably by selecting one node assuming all the nodes have the same transform
	    var n_leaves = curr.tree.get_all_leaves().length;
	    var cluster_size_params = {
		n_leaves : n_leaves,
		label_height : d3.functor(conf.label.height())(),
		label_padding : 15
	    };
	    conf.layout.adjust_cluster_size(cluster_size_params);
// 	    cluster.size([n_leaves * conf.label.height()(),
// 			  (layout.width() - layout.max_leaf_label_width() - layout.translate_vis[0]) - 15]);

	    svg
		.transition()
		.duration(conf.duration)
		.ease(ease)
		.attr("height", conf.layout.height(cluster_size_params) + 30); // height is in the layout
//		.attr("height", (n_leaves * label.height()()) + 20);

	    vis
		.transition()
		.duration(conf.duration)
		.attr("transform",
		      "translate(" +
		      conf.layout.translate_vis()[0] +
		      "," +
		      conf.layout.translate_vis()[1] +
		      ")");
	    
	    // Set up the current tree
	    // var nodes = curr.tree.cluster(cluster).nodes();
	    // var links = cluster.links(nodes);
	    // curr.nodes = curr.tree.cluster(cluster).nodes();
	    curr.nodes = cluster.nodes(curr.data);
	    conf.layout.scale_branch_lengths(curr);
	    // scale_branch_lengths();
	    // phylo(curr.nodes[0], 0);
	    curr.links = cluster.links(curr.nodes);

        // NODES
	    var node = vis.selectAll("g.tnt_tree_node")
		.data(curr.nodes, function(d) {return d._id});

	    // LINKS
	    var link = vis.selectAll("path.tnt_tree_link")
		.data(curr.links, function(d){return d.target._id});

	    var exit_link = link
		.exit()
		.remove();


	    // New links are inserted in the prev positions
	    link
		.enter()
		.append("path")
		.attr("class", "tnt_tree_link")
		.attr("id", function (d) {
		    return "tnt_tree_link_" + div_id + "_" + d.target._id;
		})
		// .attr("fill", "none")
		.attr("stroke", function (d) {
		    return d3.functor(conf.link_color)(tnt.tree.node(d.source), tnt.tree.node(d.target));
		})
		.attr("d", diagonal);

	    // Move the links to their final position, but keeping the integrity of the tree
// 	    link
// 	    	.filter(select_links_to_be_pushed)
// 	    	.each(function(d) {pull_parent.call(this, d, 0)});

	    link
	    //  TODO: Here we will be moving links that have been already moved in the previous filter
	    //  if transitions are slow, this is a good place to optimize
	    	.transition()
		.ease(ease)
	    	.duration(conf.duration)
//	    	.delay((max_depth_exit_node + entering_links) * conf.duration) // TODO: I changed this (from 1). Not sure it is correct
//		.delay(get_new_link_delay)
	    	.attr("d", diagonal);



	    // New nodes are created without radius
	    // The radius is created after the links
	    var new_node = node
		.enter()
		.append("g")
		.attr("class", function(n) {
		    if (n.children) {
			if (n.depth == 0) {
			    return "root tnt_tree_node"
			} else {
			    return "inner tnt_tree_node"
			}
		    } else {
			return "leaf tnt_tree_node"
		    }
		})
		.attr("id", function (d) {
		    return "tnt_tree_node_" + div_id + "_" + d._id;
		})
		.attr("transform", transform);
   
	    new_node
		.append('circle')
		.attr("r", 1e-6)
		.attr('stroke', function (d) {
		    return d3.functor(conf.node_color)(tnt.tree.node(d));
		})
		.attr('stroke-width', '2px')
		.transition()
		.duration(conf.duration)
		.attr("r", function (d) {
		    return d3.functor(conf.node_circle_size)(tnt.tree.node(d));
		});

	    new_node.on("click", function (node) {
		conf.on_click.call(this, tnt.tree.node(node));
	    });
	    new_node.on("dblclick", function (node) {
		conf.on_dbl_click.call(this, tnt.tree.node(node));
	    });


	    // node color, size and labels are dynamic properties
	    node
		.select("circle")
		.attr('fill', function (d) {
		    return d3.functor(conf.node_color)(tnt.tree.node(d));
		})
		.attr('r', function (d) {
		    return d3.functor(conf.node_circle_size)(tnt.tree.node(d));
		})
		// node strokes are dynamic properties
		.attr('stroke', function (d) {
		    return d3.functor(conf.node_color)(tnt.tree.node(d));
		});

	    // TODO: Shouldn't this be done only on new nodes? Old nodes should already have the labels
	    node
		.each (conf.label.remove)
		    .each (function (d) {
			conf.label.call(this, tnt.tree.node(d));
		    });
	    
	    // Node labels only on leaves
	    // But only if skip_labels is false
// 	    if (!skip_labels) {
// 		new_node
// 		    .append("text")
// 		    .attr("class", "tnt_tree_label")
// 		    .style("fill", function(d) {return d.children === undefined ? fgColor : bgColor})
// 		// .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
// 		// .attr("transform", function(d) {return "translate(10 5)" + layout === "vertical" ? "" : ("rotate(" + (d.x < 180 ? 0 : 180) + ")")})
// 		    .attr("transform", function(d) { return "translate(10 5)" })
// 		    .text("")
// 		    .transition()
// 		    .duration(conf.duration)
// //		    .delay((max_depth_exit_node + entering_links + 1) * conf.duration)
// 		    .text(function(d) {var label = d.name.replace(/_/g, ' ');
// 				       var species_name = d.name.charAt(0).toLowerCase() + d.name.slice(1);
// 				       label = label + ((sp_counts[species_name] !== undefined)  ?
// 							" [" + (sp_counts[species_name].length) + "]" :
// 							"");
// 				       return label;})
// 	    }

	    node
		.transition()
		.ease(ease)
		.duration(conf.duration)
		.attr("transform", transform);

	    // Exiting nodes are just removed
	    node
		.exit()
		.remove();
	});
    };

    // API
    var api = tnt.utils.api (tree)
	.getset (conf)

    // TODO: Rewrite data using getset / finalizers & transforms
    api.method ('data', function (d) {
	if (!arguments.length) {
	    return base.data;
	}

	// The original data is stored as the base and curr data
	base.data = d;
	curr.data = d;

	// Set up a new tree based on the data
	var newtree = tnt.tree.node(base.data);

	// The nodes are marked because we want to be able to join data after selecting a subtree
	// var i = tnt.misc.iteratorInt();
	// newtree.apply(function(d) {d.property('__tnt_id__', i())});
	// newtree.apply(function(d) {d.property('__inSubTree__', {prev : true, curr : true})});

	tree.root(newtree);
	return tree;
    });

    // TODO: Rewrite tree using getset / finalizers & transforms
    api.method ('root', function (t) {
    	if (!arguments.length) {
    	    return curr.tree;
    	}

	// The original tree is stored as the base, prev and curr tree
    	base.tree = t;
	curr.tree = base.tree;
//	prev.tree = base.tree;
    	return tree;
    });

    api.method ('subtree', function (curr_nodes) {
	// var curr_nodes = [];
	// var orig_tree = tree.root();
	// var orig_data = tree.data();
	// for (var i=0; i<node_names.length; i++) {
	//     var node = orig_tree.find_node_by_name(node_names[i]);
	//     curr_nodes.push(orig_tree.find_node_by_name(node_names[i]));
	// }
	var subtree = base.tree.subtree(curr_nodes);
	curr.data = subtree.data();
	curr.tree = subtree;

	return tree;
    });

    api.method ('focus_node', function (node_data) {
	// find 
	var found_node = tree.root().find_node_by_field(node_data._id, '_id');
	tree.subtree(found_node.get_all_leaves());

	return tree;
    });

//     tree.subtree = function (node_names) {
// 	// We have to first clean the previous subtree (if any)
// 	// This means un-marking the nodes in the subtree:
// 	base.tree.apply(function(d){
// 	    d.property('__inSubTree__').prev = d.property('__inSubTree__').curr
// 	})
// 	base.tree.apply(function(d){
// 	    d.property('__inSubTree__').curr = false
// 	});

// 	var orig_tree = tree.root();
// 	var orig_data = tree.data();

// 	//  We set up the prev data and tree
// // 	var prev_data = copy_node(curr.data);
// // 	for (var i=0; i<curr.data.children.length; i++) {
// // 	    copy_data (curr.data.children[i], prev_data, function(d) {return true});
// // 	}
// // 	prev.data = prev_data;
// // 	prev.tree = tnt.tree(prev.data);

// 	//  We set up the curr data and tree
// 	var curr_nodes = [];
// 	for (var i=0; i<node_names.length; i++) {
// 	    curr_nodes.push(orig_tree.find_node_by_name(orig_data,node_names[i]));
// 	}

// 	for (var i=0; i<curr_nodes.length; i++) {
// 	    orig_tree.upstream(curr_nodes[i], function(d) {
// 		d.property('__inSubTree__').curr = true
// 	    });
// 	}
	
// 	var curr_data = copy_node(orig_data);
// 	for (var i=0; i<orig_data.children.length; i++) {
//             copy_data (orig_data.children[i], curr_data, function(d) {
// 		return ((d.__inSubTree__.curr) && (!is_singleton(d)));
// 	    });
// 	}

// 	curr.data = curr_data;
// 	curr.tree = tnt.tree.tree(curr.data);

// 	return tree;
//     };


    // TODO: copy_data is not a good name for this
//     var copy_data = function (orig_data, sub_data, condition) {
// 	if (orig_data === undefined) {
// 	    return;
// 	}

// 	if (condition(orig_data)) {
// 	    var copy = copy_node(orig_data);

// 	    if (sub_data.children === undefined) {
// 		sub_data.children = [];
// 	    }
// 	    sub_data.children.push(copy);
// 	    if (orig_data.children === undefined) {
// 		return;
// 	    }
// 	    for (var i = 0; i < orig_data.children.length; i++) {
// 		copy_data (orig_data.children[i], copy, condition);
// 	    }
// 	} else {
// 	    if (orig_data.children === undefined) {
// 		return;
// 	    }
// 	    for (var i = 0; i < orig_data.children.length; i++) {
// 		copy_data(orig_data.children[i], sub_data, condition);
// 	    }
// 	}
//     };

//     var is_singleton = function (node) {
// 	var n_children = 0;
// 	if (node.children === undefined) {
// 	    return false;
// 	}

// 	for (var i = 0; i < node.children.length; i++) {
// 	    if (node.children[i].property('__inSubTree__').curr) {
// 		n_children++;
// 	    }
// 	}

// 	if (n_children === 1) {
// 	    node.property('__inSubTree__').curr = false;
// 	}

// 	return n_children === 1;
//     };

//     var copy_node = function (node) {
// 	var copy = {};
// 	for (var param in node) {
// 	    if ((param === "children") || (param === "children") || (param === "parent")) {
// 		continue;
// 	    }
// 	    if (node.hasOwnProperty(param)) {
// 		copy[param] = node[param];
// 	    }
// 	}
// 	return copy;
//     };

    var swap_nodes = function (src, dst) {
	var copy = copy_node (dst);
	dst = src;
	src = copy;
	return;
    };

    api.method ('tooltip', function () {
	// var tooltip = tnt.tooltip().type("table");
	var tooltip = tnt.tooltip.table();
	var tree_tooltip = function (node) {
	    node = node.data();
	    var obj = {};
	    obj.header = {
		label : "Name",
		value : node.name
	    };
	    obj.rows = [];
	    obj.rows.push({
		label : "_id",
		value : node._id
	    });
	    obj.rows.push({
		label : "Depth",
		value : node.depth
	    });
	    obj.rows.push({
		label : "Length",
		value : node.length
	    });
	    obj.rows.push({
		label : "N.Children",
		value : node.children ? node.children.length : 0
	    });
	    tooltip.call(this, obj);
	};

	return tree_tooltip;
    });

    // tree.update = function() {

    // 	var t = function(sp_counts) {
    // 	    reset_tree(species_tree);
    // 	    var sp_names = get_names_of_present_species(sp_counts);
    // 	    var present_nodes  = get_tree_nodes_by_names(species_tree, sp_names);
    // 	    var lca_node = tnt_tree.lca(present_nodes)

    // 	    decorate_tree(lca_node);
    // 	    nodes_present(species_tree, present_nodes);

    // 	    vis.selectAll("path.link")
    // 		.data(cluster.links(tnt_tree))
    // 		.transition()
    // 		.style("stroke", function(d){
    // 	    	    if (d.source.real_present === 1) {
    // 	    		return fgColor;
    // 	    	    }
    // 	    	    if (d.source.present_node === 1) {
    // 	    		return bgColor;
    // 	    	    }
    // 	    	    return "fff";
    // 		});

    // 	    vis.selectAll("circle")
    // 		.data(tnt_tree.filter(function(n) { return n.x !== undefined; }))
    // 		.attr("class", function(d) {
    // 		    if (d.real_present) {
    // 			return "present";
    // 		    }
    // 		    if (d.present_node) {
    // 			return "dubious";
    // 		    }
    // 		    return "absent";
    // 		})

    // 	    var labels = vis.selectAll("text")
    // 		.data(tnt_tree.filter(function(d) { return d.x !== undefined && !d.children; }))
    // 		.transition()
    // 		.style("fill", function (d) {
    // 		    if (d.name === tree.species()) {
    // 			return "red";
    // 		    }
    // 		    if (d.real_present === 1) {
    // 			return fgColor;
    // 		    }
    // 		    return bgColor;
    // 		    // return d.name === tree.species() ? "red" : "black"
    // 		})
    // 		.text(function(d) { var label = d.name.replace(/_/g, ' ');
    // 				    var species_name = d.name.charAt(0).toLowerCase() + d.name.slice(1);
    // 				    label = label + " [" + (sp_counts[species_name] === undefined ? 0 : sp_counts[species_name].length) + "]";
    // 				    return label;
    // 				  });
    // 	    };

    // 	return t;
    // };


    // var decorate_tree = function (node) {
    // 	if (node !== undefined) {
    // 	    tnt_tree.apply(node, function(n) {n.present_node = 1});
    // 	}
    // };

    // var reset_tree = function (node) {
    // 	if (node !== undefined) {
    // 	    tnt_tree.apply(node, function(n) {n.present_node = 0; n.real_present = 0;});
    // 	}
    // }


    var nodes_present = function (tree, nodes) {
	for (var i = 0; i < nodes.length; i++) {
	    var tree_node = tnt_tree.find_node_by_name(tree, nodes[i].name);
	    if (tree_node === undefined) {
		console.log("NO NODE FOUND WITH NAME " + nodes[i]);
	    } else {
		tree_node.real_present = 1;
	    }
	}

	// TODO: Highly inefficient algorithm ahead
	var max_depth = max_tree_depth(tree);
	for (var i = 0; i < max_depth; i++) {
	    var children_present = function(node) {
		if (node.children !== undefined) {
		    if (check_children_present(node)) {
			node.real_present = 1;
		    }
		    for (var i = 0; i < node.children.length; i++) {
			children_present(node.children[i]);
		    }
		}
	    };
	    children_present(tree);
	}
    };

    var check_children_present = function(node) {
	var n_present = 0;
	for (var i = 0; i < node.children.length; i++) {
	    if (node.children[i].real_present === 1) {
		n_present++;
	    }
	}
	if (node.children.length === n_present) {
	    return true;
	}
	return false;
    }

    var max_tree_depth = function (tree, max) {
	if (max === undefined) {
	    max = 0
	}
	var this_depth = tree.depth;
	if (tree.children !== undefined) {
	    for (var i = 0; i < tree.children.length; i++) {
		return max_tree_depth(tree.children[i], this_depth > max ? this_depth : max)
	    }
	}
	return max;
    };

    var get_names_of_present_species = function (sp_nodes) {
	var names = [];
	for (var i in sp_nodes) {
	    if (sp_nodes.hasOwnProperty(i)) {
		names.push(i.charAt(0).toUpperCase() + i.slice(1));
	    }
	}
	return names;
    };

    return tree;
};
