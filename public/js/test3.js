define(function(require, exports, module) {

  require('jquery');
  /**
   * [template description] template sea.js 调用 方式
   * @type {[type]}
   */
  var template = require('template-native');

  var data = {}
  console.log(template('test_template',data))
  /**
   * end
   */
});