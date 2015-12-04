define(function(require, exports, module) {

  require('jquery');
  console.log($)
  /*对于jquery插件需要将$变量传入，具体请参考“详细说明”*/
  require('jquery-validate')($);

  console.log(require('jquery-validate'));
  console.log($('form').validate());
  var m_validate = require('validate');

  console.log(m_validate);
  // var validator = new    ('certification_form', [
  // {
  //     name: 'name',
  //       display: '姓名',
  //       rules: 'required'
  //   },
  //   {
  //     name: 'card_no',
  //     display: '身份证号码',
  //     rules: 'required'
  //   },
  //   ], function(errors,evt) {
  //     console.log(errors);
  //     console.log(evt);
  //       if (errors.length > 0) {
  //           var SELECTOR_ERRORS = $('.error-msg'),
  //               SELECTOR_SUCCESS = $('.success_box');

  //           if (errors.length > 0) {
  //               SELECTOR_ERRORS.empty();

  //               for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
  //                   SELECTOR_ERRORS.append(errors[i].message + '<br />');
  //               }
  //           } else {
  //               SELECTOR_ERRORS.empty();
  //           }

  //           if (evt && evt.preventDefault) {
  //               evt.preventDefault();
  //           } else if (event) {
  //               event.returnValue = false;
  //           }
  //       }
  //   });
  // validator.setMessage('required',"请输入%s");
});

