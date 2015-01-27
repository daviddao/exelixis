var tnt_utils = require("../src/index.js");
var assert = require("chai").assert;

describe ("tnt utils", function () {

    describe ("tnt.utils.reduce", function () {
    	it ("exists and is a method", function () {
    	    assert.isDefined(tnt_utils.reduce);
    	    assert.isFunction(tnt_utils.reduce);
    	});
    
    	it ("returns a callback", function () {
    	    assert.isDefined(tnt_utils.reduce());
    	    assert.isFunction(tnt_utils.reduce());
    	});

    	it ("has a 'reducer' method", function () {
    	    var reduce = tnt_utils.reduce();
    	    assert.isDefined(reduce.reducer);
    	    assert.isFunction(reduce.reducer);
    	});

    	it ("has a 'redundant' method", function () {
    	    var reduce = tnt_utils.reduce();
    	    assert.isDefined(reduce.redundant);
    	    assert.isFunction(reduce.redundant);
    	});

    	it ("has a 'value' method", function () {
    	    var reduce = tnt_utils.reduce();
    	    assert.isDefined(reduce.value);
    	    assert.isFunction(reduce.value);
    	});

    	it ("has a 'smooth' method", function () {
    	    var reduce = tnt_utils.reduce();
    	    assert.isDefined(reduce.smooth);
    	    assert.isFunction(reduce.smooth);
    	});

    });

    describe ("tnt_utils.reduce.line", function () {
    	it ("exists and is a method", function () {
    	    assert.isDefined(tnt_utils.reduce.line);
    	    assert.isFunction(tnt_utils.reduce.line);
    	});

    	it ("returns a callback", function () {
    	    assert.isDefined(tnt_utils.reduce.line());
    	    assert.isFunction(tnt_utils.reduce.line());
    	});

    	it ("has utils.reduce methods", function () {
    	    var reduce = tnt_utils.reduce.line();
    	    assert.isDefined(reduce.redundant);
    	    assert.isFunction(reduce.redundant);

    	    assert.isDefined(reduce.value);
    	    assert.isFunction(reduce.value);

    	    assert.isDefined(reduce.smooth);
    	    assert.isFunction(reduce.smooth);
    	});

    	it ("doesn't filter when smooth=0 and redundant=false", function () {
    	    var data = [{ pos:1,
    			  val:1
    			},
    			{ pos:2,
    			  val:1
    			},
    			{ pos:3,
    			  val:1
    			}
    		       ];

    	    var r = tnt_utils.reduce.line()
    		.smooth(0)
    		.redundant (function () {
    		    return false;
    		});

    	    var reduced = r(data);

    	    assert.isDefined (reduced);
    	    assert.isArray (reduced);

    	    for (var i=0; i<data.length; i++) {
    	    	assert.equal (reduced[i], data[i]);
    	    }
    	});

    	it ("filters based on redundant", function () {
    	    var data = [{ pos:1,
    			  val:1
    			},
    			{ pos:2,
    			  val:1
    			},
    			{ pos:3,
    			  val:1
    			}
    		       ];

    	    var r = tnt_utils.reduce.line()
    		.smooth(1);

    	    var reduced = r(data);

    	    assert.isDefined (reduced);
    	    assert.isArray (reduced);
    	    assert.strictEqual (reduced.length, 2); // First and last data points
    	});

    	it ("smooths", function () {
    	    var data = [ { pos : 1,
    			   val : 5
    			 },
    			 { pos : 2,
    			   val : 3
    			 },
    			 { pos : 3,
    			   val : 4
    			 },
    			 { pos : 4,
    			   val : 7
    			 },
    			 { pos : 5,
    			   val : 6
    			 },
    			 { pos : 6,
    			   val : 5
    			 },
    			 { pos : 7,
    			   val : 1
    			 }
    		       ];
    	    var r = tnt_utils.reduce.line()
    		.smooth (3)
    		.redundant (function () { return false; });

    	    var smoothed = r(data);
    	    assert.strictEqual (smoothed.length, data.length);

    	    assert.strictEqual (smoothed[0].val, 4.5);
    	    assert.strictEqual (smoothed[1].val, 5);
    	    assert.strictEqual (smoothed[2].val, 5);
    	    assert.strictEqual (smoothed[3].val, 5);
    	    assert.strictEqual (smoothed[4].val, 4.5);
    	    assert.strictEqual (smoothed[5].val, 5);
    	    assert.strictEqual (smoothed[6].val, 5.5);

	});
    });

    var red = tnt_utils.reduce.line();
    describe ("API", function () {

    	describe ('smooth', function () {
    	    it ("Has a 'smooth' method", function () {
    		assert.isFunction (red.smooth);
    	    });

    	    it ("Has 5 by default", function () {
    		assert.strictEqual (red.smooth(), 5);
    	    });

    	    it ("Is also a setter", function () {
    		assert.doesNotThrow (function () {
    		    red.smooth(1);
    		});
    		assert.strictEqual (red.smooth(), 1);
    	    });

    	});

    	    describe ('value', function () {
    		it ("Has a 'value' method", function () {
    		    assert.isFunction (red.value);
    		});
		
    		it ("Has 'val' key as default", function () {
    		    assert.strictEqual (red.value(), 'val');
    		});

    		it ("Is also a setter", function () {
    		    assert.doesNotThrow (function () {
    			red.value('start');
    		    });
    		    assert.strictEqual (red.value(), 'start');
    		});
		
    	    });

    	    describe ('redundant', function () {
    		it ("Has a 'redundant' method", function () {
    		    assert.isFunction (red.redundant);
    		});

    		it ("By default returns true on similar (<20%) values", function () {
    		    var f = red.redundant();
    		    assert.isTrue (f(10,10));
    		    assert.isTrue (f(10,9));
    		    assert.isTrue (f(9,10));
    		    assert.isTrue (f(10,8));
    		    assert.isTrue (f(8,10));
    		    assert.isFalse (f(10,7));
    		    assert.isFalse (f(7,10));
    		});

    		it ("Is also a setter", function () {
    		    assert.doesNotThrow (function () {
    			red.redundant (function (a, b) {
    			    if (a < b) {
    				return ((b-a) <= (b * 0.5));
    			    }
    			    return ((a-b) <= (a * 0.5));
    			});
    		    });

    		    var f = red.redundant();
    		    assert.isTrue (f(10,8));
    		    assert.isTrue (f(10,5));
    		    assert.isTrue (f(5,10));
    		    assert.isFalse (f(10,4));
    		    assert.isFalse (f(4,10));
    		});
	    
	    });
	    
    }); // describe API end

    describe ("tnt utils iterator", function () {
    	it ("exists and is a method", function () {
    	    assert.isDefined(tnt_utils.iterator);
    	    assert.isFunction(tnt_utils.iterator);
    	});

    	it ("returns a callback", function () {
    	    assert.isDefined(tnt_utils.iterator());
    	    assert.isFunction(tnt_utils.iterator());
    	});

    	var i = tnt_utils.iterator();
    	it ("starts with 0 by default", function () {
    	    assert.strictEqual(i(), 0);
    	});

    	it ("creates new values", function () {
    	    assert.strictEqual(i(), 1);
    	});

    	it ("can start from custom values", function () {
    	    var j = tnt_utils.iterator(100);
    	    assert.strictEqual(j(), 100);
    	});
    });

    describe ("tnt utils script_path", function () {
    	it ("Exists and is a method", function () {
    	    assert.isDefined(tnt_utils.script_path);
    	    assert.isFunction(tnt_utils.script_path);
    	});

    // 	// TODO: skipping because needs phantom.js or a similar head-less webkit to work (needs 'document');
    // 	it.skip ("Finds the absolute path to a script", function () {
    // 	    var path = tnt_utils.script_path("tnt.js");
    // 	    assert.isDefined(path);
    // 	    assert.notEqual(path, "");
    // 	});
    });
});
