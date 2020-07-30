var form = layui.form;

//获取地址栏的id
//方案一，截取字符串 仅限于地址栏只有id
// var id = location.search.substr(4);
//方案二  也不是很好
// var id = location.search.replace(/\D/g, '');
//方案三  新语法   推荐使用  参数必须为地址栏的参数部分
var id = new URLSearchParams(location.search).get('id');


// ----------ajax获取分类，渲染到下拉框的位置----------
//存在异步操作，所以这里嵌套了
$.ajax({
    url: '/my/article/cates',
    success: function (res) {
        var html = template('tpl-category', res);
        $('select[name=cate_id]').html(html);

        //更新渲染
        form.render('select');

        //保证分类数据渲染完毕，然后再获取一篇文章详情，做数据回填
        //发送ajax请求，获取一篇文章的详情，数据回填
        $.ajax({
            url: '/my/article/' + id,
            success: function (res) {
                console.log(res);
                //使用layui的form模块中的val方法，快速为表单赋值
                // form.val('表单的lay-filter属性的值', { 对象形式的数据 });
                form.val('editArticle', res.data);

                // --------------使用富文本编辑器----------------
                initEditor(); //这个函数在tinymce_setup.js里面

                //---------------------回填图片-----------------------
                //步骤和更换图片的步骤一样（销毁剪裁区，更换图片，重建剪裁区）
                $image.cropper('destroy').attr('src', 'http://localhost:3006/' + res.data.cover_img).cropper(options);
            }
        });
    }
});


// ------------实现初始的剪裁效果---------------
// 1. 初始化图片裁剪器
var $image = $('#image');

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
    autoCropArea: 1//让剪裁区的九宫格占满图片，不设置的话如果你修改其他内容，不改图片，图片会在原来的基础上缩小
};

// 3. 初始化裁剪区域
$image.cropper(options);

//----------点击按钮，能够选择图片-----------------
//加一个隐藏的  文件域
//点击按钮，触发文件域的单击事件
$('button:contains("选择封面")').click(function () {
    $('#file').click();
});

// ----------图片改变了，更换剪裁区的图片------------
$('#file').change(function () {
    //1.生成url
    var fileObj = this.files[0];
    var url = URL.createObjectURL(fileObj);

    //更换剪裁区的图片
    $('#image').cropper('destroy').attr('src', url).cropper(options);
});

// --------------------处理按钮----------------------------
var s = '';
$('button:contains("发布")').click(function () {
    s = '已发布';
});
$('button:contains("存为草稿")').click(function () {
    s = '草稿';
});

// -----------------表单提交，完成修改-------------------
$('form').on('submit', function (e) {
    e.preventDefault();
    //收集表单各项的值 FormData根据表单name属性值获取数据
    //jq====>$(this)
    // DOM===>this
    // dom--->jq   $(dom)
    //jq----->dom  $(dom)[0]
    // var data = new FormData($(this)[0]);
    var data = new FormData(this); //this本身就是DOM对象，必须传入DOM对象
    //到此，data中，只有title cate_id是正常的
    //data里面缺少state，所以追加一个
    data.append('state', s);

    //不关心原来是否能够获取到内容，直接使用富文本编辑器内置方法获取值
    data.set('content', tinyMCE.activeEditor.getContent());

    //剪裁图片
    var canvas = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
    });

    // canvas.toDataURL(); //把canvas图片转成base64格式的字符串
    canvas.toBlob(function (blob) {
        //形参blob就是转换后的结果
        data.append('cover_img', blob); //把canvas图片转成二进制的形式

        //遍历data，检查data里面有哪些数据
        // data.forEach(function(value, key) {
        //     console.log(key, value);
        // });
        // return;

        //ajax提交给接口，从而完成修改
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: data,
            //提交FormData数据，必须加下面两项
            processData: false,
            contentType: false,

            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    //如果添加成功，跳转到文章列表页面
                    location.href = '/article/article.html';
                }
            }
        })
    });
});