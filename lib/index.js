/*
 * 
 * https://github.com/daviddao/exelixis
 *
 * Copyright (c) 2015 David
 * Licensed under the Apache 2 license.
 */

/**
@class exelixis
 */

/**
* Get biojs-io-newick parser
*/
var parser = require("biojs-io-newick");

exe = {};

var pics = require("./pics").ensembl_pics;

/*
 * Private Methods
 */

/**
* Import tnt tree library 
*/

var tnt_tree = require("tnt.tree");

/**
* @Default settings, data structure and memory of the tree
*/

exe.opts = require("./opts").opts;

var savedOpts = exe.opts;

var parseOpts = require("./opts").parseOpts; 

var apijs = require("tnt.api");

var compute_max_leaf_label_length = function(tree) {
    var n_hists = (opts.table_hist && opts.table_hist.colors.length) || 1;
    //var fl = (opts.histograms && opts.histograms.full_length) || 30;
    var nRadius = parseFloat(document.getElementById("nRadius").value);
    var fl = (opts.table_hist && (opts.tree.width/2)*(1-nRadius-0.05)/opts.table_hist.colors.length) || 1; 
    fl *= (opts.table_hist && opts.table_hist.labelHistogramK)|| 1;
    return fl;
};

// Small modification to composite label
// actually called workaround
tnt_tree.label.composite_war = function () {
    var labels = [];

    var label = function (node, layout_type, node_size) {
        var curr_xoffset = 0;

        for (var i=0; i<labels.length; i++) {
            var display = labels[i];

            (function (offset) {
                display.transform (function (node, layout_type) {
                    var tsuper = display._super_.transform()(node, layout_type);
                    var t = {
                        translate : [offset + tsuper.translate[0], tsuper.translate[1]],
                        rotate : tsuper.rotate
                    };
                    return t;
                })
            })(curr_xoffset);

            //curr_xoffset += 10;
            curr_xoffset += display.width()(node);

            display.call(this, node, layout_type, node_size);
        }
    };

    var api = apijs (label)

    api.method ('add_label', function (display, node) {
        display._super_ = {};
        apijs (display._super_)
            .get ('transform', display.transform());

        labels.push(display);
        return label;
    });

    api.method ('width', function () {
        return function (node) {
            var tot_width = 0;
            for (var i=0; i<labels.length; i++) {
                tot_width += parseInt(labels[i].width()(node));
                tot_width += parseInt(labels[i]._super_.transform()(node).translate[0]);
            }

            return tot_width;
        }
    });

    api.method ('height', function () {
        return function (node) {
            var max_height = 0;
            for (var i=0; i<labels.length; i++) {
                var curr_height = labels[i].height()(node);
                if ( curr_height > max_height) {
                    max_height = curr_height;
                }
            }
            return max_height;
        }
    });

    return label;
};

tnt_tree.label.histogram = function() {
    var label = tnt_tree.label();

    var api = apijs (label)
        .getset ('fontsize', 10)
        .getset ('color', "#000")
        .getset ('text', function (d) {
            return d.data().name;
        })
        .getset('componentidx', 0)

    label.display (function (node, layout_type) {
    var l = null;
    var data = node.data();
    var name = data.name;
    var hist_length = 1.0;
    var fill = '#ff0000';
    var offset = 0;
    if (node.is_leaf() || node.is_collapsed()) {
        var idx = label.componentidx();
        if (opts.table_hist)
            if (opts.table_hist.histograms.hasOwnProperty(name))
            {
                hist_length = opts.table_hist.histograms[name][idx];
                fill = opts.table_hist.colors[idx];
            }
        //var fl = (opts.histograms && opts.histograms.full_length) || 30;
        var nRadius = parseFloat(document.getElementById("nRadius").value);
        var fl = (opts.tree.width/2)*(1-nRadius-0.05)/opts.table_hist.colors.length;
        fl *= (opts.table_hist && opts.table_hist.labelHistogramK)|| 1;
        //debugger;
        l = d3.select(this)
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", hist_length*fl)
            .attr("height", 10)
            .attr("fill", fill)
            .classed("labelHistogram", true);
    } 
    else 
    {
        l = d3.select(this)
        .append("text")
        .text("")
    }
    
    return l;
    });


    label.transform (function (node, layout_type) {
        var d = node.data();
        var t = {
            translate : [0, 0],
            rotate : 0
        };

        if (layout_type === "phylo") {
            var nRadius = parseFloat(document.getElementById("nRadius").value);
            var max_tree_radius = (opts.tree.width/2) * nRadius;
            t.translate[0] = max_tree_radius - d.y;

        }
        return t;
    });


    label.width (function (node) {
        var width = 0;
        var hist_length = 1;
        var data = node.data();
        var name = data.name;
        if (node.is_leaf() || node.is_collapsed()) {
            var idx = label.componentidx();
            if (opts.table_hist)
                if (opts.table_hist.histograms.hasOwnProperty(name))
                    hist_length = opts.table_hist.histograms[name][idx];
            var svg = d3.select("body")
                .append("svg")
                .attr("height", 0)
                .style('visibility', 'hidden');

            //var fl = (opts.histograms && opts.histograms.full_length) || 30;
            var nRadius = parseFloat(document.getElementById("nRadius").value);
            var fl = (opts.tree.width/2)*(1-nRadius-0.05)/opts.table_hist.colors.length;
            fl *= (opts.table_hist && opts.table_hist.labelHistogramK)|| 1;
            var hist = svg
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", hist_length*fl)
                .attr("height", 10)
                .attr("fill", "#ff0000");

            width = hist.node().getBBox().width;
            svg.remove();
        }
        else
        {
            var svg = d3.select("body")
                .append("svg")
                .attr("height", 0)
                .style('visibility', 'hidden');

            var text = svg
                .append("text")
                .style('font-size', label.fontsize() + "px")
                .text(label.text()(node));

            width = text.node().getBBox().width;
            svg.remove();
        }
        return width;
    });

    label.height (function (node) {
        var height = 10;
        return height;
        
    });

    return label;
}

