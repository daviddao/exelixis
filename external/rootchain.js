function redraw_root_chain(chain) {

    var circles = opts.root_chain.selectAll("circle")
        .data(chain)
        .enter()
        .append("circle")
        .on("click", function(node){
            
            var d3_th = d3.select( this );
            //console.log(node);
            var start = new Date().getTime();
            opts.tree.data = opts.tree.original;
            
            tree.data(parse_nhx(opts.tree.data));
            var end = new Date().getTime();
            var time = end - start;
            //console.log('Execution time step1: ' + time);

            start = new Date().getTime();
            var found_node = tree.root().find_node_by_name(node.name);
            opts.tree.data = json_to_newick(found_node.data());
            updateTree(tree, opts);
            end = new Date().getTime();
            time = end - start;
            //console.log('Execution time step2: ' + time);
            
            var ccnt = opts.root_chain.selectAll("circle")[0].length;
            var ss = "";
            var poss = [];
            
            var current_position = parseInt(d3.select(this).attr("position"));
            for (var i=current_position+1; i < ccnt; i++)
            {
                poss.push("circle[position='"+i+"']");
                poss.push("text[position='"+i+"']");
            }
            ss = poss.join(", ");
            //console.log(ss);
            
            opts.root_chain.selectAll(ss).remove();
            var removed = opts.upstream.splice(current_position, opts.upstream.length-current_position);
            
        })
        .on("mouseenter", function(node){
            //console.log(node);
            d3.select( this ).transition().attr( 'r', 25 );
        })
        .on("mouseleave", function(node){
            d3.select( this ).transition().attr( 'r', 20 );
        });
    var circleAttrs = circles
        .attr("cx", function(d, i) {
            return (i+1)*50;
            d.position = i;
        })
        .attr("cy", function(d, i) {
            return 50;
        })
        .attr("r", function(d, i) {
            return 20;
        })
        .attr("position", function(d, i) {
            return i;
        })
        .attr("fill", function(d, i) {
            var v='black';
            //console.log(d.name);
            //console.log(opts.xitol[d.name]);
            if (opts.xitol && opts.xitol[d.name] && opts.xitol[d.name].range.hex_color)
                v = opts.xitol[d.name].range.hex_color;
            return v;
        });
        
    var text = opts.root_chain.selectAll("text")
                .data(chain)
                .enter()
                .append("text");
    var textLabels = text
        .attr("x", function(d, i) { return (i+1)*50-25; })
        .attr("y", function(d, i) { 
            return ((i%2)*80+10); 
        })
        .attr("position", function(d, i) {
            return i;
        })
        .text( function (d) { return d.name })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "black");
}