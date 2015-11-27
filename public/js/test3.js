define(function(require, exports, module) {

  require('jquery');

  /**
   * [template description] template sea.js 调用 方式
   * @type {[type]}
   */
  var template = require('template-native');

  var data = {}
  // console.log(template('test_template',data))
  /**
   * end
   */

   /**
    *
    */
  var m_validate = require('validate');
  console.log(m_validate);
  var validator = new m_validate('example_form', [{
        name: 'req',
        display: 'required',
        rules: 'required'
    }, {
        name: 'alphanumeric',
        rules: 'alpha_numeric'
    }, {
        name: 'password',
        rules: 'required'
    }, {
        name: 'password_confirm',
        display: 'password confirmation',
        rules: 'required|matches[password]'
    }, {
        name: 'email',
        rules: 'valid_email'
    }, {
        name: 'minlength',
        display: 'min length',
        rules: 'min_length[8]'
    }, {
        names: ['fname', 'lname'],
        rules: 'required|alpha'
    }], function(errors) {
        if (errors.length > 0) {
            // Show the errors
        }
    });
  console.log(validator);
});

