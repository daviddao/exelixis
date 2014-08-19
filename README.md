BioJS Tree Viewer
---------------------

BioJS Phylogenetic Tree Viewer is influenced and based on [d3](https://github.com/mbostock/d3) and [TnT](https://github.com/emepyc/tnt). It offers you a diverse variety of functions to easily visualize and process phylogenetic trees for your website. Furthermore, we provide also themes using the BioJS tree library to create beautiful and reusable applications with minimal coding.

### Include BioJS Tree Viewer into your website

Installing the tree-viewer component is very easy.

Include this link inside your html

```javascript
<script src="http://daviddao.de/biojs-vis-tree.min.js"></script>
```

or download the latest version directly from our github repository:

```sh
git clone https://github.com/biojs/biojs-vis-tree.git
cd biojs-vis-tree
npm install
npm run build-browser
```

Basics
--------

For later convenience we will save the `biojs.vis.tree` namespace in a var `treelib`.

```javascript
var treelib = biojs.vis.tree;
```

### Tree object

It is very easy to build a tree object using the tree viewer:

```javascript
var tree = treelib.tree(); 
```

The tree object offers you following design possibilities:

- `data(json-data)`      - includes the JSON data which will be represented as tree
- `layout(tree-layout)`    - takes as input parameter a tree layout object
- `duration(number)`  - sets the duration of each animation
- `label(label-object)` - access the label property of the tree 
- `node_color(color)` - sets the color of the nodes (Default: steelblue)
- `update()` - updates the tree visualization 

and following accesses:

- `root()` - returns the root node object;
- `data()` - returns JSON data

and following events:

- `on_click(event-handler)` - set event-handler in case of a mouse click event
- `on_dbl_click(event-handler)` - set event-handler in case of a double mouse click

for example:

```javascript
tree
    .duration(500)
    .on_click(function(node) {
        node.toggle();
        tree.update();
    })
```

### Tree layouts

For visualizing the tree we provide two layout objects which can be given to the layout function as parameter:

```javascript
var vertical_layout = treelib.tree.layout.vertical();
var radial_layout = treelib.tree.layout.radial();
```

The layout object offers you following functionalities:

- `width(number)` - sets the width of the tree layout
- `scale(boolean)` - scales the tree according to the branch lengths

Set the parameters of the layout object first before giving it as parameter to the tree, for example:

```javascript
vertical_layout
            .width(500)
            .scale(false);
```

As you have already noticed, biojs tree viewer allows you to chain methods like in d3 instead of writing:

```javascript
vertical_layout.width(500);
vertical_layout.scale(false);
```

### Tree label 
The label method allows you to access and change the properties of the node labels


- `height(number)` - sets the height of the label
- `fontsize(number)` - sets the fontsize for each node

Furthermore we have a label object:

```javascript
var textobject = treelib.tree.label.text();
```

The label object allows you to customize your text

```javascript
tree
    .label(textobject.text(function(node) {return node.data().name))
        .height(20);
        .fontsize(13);
```



To finally include your visualization into your html element, give the tree object a div parameter:

```javascript
<div id="tree"></div>
<script>
...
var div = document.getElementByID("tree");
tree(div)
</script>
```


Themes
--------
Themes are visualizations using ~biojs-vis-tree~, which can be easily included inside your website.
In the following we provided a list of examples which can be reused for many purposes.

Including a theme can be done in the following way:

```javascript
<div id="tree"></div>

<script>
var treelib = biojs.vis.tree; 
var tree = treelib.tree(); 
var theme = your_theme();
theme(tree,document.getElementById("tree"));
</script>
```




* * * * *

Thanks for following this tutorial, we hope you have enjoyed it. If you want to know more about BioJS 2.0, you can go to our [registry](http://www.ebi.ac.uk/Tools/biojs/registry/), or visit our [GitHub repository](https://github.com/biojs/biojs2), or participate in our [mailing list](https://groups.google.com/forum/#!forum/biojs).

This tutorial has been done by [David Dao](http://daviddao.de/). 
