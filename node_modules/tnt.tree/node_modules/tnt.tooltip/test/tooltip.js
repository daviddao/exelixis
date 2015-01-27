var tooltip = require("../index.js");
var assert = require("chai").assert;

describe ('Tooltip', function () {
    it ('Exists', function () {
	assert.isDefined(tooltip);
	assert.isFunction(tooltip);
    });

    describe ('Table tooltips', function () {
	it ('Exists', function () {
	    assert.isDefined(tooltip.table);
	    assert.isFunction(tooltip.table);
	});

	// describe ("API", function () {

	//     var table_tooltip = tooltip.table();
	//     describe ("position", function () {
	// 	it ("Exists", function () {
	// 	    assert.isDefined(table_tooltip.position);
	// 	    assert.isFunction(table_tooltip.position);
	// 	});
	//     });
	// });

    });

    describe ('Plain tooltips', function () {
	it ('Exists', function () {
	    assert.isDefined(tooltip.plain);
	    assert.isFunction(tooltip.plain);
	});
    });
});

