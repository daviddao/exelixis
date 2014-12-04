// var assert = require("assert")
// describe('Array', function(){
//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     })
//   })
// })

// var assert = require("chai").assert;
// var d3     = require("../lib/d3.min").d3;
// var epeek  = require("../ePeek").epeek;

describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);
 
    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
	assert.notEqual(myEl, null);
        // expect(myEl).to.not.equal(null);
    });
 
    it("is a child of the body", function () {
	assert.equal(myEl.parentElement, document.body);
        // expect(myEl.parentElement).to.equal(document.body);
    });
 
    it("has the right text", function () {
	assert.equal(myEl.innerHTML, "Hi there!", "Correct text");
        // expect(myEl.innerHTML).to.equal("Hi there!");
    });
 
    it("has the right background", function () {
	assert.equal(myEl.style.background, "rgb(204, 204, 204)", "Correct background color");
        // expect(myEl.style.background).to.equal("rgb(204, 204, 204)");
    });
});

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

describe('ePeek', function () {
    // ePeek Genome
    describe('ePeek Genome', function () {
	before (function () {
	    // Creation of the container
	    var container = document.createElement("div");
	    container.id = "genomeBrowser";
	    document.body.appendChild(container);
	})

	var gbrowser = epeek.genome();

	// API

	// General tests
	it('creates a genome browser', function () {
	    gbrowser(document.getElementById('genomeBrowser'));
	});
    })
})

