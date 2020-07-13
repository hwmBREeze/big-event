// ----------------获取用户的信息，把信息渲染到页面中-----------
//封装成函数，目的就是后面会多次调用
function getUserInfo() {
    $.ajax({
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        success: function(res) {
            // console.log(res);
            //设置欢迎语
            //有昵称，优先使用昵称，没有昵称，则使用账号
            var name = res.data.nickname || res.data.username;
            //注意html()和text()的区别  html可以识别标签
            $('.username').html('&nbsp;&nbsp;' + name);
            //设置头像
            //有图片类型的头像，那么就使用图片；没有图片，使用name的第一个字符
            if (res.data.user_pic) {
                //说明有图片
                $('.layui-nav-img').attr('src', res.data.user_pic).show();
                $('.text-avatar'), hide();
            } else {
                //说明没有图片
                var firstWord = name.substr(0, 1).toUpperCase(); //截取对中文也有效;中文转大写不会报错
                // 这里不能用show(),还原成原来样式 这里还原成display:inline
                // $('.text-avatar').text(firstWord).show();
                $('.text-avatar').text(firstWord).css('display', 'inline-block');
                $('.layui-nav-img').hide();

            }
        },
        headers: {
            'Authorization': localStorage.getItem('token'),
        }
    });
};
getUserInfo();


// ----------------完成退出功能-----------------------
//确定退出，1.删除token  2.跳转到login.html页面
$('#logout').click(function() {
    layer.confirm('确定退出吗？', { icon: 3, title: '提示' }, function(index) {
        localStorage.removeItem('token');
        location.href = '/login.html';
        //关闭窗口,这里可以不写，因为都跳转了
        // layer.close(index);
    });
});