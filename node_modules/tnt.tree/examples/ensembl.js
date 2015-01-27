var tnt = require("tnt.tree");

var tnt_theme = function () {

    var original_root;
    
    var mytheme = function (tree, div) {
	// Labels
	var image_label = tnt.tree.label.img()
            .src(function(node) {
		if(node.is_leaf()) {
		    var sp_name = species_info[node.node_name()]['production_name'];
		    // ucfirst
		    return (pics[sp_name.substr(0,1).toUpperCase() + sp_name.substr(1)]);
		}
            })
            .width(function() {
		return 30;
            })
            .height(function() {
		return 40;
            });

	var original_label = tnt.tree.label.text()
            .text(function (node) {
		if(node.is_leaf()) {
		    return node.node_name();
		}
            }).fontsize(14);

	var joined_label = tnt.tree.label.composite()
            .add_label(image_label)
            .add_label(original_label);

	// tooltip
	var sp_tooltip = function (node) {
	    var obj = {};
	    obj.header = "Name : " + node.node_name();
	    obj.rows = [];
	    obj.rows.push({
		label : "Ensembl Name",
		value : species_info[node.node_name()]["ensembl_name"]
	    });
	    obj.rows.push({
		label : "Taxon ID",
		value : species_info[node.node_name()]["taxon_id"]
	    });
	    obj.rows.push({
		label : "Species Homepage",
		value : '<a href="/'+species_info[node.node_name()]['ensembl_name']+'/Info/Index" title="Click to go to species homepage">'+species_info[node.node_name()]['ensembl_name']+'</a>'
	    });
	    tnt.tooltip.table()
		.width(180)
		.call(this, obj);
	};

	tree
	    .data(tnt.tree.parse_newick(ensembl_species_tree))
	    .label(joined_label)
        .layout(tnt.tree.layout.vertical().width(900).scale(false))
	    .on_click(sp_tooltip);

//	if (original_root === undefined) {
	    original_root = tree.root();
//	}
	
	// Display happens here 
	tree(div);
    };

    mytheme.original_root = function () {
	return original_root;
    };
    
    return mytheme;
};

var ensembl_species_tree = "((((Ciona intestinalis:1,Ciona savignyi:1)Ciona:1,(((((((((Sarcophilus harrisii:1,Macropus eugenii:1)Marsupialia:1,Monodelphis domestica:1)Marsupialia:1,((((((((Rattus norvegicus:1,Mus musculus:1)Murinae:1,Dipodomys ordii:1)Sciurognathi:1,Ictidomys tridecemlineatus:1)Sciurognathi:1,Cavia porcellus:1)Rodentia:1,(Oryctolagus cuniculus:1,Ochotona princeps:1)Lagomorpha:1)Glires:1,(((Microcebus murinus:1,Otolemur garnettii:1)Strepsirrhini:1,(((((((Homo sapiens:1,Pan troglodytes:1)Homininae:1,Gorilla gorilla gorilla:1)Homininae:1,Pongo abelii:1)Hominidae:1,Nomascus leucogenys:1)Hominoidea:1,((Macaca mulatta:1,Papio anubis:1)Cercopithecinae:1,Chlorocebus sabaeus:1)Cercopithecinae:1)Catarrhini:1,Callithrix jacchus:1)Simiiformes:1,Tarsius syrichta:1)Haplorrhini:1)Primates:1,Tupaia belangeri:1)Euarchontoglires:1)Euarchontoglires:1,((Sorex araneus:1,Erinaceus europaeus:1)Insectivora:1,(((Myotis lucifugus:1,Pteropus vampyrus:1)Chiroptera:1,((((Mustela putorius furo:1,Ailuropoda melanoleuca:1)Caniformia:1,Canis lupus familiaris:1)Caniformia:1,Felis catus:1)Carnivora:1,Equus caballus:1)Laurasiatheria:1)Laurasiatheria:1,((((Ovis aries:1,Bos taurus:1)Bovidae:1,Tursiops truncatus:1)Cetartiodactyla:1,Vicugna pacos:1)Cetartiodactyla:1,Sus scrofa:1)Cetartiodactyla:1)Laurasiatheria:1)Laurasiatheria:1)Boreoeutheria:1,((Dasypus novemcinctus:1,Choloepus hoffmanni:1)Xenarthra:1,((Loxodonta africana:1,Procavia capensis:1)Afrotheria:1,Echinops telfairi:1)Afrotheria:1)Eutheria:1)Eutheria:1)Theria:1,Ornithorhynchus anatinus:1)Mammalia:1,((((Taeniopygia guttata:1,Ficedula albicollis:1)Passeriformes:1,((Gallus gallus:1,Meleagris gallopavo:1)Phasianidae:1,Anas platyrhynchos:1)Galloanserae:1)Neognathae:1,Pelodiscus sinensis:1)Testudines + Archosauria group:1,Anolis carolinensis:1)Sauria:1)Amniota:1,Xenopus tropicalis:1)Tetrapoda:1,Latimeria chalumnae:1)Sarcopterygii:1,(((Astyanax mexicanus:1,Danio rerio:1)Otophysa:1,((((((Xiphophorus maculatus:1,Poecilia formosa:1)Poeciliinae:1,Oryzias latipes:1)Atherinomorphae:1,Gasterosteus aculeatus:1)Percomorphaceae:1,Oreochromis niloticus:1)Percomorphaceae:1,(Takifugu rubripes:1,Tetraodon nigroviridis:1)Tetraodontidae:1)Percomorphaceae:1,Gadus morhua:1)Acanthomorphata:1)Clupeocephala:1,Lepisosteus oculatus:1)Neopterygii:1)Euteleostomi:1,Petromyzon marinus:1)Vertebrata:1)Chordata:1,(Caenorhabditis elegans:1,Drosophila melanogaster:1)Ecdysozoa:1)Bilateria:1,Saccharomyces cerevisiae:1):0;";

