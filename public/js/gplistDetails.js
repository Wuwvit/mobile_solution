define("gplistDetails.js",['template-native.js'] ,function(require, exports, module) {
  !function($, win) {
    /**
     * [list 参保名单缴费明细交互处理]
     * @return {[type]} [description]
     */
    var document = win.document;
    var defaults = {
      monthObj  : "select_month_wrapper",
      listTableObj : "h_table",
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
      options.monthObj = querysele(options.monthObj);
      options.listTableObj = querysele(options.listTableObj);
      this.options = $.extend({}, defaults, options);
      this.initEvent();
    }
    list.prototype = {
      initEvent : function(){
        // console.log(666);
        options.monthObj.empty();
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