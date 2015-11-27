define(function(require, exports, module) {
  function testA(){
    var _self = this;
    this.init();
  }
  testA.prototype = {
  	init :function(){
	  		require('validate.js');
	    	// var validator = new FormValidator('example_form');
	    	console.log(FormValidator)
  	}
  }
  exports.testA = testA;
});