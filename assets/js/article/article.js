var laypage = layui.laypage; //加载laypage模块
var form = layui.form; //加载表单模块

//设置全局变量
var data = {
    pagenum: 1, //页码值
    pagesize: 2, //每页显示多少条数据
    // cate_id:
    // state:
}

// ----------ajax获取文章列表，渲染到页面中---------------
function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function(res) {
            console.log(res); //和分类不一样，自己只能看到自己发布的文章
            //把结果渲染到页面中
            var html = template('tpl-article', res);
            $('tbody').html(html);
            //res.total===>数据总条数
            renderPage(res.total);
        }
    });

};
renderArticle();

// ----------------------------分页------------------------------
// 第一部分：实现简单的效果（把分页页码实现）
//第二部分：和数据结合到一起
function renderPage(t) {
    //执行一个laypage实例
    laypage.render({
        elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
        count: t, //数据总数，从服务端得到
        limit: data.pagesize, //，每页显示多少条
        curr: data.pagenum, //当前页，默认应该是1比较合适
        //groups:5,//连续出现的页码个数
        // prev: '<<',//自定义上一页
        limits: [2, 3, 5, 7],
        layout: ['limit', 'prev', 'page', 'next', 'skip', 'count'], //skip快捷跳页区域
        jump: function(obj, first) {
                // console.log(first); //laypage.render首次调用时first=true，切换页码时first=undefined
                // console.log(obj);
                if (first === undefined) {
                    //修改ajax请求参数
                    data.pagenum = obj.curr;
                    data.pagesize = obj.limit;
                    //重新渲染页面
                    renderArticle();
                }

            } //jump,它是切换分页时的回调函数，切换页码时，会触发这个函数,刷新页面也会触发这个函数

    });
}
// renderPage();


// --------------获取所有分类--------------------------
$.ajax({
    url: '/my/article/cates',
    success: function(res) {
        console.log(res);
        var html = template('tpl-category', res);
        $('#category').html(html);
        //更新渲染
        form.render('select');
    }
});

// ---------完成筛选--------------------------
//搜索区的表单提交了，阻止默认行为；获取分类的cate_Id和状态，改变ajax请求参数，调用renderArticle()重新渲染页面
$('#search').on('submit', function(e) {
    e.preventDefault();
    var cate_id = $('#category').val();
    var state = $('#state').val();

    // console.log(cata_id, state);

    //改变请求参数
    data.cate_id = cate_id;
    data.state = state;

    //重置pagenum为1 
    data.pagenum = 1;

    //根据设置好的请求参数，重新渲染文章列表
    renderArticle();
});


// ----------定义过滤器函数，处理时间------------------------
template.defaults.imports.formatDate = function(val) {
    //形参指原本要处理的值
    var d = new Date(val);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = d.getDate();
    day = day < 10 ? '0' + day : day;
    var h = d.getHours();
    h = h < 10 ? '0' + h : h;
    var m = d.getMinutes();
    m = m < 10 ? '0' + m : m;
    var s = d.getSeconds();
    s = s < 10 ? '0' + s : s;

    return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
}

// -------------------完成文章的删除功能--------------------
// 找到删除按钮，注册单击事件，询问是否要删除，ajax发送请求，完成删除
$('body').on('click', '.delete', function() {

    // 在询问之前，先获取id
    var id = $(this).attr('data-id');

    layer.confirm('确定删除吗？你好狠！', { icon: 2, title: '提示' }, function(index) {
        // do something
        $.ajax({
            url: '/my/article/delete/' + id, // 新型的传参方式，只需要把接口中的:id换成实际的数字即可
            // url: '/my/article/deletecate/1' // 删除id为1的分类
            // url: '/my/article/deletecate/3' // 删除id为3的分类
            success: function(res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 删除成功，重新渲染
                    renderArticle();
                }
            }
        });

        layer.close(index);
    });
});

// ------------点击编辑，跳转到修改文章页面-------------