var tnt_theme_tree_treefam_tree = function() {
	"use strict";

	var tree_theme = function(sT, div) {
		// var pics_path = "http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/species_files/";
		var pics_path = "http://www.treefam.org/static/images/species_pictures/species_files/";
		// var newick = "((homo_sapiens,pan_troglodytes),mus_musculus);";
		// var nhx = "(((((((((((((((((ENSP00000369497:0.0020[&&NHX:D=N:G=ENSG00000139618:T=9606],ENSPTRP00000009812:0.0036[&&NHX:D=N:G=ENSPTRG00000005766:T=9598])Homininae:0.0002[&&NHX:D=N:B=100:T=207598],ENSGGOP00000015446:0.0199[&&NHX:D=N:G=ENSGGOG00000015808:T=9593])Homininae:0.0055[&&NHX:D=N:B=100:T=207598],ENSPPYP00000005997:0.0082[&&NHX:D=N:G=ENSPPYG00000005264:T=9601])Hominidae:0.0031[&&NHX:D=N:B=100:T=9604],ENSNLEP00000001277:0.0124[&&NHX:D=N:G=ENSNLEG00000001048:T=61853])Hominoidea:0.0031[&&NHX:D=N:B=100:T=314295],ENSMMUP00000009432:0.0159[&&NHX:D=N:G=ENSMMUG00000007197:T=9544])Catarrhini:0.0094[&&NHX:D=N:B=100:T=9526],ENSCJAP00000034250:0.0394[&&NHX:D=N:G=ENSCJAG00000018462:T=9483])Simiiformes:0.0370[&&NHX:D=N:B=100:T=314293],ENSTSYP00000000441:0.0854[&&NHX:D=N:G=ENSTSYG00000000478:T=9478])Haplorrhini:0.0047[&&NHX:D=N:B=100:T=376913],(ENSMICP00000010933:0.0556[&&NHX:D=N:G=ENSMICG00000011994:T=30608],ENSOGAP00000009477:0.0792[&&NHX:D=N:G=ENSOGAG00000010588:T=30611])Strepsirrhini:0.0208[&&NHX:D=N:B=100:T=376911])Primates:0.0061[&&NHX:D=N:B=100:T=9443],ENSTBEP00000013856:0.1152[&&NHX:D=N:G=ENSTBEG00000015907:T=37347])Euarchontoglires:0.0021[&&NHX:D=N:B=86:T=314146],(((((ENSMUSP00000038576:0.0406[&&NHX:D=N:G=ENSMUSG00000041147:T=10090],ENSRNOP00000001475:0.0489[&&NHX:D=N:G=ENSRNOG00000001111:T=10116])Murinae:0.1928[&&NHX:D=N:B=100:T=39107],ENSDORP00000006609:0.1421[&&NHX:D=N:G=ENSDORG00000007049:T=10020])Sciurognathi:0.0137[&&NHX:D=N:B=4:T=33553],ENSSTOP00000004979:0.0931[&&NHX:D=N:G=ENSSTOG00000005517:T=43179])Sciurognathi:0.0020[&&NHX:D=N:B=1:T=33553],ENSCPOP00000004635:0.1491[&&NHX:D=N:G=ENSCPOG00000005153:T=10141])Rodentia:0.0145[&&NHX:D=N:B=1:T=9989],(ENSOCUP00000014514:0.0566[&&NHX:D=N:G=ENSOCUG00000016878:T=9986],ENSOPRP00000014082:0.1469[&&NHX:D=N:G=ENSOPRG00000015365:T=9978])Lagomorpha:0.0577[&&NHX:D=N:B=100:T=9975])Glires:0.0049[&&NHX:D=N:B=2:T=314147])Euarchontoglires:0.0098[&&NHX:D=N:B=0:T=314146],(((((((ENSTTRP00000010004:0.0384[&&NHX:D=N:G=ENSTTRG00000010541:T=9739],ENSSSCP00000028073:0.0783[&&NHX:D=N:G=ENSSSCG00000029039:T=9823])Cetartiodactyla:0[&&NHX:D=N:B=39:T=91561],ENSBTAP00000001311:0.0631[&&NHX:D=N:G=ENSBTAG00000000988:T=9913])Cetartiodactyla:0.0083[&&NHX:D=N:B=39:T=91561],ENSVPAP00000000821:0.0578[&&NHX:D=N:G=ENSVPAG00000000886:T=30538])Cetartiodactyla:0.0178[&&NHX:D=N:B=100:T=91561],ENSECAP00000013146:0.0540[&&NHX:D=N:G=ENSECAG00000014890:T=9796])Laurasiatheria:0.0006[&&NHX:D=N:B=93:T=314145],((ENSAMEP00000009909:0.0307[&&NHX:D=N:G=ENSAMEG00000009390:T=9646],ENSMPUP00000001928:0.0363[&&NHX:D=N:G=ENSMPUG00000001945:T=9669])Caniformia:0.0114[&&NHX:D=N:B=100:T=379584],ENSCAFP00000009557:0.0469[&&NHX:D=N:G=ENSCAFG00000006383:T=9615])Caniformia:0.0432[&&NHX:D=N:B=100:T=379584])Laurasiatheria:0.0004[&&NHX:D=N:B=93:T=314145],(ENSMLUP00000012516:0.0738[&&NHX:D=N:G=ENSMLUG00000013741:T=59463],ENSPVAP00000000225:0.1194[&&NHX:D=N:G=ENSPVAG00000000246:T=132908])Chiroptera:0.0198[&&NHX:D=N:B=100:T=9397])Laurasiatheria:0.0047[&&NHX:D=N:B=100:T=314145],(ENSEEUP00000008968:0.1373[&&NHX:D=N:G=ENSEEUG00000009739:T=9365],ENSSARP00000002541:0.1475[&&NHX:D=N:G=ENSSARG00000002755:T=42254])Insectivora:0.0177[&&NHX:D=N:B=100:T=9362])Laurasiatheria:0.0106[&&NHX:D=N:B=93:T=314145])Eutheria:0.0118[&&NHX:D=N:B=0:T=9347],(ENSCHOP00000007822:0.0642[&&NHX:D=N:G=ENSCHOG00000008817:T=9358],ENSDNOP00000013476:0.0654[&&NHX:D=N:G=ENSDNOG00000017393:T=9361])Xenarthra:0.0333[&&NHX:D=N:B=100:T=9348])Eutheria:0.0053[&&NHX:D=N:B=0:T=9347],((ENSETEP00000003277:0.2111[&&NHX:D=N:G=ENSETEG00000003989:T=9371],ENSPCAP00000000440:0.2140[&&NHX:D=N:G=ENSPCAG00000000379:T=9813])Afrotheria:0.0184[&&NHX:D=N:B=26:T=311790],ENSLAFP00000002234:0.0896[&&NHX:D=N:G=ENSLAFG00000002670:T=9785])Afrotheria:0.0609[&&NHX:D=N:B=26:T=311790])Eutheria:0.1434[&&NHX:D=N:B=30:T=9347],((ENSSHAP00000012162:0.0854[&&NHX:D=N:G=ENSSHAG00000010421:T=9305],ENSMODP00000033276:0.0923[&&NHX:D=N:G=ENSMODG00000009516:T=13616])Marsupialia:0.0403[&&NHX:D=N:B=100:T=9263],ENSMEUP00000009812:0.0965[&&NHX:D=N:G=ENSMEUG00000010691:T=9315])Marsupialia:0.1548[&&NHX:D=N:B=100:T=9263])Theria:0.0638[&&NHX:D=N:B=100:T=32525],ENSOANP00000024376:0.3531[&&NHX:D=N:G=ENSOANG00000015481:T=9258])Mammalia:0.1487[&&NHX:D=N:B=100:T=40674],(((ENSGALP00000027524:0.0306[&&NHX:D=N:G=ENSGALG00000017073:T=9031],ENSMGAP00000015990:0.0320[&&NHX:D=N:G=ENSMGAG00000015077:T=9103])Phasianidae:0.1059[&&NHX:D=N:B=100:T=9005],ENSTGUP00000012130:0.1395[&&NHX:D=N:G=ENSTGUG00000011763:T=59729])Neognathae:0.2672[&&NHX:D=N:B=100:T=8825],ENSPSIP00000012858:0.2186[&&NHX:D=N:G=ENSPSIG00000011574:T=13735])Sauropsida:0.1761[&&NHX:D=N:B=100:T=8457])Amniota:0.2212[&&NHX:D=N:B=100:T=32524],ENSXETP00000060681:0.8809[&&NHX:D=N:G=ENSXETG00000017011:T=8364])Tetrapoda:0[&&NHX:D=N:B=0:T=32523];";
		
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
						// sT.layout().scale(false);
						sT.subtree(["mouse", "human", "zebrafish", "fugu"]);
						break;
					case "model":

						sT.subtree(["Mus musculus", "Homo sapiens", "Takifugu rubripes", "danio rerio"]);
						
						break;
				};
				sT.update();
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

		var menu_pane = d3.select(div)
			.append("div")
			.append("span")
			.text("Layout:  ");
		var sel = menu_pane
			.append("select")
			.on("change", function(d) {
				switch (this.value) {
					case "unscaled":
						sT.layout().scale(false);
						break;
					case "scaled":
						sT.layout().scale(true);
						break;
				};
				sT.update();
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

		// var tree = epeek.tree.tree(data);
		var gene_label = epeek.tree.label.text().text(function(d) {
			if (d.children) {
				return d.name;
			} else if (d._children) {
				return "collapsed";
			} else {
				if (d.sequence && d.sequence.name) {
					return d.sequence.name;
				} else {
					return "no gene name";
				}
			}
		});
		var taxonomy_label = epeek.tree.label.text().text(function(d) {
			if (d.children) {
				return d.name;
			} else if (d._children) {
				return "collapsed";
			} else {
				if (d.taxonomy && d.taxonomy.scientific_name) {
					return d.taxonomy.scientific_name;
				} else {
					return "NOTHING!!";
				}
			}
		});

		// The image label shows a picture of the species
		var image_label = epeek.tree.label.img()
			.src(function(d) {
				if (!d.children && !d._children && d.taxonomy.scientific_name) {
					var changed_name = d.taxonomy.scientific_name.replace(/ /g, '_');
					return pics_path + "/thumb_" + changed_name + ".png";
				} else {
					var test = d;
				}
			})
			.width(function() {
				return 17;
			})
			.height(function() {
				return 17;
			});
		// The joined label shows a picture + the common name
		var joined_label = epeek.tree.label.composite()
			.add_label(image_label)
			.add_label(gene_label);
		// sT.label(label);
		// The menu to change the labels dynamically
		var menu_pane = d3.select(div)
			.append("div")
			.append("span")
			.text("Label display:   ");

		var label_type_menu = menu_pane
			.append("select")
			.on("change", function(d) {
				switch (this.value) {
					case "joint":
						sT.label(joined_label);
						break;
					case "gene":
						sT.label(gene_label);
						break;
					case "taxonomy":
						sT.label(taxonomy_label);
						break;
				}

				sT.update();
			});
		label_type_menu
			.append("option")
			.attr("value", "joint")
			.attr("selected", 1)
			.text("joint");
		label_type_menu
			.append("option")
			.attr("value", "gene")
			.text("gene");
		label_type_menu
			.append("option")
			.attr("value", "taxonomy")
			.text("taxonomy");



		sT
			.layout(epeek.tree.layout.vertical().width(600).scale(false))
			.label(joined_label)
			.node_circle_size(5)
			.link_color(function(link) {
				var col = "steelblue";
				if (link.source && link.source.events) {
					switch (link.source.events.type) {
						case "speciation":
							col = "darkgreen";
							break
						case "duplication":
							col = "darkred";
							break
					}
					return col
				}
			})
			.node_color(function(node) {
				if (node.events && node.events.type && node.events.type === 'speciation') {
					return 'green';
				} else if (node.events && node.events.type && node.events.type === 'duplication') {
					return 'red';
				} else {
					return 'orange';
				}
			});
		// sT.node_info (function(node_data) {
		// 	// console.log(sT.data());
		// 	sT
		// 		.toggle_node(node_data)
		// 		.update();
		// 	// node.toggle_node()
		// });
	    sT.node_dbl_info (function(node_data){
			console.log("double clicked node on "+node_data._id);
			console.log(node_data);
			// var found_node = 
			sT.focus_node(node_data).update();
			
				// sT.update();
		// 		.toggle_node(node)
		// 		.update();
	    });
		// double click
		// hide rest of tree


		var rest = epeek.eRest();

		var gene_tree_id = "ENSGT00390000003602";
		var gene_tree_url = rest.url.gene_tree({
			id: gene_tree_id
		});
		console.log("loading tree from " + gene_tree_url);

		rest.call({
			url: gene_tree_url,
			success: function(tree) {
				sT.data(tree.tree);
				sT(div);
			}
		});

	};

	return tree_theme;
};