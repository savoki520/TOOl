

// var shopId = "shopId",activityId = "e9925fbc76954feabff322ef9fcd3934";
// var shopId,activityId;
// var userId = sessionStorage.getItem('userId');
var href = "http://www.youguangchina.cn/";
var number;//优惠券的剩余数量
var overyear,overmounth,overday;//活动的结束时间
var zudui;
var appid = "wx04d29c82e1d4eb0f";
//urlSearch()方法用来将hrefjson化。
function urlSearch() {
    var str=location.href; //取得整个地址栏
    var num=str.split('?');
    // var af = str.split('#');
    var arr;
    var data={};
    var name;
    $.each(num,function (ind,val) {
        if(ind>0){
            if(val.split('&').length>1){
                for(var i=0;i<val.split('&').length;i++){
                    arr=val.split('&')[i].split('=');
                    name=arr[0];
                    data[name]=arr[1];
                }
            }
            else if(val.split('!').length>1){
                for(var j = val.split('&').length;j<val.split('#').length+val.split('&').length;j++){
                    arr = val.split('#')[j].split('=');
                    name=arr[0];
                    data[name]=arr[1];
                }
            }
            else {
                arr=val.split('=');
                var name=arr[0];
                data[name]=arr[1];
            }
        }
    });

    return data;
}
window.onload = function () {
    var height = $(window).height();//获取可视区域宽度
    var bodyheight = $(document.body).height();
    var href = window.location.href;
    var appid = "wx04d29c82e1d4eb0f";
    var getRequest = urlSearch();
    if(bodyheight<height){//body高度小于屏幕的高度。
        $(".content_four").css({'position':'absolute','bottom':'0'});
    }
    var sear = new RegExp('code');
    var code;
    //苹果：判断链接是否带有ui,以此判断苹果手机第二次刷新界面时是否需要微信授权
    if(getRequest.ui===1||getRequest.ui==='1'){//无需授权，ios直接刷新数据
        //判断是否组队状态
        var ds = {shopId:localStorage.getItem('shopId'),userId:localStorage.getItem('userId'),
            activityId:localStorage.getItem('activityId')};
        // console.log('判断组队输入数据',ds);
        $.ajax({
            url:'http://www.youguangchina.cn/SuperMarket/team/inTeam',
            type:'post',
            data:JSON.stringify(ds),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log('判断组队返回数据',data);
                $("#title").text(data.activityName);
                var t = data.overTime.split("-");
                var hour = t[2].split(" ");
                overyear = parseInt(t[0]),overmounth = parseInt(t[1]),overday = parseInt(hour[0]);
                // if(data.teamStatus === 0){//目前用户没有创建队伍
                //     $(".two_button").text("创建队伍");
                //     zudui = 0;
                // }
                if(data.teamStatus === 2){//用户创建了还没有开奖的队伍
                    zudui = 1;
                    $(".two_button_font").text("查看队伍");
                    localStorage.setItem('teamId',data.teamId);
                    var teamId = data.teamId;
                    getTeamMessage({teamId:data.teamId,shopId:localStorage.getItem('shopId')});
                }
                else {
                    $(".two_button_font").text("创建队伍");
                    zudui = 0;
                }
            },
            error:function () {
                console.log("error");
            }
        });
        //小工具点击量ok
        clic();
        //读取优惠券剩余数量ok
        coupon_remain();
        //读取队伍头像
        teamavater();
        //获取二维码
        qrcode();
        //开一次奖
        timer();
        //微信分享
        share();
    }
    else {//安卓手机，或者苹果手机第一次进入
        //判断code是否获取到，获取到之后进行一下操作；有两种情况，一种为从未登陆过，一种为已经登陆过
        if (getRequest.code!==undefined&&getRequest.code!==null&&getRequest.code!==localStorage.getItem('code')) {
            localStorage.setItem('code',getRequest.code);
            localStorage.setItem('index',1);
            this.code = getRequest.code;
            // alert(window.location.href);
            var data = {code:getRequest.code};
            // 此ajax用于代入code给后台，让后台获取openid
            $.ajax({
                url: 'http://www.youguangchina.cn/SuperMarket/user/search',
                type:'post',
                data:JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success:function (date) {
                    // console.log(date);
                    localStorage.setItem('userId',date.userId);
                    var ds = {shopId:localStorage.getItem('shopId'),userId:localStorage.getItem('userId'),
                        activityId:localStorage.getItem('activityId')};
                    // console.log(ds);
                    window.history.pushState(null, null, 'http://www.youguangchina.cn/Tool1/index.html?shopId='+ localStorage.getItem('shopId') +
                        '&activityId=' + localStorage.getItem('activityId') + '&toolId=' + localStorage.getItem('toolId'));
                    //判断是否组队状态
                    $.ajax({
                        url:'http://www.youguangchina.cn/SuperMarket/team/inTeam',
                        type:'post',
                        data:JSON.stringify(ds),
                        dataType:'json',
                        contentType:'application/json',
                        success:function (data) {
                            // console.log(data);
                            $("#title").text(data.activityName);
                            var t = data.overTime.split("-");
                            var hour = t[2].split(" ");
                            overyear = parseInt(t[0]),overmounth = parseInt(t[1]),overday = parseInt(hour[0]);
                            // if(data.teamStatus === 0){//目前用户没有创建队伍
                            //     $(".two_button").text("创建队伍");
                            //     zudui = 0;
                            // }
                            if(data.teamStatus === 2){//用户创建了还没有开奖的队伍
                                zudui = 1;
                                $(".two_button_font").text("查看队伍");
                                localStorage.setItem('teamId',data.teamId);
                                var teamId = data.teamId;
                                getTeamMessage({teamId:data.teamId,shopId:localStorage.getItem('shopId')});
                            }
                            else {
                                $(".two_button_font").text("创建队伍");
                                zudui = 0;
                            }
                        },
                        error:function () {
                            console.log("error");
                        }
                    });
                    //小工具点击量ok
                    clic();
                    //读取优惠券剩余数量ok
                    coupon_remain();
                    //读取队伍头像
                    teamavater();
                    //获取二维码
                    qrcode();
                    //开一次奖
                    timer();
                    //微信分享
                    share();
                },
                error:function () {
                    console.log("error");
                }
            });
        }
        else {//调用微信接口，进入授权界面，获取code；此为没有获取到code之前进行的操作
            console.log(href);
            localStorage.setItem("shopId",getRequest.shopId);
            localStorage.setItem("activityId",getRequest.activityId);
            localStorage.setItem('toolId',getRequest.toolId);
            var pageUrl = window.location.href
                .replace(/[/]/g, "%2f")
                .replace(/[:]/g, "%3a")
                .replace(/[#]/g, "%23")
                .replace(/[&]/g, "%26")
                .replace(/[=]/g, "%3d");
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid  + "" +
                "&redirect_uri=" + pageUrl + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
        }
    }
};
//读取参与队伍头像ok
function teamavater() {
    var data = {shopId:localStorage.getItem('shopId'),activityId:localStorage.getItem('activityId')};
    // console.log('读取队伍头像输入',data);
    $.ajax({
        url: href + 'SuperMarket/team/getCaptainHeadPic',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            // console.log('读取队伍头像返回',data);
            var avterbox = $(".three_avterbox");
            avterbox.children().remove();
            if(data.CaptainHeadPic.length === 0){
                // console.log("没有队伍");
                $(".three_twop").show();
                $(".three_avterbox").hide();
            }
            else {//有队伍
                $(".three_twop").hide();
                $(".three_avterbox").show();
                var tt = 0;
                if(data.CaptainHeadPic.length>=10){//队伍数量大于10个
                    tt = 10;
                }
                else {//队伍数量小于10个
                    tt = data.CaptainHeadPic.length;
                }
                for(var i = 0;i<tt;i++){
                    avterbox.append("<div class=\"three_avter\">\n" +
                        "                        <img src=\"" + data.CaptainHeadPic[i].headPic + "\">" +
                        "            </div>");
                }
            }
        },
        error:function () {
            console.log("error");
        }
    });
}
//获取二维码ok
function qrcode() {
    var data = {shopId:localStorage.getItem('shopId'),activityId:localStorage.getItem('activityId')};
    // console.log('获取二维码输入',data);
    $.ajax({
        url: href + 'SuperMarket/getQRCode',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            // console.log('获取二维码返回',data);
            $(".content_nine_img").attr('src',data.QRCode);
        },
        error:function () {
            console.log('error');
        }
    });
}
//优惠券剩余数据读取ok
function coupon_remain(){
    var data = {shopId:localStorage.getItem('shopId'),activityId:localStorage.getItem('activityId')};
    // console.log('优惠券剩余输入',data);
    $.ajax({
        url: href + 'SuperMarket/activity/searchcouponnumber',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            // console.log('剩余数量',data);
            $(".three_one_two").text(data.number);
            number = data.number;
        },
        error:function () {
            console.log('error');
        }
    });
}
//活动点击量ok
function clic() {
    var data = {shopId:localStorage.getItem('shopId'),toolId:localStorage.getItem('toolId'),
        activityId:localStorage.getItem('activityId')};
    // console.log('活动点击输入',data);
    $.ajax({
        url: href + 'SuperMarket/clicktimesRecord',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            // console.log('活动点击返回',data)
        },
        error:function () {
            console.log('error');
        }
    });
}
//微信分享接口
function share() {
    var url = location.href;
    var newurl = 'http://www.youguangchina.cn/Tool1/index.html?shopId='+ localStorage.getItem('shopId') +
    '&activityId=' + localStorage.getItem('activityId') + '&toolId='+ localStorage.getItem('toolId') +'&ui=1';
    //判断是否是ios设备
    var isIOS = function() {
        var isIphone = navigator.userAgent.includes('iPhone');
        var isIpad = navigator.userAgent.includes('iPad');
        return isIphone || isIpad;
    };
    if(isIOS()){
        var getRequest = urlSearch();
        if(getRequest.ui!==undefined&&getRequest.ui!==null){//存在ui
        }
        else {//不存在ui刷新界面
            window.location.href=newurl;
        }
    }
    var data = {activityId:localStorage.getItem('activityId'),toolId:localStorage.getItem('toolId'),
    shopId:localStorage.getItem('shopId'),url:url};
    // console.log('微信分享输入',data);
    $.ajax({
        url:href + 'SuperMarket/share',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            // console.log('微信分享返回',data);
            var timestamp = data.timestamp;
            var nonceStr = data.noncestr;
            var signature = data.signature;
            var shareTitle =data.activityName;
            var shareDesc = data.activeContent;
            var shareUrl = location.protocol+'//'+location.host+'/'+'Tool1/index.html?shopId='+
                encodeURIComponent(localStorage.getItem('shopId')) +"&activityId=" +
                encodeURIComponent(localStorage.getItem('activityId')) + '&toolId='+
                encodeURIComponent(localStorage.getItem('toolId'));
            // var shareUrl = "http://www.youguangchina.cn/"+
            wx.config({
                debug: false,
                appId: appid,
                timestamp: timestamp,
                nonceStr:  nonceStr,
                signature: signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'hideMenuItems'
                ]
            });
            wx.ready(function () {
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq', // 分享道QQ
                        'menuItem:share:weiboApp',//分享给微博
                        'menuItem:share:QZone' // 分享到QQ空间
                    ],
                    success: function (res) {
                        // console.log("hide成功")
                    },
                    fail: function (res) {
                        // console.log("hide出错");
                    }
                });
                // 2. 分享接口
                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果
                wx.onMenuShareAppMessage({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://www.youguangchina.cn/Tool1/img/share.png', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击发送给朋友');
                    },
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        $.ajax({//转发成功，给后台判定是否是第一次转发
                            url:href + 'yhq/add?userId=' + localStorage.getItem('userid') + '&yhhdId=1',
                            type:'post',
                            success:function (data) {
                                // console.log(data);
                                // if(data.success === false){
                                //     // $(".share_limit").toggle();
                                // }
                            },
                            error:function () {
                                console.log("数据获取出错");
                            }
                        });
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        // alert('已取消');
                    }
                });
                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果
                wx.onMenuShareTimeline({
                    title: shareTitle, // 分享标题
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://www.youguangchina.cn/Tool1/img/share.png', // 分享图标
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {
                        // alert('分享成功');
                        $.ajax({//转发成功，给后台判定是否是第一次转发
                            url:href + 'yhq/add?userId=' + localStorage.getItem('userid') + '&yhhdId=1',
                            type:'post',
                            success:function (data) {
                                // console.log(data);
                                // if(data.success === false){
                                //     // $(".share_limit").toggle();
                                // }
                            },
                            error:function () {
                                console.log("数据获取出错");
                            }
                        });
                    },
                    cancel: function (res) {
                        // alert('已取消');
                    }
                });
                // alert('已注册获取“分享到朋友圈”状态事乿');
                wx.error(function (res) {
                    // console.log("config信息验证失败");
                    console.log(res);
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可
                    // 以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
            });
            $(".content_anmate").hide("");
        },
        error:function () {
            console.log('error');
        }
    });
}


