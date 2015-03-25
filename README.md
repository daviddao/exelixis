# exelixis

[![NPM version](http://img.shields.io/npm/v/exelixis.svg)](https://www.npmjs.org/package/exelixis)  

> Interactive and easy-to-use phylogenetic tree viewer for the web build on [TnT.tree](https://github.com/emepyc/tnt.tree). 

## Getting Started
Install the module with: `npm install exelixis` and build it with `npm run prepublish`
Have a look at the examples by starting the server with `npm run sniper`

```javascript
var exe = require('exelixis');
var createTree = exe.createTree;
var updateTree = exe.updateTree;
```

## Documentation


### Default opts 
Following default settings can be customized. 

```javascript
var opts = {
		el : document.getElementById("yourDiv"),
		tree : {
			data : "(homo_sapiens:12,(mus_musculus:12,(danio_rerio:13,(pan_troglodytes:9,(taeniopygia_guttata:10,callithrix_jacchus:11):12):12):10);",	
			width : 500,
			scale : false,
			layoutInput : "vertical",
		},
		label : {
			fontsize : 12,
			usePics : false, 
			pics : {
				//pictureSource : pics,
				pictureWidth : 30,
				pictureHeight : 40,
			},
		},
		nodes : {
			toggle : false, 
			select: false, 
			size : 5,
			fill : "grey",
			stroke : "black",
			selectedFill : "steelblue",
			selectedSize : 4,
		},
};
```

#### el 
Change this to the div element you want to plot in your tree

#### tree
* `data` (string) takes as input your newick string
* `width` (int) is the width of your tree
* `height` (int) is the height of your labels (currently under work)
* `scale` (boolean) scales the tree according to its branch lengths given in the newick string
* `layoutInput` ("vertical" or "radial") changes tree layout

#### label
* `fontsize` (int) sets the fontsize
* `usePics` (boolean) use pictures in the label

#### pics
* `pictureSource` (array) links to the png picture array you want to display. PicturesID has to be the same as the taxa names in the newick string.
* `pictureWidth` (int) sets the width of the picture
* `pictureHeight` (int) sets the picture height

#### nodes
* `toggle` (boolean) clicking nodes will toggle its subtree
* `select` (boolean) change node to color `selectedFill` and size `selectedSize` when clicked
* `fill` (color) nodefill color
* `stroke` (color) nodestroke color



#### .createTree(opts)

**Parameter**: `opts` a json containing settings

The 'createTree' method returns a phylogenetic tree.

How to use this method

```javascript
var tree = createTree();
```

not using any opts creates a tree with default opts

#### .updateTree(tree,opts)

**Parameter**: `tree` a tree object returned by `createTree()` , `opts` a json containing settings

The 'updateTree' method updates all opts properties which are given in `opts` with animations on runtime and saves its opts.
All opts properties which are not mentioned stays the same as previously.

How to use this method

```javascript
updateTree(tree, {tree:{data: "(Ape,(Bear,(Clown,Dolphin)))", width: 300, heigth: 20}});
```

## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/daviddao/exelixisjs/issues).

## License 
This software is licensed under the Apache 2 license, quoted below.

Copyright (c) 2015, David

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
