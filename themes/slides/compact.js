var epeek_theme_compact = function() {
    "use strict";

    // Regular expressions for user input
    // TODO: species:gene?
    var loc_re = /^(\w+):(\w+):(\d+)-(\d+)$/;

    // Display elements options that can be overridden by setters
    // (so they are exposed in the API)
    var show_options = true;
    var show_title   = true;
    var show_links   = true;
    var title   = "e!Peek";

    var path = epeek.utils.script_path("compact.js");

    var qr_tooltip = epeek.tooltip()
	.type("plain");

    // div_ids to display different elements
    // They have to be set dynamically because the IDs contain the div_id of the main element containing the plug-in
    var div_id;
    var ensGenes_div_id;
    var n_ensGenes_div_id;
    var orth_div_id;
    var para_div_id;
    var n_orth_div_id;
    var n_para_div_id;

    var gBrowser;

    /** The closure returned by the theme
	@alias ePeekTheme
	@namespace
	@param {Callback} ePeek The ePeek plug-in that has to be included in the theme.
	@param {DOMElement} div The DOM element where the plug-in is going to be inserted.
	@example
	// Typically, it is used as follows:
	var gB = epeek().width(920); // other methods can be included here
	var gBTheme = epeek_theme(); // other methods can be included here
	gBTheme(gB, document.getElementById('DOM_element_id');
    */
    var gBrowserTheme = function(gB, div) {
	// Set the different #ids for the html elements (needs to be lively because they depend on the div_id)
	set_div_id(div);

	gBrowser = gB;

	// Set the gBrowser's callbacks
	var tooltip = epeek.tooltip()
	    .type("table");
	gBrowser.gene_info_callback      = gB.tooltip(tooltip);
	gBrowser.xref_search_callback    = xref_cbak;
	gBrowser.ensgene_search_callback = ensGene_cbak;

	// We set the original data so we can always come back
	// The values are set when the core plug-in is about to start
	var orig = {};

	// The Options pane
	var opts_pane = d3.select(div)
	    .append("div")
	    .attr("class", "ePeek_options_pane")
	    .style("display", function() {
		if (show_options) {
		    return "block"
		} else {
		    return "none"
		}
	    });

	opts_pane = opts_pane
	    .append("span")
	    .text("Jump to: ");

	var ensGeneLabel = opts_pane
	    .append("span")
	    .attr("class", "ePeek_option_label")
	    .html("Ensembl Genes[<span id='" + n_ensGenes_div_id + "'></span>]")
	    .on("click", function(){toggle(d3.select("#ePeek_" + div_id + "_ensGene_option"))});

	var orthologuesLabel = opts_pane
	    .append("span")
	    .attr("class", "ePeek_option_label")
	    .on("click", function(){toggle(d3.select("#ePeek_" + div_id + "_ortho_option"))});
	orthologuesLabel
	    .append("img")
	    .attr("src", path + "../../themes/pics/orthologues.png")
	    .attr("title", "Orthologues")
	    .attr("width", "55px")
	orthologuesLabel
	    .append("text")
	    .text("[");
	orthologuesLabel
	    .append("span")
	    .attr("id", n_orth_div_id)
	orthologuesLabel
	    .append("text")
	    .text("]");

	var paraloguesLabel = opts_pane
	    .append("span")
	    .attr("class", "ePeek_option_label")
	    .on("click", function(){toggle(d3.select("#ePeek_" + div_id + "_para_option"))});
	paraloguesLabel
	    .append("img")
	    .attr("src", path + "../../themes/pics/paralogues.png")
	    .attr("title", "Paralogues")
	    .attr("width", "55px")
	paraloguesLabel
	    .append("text")
	    .text("[")
	paraloguesLabel
	    .append("span")
	    .attr("id", n_para_div_id)
	paraloguesLabel
	    .append("text")
	    .text("]");

	var searchLabel = opts_pane
	    .append("span")
	    .attr("class", "ePeek_option_label")
	    .on("click", function(){toggle(d3.select("#ePeek_" + div_id + "_search_option"))});
	searchLabel
	    .append("img")
	    .attr("src", path + "../../themes/pics/lookup.png")
	    .attr("title", "Lookup gene")
	    .attr("width", "30px");

	var origLabel = opts_pane
	    .append("span")
	    .attr("class", "ePeek_option_label")
	    .on("click", function(){ gBrowser.start(orig) });
	origLabel
	    .append("img")
	    .attr("src", path + "../../themes/pics/orig.png")
	    .attr("title", "Return to origin")
	    .attr("width", "25px");

	var ensGeneBox = opts_pane
	    .append("div")
	    .attr("class", "ePeek_TabBlock")
	    .attr("id", "ePeek_" + div_id + "_ensGene_option")
	    .style("width", gBrowser.width() + "px")
	    .style("background-color", gBrowser.background_color());

	var orthoBox = opts_pane
	    .append("div")
	    .attr("class", "ePeek_TabBlock")
	    .attr("id", "ePeek_" + div_id + "_ortho_option")
	    .style("width", gBrowser.width() + "px")
	    .style("background-color", gBrowser.background_color());

	var ParaBox = opts_pane
	    .append("div")
	    .attr("class", "ePeek_TabBlock")
	    .attr("id", "ePeek_" + div_id + "_para_option")
	    .style("width", gBrowser.width() + "px")
	    .style("background-color", gBrowser.background_color());

	var searchBox = opts_pane
	    .append("div")
	    .attr("class", "ePeek_TabBlock")
	    .attr("id", "ePeek_" + div_id + "_search_option")
	    .style("width", gBrowser.width() + "px")
	    .style("background-color", gBrowser.background_color());

	// The SearchBox
	var p = searchBox
	    .append("p")
	    .attr("class", "ePeek_top_option")
	    .text("Gene name or location")
	p
	    .append("input")
	    .attr("id", "ePeek_" + div_id + "_gene_name_input")
	    .attr("type", "text")
	    .attr("name", "gene");
	p
	    .append("input")
	    .attr("type", "button")
	    .attr("value", "Jump!")
	    .on("click", goSearch);
	p
	    .append("text")
	    .text("examples: ENSG00000139618, SNORD73 or human:5:1533225-1555555");

	var browser_title = d3.select(div)
	    .append("h1")
	    .text(title)
	    .style("color", gBrowser.foreground_color())
	    .style("display", function(){
		if (show_title) {
		    return "auto"
		} else {
		    return "none"
		}
	    });

	/////////////////////////////////////////
	// Here we have to include the browser //
	/////////////////////////////////////////

	// The Browser div
	// We set up the origin:
	if (gBrowser.gene() !== undefined) {
	    orig = {
		species : gBrowser.species(),
		gene    : gBrowser.gene()
	    };
	} else {
	    orig = {
		species : gBrowser.species(),
		chr     : gBrowser.chr(),
		from    : gBrowser.from(),
		to      : gBrowser.to()
	    }
	}
	gBrowser(div);

	// Links div
	var links_pane = d3.select(div)
	    .append("div")
	    .attr("class", "ePeek_links_pane")
	    .style("display", function() {if (show_links) {return "block"} else {return "none"}});

	links_pane = links_pane
	    .append("span")
	    .text("Links: ");

	// ePeek-web
	var epeekweb = links_pane
	    .append("span")
	    .attr("class", "ePeek_link_label")
	    .attr("title", "Open in a new window")
	.on("click", function() {console.log("here"); var link = buildLink("desktop"); window.open(link, "_blank")});
	epeekweb
	    .append("img")
	    .attr("src", path + "../../themes/pics/open_in_new_window.png")
	    .attr("width", "40px");

	// ensembl
	var ensemblLoc = links_pane
	    .append("span")
	    .attr("class", "ePeek_link_label")
	    .attr("title", "Open region in Ensembl")
	    .on("click", function() {var link = buildEnsemblLink(); window.open(link, "_blank")});
	ensemblLoc
	    .append("img")
	    .attr("src", path + "../../themes/pics/e_open_in_new_window.png")
	    .attr("width", "40px");

	// QRtag label
	var qrtagLabel = links_pane
	    .append("span")
	    .attr("class", "ePeek_qrtag_label") // both needed?
	    .attr("id", "ePeek_" + div_id + "_qrtag_label")
	    .on("click", create_QRtag);

	qrtagLabel
	    .append("img")
	    .attr("src", path + "../../themes/pics/qr.png")
	    .attr("title", "QR code")
	    .attr("width", "30px");

	gB.start();

    };

///*********************////
/// RENDERING FUNCTIONS ////
///*********************////
    // Private functions

    var create_QRtag = function() {
	// We remove previously created QRtag
	// d3.select("#ePeek_" + div_id + "_QRcode").remove();

	var tooltip_obj = '<div id="ePeek_' + div_id + '_qrtag_div"></id>';
	qr_tooltip.call(this, tooltip_obj);

	var qrtag = new QRtag();
	qrtag.data(buildLink("mobile"));
	qrtag.border(10);
	qrtag.size(180);
	qrtag.color("FFF"); // gBrowser.foreground_color().toString());
	qrtag.bgcolor("000"); // gBrowser.background_color().toString());
	qrtag.target("ePeek_" + div_id + "_qrtag_div");
	qrtag.id("ePeek_" + div_id + "_QRcode");
	qrtag.image();


	return;
    };

    var toggle = function(sel) {
	var curr_on_display = sel.classed("ePeek_TabBlock_active");

	// We hide all elements
	d3.selectAll(".ePeek_TabBlock")
	    .classed("ePeek_TabBlock_active", false);

	if (!curr_on_display) {
	    sel.classed("ePeek_TabBlock_active", true);
	} 

	return;
    };

    var goSearch = function() {
	d3.select("#ePeek_" + div_id + "_ensGene_select").remove();
	d3.select("#ePeek_" + div_id + "_orth_select").remove();
	var search_term = document.getElementById("ePeek_" + div_id + "_gene_name_input").value;
	if (isLocation(search_term)) {
	    var loc = parseLocation(search_term);
	    gBrowser.start(loc);
	} else {
	    gBrowser.start({species : gBrowser.species(),
			    gene : search_term});
	}
    };

    var gene_select = function(gene_array) {
	var ensGenes_div = d3.select("#" + ensGenes_div_id);
	var ensGene_sel = ensGenes_div
	    .append("select")
	    .attr("class", "ePeek_top_option")
	    .attr("id", "ePeek_" + div_id + "_ensGene_select");
	
	ensGene_sel.selectAll("option")
	    .data(gene_array)
	    .enter()
	    .append("option")
	    .attr("class", "ePeek_gene_option")
	    .attr("value", function(d) {return d.id})
	    .text(function(d) {return d.id});

	// We add the number of ensGenes to the corresponding tab label
	d3.select("#" + n_ensGenes_div_id)
	    .text(gene_array.length);

	return ensGene_sel;
    };

    var orthologues_select = function (orthologues) {
	var div = d3.select("#" + orth_div_id);
	var orth_select = div
	    .append("select")
	    .attr("class", "ePeek_top_option")
	    .attr("id", "ePeek_" + div_id + "_orth_select");

	orth_select
	    .append("option")
	    .attr("class", "ePeek_orth_option")
	    .text("-- Go to ortholog --");

	orth_select.selectAll("option2")
	    .data(orthologues, function(d){return d.id})
	    .enter()
	    .append("option")
	    .attr("class", "ePeek_orth_option")
	    .attr("value", function(d) {return d.id})
	    .text(function(d) {return d.id + " (" + d.species + " - " + d.type + ")"});
	
	// We fill the number of orthologues in the tab label
	d3.select("#" + n_orth_div_id)
	    .text(orthologues === undefined ? 0 : orthologues.length);

	return orth_select;
    };

    var paralogues_select = function (paralogues) {
	var div = d3.select("#" + para_div_id);
	var para_select = div
	    .append("select")
	    .attr("class", "ePeek_top_option")
	    .attr("id", "ePeek_" + div_id + "_para_select");

	para_select
	    .append("option")
	    .attr("class", "ePeek_para_option")
	    .text("-- Go to paralog --");

	para_select.selectAll("option2")
	    .data(paralogues, function(d){return d.id})
	    .enter()
	    .append("option")
	    .attr("class", "ePeek_para_option")
	    .attr("value", function(d) {return d.id})
	    .text(function(d) {return d.id + " (" + d.species + " - " + d.type + ")"});

	d3.select("#" + n_para_div_id)
	    .text(paralogues === undefined ? 0 : paralogues.length);

	return para_select;
    }


    var homologues_cbak = function(homologues) {

	// var homologues = gBrowser.split_homologues(homologues);
	
	// The orthologues select + number of orthologues
	var orthologues_sel = orthologues_select(homologues.orthologues);
	orthologues_sel.on("change", function() {
	    d3.select("#ePeek_" + div_id + "_ensGene_select").remove();
	    d3.select("#ePeek_" + div_id + "_orth_select").remove();
	    gBrowser.start({
		gene : this.value
	    });
	});

	var paralogues_sel  = paralogues_select(homologues.paralogues);
	paralogues_sel.on("change", function() {
	    d3.select("#ePeek_" + div_id + "_ensGene_select").remove();
	    d3.select("#ePeek_" + div_id + "_para_select").remove();
	    gBrowser.start({
		gene : this.value
	    });
	});

    };

    var xref_cbak = function(ensGenes) {
	// The ensGenes select + number of ensGenes
	var ensGene_sel = gene_select(ensGenes);
	ensGene_sel.on("change", function() {
	    gBrowser.start({
		gene : this.value
	    });
	});
    };

    var ensGene_cbak = function(ensGene) {
	gBrowser.homologues(ensGene.id, homologues_cbak);
    }

    // TODO: What happens on error? i.e. if the string is not a valid location
    // TODO: We can make it smarter? allowing for examples species:gene?

    /** <strong>parseLocation</strong> takes a string as input and guesses a location
	setting <a href="../../ePeek.html#species">ePeek.species</a>, <a href="../../ePeek.html#chr">ePeek.chr</a>. <a href="../../ePeek.html#from">ePeek.from</a> and <a href="../../ePeek.html#to">ePeek.to</a>.
	@param {String} location A string of the form species:chr:from-to
	@returns {ePeekTheme} The original object allowing method chaining.
    */
    var parseLocation = function(loc) {
	var loc_arr = loc_re.exec(loc);
	var loc = {};
	loc.species = loc_arr[1];
	loc.chr     = loc_arr[2];
	loc.from    = loc_arr[3];
	loc.to      = loc_arr[4];

	return loc;
    };

    /** <strong>show_options</strong> sets the visibility of the options pane
	Its argument is evaluated to 'true' or 'false'.
	@param {Boolean} boolean
	@returns {ePeekTheme} The original object allowing method chaining.
    */
    gBrowserTheme.show_options = function(b) {
	show_options = b;
	return gBrowserTheme;
    };

    /** <strong>show_title</strong> sets the visibility of the title.
	This title is set by {@link ePeekTheme.title}.
	Its argument is evaluated to 'true' or 'false'.
	@param {Boolean} boolean
	@returns {ePeekTheme} The original object allowing method chaining
    */
    gBrowserTheme.show_title = function(b) {
	show_title = b;
	return gBrowserTheme;
    };

    /** <strong>show_links</strong> sets the visibility of the links pane.
	Its argument is evaluated to 'true' or 'false'.
	@param {Boolean} boolean
	@returns {ePeekTheme} The original object allowing method chaining
    */
    gBrowserTheme.show_links = function(b) {
	show_links = b;
	return gBrowserTheme;
    };

    /** <strong>title</strong> gets/sets the title of the widget.
	If no argument is provided, returns the default title for the widget ("e!Peek").
	@param {String} [title] The new title for the plug-in
	@returns {ePeekTheme} The original object allowing method chaining
     */
    gBrowserTheme.title = function (s) {
	if (!arguments.length) {
	    return title;
	}
	title = s;
	return gBrowserTheme;
    };

    var set_div_id = function(div) {
	div_id = d3.select(div).attr("id");
	ensGenes_div_id = "ePeek_" + div_id + "_ensGene_option";
	n_ensGenes_div_id = "ePeek_" + div_id + "_n_ensGenes";
	orth_div_id = "ePeek_" + div_id + "_ortho_option";
	n_orth_div_id = "ePeek_" + div_id + "_n_orthologues";
	para_div_id = "ePeek_" + div_id + "_para_option";
	n_para_div_id = "ePeek_" + div_id + "_n_paralogues";
    };


    ///*********************////
    /// UTILITY METHODS     ////
    ///*********************////
    // Private methods
    var buildLink = function(platform) {
	var url = "http://www.ebi.ac.uk/~mp/minimalGenomeBrowser/themes/";
	var postfix = "";
	if (platform === "desktop") {
	    url = url + "compact/compact.html";
	} else if (platform === "mobile") {
	    url = url + "mobile/mobile.html";
	    postfix = "#browser";
	}
	url = url + "?loc=" + gBrowser.species() + ":" + gBrowser.chr() + ":" + gBrowser.from() + "-" + gBrowser.to() + postfix;
	return url;
    };

    var buildEnsemblLink = function() {
	var url = "http://www.ensembl.org/" + gBrowser.species() + "/Location/View?r=" + gBrowser.chr() + "%3A" + gBrowser.from() + "-" + gBrowser.to();
	return url;
    };


    // Public methods

    /** <strong>isLocation</strong> determines if the argument looks like a location of the form
	species:chr:from-to or false otherwise
	@param {String} location The string to be tested
	@returns {Boolean} If the string looks like a location or not
    */
    var isLocation = function(term) {
	if (term.match(loc_re)) {
	    return true;
	} else {
	    return false;
	}
    };


    /** <strong>buildEnsemblGeneLink</strong> returns the Ensembl url pointing to the gene summary of the given gene
	@param {String} gene The Ensembl gene id. Should be a valid ID of the form ENSGXXXXXXXXX"
	@returns {String} The Ensembl URL for the given gene
    */
    var buildEnsemblGeneLink = function(ensID) {
	//"http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000139618"
	var url = "http://www.ensembl.org/" + gBrowser.species() + "/Gene/Summary?g=" + ensID;
	return url;
    };



    return gBrowserTheme;
};

