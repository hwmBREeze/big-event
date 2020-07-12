// ---------------------切换登录/注册盒子----------------------------
$('#goto-login').click(function() {
    $('#login').show().next().hide();
});

$('#goto-register').click(function() {
    $('#login').hide().next().show();
});

// ---------------------完成注册功能---------------------------------
//整体思路：把账号密码提交给接口
$('#register form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: 'http://www.liulongbin.top:3007/api/reguser',
        data: data,
        success: function(res) {
            //无论成功失败都提示
            layer.msg(res.message);
            //如果注册成功，显示登录的盒子，隐藏注册的盒子
            if (res.status === 0) {
                $('#login').show().next().hide();
            }
        }
    })
});


// --------------注册的表单验证功能------------------------
//需要验证的有两个：密码长度必须是6～12位；两次密码必须一致

//使用layui提供的form模块之前，必须先引入模块
var form = layui.form;
// 调用下面的方法，自定义验证规则
form.verify({
    //键（验证规则）:值（验证方法,可以使用数组，可以使用函数）
    // abc: ['正则表达式的验证规则', '验证不通过时的提示信息']
    // len: [/^\S{6,12}$/, 'sorry,密码长度不对']

    len: function(val) {
        var reg = /^\S{6,12}$/; //\S匹配非空白字符
        //形参val表示使用此验证规则的输入框的值，简单来说就是我们填写的值
        //案例中密码框使用了这个验证规则，形参val表示我们输入的密码
        if (!reg.test(val)) {
            return '密码长度不行，请改正';
        }
    },

    same: function(val) {
        //这个验证规则，重复密码使用，所以val表示重复密码
        //获取密码
        var pwd = $('input[name=password]').val();
        if (pwd !== val) {
            return '两次密码不一致';
        }
    }
});