var ncbi_species_tree = "(((((((((((((((Microcebus murinus:0.4,Otolemur garnettii:0.4)Strepsirrhini:0.1,((((((Homo sapiens:0.2,Pan troglodytes:0.2,Gorilla gorilla gorilla:0.3)Homininae:0.1,Pongo abelii:0.3)Hominidae:0.1,Nomascus leucogenys:0.3)Hominoidea:0.1,(Macaca mulatta:0.2,Papio anubis:0.2,Chlorocebus sabaeus:0.2)Cercopithecinae:0.3)Catarrhini:0.1,Callithrix jacchus:0.5)Simiiformes:0.1,Tarsius syrichta:0.4)Haplorrhini:0.1)Primates:0.1,((((Rattus norvegicus:0.2,Mus musculus:0.3)Murinae:0.3,Dipodomys ordii:0.4,Ictidomys tridecemlineatus:0.5)Sciurognathi:0.1,Cavia porcellus:0.4)Rodentia:0.1,(Oryctolagus cuniculus:0.3,Ochotona princeps:0.3)Lagomorpha:0.1)Glires:0.1,Tupaia belangeri:0.4)Euarchontoglires:0.1,((Erinaceus europaeus:0.4,Sorex araneus:0.4)Insectivora:0.1,((Ailuropoda melanoleuca:0.3,Canis lupus familiaris:0.4,Mustela putorius furo:0.5)Caniformia:0.1,Felis catus:0.5)Carnivora:0.1,(Myotis lucifugus:0.4,Pteropus vampyrus:0.5)Chiroptera:0.1,((Ovis aries:0.3,Bos taurus:0.3)Bovidae:0.3,Sus scrofa:0.4,Vicugna pacos:0.4,Tursiops truncatus:0.5)Cetartiodactyla:0.1,Equus caballus:0.5)Laurasiatheria:0.1)Boreoeutheria:0.1,(Dasypus novemcinctus:0.4,Choloepus hoffmanni:0.5)Xenarthra:0.1,(Loxodonta africana:0.4,Procavia capensis:0.4,Echinops telfairi:0.4)Afrotheria:0.1)Eutheria:0.1,(Macropus eugenii:0.4,Sarcophilus harrisii:0.4,Monodelphis domestica:0.5)Marsupialia:0.1)Theria:0.1,Ornithorhynchus anatinus:0.5)Mammalia:0.1,((((Ficedula albicollis:0.3,Taeniopygia guttata:0.5)Passeriformes:0.1,((Meleagris gallopavo:0.3,Gallus gallus:0.3)Phasianidae:0.2,Anas platyrhynchos:0.4)Galloanserae:0.1)Neognathae:0.7,Pelodiscus sinensis:0.6)Testudines + Archosauria group:0.1,Anolis carolinensis:1.1)Sauria:0.2)Amniota:0.1,Xenopus tropicalis:0.9)Tetrapoda:0.2,Latimeria chalumnae:0.5)Sarcopterygii:0.1,(((Danio rerio:0.6,Astyanax mexicanus:0.8)Otophysa:0.3,((((Takifugu rubripes:0.2,Tetraodon nigroviridis:0.2)Tetraodontidae:0.4,Gasterosteus aculeatus:0.6)Eupercaria:0.1,(((Poecilia formosa:0.2,Xiphophorus maculatus:0.2)Poeciliinae:0.4,Oryzias latipes:0.6)Atherinomorphae:0.1,Oreochromis niloticus:0.8)Ovalentaria:0.1)Percomorphaceae:0.2,Gadus morhua:0.8)Acanthomorphata:0.5)Clupeocephala:0.3,Lepisosteus oculatus:0.5)Neopterygii:0.3)Euteleostomi:0.3,Petromyzon marinus:0.6)Vertebrata:0.2,(Ciona intestinalis:0.1,Ciona savignyi:0.1)Ciona:0.6)Chordata:0.2,(Caenorhabditis elegans:0.8,Drosophila melanogaster:2.8)Ecdysozoa:0.2)Bilateria:0.3,Saccharomyces cerevisiae:1):0.1;"


