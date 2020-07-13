$.ajaxPrefilter(function(options) {
    //更改url
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    //统一配置complete
    //表示ajax请求结束之后（无论成功还是失败），都会执行complete函数
    options.complete = function(xhr) {
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                //说明经过服务器的验证，你使用了一个假的token或者过期的token
                //删除假token
                localStorage.removeItem('token');
                //跳转到登录页面
                location.href = '/login.html';
            }
        }
        //统一配置headers
    options.headers = {
        'Authorization': localStorage.getItem('token'),
    }
});