tnt_tree.layout.phylo = function () {
    var layout = tree.layout();
    // Elements like 'labels' depend on the layout type. This exposes a way of identifying the layout type
    layout.type = 'phylo';

    var default_width = 360;
    var r = default_width / 2;

    var conf = {
        width : 360
    };

    var api = apijs (layout)
    .getset (conf)
    .getset ('translate_vis', [r, r]) // TODO: 1.3 should be replaced by a sensible value
    .method ('transform_node', function (d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
    })
    .method ('diagonal', tnt_tree.diagonal.radial)
    .method ('height', function () { return conf.width });

    // Changes in width affect changes in r
    layout.width.transform (function (val) {
        var nRadius = parseFloat(document.getElementById("nRadius").value);
        r = val / 2;
        layout.cluster.size([360, r*nRadius])
        layout.translate_vis([r, r]);
        return val;
    });

    api.method ("yscale",  function (dists) {
    var nRadius = parseFloat(document.getElementById("nRadius").value);
    return d3.scale.linear()
        .domain([0, d3.max(dists)])
        .range([0, r*nRadius]);
    });

    api.method ("adjust_cluster_size", function (params) {
    var r = (layout.width()/2);
    var nRadius = parseFloat(document.getElementById("nRadius").value);
    layout.cluster.size([360, r*nRadius]);
    return layout;
    });

    api.method('scale_branch_lengths', function (curr) {
        if (layout.scale() === false) {
            return
        }

        var nodes = curr.nodes;
        var tree = curr.tree;

        var root_dists = nodes.map (function (d) {
            return d._root_dist;
        });

        var x_root_dists = nodes.map (function (d) {
            return d.x;
        });
        
        var y_root_dists = nodes.map (function (d) {
            return d.y;
        });

        /*
            il metodo l.yscale prende in input un array di distanze dal nodo radice.
            queste distanze non sono espresse in pixel ma corrispondono alla somma 
            di tutte le distanze dalla radice fino alla foglia presenti nel file newick.

            vale la proporzione
            massima distanza : metà width del container svg = X : distanza in pixel delle etichette
        */
        var max_root_dist = d3.max(root_dists); // questa dovrebbe essere una foglia
        opts.tree.max_root_dist = max_root_dist;
        var max_idx = root_dists.lastIndexOf(max_root_dist);
        opts.tree.max_x = x_root_dists[max_idx];
        opts.tree.max_y = y_root_dists[max_idx];
        opts.tree.max_leaf_label_width = this.max_leaf_label_width();
        //var fl = (opts.histograms && opts.histograms.full_length) || 30;
        var nRadius = parseFloat(document.getElementById("nRadius").value);
        var fl = (opts.table_hist && (opts.tree.width/2)*(1-nRadius)/opts.table_hist.colors.length) || 1;
        fl *= (opts.table_hist && opts.table_hist.labelHistogramK)|| 1;
        var n_hists = (opts.table_hist && opts.table_hist.colors.length) || 1;
        var delta = d3.round(max_root_dist*n_hists*fl/(opts.tree.width/2)*100)/100; //calcolo la proporzione
        /*
        for(var ii=0; ii<root_dists.length;ii++)
        {
            //if (root_dists[ii] == max_root_dist)
                root_dists[ii] += delta;
        }
        */
        
        var yscale = layout.yscale(root_dists);
        tree.apply (function (node) {
            node.property("y", yscale(node.root_dist()));
        });
    });

    return layout;
};