//活动开奖时间
//活动规则的打开和关闭ok
$(".rule").click(function () {
    var content_five = $(".content_five");
    var height = $(window).height();//获取可视区域宽度
    var divheight = content_five.height();//获取规则界面的高度
    var bodyheight = $(document.body).height();//获取body的高度
    // console.log(height,divheight,bodyheight);
    if(bodyheight>divheight){//body高度小于规则界面的高度。
        $(".content_four").css({'position':'relative'});
        // $(".content_five").css({'position':'absolute','min-height':bodyheight});
        // $(document.body).height(divheight);
        // content_five.addClass('amate');
    }
    content_five.toggle("");
    //此ajax用于获取活动信息
    var data = {shopId:localStorage.getItem('shopId'),activityId:localStorage.getItem('activityId')};
    // console.log(data);
    $.ajax({
        url: href + 'SuperMarket/activity/getActivity',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            // console.log(data);
            if(data.length === 0){
                $(".activetime").text("待定");//活动时间
                $(".hostname").text("待定");//主办单位
                $(".redempaddress").text("待定");//兑奖地址
                $(".address").text('待定');//单位地址
                $(".activity").text('待定');//活动内容
                $(".phone").text('待定');//联系方式
            }
            else {
                var t = data.beginTime.split("-");
                var hour = t[2].split(" ");
                var s = data.overTime.split("-");
                var oh = s[2].split(" ");
                $(".activetime").text(parseInt(t[0]) + "年" + parseInt(t[1]) + "月" + parseInt(hour[0]) + "日"
                    + "-" + parseInt(s[0]) + "年" + parseInt(s[1]) + "月" + parseInt(oh[0]) + "日" );
                $(".hostname").text(data.shopName);
                $(".redempaddress").text("兑奖地点：" + data.getpriceaddress);
                $(".address").text(data.shopAddress);
                var q = data.activeContent.replace('<br>','\n');
                // console.log(q);
                $(".activity").text(q);
                $(".phone").text(data.tel);
            }
        },
        error:function () {
            console.log("error");
        }
    });
});
$(".rule_shutdown").click(function () {
    $(".content_five").toggle("");
    $(".content_four").css({'position':'relative','bottom':'0'});
});
//我的奖品的打开和关闭ok
$(".gift").click(function () {
    $(".content_six").toggle();
    $(".gift_content").children().remove();
    //此ajax用于获取我的奖品
    var data = {shopId:localStorage.getItem('shopId'),userId:localStorage.getItem('userId')};
    // console.log(data);
    $.ajax({
        url: href + 'SuperMarket/user/getCoupons',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            // console.log(data);
            if(data.coupons.length === 0){
                $(".gift_content").append("<p>您还没有奖品</p>");
            }
            else {
                var ll = 0;//ll代表未核销优惠券的数量
                for(var i = 0;i<data.coupons.length;i++){
                    if(data.coupons[i].status === 0){//没有核销
                        // console.log(data.coupons[i].status);
                        // var et = data.coupons[i].endTime.split("-");
                        $(".gift_content").append("<div class=\"gift_card\">\n" +
                            "                    <div class=\"gift_one\">\n" +
                            "                        <div class=\"gift_num\">" + parseInt(data.coupons[i].couponName) + "</div>\n" +
                            "                        <div class=\"gift_infotmation\">无门槛</div>\n" +
                            "                    </div>\n" +
                            "                    <div class=\"gift_two\">\n" +
                            "                        <div class=\"gift_id\">" + data.coupons[i].cdkCode + "</div>\n" +
                            "                        <div class=\"gift_time\">无期限</div>\n" +
                            "                    </div>\n" +
                            "                </div>")
                        ll++;
                    }
                    if(i === data.coupons.length-1&&ll===0){
                        $(".gift_content").append("<p>您还没有奖品</p>");
                    }
                }
            }
        },
        error:function () {
            console.log("error");
        }
    });
});
$(".gift_shutdown").click(function () {
    $(".content_six").toggle();
});
//中奖界面退出?
$(".winning_shutdown").click(function () {
   $(".content_seven").toggle("");
});
//未中奖界面退出?
$(".notwon_shutdown").click(function () {
    $(".content_eight").toggle("");
});
//进入首页，判断是否已在队伍中。


