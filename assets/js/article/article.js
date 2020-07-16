// ----------ajax获取文章列表，渲染到页面中---------------
function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: {
            pagenum: 1, //页码值
            pagesize: 5, //每页显示多少条数据
            // cate_id:
            // state:
        },
        success: function(res) {
            // console.log(res); //和分类不一样，自己只能看到自己发布的文章
            //把结果渲染到页面中
            var html = template('tpl-article', res);
            $('tbody').html(html);
        }
    })
};
renderArticle();

// -----------------分页---------------------------
// 第一部分：实现简单的效果（把分页页码实现）
//第二部分：和数据结合到一起
function renderPage() {

}
renderPage();