/**
* @Default label creator
*/
function createLabel(opts) {

    //Utility function for histograms
    function appendLabelHistogram(vv, idx)
    {
        hl = tnt_tree.label.histogram()
            .text(function (node) {
                if(node.is_leaf()) {
                    return node.node_name();
                }
            })
            .componentidx(idx);
        vv = vv.add_label(hl);
        return vv;
    }   

    //Translating opts
    var pics = opts.label.pics.pictureSource;
    var pictureWidth = opts.label.pics.pictureWidth;
    var pictureHeight = opts.label.pics.pictureHeight;
    var fontsize = opts.label.fontsize;
    var usePics = opts.label.usePics;
    var useHists = opts.label.useHists;

    if(usePics) {
        var image_label = tnt_tree.label.img()
                .src(function(node) {
            if(node.is_leaf()) {
                var sp_name = node.node_name();
                // ucfirst
                return (pics[sp_name.substr(0,1).toUpperCase() + sp_name.substr(1)]);
            }
                })
                .width(function() {
            return pictureWidth;
                })
                .height(function() {
            return pictureHeight;
                });
    }

    var original_label = tnt_tree.label.text()
            .text(function (node) {
        if(node.is_leaf()) {
            return node.node_name();
        }
            }).fontsize(fontsize);

    if(usePics) {
        var joined_label = tnt_tree.label.composite()
                .add_label(image_label)
                .add_label(original_label);
        
        return joined_label;

    } else if (useHists) {
        debugger;
        var n = opts.table_hist?opts.table_hist.labels.length:0;
        var joined_label = tnt_tree.label.composite_war();
        for (var idx=0; idx < n; idx++)
            appendLabelHistogram(joined_label, idx);
        return joined_label;
    } else {

        return original_label;
    }

}

/**
* @Create layout by deciding between vertical and radial
*/ 

function createLayout(opts) {
    
    var string = opts.tree.layoutInput;
    var width = opts.tree.width;
    var scale = opts.tree.scale;

    var layout;
    if(string === "vertical") {
        layout = tnt_tree.layout.vertical().width(width).scale(scale);
    }
    else if(string === "radial") {
        layout = tnt_tree.layout.radial().width(width).scale(scale);
    }
    else if(string === "phylo") {
        layout = tnt_tree.layout.phylo().width(width).scale(scale);
    }
    else {
        console.log("Unknown Layout Parameter: Please choose between 'vertical' and 'radial' layout");
    }
    return layout;
}

/**
* @Create node display which switches between triangle and circle nodes
*/ 

function createNodeDisplay(opts) {
    
    var node_size = opts.nodes.size;
    var node_fill = opts.nodes.fill;
    var node_stroke = opts.nodes.stroke;

    var selected_node_size = opts.nodes.selectedSize;
    var selected_node_fill = opts.nodes.selectedFill;

    
    tnt_tree.node_display.phylo_circle = function () {
        var n = tree.node_display();

        n.display (function (node) {
        d3.select(this)
            .append("circle")
            .attr("r", function (d) {
                var radius = 5;
                if (opts.xitol && opts.xitol[d.name])
                {
                    var color = opts.xitol[d.name]['range']['hex_color'];
                    radius = opts.table_hist['color_map'][color]['radius'];
                }
                return radius;//opts.xitol[node.name()].radius; //d3.functor(n.size())(node)
            })
            .attr("fill", function (d) {
            var nf = node_fill;
            if (opts.xitol)
                if (opts.xitol.hasOwnProperty(d.name))
                {
                    var rd = opts.xitol[d.name]["range"];
                    if (rd)
                        nf = rd.hex_color;
                }
            return nf;
            //return d3.functor(n.fill())(node);
            })
            .attr("stroke", function (d) {
            return node_stroke;
            //return d3.functor(n.stroke())(node);
            })
            .attr("stroke-width", function (d) {
            return d3.functor(n.stroke_width())(node);
            })
        });

        return n;
    };
    
    
    var expanded_node = {};
    if(opts.tree.layoutInput === "phylo") {
        expanded_node = tnt_tree.node_display.phylo_circle();
    } else {
        expanded_node = tnt_tree.node_display.circle()
            .size(node_size)
            .fill(node_fill)
            .stroke(node_stroke);
    }

    var collapsed_node = tnt_tree.node_display.triangle()
        .size(node_size)
        .fill(node_fill)
        .stroke(node_stroke)

    var selected_node = tnt_tree.node_display.circle()
        .size(selected_node_size)
        .fill(selected_node_fill)
        .stroke(node_stroke)

    // VR 20160610
    /*
    var node_display = tnt_tree.node_display.cond()
        .add("collapsed", function (node) {
            return node.is_collapsed()
        }, collapsed_node)
        .add("selected", function (node) {
            return node.property('selected')
        }, selected_node)
        .add("rest", function () {
            return true
        }, expanded_node);
    */

    var node_display = tnt_tree.node_display()
        .display (function (node) {
                    if (node.is_collapsed()) {
                        collapsed_node.display().call(this, node);
                    } 
                    else if (node.property('selected')) {
                        selected_node.display().call(this, node);
                    }
                    else {
                        expanded_node.display().call(this, node);
                    }
        });

    return node_display;
}

