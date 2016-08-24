json_to_newick = function (json) {
    function nested(nest)
    {
        var subtree = "";

        if(nest.hasOwnProperty('children')){
            var children = [];
            nest.children.forEach(function(child){
                var subsubtree = nested(child);
                children.push(subsubtree);
            });
            var substring = children.join();
            if(nest.hasOwnProperty('name')){
                subtree = "("+substring+")" + nest.name;
            }
            if(nest.hasOwnProperty('branch_length')){
                subtree = subtree + ":"+nest.branch_length;
            }
        }
        else 
        {
            var leaf = "";
            if(nest.hasOwnProperty('name')){
                leaf = nest.name;
            }
            if(nest.hasOwnProperty('branch_length')){
                leaf = leaf + ":"+nest.branch_length;
            }
            subtree = subtree + leaf;
        }
        return subtree;
    }
    return nested(json) +";";
};

function normalize_hist(table_hist)
{
    var accumulators = [];
    for (var l in table_hist.labels)
        accumulators.push(0.0);
    for (var key in table_hist.histograms) {
      if (table_hist.histograms.hasOwnProperty(key)) {
        var idx = 0;
        var hs = table_hist.histograms[key];
        for (var l in table_hist.labels)
        {
            accumulators[idx]+= hs[idx];
            idx += 1;
        }
      }
    }
    for (var key in table_hist.histograms) {
      if (table_hist.histograms.hasOwnProperty(key)) {
        var idx = 0;
        for (var l in table_hist.labels)
        {
            table_hist.histograms[key][idx] = table_hist.histograms[key][idx]/accumulators[idx];
            idx += 1;
        }
      }
    }
    return table_hist;
};

parseTableHist = function (lines) {
    var table_hist = {"histograms":{}};
    for(var line = 0; line < lines.length; line++)
    {
        //console.log(lines[line]);
        var l = lines[line];
        var parts = l.split(",");
        var label = parts[0];
        var idx = 0;
        switch(label) {
            case "LABELS":
                table_hist.labels = parts.slice(1,parts.length);
                break;
            case "COLORS":
                table_hist.colors = parts.slice(1,parts.length);
                break;
            case ",,,":
                break;
            default:
                if (label.length>0)
                {
                    // console.log(l);
                    // console.log(parts);
                    table_hist.histograms[label] = [];
                    for (idx=1;idx<parts.length;idx++)
                        table_hist.histograms[label].push(parseFloat(parts[idx]));
                }
        }
    }
    // console.log(table_hist);
    table_hist = normalize_hist(table_hist);
    // console.log('normalized');
    // console.log(table_hist);
    return table_hist;
};

parseXItol = function (lines) {
    var xitol = {};
    for(var line = 0; line < lines.length; line++)
    {
        // console.log(lines[line]);
        var l = lines[line];
        var parts = l.split("\t");
        var node_name = parts[0];
        var var_type = parts[1];
        if (!xitol.hasOwnProperty(node_name))
            xitol[node_name] = {};
        xitol[node_name][var_type] = {}; //range/significant
        xitol[node_name][var_type].hex_color = parts[2];
        xitol[node_name][var_type].notes = parts[3];
    }
    // console.log(xitol);
    return xitol;
};