//定时器判定活动是否到开奖时间并获取是否中奖
//获取队伍信息
var time;
function getTeamMessage(dat) {
    // console.log(dat);
    $.ajax({
        url:href+'SuperMarket/team/getTeamMessage',
        method:'POST',
        contentType:'application/json',
        data:JSON.stringify(dat),
        success:function (data) {
            $.each(data.teamer,function (ind,val) {
                if(data.leaderId === localStorage.getItem('userId')){
                    time = setInterval(timer,10000);
                }
            });
            },
        error:function (data) {
            console.log(data);
        }
    });
}
function timer() {
    var data = {shopId:localStorage.getItem('shopId'),activityId:localStorage.getItem('activityId'),
        userId:localStorage.getItem('userId'),teamId:localStorage.getItem('teamId')};
        //此ajax用于向后台获取用户的中奖信息。
    console.log(data);
    $.ajax({
            url: href+'SuperMarket/user/getPrizeList',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                if(data.type === 1){//1已组队已满员有优惠券
                    $(".content_seven").show();
                    clearInterval(time);
                    $(".winning_content").append("<div class=\"gift_card\">\n" +
                        "                    <div class=\"gift_one\">\n" +
                        "                        <div class=\"gift_num\">" + data.coupons[0].couponName + "</div>\n" +
                        "                        <div class=\"gift_infotmation\">无门槛</div>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"gift_two\">\n" +
                        "                        <div class=\"gift_id\">" + data.coupons[0].cdkCode +"</div>\n" +
                        "                        <div class=\"gift_time\">无期限</div>\n" +
                        "                    </div>\n" +
                        "                </div>")
                    $(".two_button_font").text("创建队伍");
                }
                else if(data.type === 0){//0没有奖券，2已经开过奖了，3队伍没有m满员,4队伍没创建
                    $(".content_eight").show();
                    clearInterval(time);
                    $(".two_button_font").text("创建队伍");
                }
                else if(data.type === 2||data.type === 4){
                    clearInterval(time);
                }
                else {
                }
            },
            error:function () {
                console.log("error");
            }
        });
    coupon_remain();
}

