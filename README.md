# Exelixis.js

[![NPM version](http://img.shields.io/npm/v/exelixisjs.svg)](https://www.npmjs.org/package/exelixis)  

> A quick and dirty phylogeny creator for the web build on [TnT.tree](https://github.com/emepyc/tnt.tree). More coming soon!

## Getting Started
Install the module with: `npm install exelixis` and build it with `npm run prepublish`

```javascript
var exe = require('exelixis');
var createTree = exe.createTree;
var updateTree = exe.updateTree;
```

## Documentation

#### .createTree(opts)

**Parameter**: `opts` a json containing settings

The 'createTree' method returns a phylogenetic tree.

How to use this method

```javascript
var tree = createTree({data: "(A,(B,(C,D)))", width: 500});
```

### Default opts 
Following default settings, which can be edited

```javascript
{
	data : "(homo_sapiens:1,(mus_musculus:2,(danio_rerio:13,(pan_troglodytes:9,taeniopygia_guttata:10,callithrix_jacchus:1):12):4);",
	width : 500, //width of the component
	height : 12, //height of the labels
	scale : false, //scaled branchlengths
	el : document.getElementById("yourDiv"), //div the tree is put in
	layout_input : "vertical", //vertical or radial layout
}
```



#### .updateTree(tree,opts)

**Parameter**: `tree` a tree object returned by `createTree()` , `opts` a json containing settings

The 'updateTree' method updates the opts properties with animations

How to use this method

```javascript
updateTree(tree, {data: "(Ape,(Bear,(Clown,Dolphin)))", width: 300, heigth: 20});
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
