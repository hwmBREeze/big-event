// ---------重置密码的表单验证----------------
//需要验证的有：
//1.三个密码框都需要验证密码长度
//2.原密码和新密码不能相同
//3.新密码和确认新密码必须相同
var form = layui.form;
//自定义验证规则
form.verify({
    //规则名称：验证方法(数组或者函数)

    //1.三个密码框都需要验证密码长度
    len: [/^\S{6,12}$/, '密码长度必须是6～12位，且不能出现空格'], //需要注意{6,12}不是{6, 12}

    //2.原密码和新密码不能相同
    //新密码使用这个验证规则，形参val表示输入的新密码
    diff: function(val) {
        //获取原密码(自己给原密码加一个类oldpwd)
        var oldpwd = $('.oldpwd').val();
        if (oldpwd === val) {
            return '新密码不能和原密码相同';
        }
    },
    //3.新密码和确认新密码必须相同
    //确认新密码使用这个验证规则，形参val表示输入的确认新密码
    same: function(val) {
        //获取新密码（自己给新密码加一个类newpwd）
        var newpwd = $('.newpwd').val();
        if (newpwd !== val) {
            return '两次新密码不一致';
        }
    }
});

// ----------------按照接口要求完成重置密码----------------
//监听表单的提交事件
$('form').on('submit', function(e) {
    //阻止表单的默认行为
    e.preventDefault();
    //serialize是根据表单的name属性值获取值的，所以一定要检查name属性值
    var data = $(this).serialize();
    $.post('/my/updatepwd', data, function(res) {
        //无论修改成功还是失败，都给出提示
        layer.msg(res.message);
        if (res.status === 0) {
            //修改成功，清空输入框的值
            $('form')[0].reset(); //DOM方法reset表示重置表单

        }
    });
})