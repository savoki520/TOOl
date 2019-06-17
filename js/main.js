$(document).ready(function () {
    var $body=$('body');
    var $url='http://www.youguangchina.cn/';
    var appid = "wx04d29c82e1d4eb0f";
    /***************点击加入队伍模块***************/
    $body.on('click','#No',function () {
        $('#Alert').hide();
    });
    $body.on('click','#Yes',function () {
        var getRequest = urlSearch();
        var data={userId:localStorage.getItem('userId'),teamId:JSON.parse(localStorage.getItem('getRequest')).teamId,shopId:JSON.parse(localStorage.getItem('getRequest')).shopId};
        $.ajax({
            url:$url+'SuperMarket/team/addIntoTeam',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify(data),
            success:function (data) {
                console.log(data);
                if(data.result==='success'){
                    // alert('加入队伍成功');
                    getTeamMessage({teamId:JSON.parse(localStorage.getItem('getRequest')).teamId,
                        shopId:JSON.parse(localStorage.getItem('getRequest')).shopId});
                    $(".suee").show(500,function () {
                        $(".suee").delay(1000).hide("");
                    });
                }else {
                    alert('队伍成员已满');
                    getTeamMessage({teamId:JSON.parse(localStorage.getItem('getRequest')).teamId,
                        shopId:JSON.parse(localStorage.getItem('getRequest')).shopId});
                }
            },
            error:function () {
                alert('请求超时')
            }
        })
    });
    var height = $(window).height();//获取可视区域宽度
    var bodyheight = $(document.body).height();
    if(bodyheight<height){//body高度小于屏幕的高度。
        $(".content_four").css({'position':'absolute','bottom':'0'});
        $(document.body).height(height)
    }




//活动规则的打开和关闭ok
    $(".rule").click(function () {
        var content_five = $(".content_five");
        var height = $(window).height();//获取可视区域宽度
        var divheight = content_five.height();//获取规则界面的高度
        var bodyheight = $(document.body).height();//获取body的高度
        if(bodyheight<divheight){//body高度小于规则界面的高度。
            $(".content_four").css({'position':'fixed','bottom':'0'});
            $(".content_five").css({'position':'absolute','min-height':height});
        }
        content_five.toggle("");
        //此ajax用于获取活动信息
        var data = {shopId:localStorage.getItem('shopId'),activityId:localStorage.getItem('activityId')};
        $.ajax({
            url: 'http://www.youguangchina.cn/SuperMarket/activity/getActivity',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
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
                    var q = data.activeContent.replace('↵','\n');
                    console.log(q);
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






var time;//time为定时器，kk为判定组队弹框是否是队长
    /***************组队分享模块***************/
    //获取微信授权code
    var getRequest = urlSearch();
    //苹果：判断链接是否带有ui,以此判断苹果手机第二次刷新界面时是否需要微信授权
    if(getRequest.ui===1||getRequest.ui==='1') {//无需授权，ios直接刷新数据
        getTeamMessage({teamId:getRequest.teamId,shopId:getRequest.shopId});
        // var str=location.href;
        var str = 'http://www.youguangchina.cn/Tool1/group.html?shopId=' +getRequest.shopId +
            '&activityId='+ getRequest.activityId +'&teamId='+ getRequest.teamId + '&toolId='+ getRequest.toolId;
        // console.log(str);
        localStorage.setItem('teamId',getRequest.teamId);
        qrImg(str);
        share();
        timer();
    }
    else {//安卓手机，苹果初始化
        if (getRequest.code!==undefined&&getRequest.code!==null&&getRequest.code!==localStorage.getItem('code')) {
            localStorage.setItem('code',getRequest.code);
            this.code = getRequest.code;
            //传输code
            $.ajax({
                url:$url+'SuperMarket/user/search',
                method:'POST',
                contentType:'application/json',
                data:JSON.stringify({code:getRequest.code}),
                success:function (data) {
                    // alert(JSON.stringify(data));
                    localStorage.setItem('userId',data.userId);
                    var getRequest=JSON.parse(localStorage.getItem('getRequest'));
                    // console.log(getRequest);
                    window.history.pushState(null, null, 'http://www.youguangchina.cn/Tool1/group.html?shopId=' + getRequest.shopId +
                        '&activityId='+ getRequest.activityId +'&teamId='+ getRequest.teamId + '&toolId='+ getRequest.toolId);
                    getTeamMessage({teamId:getRequest.teamId,shopId:getRequest.shopId});
                    var str=location.href;
                    localStorage.setItem('teamId',getRequest.teamId);
                    qrImg(str);
                    share();
                    timer();
                },
                error:function () {
                    console.log('请求超时')
                }
            });

        }
        else {
            localStorage.setItem('getRequest',JSON.stringify(getRequest));

            var pageUrl = window.location.href
                .replace(/[/]/g, "%2f")
                .replace(/[:]/g, "%3a")
                .replace(/[#]/g, "%23")
                .replace(/[&]/g, "%26")
                .replace(/[=]/g, "%3d");
            var url =
                "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                "wx04d29c82e1d4eb0f" +
                "&redirect_uri=" +
                pageUrl + //这里放当前页面的地址
                "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";


            window.location.href = url;
            // location.replace(url);

        }
    }



    function urlSearch() {
        var str=location.href; //取得整个地址栏
        var num=str.split('?');
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
                }else {
                    arr=val.split('=');
                    var name=arr[0];
                    data[name]=arr[1];
                }
            }
        });
        return data;
    }

    //获取队伍信息
    function getTeamMessage(dat) {
        console.log(dat,'1');
        $('#bank').html('');

        $.ajax({
            url:$url+'SuperMarket/team/getTeamMessage',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify(dat),
            success:function (data) {
                console.log(data,'1.1');
                $('#Alert').find('.bank').remove();
                // alert(JSON.stringify(data));
                var arr=[];
                $("#bank").children().remove();
                $.each(data.teamer,function (ind,val) {
                    arr.push(val.userId);
                    var html='            <div class="bank" data-user="'+val.userId+'">\n' +
                        '                <div class="Avatar" style="background-image: url('+val.headPic+')"></div>\n' +
                        '                <div class="Name">队员</div>\n' +
                        '            </div>\n';
                    $('#bank').append(html);
                    if(data.leaderId === localStorage.getItem('userId')){
                        time = setInterval(timer,10000);
                    }
                    if(data.leaderId===val.userId){
                        $('#Alert').find('.Title').after(html);
                        var $leader=$('.bank[data-user="'+data.leaderId+'"]');
                        $leader.find('.Name').text('队长');
                    }
                    if(ind === data.teamer.length-1){
                        $(".content_anmate").hide("");
                    }
                });
                if(data.needPeople>data.teamer.length){
                    var len=data.needPeople-data.nowPeople;
                    for(var i=0;i<len;i++){
                        var html='            <div class="bank none">\n' +
                            '                <div class="Avatar"></div>\n' +
                            '            </div>\n';
                        $('#bank').append(html);
                    }
                }
                var width=100/data.needPeople;
                $('#bank').find('.bank').css('width',width+'%');

                $('#Alert').find('.activityName').text(data.activityName);

                $.each(arr,function (ind,val) {
                    //队伍人数没有上限并且进来的人不在队伍中
                    if(data.needPeople!==arr.length&&localStorage.getItem('userId')!==val){
                        $('#Alert').show();
                    }else {//表示进来的人在队伍中或者队伍人数上限了
                        $('#Alert').hide();

                        console.log("正常操作");

                        return false;
                        // alert(2)

                    }
                });
            },
            error:function () {
                console.log('请求超时')
            }
        });
    }
    //定时刷新获取队伍信息
    function getTeamMessagetwo(dat) {
        $('#bank').html('');
        $.ajax({
            url:$url+'SuperMarket/team/getTeamMessage',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify(dat),
            success:function (data) {
                console.log(data,'2');
                // alert(JSON.stringify(data));
                var arr=[];
                $("#bank").children().remove();
                $.each(data.teamer,function (ind,val) {
                    arr.push(val.userId);
                    var html='            <div class="bank" data-user="'+val.userId+'">\n' +
                        '                <div class="Avatar" style="background-image: url('+val.headPic+')"></div>\n' +
                        '                <div class="Name">队员</div>\n' +
                        '            </div>\n';
                    $('#bank').append(html);
                    if(data.leaderId===val.userId){
                        // $('#Alert').find('.Title').after(html);
                        var $leader=$('.bank[data-user="'+data.leaderId+'"]');
                        $leader.find('.Name').text('队长');
                    }
                    if(ind === data.teamer.length-1){
                        $(".content_anmate").hide("");
                    }
                });
                if(data.needPeople>data.teamer.length){
                    var len=data.needPeople-data.nowPeople;
                    for(var i=0;i<len;i++){
                        var html='            <div class="bank none">\n' +
                            '                <div class="Avatar"></div>\n' +
                            '            </div>\n';
                        $('#bank').append(html);
                    }
                }
                var width=100/data.needPeople;
                $('#bank').find('.bank').css('width',width+'%');

            },
            error:function () {
                console.log('请求超时')
            }
        });
    }

    //返回到首页
    $(".header_return").click(function () {
        var getRequest = urlSearch();
        window.location.href ='http://www.youguangchina.cn/Tool1/index.html?shopId='+ getRequest.shopId +'&activityId='+getRequest.activityId+
            '&toolId=' + getRequest.toolId;
    });

    //获取QR码
    function qrImg(dat) {
        console.log(dat,'3');
        $.ajax({
            url:$url+'SuperMarket/generateQR',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify({content:dat}),
            success:function (data) {
                // console.log('data:img/jpg;base64,'+data);
                $('#QR').find('.img').attr('src','data:img/jpg;base64,'+data+'')
            },
            error:function () {
                console.log('获取QR码超时，请稍候重试')
            }
        });
    }



    //监听返回按钮，退出微信浏览器事件
    window.addEventListener("popstate", function(e) {
        WeixinJSBridge.call('closeWindow');
    }, false);


    //定时器判定活动是否到开奖时间并获取是否中奖

    function timer() {
        var getRequest = urlSearch();
        var data = {shopId:getRequest.shopId,activityId:getRequest.activityId,
            userId:localStorage.getItem('userId'),teamId:getRequest.teamId};
        console.log(data,'4');
        //此ajax用于向后台获取用户的中奖信息。
        $.ajax({
            url: 'http://www.youguangchina.cn/SuperMarket/user/getPrizeList',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data,'4.1');
                if(data.type === 1){//1已组队已满员有优惠券
                    // alert("恭喜中奖");
                    getTeamMessagetwo({teamId:JSON.parse(localStorage.getItem('getRequest')).teamId,
                        shopId:JSON.parse(localStorage.getItem('getRequest')).shopId});
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
                }
                else if(data.type === 0){//0人满没有奖券，2已经开过奖了，3队伍没有满员,4队伍不存在或者已废弃
                    getTeamMessagetwo({teamId:JSON.parse(localStorage.getItem('getRequest')).teamId,
                        shopId:JSON.parse(localStorage.getItem('getRequest')).shopId});
                    $(".content_eight").show();
                    clearInterval(time);
                    // alert("中奖失败");
                }
                else if(data.type === 2||data.type === 4){
                    clearInterval(time);
                    // alert('大都督');
                }
                else {
                    getTeamMessagetwo({teamId:JSON.parse(localStorage.getItem('getRequest')).teamId,
                        shopId:JSON.parse(localStorage.getItem('getRequest')).shopId});
                }
            },
            error:function () {
                console.log("error");
            }
        });
    }

    //微信分享接口
    function share() {
        var getRequest = urlSearch();
        var url = window.location.href;
        var newurl = url + '&ui=1';
        //判断是否是ios设备
        var isIOS = function() {
            var isIphone = navigator.userAgent.includes('iPhone');
            var isIpad = navigator.userAgent.includes('iPad');
            return isIphone || isIpad;
        };
        if(isIOS()){
            if(getRequest.ui!==undefined&&getRequest.ui!==null){//存在ui
            }
            else {//不存在ui刷新界面
                console.log('ios设备');
                window.location.href=newurl;
            }
        }
        var data = {activityId:getRequest.activityId,toolId:'toolId',
            shopId:getRequest.shopId,url:url};
        console.log(data,'5');
        $.ajax({
            url:$url+'SuperMarket/share',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data,'5.1');
                var timestamp = data.timestamp;
                var nonceStr = data.noncestr;
                var signature = data.signature;
                var shareTitle =data.activityName;
                // var shareDesc = data.activeContent;
                var shareDesc = "我创建了一支队伍，快来加入我吧！";
                // var shareUrl = "http://www.youguangchina.cn/Tool1/index.html?shopId="+ localStorage.getItem('shopId') +"&activityId=" + localStorage.getItem('activityId')
                var shareUrl = 'http://www.youguangchina.cn/Tool1/group.html?shopId=' + encodeURIComponent(getRequest.shopId) +
                    '&activityId='+ encodeURIComponent(getRequest.activityId) +'&teamId='+ encodeURIComponent(getRequest.teamId) +
                    '&toolId=' + encodeURIComponent(getRequest.toolId);
                wx.config({
                    debug: false,
                    appId: appid,
                    timestamp: timestamp,
                    nonceStr:  nonceStr,
                    signature: signature,
                    jsApiList: [
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
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
                        type: '', // 分享类型,music、video或link，不填默认为link
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
                                    console.log(data);
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
                                    console.log(data);
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
            },
            error:function () {
                console.log("error");
            }
        });
    }
//中奖界面退出?
    $(".winning_shutdown").click(function () {
        $(".content_seven").hide("");
    });
//未中奖界面退出?
    $(".notwon_shutdown").click(function () {
        $(".content_eight").hide("");
    });
});