//creates default eventFunction for toggle and select
function createNodeEvent(opts) {

    var eventFunction = {};

    if(opts.nodes.toggle) {
        eventFunction = function(node) {
            if(!node.is_leaf() || (node.n_hidden() > 0)) {
                node.toggle();
                tree.update();
            } else {
                if(opts.nodes.select) {
                    toggleClick(node);
                }
                tree.update();
            }
            
            if(opts.tree.layoutInput === "phylo") {
                createContextMenu();
                draw_enclosing_circle();
            }
        }
    } else {
        if(opts.nodes.select) {
            eventFunction = function(node) {
                toggleClick(node);
                tree.update();
                if(opts.tree.layoutInput === "phylo") {
                    createContextMenu();
                    draw_enclosing_circle();
                }
            }
        }
    }

    if(opts.nodes.select) {
        function toggleClick(node) {
        if(node.property('selected')) {
            node.property('selected',false);
        } else {
            node.property('selected',true);
        }
    } 
    } 

    return eventFunction;

}

function createContextMenu() {
    var menu = [
        {
            title: 'Collassa/Espandi',
            action: function(elm, d, i) {
                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                elm.dispatchEvent(clickEvent);
            }
        },
        {
            title: 'Nuova root',
            action: function(elm, d, i) {
                if (opts.upstream.length == 0)
                    opts.upstream.unshift({
                        'name': tree.root().data().name,
                        'id': tree.root().data()._id
                    });
                var tmp_upstream = [];
                var temp = d;
                while(temp._parent)
                {
                    tmp_upstream.unshift({
                        'name': temp.name,
                        'id': temp._id
                    });
                    temp = temp._parent;
                }
                opts.upstream = opts.upstream.concat(tmp_upstream);
                redraw_root_chain(opts.upstream);
                opts.tree.data = json_to_newick(d);
                updateTree(tree, opts);
            }
        },
        {
            title: function(d) {
                var info = opts.xitol[d.name];
                var labels = opts.table_hist.labels;
                var hist_values = opts.table_hist.histograms[d.name];
                var to_clipboard = [d.name, info.taxonomy];
                var parts = [];
                for (var idx = 0; idx < labels.length; idx++)
                {
                    parts.push(labels[idx] + ': ' + hist_values[idx]);
                    to_clipboard.push(hist_values[idx]);
                }
                var hist_info = parts.join('<br/>');
                d['to_clipboard'] = to_clipboard.join(';');
                var elem = '<div><b>'+ d.name + '</b><br/><i>' + info.taxonomy + '</i><br/>' + hist_info + '</div>';
                return elem;
            },
            action: function(elm, d, i) {
                //window.prompt("Copy to clipboard: Ctrl+C, Enter", d.to_clipboard);
                var info = opts.xitol[d.name].csv_line;
                document.getElementById("csv-area").value += info + "\n";
            }
        }
    ];

    d3.selectAll(".tnt_tree_node").on("contextmenu", d3.contextMenu(menu, {
                    onOpen: function() {
                        console.log('opened!');
                    },
                    onClose: function() {
                        console.log('closed!');
                    }
                }));
}

