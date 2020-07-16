var form = layui.form;
// ----------ajax获取分类，渲染到下拉框的位置----------
$.ajax({
    url: '/my/article/cates',
    success: function(res) {
        var html = template('tpl-category', res);
        $('select[name=cate_id]').html(html);

        //更新渲染
        form.render('select');
    }
});


// --------------使用富文本编辑器----------------
initEditor(); //这个函数在tinymce_setup.js里面



// ------------实现初始的剪裁效果---------------
// 1. 初始化图片裁剪器
var $image = $('#image');

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
};

// 3. 初始化裁剪区域
$image.cropper(options);

//----------点击按钮，能够选择图片-----------------
//加一个隐藏的  文件域
//点击按钮，触发文件域的单击事件
$('button:contains("选择封面")').click(function() {
    $('#file').click();
});

// ----------图片改变了，更换剪裁区的图片------------
$('#file').change(function() {
    //1.生成url
    var fileObj = this.files[0];
    var url = URL.createObjectURL(fileObj);

    //更换剪裁区的图片
    $('#image').cropper('destroy').attr('src', url).cropper(options);
});

// --------------------处理按钮----------------------------
var s = '';
$('button:contains("发布")').click(function() {
    s = '已发布';
});
$('button:contains("存为草稿")').click(function() {
    s = '草稿';
});

// -----------------表单提交，完成添加-------------------
$('form').on('submit', function(e) {
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
    canvas.toBlob(function(blob) {
        //形参blob就是转换后的结果
        data.append('cover_img', blob); //把canvas图片转成二进制的形式

        //遍历data，检查data里面有哪些数据
        // data.forEach(function(value, key) {
        //     console.log(key, value);
        // });
        // return;

        //ajax提交给接口，从而完成添加
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: data,
            //提交FormData数据，必须加下面两项
            processData: false,
            contentType: false,

            success: function(res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    //如果添加成功，跳转到文章列表页面
                    location.href = '/article/article.html';
                }
            }
        })
    });
});