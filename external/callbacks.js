function onload_cbak() {
    var fileInputCSV = document.getElementById('fileInputCSV');
    var fileInputTree = document.getElementById('fileInputTree');
    fileInputCSV.addEventListener('change', function(e) {
        var num_files = fileInputCSV.files.length;
        if ( (num_files>0) && (fileInputCSV.files[0].name.indexOf('.mibybranch')>-1) )
        {
            var file = fileInputCSV.files[0];
            var reader = new FileReader();
            reader.onload = function (e)
            {
                //console.log(reader.result);
                var lines = reader.result.split('\n');
                parseCSVLines(lines);
                fileInputTree.disabled = false;
            }
            reader.readAsText(file);
        }
    });
    fileInputTree.addEventListener('change', function(e) {
        var num_files = fileInputTree.files.length;
        if ( (num_files>0) && (fileInputTree.files[0].name.indexOf('.TreeLabeled')>-1) )
        {
            var file = fileInputTree.files[0];
            var reader = new FileReader();
            reader.onload = function (e)
            {
                var lines = reader.result.split('\n');
                opts.tree.original = lines[0];
                opts.tree.data = lines[0];
                var start = new Date().getTime();
                updateTree(tree,opts);

                var end = new Date().getTime();
                var time = end - start;
                //console.log('Execution time load new tree: ' + time);
                computeInnerLeavesHistograms(tree.data());

                var inputTreeNameToSaveAs = document.getElementById("inputTreeNameToSaveAs");
                inputTreeNameToSaveAs.disabled = false;
                var saveTreeAsFileButton = document.getElementById("saveTreeAsFileButton");
                saveTreeAsFileButton.disabled = false;
            }
            reader.readAsText(file);
        }
    });

    opts.root_chain = d3.select("#root_chain")
                    .append("svg")
                    .attr("width", window.innerWidth)
                    .attr("height", 100);
};

computeInnerLeavesHistograms = function (tree) {
    function nested(nest)
    {
        if(nest.hasOwnProperty('children')){
            var children = [];
            nest.children.forEach(function(child){
                nested(child);
            });

            var count = nest.children.length;
            if (count>0)
            {
                opts.table_hist.histograms[nest.name] = [];
                for (var l in opts.table_hist.labels)
                    opts.table_hist.histograms[nest.name].push(0);
                for (var cidx = 0; cidx<count; cidx++)
                {
                    var el = nest.children[cidx];
                    for (var lidx=0;lidx<opts.table_hist.histograms[nest.name].length;lidx++)
                    {
                        opts.table_hist.histograms[nest.name][lidx]+=
                            opts.table_hist.histograms[el.name][lidx];    
                    }
                }
            }
        }
    }
    nested(tree);
    //console.log(tree);
};

function updateLegend(th)
{
    var legend_div = document.getElementById('legend');
    for (var idx = 0; idx < th.colors.length; idx++)
    {
        var color_div = document.createElement('div');
        color_div.style.width = "40px";
        color_div.style.height = "20px";
        color_div.style.float = 'left';
        color_div.style.backgroundColor = th.colors[idx];
        var label_div = document.createElement('div');
        label_div.style.width = "60px";
        label_div.style.float = 'left';
        label_div.innerHTML = th.labels[idx];
        var brel = document.createElement('br');
        brel.style.clear = 'left';
        legend_div.appendChild(color_div);
        legend_div.appendChild(label_div);
        legend_div.appendChild(brel);
    }
};

function updateCircleRadius(nRadius) {
    // adjust the text on the range slider
    d3.select("#nRadius-value").text(nRadius);
    d3.select("#nRadius").property("value", nRadius);
    // update the circle radius
    d3.selectAll("circle") 
        .attr("r", nRadius);
};

function updateRadius(nRadius, tree, opts) {
    d3.select("#nRadius-value").text(nRadius);
    d3.select("#nRadius").property("value", nRadius);
    updateTree(tree, opts);
};

function initHoverTooltip() {
    var div = d3.select("body").append("div") 
        .attr("id","tooltip")  
        .attr("class", "tooltip")               
        .style("opacity", 0);    
    var myElements = document.querySelectorAll(".tooltip");
    for (var i = 0; i < myElements.length; i++) {
        var st = myElements[i].style;
        st.position = "absolute";
        st.textAlign = "center";
        st.width = "100px";
        st.height = "28px";
        st.padding ="2px";
        st.font = "12px sans-serif"; 
        st.background = "lightsteelblue";
        st.border = "0px";
        st.borderRadius = "8px";
        st.pointerEvents = "none";
    }
};

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
};

function saveTreeAsFile()
{
    var treedata = opts.tree.data;
    var treedataAsBlob = new Blob([treedata], {type:'text/plain'});
    var treeNameToSaveAs = document.getElementById("inputTreeNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = treeNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(treedataAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(treedataAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
};