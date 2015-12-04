//错误信息本地化
define(function(require,exports,module){
module.exports = function(jQuery) {
$.fn.validateHq = function(settings) {

        var defaults = {
            rules: {},
            messages: {},
            postUrl: null,//当前步骤的验证url
            nextUrl: null,//没有弹框下一步url
            dialog:false,//是否有弹框
            success_tips:false,//是否成功的弹框
            val:null,//当直接有手机号或者邮箱号的值得时候
            recept:null,//弹框输出绑定值 邮箱号或手机号
            emBox:$('#email'),//邮箱box
            errorMsg: $('.error-msg'),//错误信息box
            dBox : $('.success-box'),
            isTemplate:false,//扩展  后期用模板
            showNum:0//需要最后成功显示的条目
        }
        var opts     = $.extend(defaults, settings || {});

        var obj      = $(this);
        var errorMsg = opts.errorMsg;
        var rules    = opts.rules;
        var messages = opts.messages;
        var postUrl  = opts.postUrl;
        var nextUrl  = opts.nextUrl;
        var val      = opts.val;
        var emBox    =opts.emBox;

        var dBox     =opts.dBox;
        var isTemplate = opts.isTemplate;
        var serializeArr = [];//存储序列化数据的数组值
        var init = function() {
            obj.validate({

                debug: true,
                errorLabelContainer: '.error-msg',
                errorClass: "error",
                focusCleanup: true,
                onfocusout: false,
                onkeyup: false,
                focusInvalid: false,
                ignore: 'input[type="button"]',
                rules: rules,
                messages: messages,
                invalidHandler: function(form, validator) {
                    $.each(validator.errorList, function(key, value) {
                        errorMsg.show().text(value.message);
                        $(value.element).focus();
                        return false;
                    });
                },
                success: function(element) {
                    errorMsg.text("").hide();
                },
                showErrors: function(errorMap, errorList) {

                },
                submitHandler: function(form, validator) {
                    errorMsg.text("").hide();
                    var data = obj.serialize();
                    serializeArr = obj.serializeArray();
                    $.ajax({
                        url: postUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function(data) {

                            if (data.status) {
                                triggerSuccessEvent(data)
                            } else {
                                if(data.msg){
                                    errorMsg.text(data.msg).show();
                                }else{
                                    errorMsg.text(data[0]).show();
                                }

                            }
                        },
                        error: function(data) {
                        }
                    })
                }
            });

        }
        var triggerSuccessEvent = function(data){
            if(nextUrl){
                layer.msg(data.msg);
                window.location.href = nextUrl;
            }else if(opts.dialog){
                openDialog();
            }
        }
        var openDialog = function(){
            if(opts.success_tips){
                writeSuccessInfo();
            }
        }
        //给成功弹框赋值 暂时不用
        var writeSuccessInfo = function(){
            if(isTemplate){
                // 身份名字
                // 身份证
                dataT = formateDateTemplate();
                var data = {
                    info:dataT
                }
                var html = template('success-box-dialog',data);
                dBox.empty().html(html);
                // $('#bind_real_name').html(serializeArr[0].value)
                // $('#bind_id').html(serializeArr[1].value)
            }else{
                opts.recept.empty().text(val?val:emBox.val())
            }
            layer.open({
                    type:1,
                    title   : "",
                    skin    : 'layer-ext-moon',
                    area    : ['400px','305px'],
                    btn     : false,
                    content : dBox
                })
        }
        // 需要获取的序列化数据的个数 根据表单提交的值来判断
        // 用户认证 大陆认证 需要成功显示的数据
        var formateDateTemplate = function(){
            if(opts.showNum){
                var data = serializeArr.slice(0,opts.showNum);//除掉一些不需要显示的条目
                var info = {
                        name:data[0].value,
                        id :data[1].value
                    }
                return info;
            }

        }
        var ensureEvent = function(){

        }
        init();
};
}
})