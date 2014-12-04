var tnt_theme_slider = function () {

    var theme = function (div) {

	var slider = tnt.utils.slider();

	var viz = d3.select (div)
	    .append("svg")
	    .attr("width", 500)
	    .attr("height", 200)
	    .append("g")
	    .call(slider);
    };

    return theme;
};
