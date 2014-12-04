tnt.utils.slider = function () {
"use strict";

    var opts = {
	min : 0,
	max : 10,
	width : 200,
	height : 20,
	pos1 : 0,
	pos2 : 10
    };

    var dipatch = d3.dispatch("slide", "slideend");

    // Creates svg code and returns it
    var slider = function (g) {
	var x_scale = d3.scale.linear()
	    .domain ([opts.min, opts.max])
	    .range ([0,opts.width]);

	var padding = opts.height * 0.1;

	// Bar
	g
	    .append("rect")
	    .attr("x", 5)
	    .attr("y", padding)
	    .attr("width", x_scale (opts.max - opts.min))
	    .attr("height", opts.height - (2 * padding))
	    .attr("fill", "lightgrey");

	// Handler
	var handler1 = g
	    .append("g")
	    .append("rect")
	    .attr("x", x_scale(opts.pos1)-5)
	    .attr("y", 0)
	    .attr("width", 10)
	    .attr("height", opts.height)
	    .attr("fill", 'steelblue');

	var handler2 = g
	    .append("g")
	    .append("rect")
	    .attr("x", x_scale(opts.pos2) - 5)
	    .attr("y", 0)
	    .attr("width", 10)
	    .attr("height", opts.height)
	    .attr("fill", "steelblue");

	var move1 = function () {
	    var x = d3.event.x;
	    console.log("X:",x);
	    console.log("POS2:" + opts.pos2 + " (" + x_scale(opts.pos2) + ")");
	    if (x < 0) {
		opts.pos1 = 0;
	    } else if (x > x_scale(opts.pos2)) {
		x = x_scale(opts.pos2);
	    } else {
		opts.pos1 = x;
	    }
	    d3.select(this)
		.attr("x", opts.pos1);
	};

	var move2 = function () {
	    var x = d3.event.x;
	    if (x > opts.width) {
		opts.pos2 = opts.width;
	    } else if (x < x_scale(opts.pos1)) {
		x = x_scale(opts.pos1);
	    } else {
		opts.pos2 = x;
	    }
	    d3.select(this)
		.attr("x", opts.pos2);
	};

	handler1
	    .call (d3.behavior.drag()
		   .on('drag', move1)
		   .on('dragend', function () {
		       console.log('dragend1');
		   })
		  );
	handler2
	    .call (d3.behavior.drag()
		   .on('drag', move2)
		   .on('dragend', function () {
//		       var p = x_scale.invert(opts.pos2);
		   })
		  );
    };

    var api = tnt.utils.api (slider)
	.getset (opts);

    return slider;
};
