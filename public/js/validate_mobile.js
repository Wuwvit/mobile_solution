define(function(require, exports, module) {
  require('jquery');
  /*对于jquery插件需要将$变量传入，具体请参考“详细说明”*/
  require('jquery-validate')($);

  $.fn.test = function(){
    var init = function(){
      console.log("success");
    }
  }

});

