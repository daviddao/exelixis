describe ("tnt.utils", function () {
    it ("Exists", function () {
	assert.isDefined(tnt.utils);
	assert.isObject(tnt.utils);
    });

    describe ("tnt.utils.reduce", function () {
	it ("Exists and is a method", function () {
	    assert.isDefined(tnt.utils.reduce);
	    assert.isFunction(tnt.utils.reduce);
	});

	it ("Returns a callback", function () {
	    assert.isDefined(tnt.utils.reduce());
	    assert.isFunction(tnt.utils.reduce());
	});

	it ("Has a 'reducer' method", function () {
	    var reduce = tnt.utils.reduce();
	    assert.isDefined(reduce.reducer);
	    assert.isFunction(reduce.reducer);
	});

	it ("Has a 'redundant' method", function () {
	    var reduce = tnt.utils.reduce();
	    assert.isDefined(reduce.redundant);
	    assert.isFunction(reduce.redundant);
	});

	it ("Has a 'value' method", function () {
	    var reduce = tnt.utils.reduce();
	    assert.isDefined(reduce.value);
	    assert.isFunction(reduce.value);
	});

	it ("Has a 'smooth' method", function () {
	    var reduce = tnt.utils.reduce();
	    assert.isDefined(reduce.smooth);
	    assert.isFunction(reduce.smooth);
	});

    });

    describe ("tnt.utils.reduce.line", function () {
	it ("Exists and is a method", function () {
	    assert.isDefined(tnt.utils.reduce.line);
	    assert.isFunction(tnt.utils.reduce.line);
	});

	it ("Returns a callback", function () {
	    assert.isDefined(tnt.utils.reduce.line());
	    assert.isDefined(tnt.utils.reduce.line());
	});

	it ("Has utils.reduce methods", function () {
	    var reduce = tnt.utils.reduce.line();
	    assert.isDefined(reduce.redundant);
	    assert.isFunction(reduce.redundant);

	    assert.isDefined(reduce.value);
	    assert.isFunction(reduce.value);

	    assert.isDefined(reduce.smooth);
	    assert.isFunction(reduce.smooth);
	});

	it ("Doesn't filter when smooth=0 and redundant=false", function () {
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

	    var r = tnt.utils.reduce.line()
		.smooth(0)
		.redundant (function () {
		    return false
		});

	    var reduced = r(data);

	    assert.isDefined (reduced);
	    assert.isArray (reduced);

	    for (var i=0; i<data.length; i++) {
	    	assert.equal (reduced[i], data[i]);
	    }
	});

	it ("Filters based on redundant", function () {
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

	    var r = tnt.utils.reduce.line()
		.smooth(1);

	    var reduced = r(data);

	    assert.isDefined (reduced);
	    assert.isArray (reduced);
	    assert.strictEqual (reduced.length, 2); // First and last data points
	});

	it ("Smooths", function () {
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
	    var r = tnt.utils.reduce.line()
		.smooth (3)
		.redundant (function () {return false});

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

	var red = tnt.utils.reduce.line();
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
				return ((b-a) <= (b * .5));
			    }
			    return ((a-b) <= (a * .5));
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

    });

    describe ("tnt.utils.iterator", function () {
	it ("Exists and is a method", function () {
	    assert.isDefined(tnt.utils.iterator);
	    assert.isFunction(tnt.utils.iterator);
	});

	it ("Returns a callback", function () {
	    assert.isDefined(tnt.utils.iterator());
	    assert.isFunction(tnt.utils.iterator());
	});

	var i = tnt.utils.iterator();
	it ("Starts with 0 by default", function () {
	    assert.strictEqual(i(), 0);
	});

	it ("Creates new values", function () {
	    assert.strictEqual(i(), 1);
	});

	it ("Can start from custom values", function () {
	    var j = tnt.utils.iterator(100);
	    assert.strictEqual(j(), 100);
	});
    });

    describe ("tnt.utils.script_path", function () {
	it ("Exists and is a method", function () {
	    assert.isDefined(tnt.utils.script_path);
	    assert.isFunction(tnt.utils.script_path);
	});

	it ("Finds the absolute path to a script", function () {
	    var path = tnt.utils.script_path("tnt.js");
	    assert.isDefined(path);
	    assert.notEqual(path, "");
	});
    });

    describe ("tnt.utils.api", function () {
	it ("Exists and is a method", function () {
	    assert.isDefined(tnt.utils.api);
	    assert.isFunction(tnt.utils.api);
	});

	// Namespace to attach getters/setters
	var namespace = {};
	var api = tnt.utils.api(namespace);

	describe ("Getter/Setter", function () {
	    var props = {
	    	prop1 : 1,
	    	prop2 : "two",
	    	prop3 : function () {return 3}
	    };

	    it("Stores default values", function () {
		api.getset('property1', 5);
		assert.strictEqual(namespace.property1(), 5);
	    });

	    it ("Sets properties in batches", function () {
	    	api.getset(props);
	    	assert.isDefined(namespace.prop1);
	    	assert.strictEqual(namespace.prop1(), 1);
	    	assert.strictEqual(namespace.prop2(), "two");
	    	assert.isFunction(namespace.prop3());
	    });

	    it ("Allows api properties to be accessed from the properties object", function () {
	    	assert.strictEqual(namespace.prop1(), props.prop1);
	    	namespace.prop1(2);
	    	assert.strictEqual(namespace.prop1(), 2);
	    	assert.strictEqual(namespace.prop1(), props.prop1);
	    });

	    it ("Allows api properties to be changed from the properties object", function () {
		assert.strictEqual(namespace.prop1(), props.prop1);
		props.prop1 = 2000;
		assert.strictEqual(namespace.prop1(), 2000);
		assert.strictEqual(namespace.prop1(), props.prop1);
	    });

	    it ("Masks properties with new ones", function () {
		var props = {
		    prop1 : 2
		};
		api.getset(props);
		assert.strictEqual(namespace.prop1(), 2);
		props.prop1 = 1000;
		api.getset(props);
		assert.strictEqual(namespace.prop1(), 1000);
	    });

	});

	describe ("Getter", function () {
	    it ("Stores default values", function () {
	    	api.get('ro_property1', "a given value");
	    	assert.strictEqual(namespace.ro_property1(), "a given value");
	    });

	    it ("Complains on setting", function () {
		assert.throws(function () {
		    namespace.ro_property1("another value")
		}, /^Method defined only as a getter/);
	    });
	});

	describe ("Setter", function () {
	    it ("Stores default values", function () {
	    	api.set('wo_property1', "a hidden value");
	    });

	    it ("Complains on getting", function () {
		assert.throws(function () {
		    namespace.wo_property1()
		}, /^Method defined only as a setter/);
	    });

	    it ("Allows to get the values from the object", function () {
	    	wo_methods = {
	    	    my_property : 5
	    	};
		api.set(wo_methods);
	    	namespace.my_property("changed");
	    	assert.strictEqual(wo_methods.my_property, "changed");
	    });
	});

	describe ("Check", function () {
	    it ("Stores and run checks by method name", function () {
		api.check('prop1', function (val) { return val > 0 });

		assert.doesNotThrow (function () {
		    namespace.prop1(10);
		});

		assert.throws (function () {
		    namespace.prop1(-1);
		}, /doesn't seem to be valid for this method/);

		assert.strictEqual(namespace.prop1(), 10);
	    });

	    it ("Stores and run checks by method", function () {
		api.check(namespace.prop1, function (val) { return val < 100});

		assert.doesNotThrow (function () {
		    namespace.prop1(20);
		});

		assert.throws (function () {
		    namespace.prop1(200);
		}, /doesn't seem to be valid for this method/);

		assert.strictEqual(namespace.prop1(), 20);
	    });

	    it ("Works with chai's assert", function () {
		api.check(namespace.prop2, function (val) { assert.isNumber (val) });
		assert.throws (function () {
		    namespace.prop2("not a number");
		}, /expected 'not a number' to be a number/);
	    });

	    it ("Accepts an optional argument with the error message", function () {
		api.check(namespace.prop3,
			  function (val) { return typeof (val) === 'function' },
			  'Argument should be a function');

		assert.throws (function () {
		    namespace.prop3("not a function");
		}, 'Argument should be a function');
		
	    });

	    it ("Can be attached via the method interface", function () {
		api.getset("kk", 1);
		namespace.kk.check(function (val) {return val > 0});
		assert.strictEqual(namespace.kk(), 1);
		assert.throws(function () {
		    namespace.kk(-1);
		}, /doesn't seem to be valid for this method/);
	    });

	    it ("Allows chainable checks via the method interface", function () {
		api.getset('another_method', 200);
		namespace.another_method
		    .check (function (val) {
			return val > 0;
		    })
		    .check (function (val) {
			return val < 1000;
		    });

		assert.throws (function () {
		    namespace.another_method(-1);
		}, /doesn't seem to be valid for this method/);

		assert.throws (function () {
		    namespace.another_method(1001);
		}, /doesn't seem to be valid for this method/);
	    });

	    it ("Registers checks on multiple methods at the same time", function () {
		api.getset({
		    one : 1,
		    two : 2,
		    three : 3
		});
		api.check(['one', 'two', 'three'], function (x) {return x>0});
		assert.throws (function () {
		    namespace.one(-1);
		}, /doesn't seem to be valid for this method/);

		assert.throws (function () {
		    namespace.two(-1);
		}, /doesn't seem to be valid for this method/);

		assert.doesNotThrow (function () {
		    namespace.one(10);
		});
		assert.strictEqual(namespace.one(), 10);
	    });

	});

	describe ("Transform", function () {

	    it ("Stores and run transforms by method name", function () {
		api.getset('another_prop', 1);
		api.check('another_prop', function (val) { return val < 10 });
		assert.throws (function () {
		    namespace.another_prop(20);
		}, /doesn't seem to be valid for this method/);
		api.transform('another_prop', function (val) { return val % 10 });
		assert.doesNotThrow (function () {
		    namespace.another_prop(20);
		});
	    });

	    it ("Stores and run transforms by method", function () {
		api.getset('another_prop2', 1);
		api.check('another_prop2', function (val) { return val < 10 });
		assert.throws (function () {
		    namespace.another_prop2(20);
		}, /doesn't seem to be valid for this method/);
		api.transform(namespace.another_prop2, function (val) { return val % 10 });
		assert.doesNotThrow (function () {
		    namespace.another_prop2(20);
		});
	    });

	    it ("Can be attached via the method interface", function () {
		namespace.kk.transform (function (val) {return Math.abs(val)});
		assert.strictEqual (namespace.kk(), 1);
		assert.doesNotThrow (function () {
		    namespace.kk(-10);
		});
		assert.strictEqual(namespace.kk(), 10);
	    });

	    it ("Allows chainable transforms via the method interface", function () {
		api.getset('another_method2', 200);
		namespace.another_method2
		    .transform (function (val) {
			return Math.abs(val);;
		    })
		    .check (function (val) {
			return val > 0;;
		    });

		assert.doesNotThrow (function () {
		    namespace.another_method2(-1);
		});
	    });

	    it ("Registers transforms on multiple methods at the same time", function () {
		api.transform(['one', 'two', 'three'], function (x) {return Math.abs(x)});

		assert.doesNotThrow (function () {
		    namespace.one(-10);
		});
 		assert.strictEqual(namespace.one(), 10);

		assert.doesNotThrow (function () {
		    namespace.two(-20);
		});
		assert.strictEqual(namespace.two(), 20);
	    });

	});

	describe ("Method", function () {
	    it ("Stores and retrieves api methods (not getters / setters)", function () {
		var method1 = function () {
		    return 1;
		};
		api.method('method1', method1);
		assert.strictEqual(namespace.method1(), 1);
	    });

	    it ("Stores and retrieves api methods in batches", function () {
		var method2 = function () {
		    return 2
		};
		var method3 = function () {
		    return 3;
		};
		var methods = {
		    method2 : method2,
		    method3 : method3
		};

		api.method(methods);
		assert.strictEqual(namespace.method2(), 2);
		assert.strictEqual(namespace.method3(), 3);
	    });
	});

    });

});
