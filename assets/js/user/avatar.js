// 1.---------------初始化剪裁插件-----------------
//实现基础的剪裁效果，需要用到剪裁插件
//1）找到剪裁区的图片
var $image = $('#image');
//2）设置剪裁插件的配置项
var options = {
    // 纵横比(宽高比)
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview' //类选择器
};
//3）调用剪裁插件，实现初始剪裁效果
$image.cropper(options);


//2.-----------点击上传，能够选择图片-----------------
//所有的html标签中，只有文件域可以选择图片的
//所以在页面中，加一个隐藏的文件域(隐藏是为了页面效果好看点)
//点击上传的时候，触发文件域的单击事件
$('button:contains("上传")').click(function() {
    $('#file').click();
});


// 3.--------当文件域的内容改变的时候，更换剪裁区的图片-----------
$('#file').change(function() {

    //需要得到选择的图片的url（新知识点）
    //1）需要文件对象
    // console.dir(this);
    // 下标0选择的是第一张图片，因为你可能选择多张图片
    var fileObj = this.files[0];

    //2）为文件对象创建一个url（使用JS内置对象的方法，为文件对象创建一个用于访问它的临时的url）
    var url = URL.createObjectURL(fileObj);
    // console.log(url);

    //插件要求：要更换剪裁区的图片，需要先销毁剪裁区
    //cropper是插件的方法
    $image.cropper('destroy');
    $image.attr('src', url);
    $image.cropper(options);
});

// 4.------------点击确定，剪裁图片，转成base64格式，ajax提交----------
$('button:contains("确定")').click(function() {
    //使用插件提供的方法，实现剪裁.剪裁得到一张canvas图片，宽高都是100
    var canvas = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
    });

    //把canvas图片转成base64格式
    var image_base64 = canvas.toDataURL('image/png');
    // console.log(image_base64);

    //ajax请求接口，完成更换
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: image_base64
        },
        success: function(res) {
            //无论成功失败，都给出提示
            layer.msg(res.message);
            if (res.status === 0) {
                //如果头像更换成功，重新渲染父页面
                window.parent.getUserInfo();
            }
        }

    });
});