parseCSV = function (lines) {
    var palette = ["#FF0000","#00FF00","#0000FF","#FF33CC","#996633","#00CC99","#CC6699","#009933"]
    var table_hist = {"histograms":{}, 'labels':[], 'colors':[], "labelHistogramK": 1.0};
    var xitol = {};
    var csv_line = {};
    var rel_freqs_indices = [];
    var line_0 = lines[0];
    var parts_0 = line_0.split("\t");
    for (var idx=0; idx < parts_0.length; idx++)
    {
        if(parts_0[idx] == "By Group Relative Frequency")
            rel_freqs_indices.push(idx)
    }
    var line_l = lines[1];
    var parts_l = line_l.split("\t");
    var color_values = new Set();
    //var line_c = lines[2];
    //var parts_c = line_c.split("\t");
    
    for (var idx = 0; idx < rel_freqs_indices.length; idx++)
    {
        table_hist.labels.push(parts_l[rel_freqs_indices[idx]]);
        table_hist.colors.push(palette[idx%palette.length]);
    }

    for (var line = 3; line <  lines.length; line++)
    {
        var l = lines[line];
        var parts = l.split("\t");
        var node_name = parts[0];
        var is_leaf = parts[1];
        var taxonomy = parts[2];
        var itig = {
            'nats': parseFloat(parts[3]),
            'turnover': parseFloat(parts[4]),
            'pvalue': parseFloat(parts[5]),
            'multtest': parts[6],
            'color': parts[7]
        };
        color_values.add(itig['color']);
        var last_rel_f = rel_freqs_indices[rel_freqs_indices.length-1];
        var itigs = {
            'nats': parseFloat(parts[last_rel_f+1]),
            'turnover': parseFloat(parts[last_rel_f+2]),
            'pvalue': parseFloat(parts[last_rel_f+3]),
            'multtest': parts[last_rel_f+4]
        }
        if (node_name.length>0)
        {
            if (!xitol.hasOwnProperty(node_name))
                xitol[node_name] = {};
            xitol[node_name]["range"] = {"hex_color": itig.color}; //range/clade
            var clade_color = "#000000";
            if(itig.multtest == "True")
                clade_color = "#0000FF";
            xitol[node_name]["clade"] = {"hex_color": clade_color};
            xitol[node_name].taxonomy = taxonomy;
            xitol[node_name].itig = itig;
            xitol[node_name].itigs = itigs;
            xitol[node_name].csv_line = parts.join(";");
            table_hist.histograms[node_name] = [];
            for (var idx = 0; idx < rel_freqs_indices.length; idx++)
                table_hist.histograms[node_name].push(parseFloat(parts[rel_freqs_indices[idx]]));    
        }
    }
    var color_dd = {};
    var colors_weights_dd = {};
    var color_map = Array.from(color_values);
    for (var idx = 0; idx < color_map.length; idx++)
        color_dd[color_map[idx]] = [];
    for (var key in xitol) {
      if (xitol.hasOwnProperty(key)) {
        var cv = xitol[key]["range"]["hex_color"];
        color_dd[cv].push(xitol[key]["itig"]["turnover"]);
      }
    }
    for (var idx = 0; idx < color_map.length; idx++)
    {
        var sum = 0;
        for( var i = 0; i < color_dd[color_map[idx]].length; i++ ){
            sum += color_dd[color_map[idx]][i]; 
        }
        var avg = sum/color_dd[color_map[idx]].length;
        colors_weights_dd[color_map[idx]] = avg;
    }
    var items = Object.keys(colors_weights_dd).map(function(key) {
        return [key, colors_weights_dd[key]];
    });
    items.sort(function(first, second) {
        return first[1] - second[1];
    });
    // array di oggetti da ordinare
    table_hist.color_map = {};
    var temp_lines = [];
    for (var idx = 0; idx < 3; idx++)
        temp_lines.push(lines[idx].split("\t").join(";"));
    table_hist.csv_header = temp_lines.join("\n"); 
    var cnt = 1;
    for (var idx = 0; idx < items.length; idx++)
        if (items[idx][1]!=NaN)
        {
            table_hist.color_map[items[idx][0]] = {};
            table_hist.color_map[items[idx][0]] = {"radius": cnt*3};
            cnt++;
        }
    //table_hist = normalize_hist(table_hist);
    return {'table_hist': table_hist, 'xitol': xitol};
}

function parseCSVLines(lines)
{
    var dd = parseCSV(lines);
    opts.table_hist = dd.table_hist;
    opts.xitol = dd.xitol;
    document.getElementById("csv-area").value = dd.table_hist.csv_header + "\n"; 
    //updateTree(tree,opts);
    updateLegend(opts.table_hist);
}
