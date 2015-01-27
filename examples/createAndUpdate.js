var exe = require("exelixis");

var createTree = exe.createTree;
var yourDiv = document.getElementById("yourDiv");
tree = createTree({el: yourDiv, width: 1000});

updateTree = exe.updateTree;


/* Try out following things in your console */
//i.e. updateTree(tree,{height:20,width:600});
//updateTree(tree,{layout: "radial"})
//updateTree(tree,{data: "(A,(B,(C,D)));"})

