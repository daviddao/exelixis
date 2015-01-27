var tnt_theme = function () {
    scale = false;
    var theme = function (t, div) {
	t
	    .layout (tnt.tree.layout.vertical()
		     .width(250)
		     .scale(scale)
		    )
	    .label (tnt.tree.label.text()
		    .height(15)
		   );
	t(div);
    };

    // scale method
    theme.scale = function (v) {
	if (!arguments.length) {
	    return scale;
	}
	switch (v) {
	case "false" :
	    scale = false;
	    break;
	case "true" :
	    scale = true;
	    break;
	}
	return theme;
    };
    
    return theme;
};
