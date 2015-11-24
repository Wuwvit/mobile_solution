define("gplistDetails.js",function(require, exports, module) {
  // var testa = require('test1');
  var $ = require('zepto');

  !function($, win) {

    /**
     * [list 参保名单缴费明细交互处理]
     * @return {[type]} [description]
     */
    // var tpl = require('template-native');
    // console.log(tpl);
    var document = win.document;
    var defaults = {
      monthObj  : ".select_month_wrapper",
      listTableObj : ".h_table",
      /**
       * @return {undefined}
       */
      onPullStart : function() {
      },
      /**
       * @return {undefined}
       */
      onMove : function() {
      },
      /**
       * @return {undefined}
       */
      onPullEnd : function() {
      }
    };

    var list = function(options){
      this.opts = $.extend({}, defaults, options);
      this.initEvent();
    }
    list.prototype = {
      initEvent : function(){
          $(this.opts.monthObj).addClass('aaa')
      }
    }
    win.ListDetail = {
      init:function(opts){
        return new list(opts);
      }
    }
    function querysele(obj){
      if ("string" == typeof obj) {
        /** @type {(Element|null)} */
        return document.querySelector(obj);
      }
    }
  }(window.jQuery || window.Zepto, window);
  module.exports = ListDetail;
});