var species_info = {
    'Cercopithecinae' : {
        'name' : undefined,
        'taxon_id' : '9528',
        'ensembl_name' : 'Old World monkeys',
        'timetree' : '11.1'
    },
    'Petromyzon marinus' : {
        'production_name' : 'petromyzon_marinus',
        'name' : 'sea lamprey',
        'taxon_id' : '7757',
        'ensembl_name' : 'Lamprey',
        'timetree' : undefined,
        'assembly' : 'Pmarinus_7.0'
    },
    'Sarcophilus harrisii' : {
        'production_name' : 'sarcophilus_harrisii',
        'name' : 'Tasmanian devil',
        'taxon_id' : '9305',
        'ensembl_name' : 'Tasmanian devil',
        'timetree' : undefined,
        'assembly' : 'DEVIL7.0'
    },
    'Rodentia' : {
        'name' : undefined,
        'taxon_id' : '9989',
        'ensembl_name' : 'Rodents',
        'timetree' : '77.9'
    },
    'Theria' : {
        'name' : undefined,
        'taxon_id' : '32525',
        'ensembl_name' : 'Marsupials and Placental mammals',
        'timetree' : '162.6'
    },
    'Ochotona princeps' : {
        'production_name' : 'ochotona_princeps',
        'name' : 'American pika',
        'taxon_id' : '9978',
        'ensembl_name' : 'Pika',
        'timetree' : undefined,
        'assembly' : 'pika'
    },
    'Ficedula albicollis' : {
        'production_name' : 'ficedula_albicollis',
        'name' : 'collared flycatcher',
        'taxon_id' : '59894',
        'ensembl_name' : 'Flycatcher',
        'timetree' : undefined,
        'assembly' : 'FicAlb_1.4'
    },
    'Simiiformes' : {
        'name' : undefined,
        'taxon_id' : '314293',
        'ensembl_name' : 'Simians',
        'timetree' : '42.6'
    },
    'Astyanax mexicanus' : {
        'production_name' : 'astyanax_mexicanus',
        'name' : 'Mexican tetra',
        'taxon_id' : '7994',
        'ensembl_name' : 'Cave fish',
        'timetree' : undefined,
        'assembly' : 'AstMex102'
    },
    'Vertebrata' : {
        'name' : undefined,
        'taxon_id' : '7742',
        'ensembl_name' : 'Vertebrates',
        'timetree' : '535.7'
    },
    'Bilateria' : {
        'name' : undefined,
        'taxon_id' : '33213',
        'ensembl_name' : 'Bilateral animals',
        'timetree' : '937.5'
    },
    'Testudines + Archosauria group' : {
        'name' : undefined,
        'taxon_id' : '1329799',
        'ensembl_name' : 'Birds and turtles',
        'timetree' : '244.2'
    },
    'Oryctolagus cuniculus' : {
        'production_name' : 'oryctolagus_cuniculus',
        'name' : 'rabbit',
        'taxon_id' : '9986',
        'ensembl_name' : 'Rabbit',
        'timetree' : undefined,
        'assembly' : 'OryCun2.0'
    },
    'Callithrix jacchus' : {
        'production_name' : 'callithrix_jacchus',
        'name' : 'white-tufted-ear marmoset',
        'taxon_id' : '9483',
        'ensembl_name' : 'Marmoset',
        'timetree' : undefined,
        'assembly' : 'C_jacchus3.2.1'
    },
    'Mustela putorius furo' : {
        'production_name' : 'mustela_putorius_furo',
        'name' : undefined,
        'taxon_id' : '9669',
        'ensembl_name' : 'Ferret',
        'timetree' : undefined,
        'assembly' : 'MusPutFur1.0'
    },
    'Microcebus murinus' : {
        'production_name' : 'microcebus_murinus',
        'name' : 'gray mouse lemur',
        'taxon_id' : '30608',
        'ensembl_name' : 'Mouse Lemur',
        'timetree' : undefined,
        'assembly' : 'micMur1'
    },
    'Gallus gallus' : {
        'production_name' : 'gallus_gallus',
        'name' : 'chicken',
        'taxon_id' : '9031',
        'ensembl_name' : 'Chicken',
        'timetree' : undefined,
        'assembly' : 'Galgal4'
    },
    'Ovis aries' : {
        'production_name' : 'ovis_aries',
        'name' : 'sheep',
        'taxon_id' : '9940',
        'ensembl_name' : 'Sheep',
        'timetree' : undefined,
        'assembly' : 'Oar_v3.1'
    },
    'Caenorhabditis elegans' : {
        'production_name' : 'caenorhabditis_elegans',
        'name' : undefined,
        'taxon_id' : '6239',
        'ensembl_name' : 'C.elegans',
        'timetree' : undefined,
        'assembly' : 'WBcel235'
    },
    'Opisthokonta' : {
        'name' : undefined,
        'taxon_id' : '33154',
        'ensembl_name' : 'Animals and Fungi',
        'timetree' : '1215.8'
    },
    'Ecdysozoa' : {
        'name' : undefined,
        'taxon_id' : '1206794',
        'ensembl_name' : 'Arthropods and nematodes',
        'timetree' : '936.5'
    },
    'Macropus eugenii' : {
        'production_name' : 'macropus_eugenii',
        'name' : 'tammar wallaby',
        'taxon_id' : '9315',
        'ensembl_name' : 'Wallaby',
        'timetree' : undefined,
        'assembly' : 'Meug_1.0'
    },
    'Neopterygii' : {
        'name' : undefined,
        'taxon_id' : '41665',
        'ensembl_name' : 'Ray-finned fishes',
        'timetree' : '333.8'
    },
    'Strepsirrhini' : {
        'name' : undefined,
        'taxon_id' : '376911',
        'ensembl_name' : 'Wet nose lemurs',
        'timetree' : '57.9'
    },
    'Amniota' : {
        'name' : undefined,
        'taxon_id' : '32524',
        'ensembl_name' : 'Amniotes',
        'timetree' : '296.0'
    },
    'Ovalentaria' : {
        'name' : undefined,
        'taxon_id' : '1489908',
        'ensembl_name' : 'Teleost fishes',
        'timetree' : '103.8'
    },
    'Canis lupus familiaris' : {
        'production_name' : 'canis_familiaris',
        'name' : undefined,
        'taxon_id' : '9615',
        'ensembl_name' : 'Dog',
        'timetree' : undefined,
        'assembly' : 'CanFam3.1'
    },
    'Murinae' : {
        'name' : undefined,
        'taxon_id' : '39107',
        'ensembl_name' : 'Old World rodents',
        'timetree' : '25.4'
    },
    'Catarrhini' : {
        'name' : undefined,
        'taxon_id' : '9526',
        'ensembl_name' : 'Apes and Old World monkeys',
        'timetree' : '29.0'
    },
    'Lepisosteus oculatus' : {
        'production_name' : 'lepisosteus_oculatus',
        'name' : 'spotted gar',
        'taxon_id' : '7918',
        'ensembl_name' : 'Spotted gar',
        'timetree' : undefined,
        'assembly' : 'LepOcu1'
    },
    'Poecilia formosa' : {
        'production_name' : 'poecilia_formosa',
        'name' : 'Amazon molly',
        'taxon_id' : '48698',
        'ensembl_name' : 'Amazon molly',
        'timetree' : undefined,
        'assembly' : 'PoeFor_5.1.2'
    },
    'Rattus norvegicus' : {
        'production_name' : 'rattus_norvegicus',
        'name' : 'Norway rat',
        'taxon_id' : '10116',
        'ensembl_name' : 'Rat',
        'timetree' : undefined,
        'assembly' : 'Rnor_5.0'
    },
    'Gasterosteus aculeatus' : {
        'production_name' : 'gasterosteus_aculeatus',
        'name' : 'three-spined stickleback',
        'taxon_id' : '69293',
        'ensembl_name' : 'Stickleback',
        'timetree' : undefined,
        'assembly' : 'BROADS1'
    },
    'Carnivora' : {
        'name' : undefined,
        'taxon_id' : '33554',
        'ensembl_name' : 'Carnivores',
        'timetree' : '55.1'
    },
    'Galloanserae' : {
        'name' : undefined,
        'taxon_id' : '1549675',
        'ensembl_name' : undefined,
        'timetree' : undefined
    },
    'Choloepus hoffmanni' : {
        'production_name' : 'choloepus_hoffmanni',
        'name' : 'Hoffmann\'s two-fingered sloth',
        'taxon_id' : '9358',
        'ensembl_name' : 'Sloth',
        'timetree' : undefined,
        'assembly' : 'choHof1'
    },
    'Mus musculus' : {
        'production_name' : 'mus_musculus',
        'name' : 'house mouse',
        'taxon_id' : '10090',
        'ensembl_name' : 'Mouse',
        'timetree' : undefined,
        'assembly' : 'GRCm38'
    },
    'Ictidomys tridecemlineatus' : {
        'production_name' : 'ictidomys_tridecemlineatus',
        'name' : 'thirteen-lined ground squirrel',
        'taxon_id' : '43179',
        'ensembl_name' : 'Squirrel',
        'timetree' : undefined,
        'assembly' : 'spetri2'
    },
    'Gorilla gorilla gorilla' : {
        'production_name' : 'gorilla_gorilla',
        'name' : undefined,
        'taxon_id' : '9595',
        'ensembl_name' : 'Gorilla',
        'timetree' : undefined,
        'assembly' : 'gorGor3.1'
    },
    'Bovidae' : {
        'name' : undefined,
        'taxon_id' : '9895',
        'ensembl_name' : 'Bovids',
        'timetree' : '30.1'
    },
    'Gadus morhua' : {
        'production_name' : 'gadus_morhua',
        'name' : 'Atlantic cod',
        'taxon_id' : '8049',
        'ensembl_name' : 'Cod',
        'timetree' : undefined,
        'assembly' : 'gadMor1'
    },
    'Sarcopterygii' : {
        'name' : undefined,
        'taxon_id' : '8287',
        'ensembl_name' : 'Lobe-finned fish',
        'timetree' : '414.9'
    },
    'Chordata' : {
        'name' : undefined,
        'taxon_id' : '7711',
        'ensembl_name' : 'Chordates',
        'timetree' : '722.5'
    },
    'Xenopus tropicalis' : {
        'production_name' : 'xenopus_tropicalis',
        'name' : 'western clawed frog',
        'taxon_id' : '8364',
        'ensembl_name' : 'X.tropicalis',
        'timetree' : undefined,
        'assembly' : 'JGI_4.2'
    },
    'Acanthomorphata' : {
        'name' : undefined,
        'taxon_id' : '123368',
        'ensembl_name' : 'Teleost fishes',
        'timetree' : '165.0'
    },
    'Marsupialia' : {
        'name' : undefined,
        'taxon_id' : '9263',
        'ensembl_name' : 'Marsupials',
        'timetree' : '86.4'
    },
    'Taeniopygia guttata' : {
        'production_name' : 'taeniopygia_guttata',
        'name' : 'zebra finch',
        'taxon_id' : '59729',
        'ensembl_name' : 'Zebra Finch',
        'timetree' : undefined,
        'assembly' : 'taeGut3.2.4'
    },
    'Felis catus' : {
        'production_name' : 'felis_catus',
        'name' : 'domestic cat',
        'taxon_id' : '9685',
        'ensembl_name' : 'Cat',
        'timetree' : undefined,
        'assembly' : 'Felis_catus_6.2'
    },
    'Tetraodon nigroviridis' : {
        'production_name' : 'tetraodon_nigroviridis',
        'name' : 'spotted green pufferfish',
        'taxon_id' : '99883',
        'ensembl_name' : 'Tetraodon',
        'timetree' : undefined,
        'assembly' : 'TETRAODON8'
    },
    'Ciona savignyi' : {
        'production_name' : 'ciona_savignyi',
        'name' : 'Pacific transparent sea squirt',
        'taxon_id' : '51511',
        'ensembl_name' : 'C.savignyi',
        'timetree' : undefined,
        'assembly' : 'CSAV2.0'
    },
    'Latimeria chalumnae' : {
        'production_name' : 'latimeria_chalumnae',
        'name' : 'coelacanth',
        'taxon_id' : '7897',
        'ensembl_name' : 'Coelacanth',
        'timetree' : undefined,
        'assembly' : 'LatCha1'
    },
    'Procavia capensis' : {
        'production_name' : 'procavia_capensis',
        'name' : 'Cape rock hyrax',
        'taxon_id' : '9813',
        'ensembl_name' : 'Hyrax',
        'timetree' : undefined,
        'assembly' : 'proCap1'
    },
    'Eupercaria' : {
        'name' : undefined,
        'taxon_id' : '1489922',
        'ensembl_name' : 'Teleost fishes',
        'timetree' : '125.0'
    },
    'Loxodonta africana' : {
        'production_name' : 'loxodonta_africana',
        'name' : 'African savanna elephant',
        'taxon_id' : '9785',
        'ensembl_name' : 'Elephant',
        'timetree' : undefined,
        'assembly' : 'loxAfr3'
    },
    'Xiphophorus maculatus' : {
        'production_name' : 'xiphophorus_maculatus',
        'name' : 'southern platyfish',
        'taxon_id' : '8083',
        'ensembl_name' : 'Platyfish',
        'timetree' : undefined,
        'assembly' : 'Xipmac4.4.2'
    },
    'Dipodomys ordii' : {
        'production_name' : 'dipodomys_ordii',
        'name' : 'Ord\'s kangaroo rat',
        'taxon_id' : '10020',
        'ensembl_name' : 'Kangaroo rat',
        'timetree' : undefined,
        'assembly' : 'dipOrd1'
    },
    'Sciurognathi' : {
        'name' : undefined,
        'taxon_id' : '33553',
        'ensembl_name' : 'Squirrels and Old World rodents',
        'timetree' : '78.7'
    },
    'Nomascus leucogenys' : {
        'production_name' : 'nomascus_leucogenys',
        'name' : 'northern white-cheeked gibbon',
        'taxon_id' : '61853',
        'ensembl_name' : 'Gibbon',
        'timetree' : undefined,
        'assembly' : 'Nleu1.0'
    },
    'Equus caballus' : {
        'production_name' : 'equus_caballus',
        'name' : 'horse',
        'taxon_id' : '9796',
        'ensembl_name' : 'Horse',
        'timetree' : undefined,
        'assembly' : 'EquCab2'
    },
    'Boreoeutheria' : {
        'name' : undefined,
        'taxon_id' : '1437010',
        'ensembl_name' : undefined,
        'timetree' : undefined
    },
    'Ciona' : {
        'name' : undefined,
        'taxon_id' : '7718',
        'ensembl_name' : 'Ciona sea squirts',
        'timetree' : '100'
    },
    'Meleagris gallopavo' : {
        'production_name' : 'meleagris_gallopavo',
        'name' : 'turkey',
        'taxon_id' : '9103',
        'ensembl_name' : 'Turkey',
        'timetree' : undefined,
        'assembly' : 'UMD2'
    },
    'Erinaceus europaeus' : {
        'production_name' : 'erinaceus_europaeus',
        'name' : 'western European hedgehog',
        'taxon_id' : '9365',
        'ensembl_name' : 'Hedgehog',
        'timetree' : undefined,
        'assembly' : 'HEDGEHOG'
    },
    'Anas platyrhynchos' : {
        'production_name' : 'anas_platyrhynchos',
        'name' : 'mallard',
        'taxon_id' : '8839',
        'ensembl_name' : 'Duck',
        'timetree' : undefined,
        'assembly' : 'BGI_duck_1.0'
    },
    'Afrotheria' : {
        'name' : undefined,
        'taxon_id' : '311790',
        'ensembl_name' : 'African mammals',
        'timetree' : '81.8'
    },
    'Papio anubis' : {
        'production_name' : 'papio_anubis',
        'name' : 'olive baboon',
        'taxon_id' : '9555',
        'ensembl_name' : 'Olive baboon',
        'timetree' : undefined,
        'assembly' : 'PapAnu2.0'
    },
    'Haplorrhini' : {
        'name' : undefined,
        'taxon_id' : '376913',
        'ensembl_name' : 'Dry-nosed primates',
        'timetree' : '65.2'
    },
    'Mammalia' : {
        'name' : undefined,
        'taxon_id' : '40674',
        'ensembl_name' : 'Mammals',
        'timetree' : '167.4'
    },
    'Sauria' : {
        'name' : undefined,
        'taxon_id' : '32561',
        'ensembl_name' : 'Reptiles and birds',
        'timetree' : '276.0'
    },
    'Otolemur garnettii' : {
        'production_name' : 'otolemur_garnettii',
        'name' : 'small-eared galago',
        'taxon_id' : '30611',
        'ensembl_name' : 'Bushbaby',
        'timetree' : undefined,
        'assembly' : 'OtoGar3'
    },
    'Saccharomyces cerevisiae' : {
        'production_name' : 'saccharomyces_cerevisiae',
        'name' : 'baker\'s yeast',
        'taxon_id' : '4932',
        'ensembl_name' : 'S.cerevisiae',
        'timetree' : undefined,
        'assembly' : 'R64-1-1'
    },
    'Homo sapiens' : {
        'production_name' : 'homo_sapiens',
        'name' : 'human',
        'taxon_id' : '9606',
        'ensembl_name' : 'Human',
        'timetree' : undefined,
        'assembly' : 'GRCh38'
    },
    'Homininae' : {
        'name' : undefined,
        'taxon_id' : '207598',
        'ensembl_name' : 'Hominines',
        'timetree' : '8.8'
    },
    'Tetrapoda' : {
        'name' : undefined,
        'taxon_id' : '32523',
        'ensembl_name' : 'Tetrapods',
        'timetree' : '371.2'
    },
    'Oryzias latipes' : {
        'production_name' : 'oryzias_latipes',
        'name' : 'Japanese medaka',
        'taxon_id' : '8090',
        'ensembl_name' : 'Medaka',
        'timetree' : undefined,
        'assembly' : 'MEDAKA1'
    },
    'Hominidae' : {
        'name' : undefined,
        'taxon_id' : '9604',
        'ensembl_name' : 'Great apes',
        'timetree' : '15.7'
    },
    'Echinops telfairi' : {
        'production_name' : 'echinops_telfairi',
        'name' : 'small Madagascar hedgehog',
        'taxon_id' : '9371',
        'ensembl_name' : 'Tenrec',
        'timetree' : undefined,
        'assembly' : 'TENREC'
    },
    'Ornithorhynchus anatinus' : {
        'production_name' : 'ornithorhynchus_anatinus',
        'name' : 'platypus',
        'taxon_id' : '9258',
        'ensembl_name' : 'Platypus',
        'timetree' : undefined,
        'assembly' : 'OANA5'
    },
    'Cetartiodactyla' : {
        'name' : undefined,
        'taxon_id' : '91561',
        'ensembl_name' : 'Cetaceans and Even-toed ungulates',
        'timetree' : '63.4'
    },
    'Sorex araneus' : {
        'production_name' : 'sorex_araneus',
        'name' : 'European shrew',
        'taxon_id' : '42254',
        'ensembl_name' : 'Shrew',
        'timetree' : undefined,
        'assembly' : 'COMMON_SHREW1'
    },
    'Chiroptera' : {
        'name' : undefined,
        'taxon_id' : '9397',
        'ensembl_name' : 'Bats',
        'timetree' : '60.0'
    },
    'Ailuropoda melanoleuca' : {
        'production_name' : 'ailuropoda_melanoleuca',
        'name' : 'giant panda',
        'taxon_id' : '9646',
        'ensembl_name' : 'Panda',
        'timetree' : undefined,
        'assembly' : 'ailMel1'
    },
    'Passeriformes' : {
        'name' : undefined,
        'taxon_id' : '9126',
        'ensembl_name' : 'Perching birds',
        'timetree' : '39.2'
    },
    'Phasianidae' : {
        'name' : undefined,
        'taxon_id' : '9005',
        'ensembl_name' : 'Turkeys',
        'timetree' : '44.6'
    },
    'Primates' : {
        'name' : undefined,
        'taxon_id' : '9443',
        'ensembl_name' : 'Primates',
        'timetree' : '74.0'
    },
    'Danio rerio' : {
        'production_name' : 'danio_rerio',
        'name' : 'zebrafish',
        'taxon_id' : '7955',
        'ensembl_name' : 'Zebrafish',
        'timetree' : undefined,
        'assembly' : 'Zv9'
    },
    'Laurasiatheria' : {
        'name' : undefined,
        'taxon_id' : '314145',
        'ensembl_name' : 'Laurasiatherian mammals',
        'timetree' : '91.7'
    },
    'Drosophila melanogaster' : {
        'production_name' : 'drosophila_melanogaster',
        'name' : 'fruit fly',
        'taxon_id' : '7227',
        'ensembl_name' : 'Fruitfly',
        'timetree' : undefined,
        'assembly' : 'BDGP5'
    },
    'Tursiops truncatus' : {
        'production_name' : 'tursiops_truncatus',
        'name' : 'bottlenosed dolphin',
        'taxon_id' : '9739',
        'ensembl_name' : 'Dolphin',
        'timetree' : undefined,
        'assembly' : 'turTru1'
    },
    'Eutheria' : {
        'name' : undefined,
        'taxon_id' : '9347',
        'ensembl_name' : 'Placental mammals',
        'timetree' : '104.2'
    },
    'Sus scrofa' : {
        'production_name' : 'sus_scrofa',
        'name' : 'pig',
        'taxon_id' : '9823',
        'ensembl_name' : 'Pig',
        'timetree' : undefined,
        'assembly' : 'Sscrofa10.2'
    },
    'Oreochromis niloticus' : {
        'production_name' : 'oreochromis_niloticus',
        'name' : 'Nile tilapia',
        'taxon_id' : '8128',
        'ensembl_name' : 'Tilapia',
        'timetree' : undefined,
        'assembly' : 'Orenil1.0'
    },
    'Xenarthra' : {
        'name' : undefined,
        'taxon_id' : '9348',
        'ensembl_name' : 'Xenarthran mammals',
        'timetree' : '64.50'
    },
    'Hominoidea' : {
        'name' : undefined,
        'taxon_id' : '314295',
        'ensembl_name' : 'Apes',
        'timetree' : '20.4'
    },
    'Myotis lucifugus' : {
        'production_name' : 'myotis_lucifugus',
        'name' : 'little brown bat',
        'taxon_id' : '59463',
        'ensembl_name' : 'Microbat',
        'timetree' : undefined,
        'assembly' : 'Myoluc2.0'
    },
    'Euteleostomi' : {
        'name' : undefined,
        'taxon_id' : '117571',
        'ensembl_name' : 'Bony vertebrates',
        'timetree' : '400.1'
    },
    'Bos taurus' : {
        'production_name' : 'bos_taurus',
        'name' : 'cattle',
        'taxon_id' : '9913',
        'ensembl_name' : 'Cow',
        'timetree' : undefined,
        'assembly' : 'UMD3.1'
    },
    'Otophysa' : {
        'name' : undefined,
        'taxon_id' : '186626',
        'ensembl_name' : 'Teleost fishes',
        'timetree' : '152.9'
    },
    'Pelodiscus sinensis' : {
        'production_name' : 'pelodiscus_sinensis',
        'name' : 'Chinese soft-shelled turtle',
        'taxon_id' : '13735',
        'ensembl_name' : 'Chinese softshell turtle',
        'timetree' : undefined,
        'assembly' : 'PelSin_1.0'
    },
    'Clupeocephala' : {
        'name' : undefined,
        'taxon_id' : '186625',
        'ensembl_name' : 'Teleost fishes',
        'timetree' : '265.5'
    },
    'Macaca mulatta' : {
        'production_name' : 'macaca_mulatta',
        'name' : 'Rhesus monkey',
        'taxon_id' : '9544',
        'ensembl_name' : 'Macaque',
        'timetree' : undefined,
        'assembly' : 'MMUL_1'
    },
    'Tarsius syrichta' : {
        'production_name' : 'tarsius_syrichta',
        'name' : 'Philippine tarsier',
        'taxon_id' : '9478',
        'ensembl_name' : 'Tarsier',
        'timetree' : undefined,
        'assembly' : 'tarSyr1'
    },
    'Tetraodontidae' : {
        'name' : undefined,
        'taxon_id' : '31031',
        'ensembl_name' : 'Puffers',
        'timetree' : '69.8'
    },
    'Pongo abelii' : {
        'production_name' : 'pongo_abelii',
        'name' : 'Sumatran orangutan',
        'taxon_id' : '9601',
        'ensembl_name' : 'Orangutan',
        'timetree' : undefined,
        'assembly' : 'PPYG2'
    },
    'Anolis carolinensis' : {
        'production_name' : 'anolis_carolinensis',
        'name' : 'green anole',
        'taxon_id' : '28377',
        'ensembl_name' : 'Anole Lizard',
        'timetree' : undefined,
        'assembly' : 'AnoCar2.0'
    },
    'Euarchontoglires' : {
        'name' : undefined,
        'taxon_id' : '314146',
        'ensembl_name' : 'Primates and Rodents',
        'timetree' : '92.3'
    },
    'Insectivora' : {
        'name' : undefined,
        'taxon_id' : '9362',
        'ensembl_name' : 'Insectivore mammals',
        'timetree' : '65.9'
    },
    'Atherinomorphae' : {
        'name' : undefined,
        'taxon_id' : '1489913',
        'ensembl_name' : 'Silverside fishes',
        'timetree' : '120'
    },
    'Percomorphaceae' : {
        'name' : undefined,
        'taxon_id' : '1489872',
        'ensembl_name' : 'Teleost fishes',
        'timetree' : '125.0'
    },
    'Poeciliinae' : {
        'name' : undefined,
        'taxon_id' : '586240',
        'ensembl_name' : 'Live-bearing aquarium fishes',
        'timetree' : undefined
    },
    'Cavia porcellus' : {
        'production_name' : 'cavia_porcellus',
        'name' : 'domestic guinea pig',
        'taxon_id' : '10141',
        'ensembl_name' : 'Guinea Pig',
        'timetree' : undefined,
        'assembly' : 'cavPor3'
    },
    'Vicugna pacos' : {
        'production_name' : 'vicugna_pacos',
        'name' : 'alpaca',
        'taxon_id' : '30538',
        'ensembl_name' : 'Alpaca',
        'timetree' : undefined,
        'assembly' : 'vicPac1'
    },
    'Caniformia' : {
        'name' : undefined,
        'taxon_id' : '379584',
        'ensembl_name' : 'Caniforms',
        'timetree' : '45.0'
    },
    'Pan troglodytes' : {
        'production_name' : 'pan_troglodytes',
        'name' : 'chimpanzee',
        'taxon_id' : '9598',
        'ensembl_name' : 'Chimpanzee',
        'timetree' : undefined,
        'assembly' : 'CHIMP2.1.4'
    },
    'Chlorocebus sabaeus' : {
        'production_name' : 'chlorocebus_sabaeus',
        'name' : 'green monkey',
        'taxon_id' : '60711',
        'ensembl_name' : 'Vervet/AGM',
        'timetree' : undefined,
        'assembly' : 'ChlSab1.1'
    },
    'Monodelphis domestica' : {
        'production_name' : 'monodelphis_domestica',
        'name' : 'gray short-tailed opossum',
        'taxon_id' : '13616',
        'ensembl_name' : 'Opossum',
        'timetree' : undefined,
        'assembly' : 'BROADO5'
    },
    'Tupaia belangeri' : {
        'production_name' : 'tupaia_belangeri',
        'name' : 'northern tree shrew',
        'taxon_id' : '37347',
        'ensembl_name' : 'Tree Shrew',
        'timetree' : undefined,
        'assembly' : 'TREESHREW'
    },
    'Takifugu rubripes' : {
        'production_name' : 'takifugu_rubripes',
        'name' : 'torafugu',
        'taxon_id' : '31033',
        'ensembl_name' : 'Fugu',
        'timetree' : undefined,
        'assembly' : 'FUGU4'
    },
    'Ciona intestinalis' : {
        'production_name' : 'ciona_intestinalis',
        'name' : 'vase tunicate',
        'taxon_id' : '7719',
        'ensembl_name' : 'C.intestinalis',
        'timetree' : undefined,
        'assembly' : 'KH'
    },
    'Dasypus novemcinctus' : {
        'production_name' : 'dasypus_novemcinctus',
        'name' : 'nine-banded armadillo',
        'taxon_id' : '9361',
        'ensembl_name' : 'Armadillo',
        'timetree' : undefined,
        'assembly' : 'Dasnov3.0'
    },
    'Glires' : {
        'name' : undefined,
        'taxon_id' : '314147',
        'ensembl_name' : 'Rodents and Rabbits',
        'timetree' : '86.9'
    },
    'Lagomorpha' : {
        'name' : undefined,
        'taxon_id' : '9975',
        'ensembl_name' : 'Rabbits and Pikas',
        'timetree' : '51.2'
    },
    'Pteropus vampyrus' : {
        'production_name' : 'pteropus_vampyrus',
        'name' : 'large flying fox',
        'taxon_id' : '132908',
        'ensembl_name' : 'Megabat',
        'timetree' : undefined,
        'assembly' : 'pteVam1'
    },
    'Neognathae' : {
        'name' : undefined,
        'taxon_id' : '8825',
        'ensembl_name' : 'Birds',
        'timetree' : '104.2'
    }
};

var tree_vis = tnt.tree();
var mytheme = tnt_theme();
mytheme(tree_vis, yourDiv);
