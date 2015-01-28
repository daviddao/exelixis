var exe = require("exelixis");

var createTree = exe.createTree;
var tree = createTree({el: yourDiv, width: 1000});

var updateTree = exe.updateTree;

//crazy randomnizer
function randomLayout() {
var opts = {};
opts.width = Math.random() * 1000;
opts.height = Math.random() * 20;
opts.layout = "vertical";
opts.scale = true;

if(Math.random() > 0.5) {
	opts.layout = "radial";
}

if(Math.random() > 0.5) {
	opts.scale = false;
}

opts.data = "(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;"
if(Math.random() > 0.5) {
	opts.data = "(homo_sapiens:1,(mus_musculus:2,danio_rerio:17):4);";
}
if(Math.random() > 0.5) {
	opts.data = "(homo_sapiens:1,(mus_musculus:2,(danio_rerio:13,(pan_troglodytes:9,taeniopygia_guttata:10,callithrix_jacchus:1):12):4);";
}

updateTree(tree,opts);
setTimeout(randomLayout, 3000);
}

function start() {
	randomLayout();
}

setTimeout(start, 3000);
start();
