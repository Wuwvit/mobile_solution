define(function(require, exports, module) {
  require('zepto');

  var test = function(){
    this.testa = "a";
    this.form = $('#form');
    this.isValidate = false;
  }
  test.prototype = {
    init: function(){
      _self = this;
      form = this.form;
      _isValidate = this.isValidate
      _self.submit();
    },
    moduleA:function(){
      alert(_self.testa)
    },
    submit:function(){
      form.on('submit', function(event) {
        _isValidate = _self.validate();
        if(_isValidate){
          alert("验证成功！")
        }else {
          alert("验证失败！");
          event.preventDefault();
        }
      });
    },
    validate : function(){
      return true;
    },
    regex: function(str,type){
      var regexEnum = {
        chinese:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",
        idcard:"^[1-9]([0-9]{14}|[0-9]{17})$" //身份证
      }
      regex=regexEnum[type];
      is = (new RegExp(regex,'i')).test(str);
      if(!is){
        return false;
      }
      return true;
    }
  }
  function regex(){

  }
  exports.test = test;
  exports.url = "www.baidu.com";
});