//创建队伍ok
$(".two_button").click(function () {
    overyear,overmounth,overday
    var myDate = new Date();
    var year = myDate.getFullYear(),mounth = parseInt(myDate.getMonth())+1,day = myDate.getDate();
    //当前年份>结束年份，当前年份<=结束年份但是当前月份>结束月份，当前年份<=当前年份并且当前月份<=结束月份但是日>结束日
    if(year>overyear||year<=overyear&&mounth>overmounth||year<=overyear&&mounth<=overmounth&&day>overday){
        alert('活动已结束！');
        $(".two_button_font").text('创建队伍');
    }
    else if(number === 0){//优惠券已发完，活动自动结束
        alert('活动已结束！');
        $(".two_button_font").text('创建队伍');
    }
    else {//活动没有结束
        if(zudui === 1){//已经有队伍了
            // window.location.href = "group.html" + "?shopId=" + localStorage.getItem('shopId')
            //     + "&activityId=" + localStorage.getItem('activityId')  + "&teamId=" + localStorage.getItem('teamId')
            //     + '&toolId=' + localStorage.getItem('toolId');
            window.location.href = "http://www.youguangchina.cn/Tool1/group.html" + "?shopId=" + localStorage.getItem('shopId')
                + "&activityId=" + localStorage.getItem('activityId')  + "&teamId=" + localStorage.getItem('teamId')
                + "&toolId=" + localStorage.getItem('toolId');
        }
        else {//没有队伍
            var data  = {shopId:localStorage.getItem('shopId'),activityId:localStorage.getItem('activityId'),
                userId:localStorage.getItem('userId')};
            $.ajax({
                    url: href + 'SuperMarket/team/createTeam',
                    type:'post',
                    data:JSON.stringify(data),
                    dataType:'json',
                    contentType:'application/json',
                    success:function (data) {
                        // console.log(data);
                        if(data.result === 'error'){
                            alert("您已经不能再创建队伍了！");
                        }
                        else {
                            alert("队伍创建成功！");
                            window.location.href = href + "Tool1/group.html" + "?shopId=" + localStorage.getItem('shopId')
                                + "&activityId=" + localStorage.getItem('activityId')  + "&teamId=" + data.teamId + "&toolId="
                            + localStorage.getItem('toolId');
                        }
                    },
                    error:function () {
                        console.log("error");
                    }
                });
        }
    }
});
