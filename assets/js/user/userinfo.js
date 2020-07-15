// ----------- 为表单赋值（数据回填）------------
//页面刷新，马上发送ajax请求，获取用户的信息，完成数据回填
var form = layui.form;

function renderUser() {
    $.ajax({
        url: '/my/userinfo',
        success: function(res) {
            if (res.status === 0) {
                //获取用户信息成功，下面为表单赋值
                // form.val('表单的lay-filter属性值', res.data);
                //只要保证input的name属性值===对象的键，就可以完成表单赋值
                form.val('user', res.data);
            }
        }
    });
};
renderUser();

// ----------完成更新用户的基本信息-------------
//监听表单的提交事件
$('form').on('submit', function(e) {
    e.preventDefault();
    //收集表单各项数据
    var data = $(this).serialize(); //包括nickname,email,id
    // console.log(data); //data里面没有username，因为username是disabled

    $.ajax({
        type: 'POST',
        url: '/my/userinfo',
        data: data,
        success: function(res) {
            //无论成功失败，都给出提示
            layer.msg(res.message);
            if (res.status === 0) {
                //修改成功，马上更新index.html的欢迎语
                //调用index.html页面的getUserInfo()即可
                //window表示当前窗口，parent父亲的意思，组合到一起，表示调用父页面的函数
                //因为当前userinfo页面是在iframe里面的，是index页面中的一个子页面，所以你要调用index.js中的方法，要用window.parent
                window.parent.getUserInfo();
                renderUser();
            }
        }
    })
});

// ------------重置表单-----------------------
$('button:contains("重置")').click(function(e) {
    e.preventDefault();
    renderUser(); //调用renderUser(),为表单重新赋值，就可以恢复成原样
})