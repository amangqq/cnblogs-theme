
$('body').addClass('body_bg');
var app = new Vue({
    el:'#cpc',
    data:{
        homeUrl     : '',   //url
        header      : {},   //头部
        mainContent : {},   //列表
        sideBar     : {},   // 侧边栏
        footer      : {},
        hide        : false
    },
    created(){
        let _this = this;
        let currentBlogApp = 'amang';

        //请求侧边栏
        loadBlogSideColumn();
        function loadBlogSideColumn() {
            $("#blog-sidecolumn").length && $.ajax({
                url: "/" + currentBlogApp + "/mvc/blog/sidecolumn.aspx",
                data: {
                    blogApp: currentBlogApp
                },
                type: "get",
                dataType: "text",
                success: function (n) {
                    $("#blog-sidecolumn").html(n);
                    loadBlogSideBlocks();
                }
            })
        }

        function loadBlogSideBlocks() {
            var n = [];
            document.getElementById("RecentCommentsBlock") && n.push("ShowRecentComment");
            document.getElementById("TopViewPostsBlock") && n.push("ShowTopViewPosts");
            document.getElementById("TopFeedbackPostsBlock") && n.push("ShowTopFeedbackPosts");
            document.getElementById("TopDiggPostsBlock") && n.push("ShowTopDiggPosts");
            $.ajax({
                url: "/mvc/Blog/GetBlogSideBlocks.aspx",
                data: {
                    blogApp: currentBlogApp,
                    showFlag: n.join(",")
                },
                type: "get",
                dataType: "json",
                success: function (n) {
                    n && (n.RecentComments ? $("#RecentCommentsBlock").html(n.RecentComments) : $("#recent_comments_wrap").hide(), n.TopViewPosts ? $("#TopViewPostsBlock").html(n.TopViewPosts) : $("#topview_posts_wrap").hide(), n.TopFeedbackPosts ? $("#TopFeedbackPostsBlock").html(n.TopFeedbackPosts) : $("#topfeedback_posts_wrap").hide(), n.TopDiggPosts ? $("#TopDiggPostsBlock").html(n.TopDiggPosts) : $("#topdigg_posts_wrap").hide())
                    _set();
                }
            })
        }

        function _set(){

            let home = $('#home');
            let header = home.children('#header'); //头部
            let mainContent = home.find('#mainContent'); //列表
            let sideBar = home.find('#sideBar'); // 侧边栏
            let footer = home.find('#footer'); // 底部


            // home url
            _this.homeUrl = header.find('#lnkBlogLogo').attr('href');

            // 头部
            _this.nav = header.find('#navList li a');
            _this.nav.navText = [];
            _this.nav.navUrl = [];
            $.each(_this.nav,function(i,n){
                _this.nav.navText.push($(this).html());
                _this.nav.navUrl.push($(this).attr('href'));
            });
            _this.header = {
                name    :   header.find('#Header1_HeaderTitle').html(),
                ssss    :   header.find('#blogTitle h2').html(),
                url     :   header.find('#Header1_HeaderTitle').attr('href'),
                navText :   _this.nav.navText,
                navUrl  :   _this.nav.navUrl
            };

            // 主体列表
            _this.mainContent          = mainContent.find('.day .postTitle a');
            _this.mainContent.name     = [];
            _this.mainContent.url      = [];
            _this.mainContent.abstract = [];
            _this.mainContent.data     = [];
            _this.mainContent.info     = [];
            _this.mainContent.author   = [];
            _this.mainContent.read     = [];
            _this.mainContent.comment  = [];

            $.each(_this.mainContent,function(i){
                _this.mainContent.name.push($(this).html());
                _this.mainContent.url.push($(this).attr('href'));
                var str1 = mainContent.find('.postCon .c_b_p_desc').eq(i).text();
                str1 = str1.replace('阅读全文','');
                _this.mainContent.abstract.push(str1);

                var str2 = mainContent.find('.day .postDesc').eq(i).text();
                str2 = str2.split(' ');
                _this.mainContent.info.push(str2);
                _this.mainContent.data.push(_this.mainContent.info[i][2]);
                _this.mainContent.author.push(_this.mainContent.info[i][4]);
                _this.mainContent.read.push(_this.mainContent.info[i][5]);
                _this.mainContent.comment.push(_this.mainContent.info[i][6]);
            });
            _this.mainContent = {
                name    :   _this.mainContent.name, //标题名称
                url     :   _this.mainContent.url, //网址
                data    :   _this.mainContent.data, //日期
                abstract:   _this.mainContent.abstract, //摘要
                author  :   _this.mainContent.author, //作者
                read    :   _this.mainContent.read, //阅读
                comment :   _this.mainContent.comment,  //评论
                info    :   _this.mainContent.info
            };


            // 主体侧边
            _this.sideBar = {};

            //随笔分类
            //sideGet('#sidebar_postcategory ul li a','classify','classifyText','classifyUrl');
            _this.sideBar.classify = sideBar.find('#sidebar_postcategory ul li a');
            _this.sideBar.classifyText = [];
            _this.sideBar.classifyUrl = [];
            $.each(_this.sideBar.classify,function(i){
                _this.sideBar.classifyText.push(_this.sideBar.classify.eq(i).text());
                _this.sideBar.classifyUrl.push(_this.sideBar.classify.eq(i).attr('href'));
            });

            //阅读排行
            _this.sideBar.readTop = sideBar.find('#TopViewPostsBlock ul li a');
            _this.sideBar.readTopText = [];
            _this.sideBar.readTopUrl  = [];
            $.each(_this.sideBar.classify,function(i){
                _this.sideBar.readTopText.push(_this.sideBar.readTop.eq(i).text());
                _this.sideBar.readTopUrl.push(_this.sideBar.readTop.eq(i).attr('href'));
            });

            //sideGet('#TopViewPostsBlock ul li a','readTop','objText','objUrl');
            function sideGet(_label,_obj,objText,objUrl){
                _this.sideBar._obj = sideBar.find(_label);
                _this.sideBar.objText = [];
                _this.sideBar.objUrl  = [];
                $.each(_this.sideBar.classify,function(i){
                    _this.sideBar.objText.push(_this.sideBar._obj.eq(i).text());
                    _this.sideBar.objUrl.push(_this.sideBar._obj.eq(i).attr('href'));
                });
            }

            _this.sideBar = {
                classifyText   :  _this.sideBar.classifyText,   //随笔分类内容
                classifyUrl    :  _this.sideBar.classifyUrl,    //随笔分类链接
                readTopText    :  _this.sideBar.readTopText,    //阅读排行榜内容
                readTopUrl     :  _this.sideBar.readTopUrl      //阅读排行榜链接
            };
        }



    }

});