function draw_enclosing_circle() {
    var nRadius = parseFloat(document.getElementById("nRadius").value);
    var root_node = d3.select(".root");
    root_node.append("circle")
            .attr("x",opts.tree.width/2)
            .attr("y",opts.tree.width/2)
            .attr("r",((opts.tree.width/2)*nRadius)) 
            .attr("stroke", "black")
            .attr("stroke-width",0.5)
            .attr('fill', 'none');
}

function display_tooltip() {
    d3.selectAll(".tnt_tree_node").on("mouseenter", 
        function (node) {

        var tt = document.getElementById("tooltip");
        var st = tt.style;
        tt.innerHTML = node.name + "<br/><i>" + opts.xitol[node.name].taxonomy + "</i>";
        if (node.name.length>0)
        {
            st.opacity = 0.9;
            st.left = (d3.event.pageX + 10) + "px";
            st.top = (d3.event.pageY - 28) + "px";
        }
    }
    );

    d3.selectAll(".tnt_tree_node").on("mouseleave", 
        function (node) {

        var tt = document.getElementById("tooltip");
        var st = tt.style;
        st.opacity = 0;

    }
    );
}

/*
 * Public Methods
 */

/**
* @create a default tree
*   
*   exe.createTree(opts);
*   
*   @method createTree
*   @param {object} a config json
*   @return {tree object} a tree object
*/

exe.createTree = function (opts) {
    var parsedOpts = parseOpts(opts, savedOpts);

    savedOpts = parsedOpts; //Saves state

    var data = parsedOpts.tree.data;
    var el = parsedOpts.el;

    //Create a layout
    var layout;
    layout = createLayout(parsedOpts);

    //Create a label
    var label;
    label = createLabel(parsedOpts);

    //Create a nodedisplay
    var nodeDisplay;
    nodeDisplay = createNodeDisplay(parsedOpts);
    
    //Create a tree
    var tree = tnt_tree();

    tree.data(parser.parse_newick(data))
        .layout(layout)
        .node_display(nodeDisplay);

    tree.label(label);

    var nodeEvent = createNodeEvent(parsedOpts);
    tree.on("click", nodeEvent);

    tree(el);

    // VR 20160621
    // Create ContextMenu only with proper layout
    if(parsedOpts.tree.layoutInput === "phylo")
        createContextMenu();

    return tree;
} 

/**
* @updates a tree
*   
*   exe.updateTree(tree,opts);
*   
*   @method updateTree
*   @param {tree object} a given tree, {object} a config json
*   @return void
*/

exe.updateTree = function(tree, opts) {

    //get the tree object and update the opts
    var parsedOpts = parseOpts(opts, savedOpts);

    savedOpts = parsedOpts;

    var data = parsedOpts.tree.data;

    //Create a layout
    var layout;
    layout = createLayout(parsedOpts);

    var max_label_length = compute_max_leaf_label_length(tree);
    layout.max_leaf_label_width(max_label_length);

    //Create a label
    var label;
    label = createLabel(parsedOpts);

    //Create a nodedisplay
    var nodeDisplay;
    nodeDisplay = createNodeDisplay(parsedOpts);

    tree.data(parser.parse_newick(data))
        .layout(layout)
        .node_display(nodeDisplay);

    tree.label(label);

    var nodeEvent = createNodeEvent(parsedOpts);
    tree.on("click", nodeEvent);

    tree.update();

    // VR 20160623
    // Create ContextMenu, enclosing circle,
    // branch color and tooltips 
    // only with proper layout
    if(parsedOpts.tree.layoutInput === "phylo") {
        tree.branch_color(function(source, target) {
            var data = target.data();
            var color = "black";
            if (opts.xitol)
                if (opts.xitol.hasOwnProperty(data.name))
                {
                    var cd = opts.xitol[data.name]["clade"];
                    if (cd)
                        color = cd.hex_color;
                }
            return color;
        });
        createContextMenu();
        draw_enclosing_circle();
        display_tooltip();
    }
}

exe.updateLabelHistogram = function (tree, opts) {
  d3.selectAll(".labelHistogram").remove();
  var parsedOpts = parseOpts(opts, savedOpts);

  savedOpts = parsedOpts;


  //Create a label
  var label;
  label = createLabel(parsedOpts);

  tree.label(label);
  tree.update_nodes();

  draw_enclosing_circle();
};

/**
* @exports the functionalities
*/

module.exports = {
    createTree : exe.createTree,
    updateTree : exe.updateTree,
    updateLabelHistogram : exe.updateLabelHistogram,
};
