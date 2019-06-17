var num = 0;//num用来表示目前有没有活动
var href = "http://www.youguangchina.cn/";
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
//获取cookie
function getCookie(name) {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
}
window.onload = function () {
    var getRequest = urlSearch();
    // var shopId = localStorage.getItem('userInfo');
    var shopId = getCookie('loginMsg');
    if(shopId===null||shopId===undefined||shopId===''){//未读到shopId
        alert("请登录！");
        window.location.href = 'http://www.youguangchina.cn/yxgj/XGJM/dist/index.html';
    }
    else {//已登录
        localStorage.setItem('shopId',JSON.parse(JSON.parse(shopId).userInfo).id);
        // localStorage.setItem('shopId','shopId');
        localStorage.setItem('toolId',getRequest.toolId);
        // localStorage.setItem('toolId','toolId');
        var $body=$('body');
        var duration = $(".create_content_two_dr");
        var height = $body.height();//body的高度
        var h = $(window).height();//浏览器窗口的高度
        if(height<=h){//body的高度小于浏览器窗口的高度
            $body.height(h);
        }
        //初始化活动时间,now为当前的时间
        var myDate = new Date();
        var mounth = parseInt(myDate.getMonth()+1);
        var year = myDate.getFullYear();
        var date = myDate.getDate();
        var hour = myDate.getHours();
        if(parseInt(mounth)<10){//判断月份是否少于两位数，少则加0
            mounth = '0'+ mounth;
        }
        var now = year + '-' + mounth + '-' + date;
        $(".time_begin").text(now).attr('data-time',now);
        //日期插件
        $("#time_two").click(function () {
            var $name=$(this);
            var dtPicker;
            if($name.attr('id')==='time_two'){
                dtPicker = new mui.DtPicker({type:'date'});
                dtPicker.show(function(items) {
                    $(".time_end").remove();
                    // $name.html('<span class="time_one_line"><</span>');
                    /* * items.value 拼合后的 value
                     * items.text 拼合后的 text
                     * items.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                     * items.m 月，用法同年
                     * items.d 日，用法同年
                     * items.h 时，用法同年
                     * items.i 分（minutes 的第二个字母），用法同年
                     */
                    $name.prepend('<span class="time_end" data-time="'+items.value +'">'+items.value+'</span>');
                    if(year>items.y.value||(year===items.y.value&&mounth>items.m.value)
                        ||(year===items.y.value&&mounth===items.m.value&&date>items.d.value)){//选择时间倒退
                        alert("请选择正确的时间！");
                        $(".time_end").remove();
                        duration.text('0天');
                    }
                    else if(parseInt(year)===parseInt(items.y.value)&&parseInt(mounth)===parseInt(items.m.value)
                        &&parseInt(date)===parseInt(items.d.value)){
                        duration.text('1天');
                    }
                    else {
                        now=now.replace(/-/g, '/');
                        var time1 = Date.parse(new Date(now)) / 1000;
                        var  tim=items.value.replace(/-/g, '/');
                        var time2 = Date.parse(new Date(tim)) / 1000;
                        var nDays = Math.abs(parseInt((time2 - time1)/3600/24)) + 1 ;
                        duration.text(nDays +'天');
                    }
                });
            }
        });

        var key = localStorage.getItem('key');//key为页面标识码
        if(key === 'admin'){
            active_reading(0);
        }
    }

};
//计算两个日期之间的天数差
function daysBetween(sDate1,sDate2){
//Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
    return nDays;
}

//首页功能
//首页-->活动和核销页面切换ok
$(".admin_activity").click(function () {
    $(this).children().addClass('admin_content_one_item_add');
    $(".admin_writeoff").children().removeClass('admin_content_one_item_add');
    $(".admin_content_two_item_small").removeClass('admin_content_two_item_add').eq(0).addClass('admin_content_two_item_add');
    $(".admin_content_two").show();
    $(".admin_content_three").hide();
    $(".admin_body_content").show();
    $(".admin_coupon").hide();
    active_reading(0);
    $(".admin_footer").show();
});
$(".admin_writeoff").click(function () {
    $(this).children().addClass('admin_content_one_item_add');
    $(".admin_activity").children().removeClass('admin_content_one_item_add');
    $(".admin_content_three_item_small").removeClass('admin_content_three_item_add').eq(0).addClass('admin_content_three_item_add');
    $(".admin_content_three").show();
    $(".admin_content_two").hide();
    $(".admin_body_content").hide();
    $(".admin_coupon").show();
    coupon(0);
    $(".admin_footer").hide();
});
//首页-->进行中和已结束切换ok
$(".admin_content_two_item").click(function () {
    var index = $(".admin_content_two_item").index(this);//index为切换的div的坐标，0代表进行中，1代表已结束
    $(".admin_content_two_item_small").removeClass('admin_content_two_item_add').eq(index).addClass('admin_content_two_item_add');
    active_reading(index);
});
//首页-->核销和已核销切换ok
$(".admin_content_three_item").click(function () {
    var index = $(".admin_content_three_item").index(this);//index为切换的div的坐标，0代表核销，1代表已核销
    $(".admin_content_three_item_small").removeClass('admin_content_three_item_add').eq(index).addClass('admin_content_three_item_add');
    coupon(index);
});
//首页-->开始活动既创建活动ok
$(".admin_footer").click(function () {
    if(num === 0){//目前没有活动
        window.location.href = 'create.html?toolId=toolId';
    }
    else {
     alert("您有进行中的活动，不能再创建更多活动！")
    }
});
//首页-->活动列表读取动能,a代表进行中或者已结束字段ok
function active_reading(a) {
    var data = {shopId:localStorage.getItem('shopId'),toolId:localStorage.getItem('toolId')};
    console.log(data);
    $(".admin_body_content").children().remove();
    if(a === 0){//读取进行中的活动
        $(".admin_footer").show();
        $.ajax({
            url:href + 'SuperMarket/activity/getActivities',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var k = 0;//k用来判断是否有活动处于进行中，0为没有，1为有
                if(data.activities.length === 0){//没有活动
                    $(".admin_body_content").append('<div class="admin_body_content_no">暂无活动</div>');
                    num = 0;
                }
                else {//有活动，但是不确定是否是已结束的活动
                    for(var i = 0;i<data.activities.length;i++){
                        if(data.activities[i].status === 0){//判断该活动是否在进行中
                            k++;
                            num = 1;
                            var reg = new RegExp('-','g');
                            var bt = data.activities[i].beginTime.replace(reg,'.');
                            var et = data.activities[i].overTime.replace(reg,'.');
                            $(".admin_body_content").append('<div class="admin_body_content_item" data-id="'+ data.activities[i].activityId + '"' +
                                'onclick="come($(\'.admin_body_content_item\').index(this))">\n' +
                                '                <div class="admin_body_content_item_one">\n' +
                                '                    <div class="admin_body_content_item_back">'+ data.activities[i].activityName[0] +'</div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_body_content_item_two">\n' +
                                '                    <div class="admin_body_content_item_two_title">'+ data.activities[i].activityName +'</div>\n' +
                                '                    <div class="admin_body_content_item_two_font">获奖人数： <span>' + data.activities[i].getpricenumber + '</span></div>\n' +
                                '                    <div class="admin_body_content_item_two_font">参与人数： <span>' + data.activities[i].joinnumber + '</span></div>\n' +
                                '                    <div class="admin_body_content_item_two_font">点击次数： <span>' + data.activities[i].clicktimes + '</span></div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_body_content_item_three">\n' +
                                '                    <div class="admin_body_content_item_three_status">进行中</div>\n' +
                                '                    <div class="admin_body_content_item_three_time">' + bt + '- ' + et + '</div>\n' +
                                '                </div>\n' +
                                '            </div>');
                            // $(".admin_footer").hide();
                        }
                    }
                    if(k === 0){//所有活动已结束
                        $(".admin_body_content").append('<div class="admin_body_content_no">暂无进行中的活动</div>');
                        num = 0;
                    }
                }
            },
            error:function () {
                alert("数据读取出错！请重新刷新界面！");
            }
        });
    }
    else {//读取已结束的活动
        $(".admin_footer").hide();
        $.ajax({
            url:href + 'SuperMarket/activity/getActivities',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var k = 0;//k用来判断是否有活动处于已结束，0为没有，1为有
                if(data.activities.length === 0){//没有活动
                    $(".admin_body_content").append('<div class="admin_body_content_no">暂无活动</div>');
                }
                else {
                    for(var i = 0;i<data.activities.length;i++){
                        if(data.activities[i].status === -1){//判断该活动是否在进行中
                            k++;
                            var reg = new RegExp('-','g');
                            var bt = data.activities[i].beginTime.replace(reg,'.');
                            var et = data.activities[i].overTime.replace(reg,'.');
                            $(".admin_body_content").append('<div class="admin_body_content_item" data-id='+ data.activities[i].activityId + '>\n' +
                                '                <div class="admin_body_content_item_one">\n' +
                                '                    <div class="admin_body_content_item_back">'+ data.activities[i].activityName[0] +'</div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_body_content_item_two">\n' +
                                '                    <div class="admin_body_content_item_two_title">'+ data.activities[i].activityName +'</div>\n' +
                                '                    <div class="admin_body_content_item_two_font">获奖人数： <span>' + data.activities[i].getpricenumber + '</span></div>\n' +
                                '                    <div class="admin_body_content_item_two_font">参与人数： <span>' + data.activities[i].joinnumber + '</div>\n' +
                                '                    <div class="admin_body_content_item_two_font">点击次数： <span>' + data.activities[i].clicktimes + '</div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_body_content_item_three">\n' +
                                '                    <div class="admin_body_content_item_three_status item_three_end">已结束</div>\n' +
                                '                    <div class="admin_body_content_item_three_time">' + bt + '- ' + et + '</div>\n' +
                                '                </div>\n' +
                                '            </div>')
                        }
                    }
                    if(k === 0){
                        $(".admin_body_content").append('<div class="admin_body_content_no">暂无已结束的活动</div>');
                    }
                }
            },
            error:function () {
                alert("数据读取出错！请重新刷新界面！");
            }
        });
    }
}
//首页-->优惠券列表读取功能，a代表未核销或者已核销ok
function coupon(a) {
    $(".admin_coupon").children().remove();
    var data = {shopId:localStorage.getItem('shopId')};
    if(a === 0){//未核销
        $.ajax({
            url:href + 'SuperMarket/activity/getPrizeWinList',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var k = 0;//k用于表示优惠券是否全是没有被核销或者核销
                if(data.prizeWinLists.length === 0){//没有优惠券
                    $(".admin_coupon").append('<div class="admin_coupon_no">暂无优惠券</div>');
                }
                else {//有优惠券
                    for(var i = data.prizeWinLists.length-1;i>=0;i--){
                        if(data.prizeWinLists[i].cdk_status === 0){//该优惠券没有被使用
                            k++;
                            $(".admin_coupon").append(' <div class="admin_coupon_item" data-id="' + data.prizeWinLists[i].userId + '">\n' +
                                '                <div class="admin_coupon_item_one">\n' +
                                '                    <div class="admin_coupon_item_one_img">\n' +
                                '                        <img src="' + data.prizeWinLists[i].headPic + '">\n' +
                                '                    </div>\n' +
                                '                    <div class="admin_coupon_item_one_name">' + data.prizeWinLists[i].nickName + '</div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_coupon_item_two">\n' +
                                '                    <div class="admin_coupon_item_two_title">' + data.prizeWinLists[i].activityName + '</div>\n' +
                                '                    <div class="admin_coupon_item_two_cdk">CDK：' + data.prizeWinLists[i].cdkCode + '</div>\n' +
                                '                    <div class="admin_coupon_item_two_time">无期限</div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_coupon_item_three">\n' +
                                '                    <div class="admin_coupon_item_three_status" data-id="' + data.prizeWinLists[i].couponId + '" ' +
                                'onclick="writeoff($(\'.admin_coupon_item_three_status\').index(this))">兑换</div>\n' +
                                '                </div>\n' +
                                '            </div>')
                        }
                    }
                    if(k === 0){//表示所有优惠券全已被核销
                        $(".admin_coupon").append('<div class="admin_coupon_no">暂无未核销的优惠券</div>')
                    }
                }
            },
            error:function () {
                alert("数据读取出错！请重新刷新界面！");
            }
        });
    }
    else {//已核销
        $.ajax({
            url:href + 'SuperMarket/activity/getPrizeWinList',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                var k = 0;//k用于表示优惠券是否全是没有被核销或者核销
                if(data.prizeWinLists.length === 0){//没有优惠券
                    $(".admin_coupon").append('<div class="admin_coupon_no">暂无优惠券</div>')
                }
                else {//有优惠券
                    for(var i = data.prizeWinLists.length-1;i>=0;i--){
                        if(data.prizeWinLists[i].cdk_status === -1){//该优惠券已核销
                            k++;
                            $(".admin_coupon").append(' <div class="admin_coupon_item">\n' +
                                '                <div class="admin_coupon_item_one">\n' +
                                '                    <div class="admin_coupon_item_one_img">\n' +
                                '                        <img src="' + data.prizeWinLists[i].headPic + '">\n' +
                                '                    </div>\n' +
                                '                    <div class="admin_coupon_item_one_name">' + data.prizeWinLists[i].nickName + '</div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_coupon_item_two">\n' +
                                '                    <div class="admin_coupon_item_two_title">' + data.prizeWinLists[i].activityName + '</div>\n' +
                                '                    <div class="admin_coupon_item_two_cdk">CDK：' + data.prizeWinLists[i].cdkCode + '</div>\n' +
                                '                    <div class="admin_coupon_item_two_time">无期限</div>\n' +
                                '                </div>\n' +
                                '                <div class="admin_coupon_item_three">\n' +
                                '                    <div class="admin_coupon_item_three_status item_three_end">已兑换</div>\n' +
                                '                </div>\n' +
                                '            </div>')
                        }
                    }
                    if(k === 0){//表示所有的优惠券都是未核销的优惠券
                        $(".admin_coupon").append('<div class="admin_coupon_no">暂无已核销的优惠券</div>')
                    }
                }
            },
            error:function () {
                alert("数据读取出错！请重新刷新界面！");
            }
        });
    }
}
//首页-->核销功能
function writeoff(i) {
    $(".admin_writebox").show();
    var cdkCode =parseInt($(".admin_coupon_item_two_cdk").eq(i).text().replace(/[^0-9]/ig,""));//cdk码
    var userId = $(".admin_coupon_item").eq(i).attr('data-id');//用户id
    var couponId = $(".admin_coupon_item_three_status").eq(i).attr('data-id');//优惠券id
    $(".admin_write").attr('data-id',userId).attr('data-cdk',cdkCode).attr('data-couponid',couponId);
}
//首页-->确定核销
function writeoff_ok() {
    var admin_write = $(".admin_write");
    var shopId = localStorage.getItem('shopId');
    var cdkCode = admin_write.attr('data-cdk');
    var userId = admin_write.attr('data-id');
    var couponId = admin_write.attr('data-couponid');
    var data = {shopId:shopId,cdkCode:cdkCode,userId:userId,couponId:couponId};
    console.log(data);
    $.ajax({
        url:href + 'SuperMarket/activity/exchangeCDK',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            coupon(0);
            $(".admin_writebox").hide();
        },
        error:function () {
            alert("核销出错！请重新刷新界面！");
        }
    });
}
//首页-->取消核销
$(".admin_write_canel").click(function () {
    $(".admin_writebox").hide();
});
//首页-->进入小工具
function come(i) {
    var shopId = localStorage.getItem('shopId');
    var activityId = $(".admin_body_content_item").eq(i).attr('data-id');
    // console.log(activityId)
    window.location.href = '../index.html?shopId=' + shopId + '&activityId=' + activityId
    + '&toolId=' + localStorage.getItem('toolId');
}
//首页-->返回上一页
function retu() {
    window.location.href = 'http://www.youguangchina.cn/yxgj/XGJM/dist/tools.html';
};


//创建活动页功能
//头部返回上一页
$(".create_return").click(function () {
    window.location.href = 'admin.html?toolId=toolId';
});
//字数限制
$(".create_content_five_textarea").keyup(function () {
   var length = $(this).val().length;//length代表目前的字数
    if(length > 149){
        $(this).val($(this).val().substring(0,150));
        alert("请把字数保持在150字以内！")
    }
    $(".word_count").text(length);
});
//队员人数选择
$(".six_item_radio").click(function () {
    var index = $(".six_item_radio").index(this);//index为选中的input[radio]的坐标
    $(".create_content_six_item").removeClass('create_content_six_item_add')
        .eq(index).addClass('create_content_six_item_add');
    $(".item_input").val(null);
});
//创建活动ok
$(".create_content_eight_ok").click(function () {
    var formData = new FormData(document.getElementById('imgfilebox'));
    var activitname = $("#activitname").val();
    var time_begin = $(".time_begin").text();
    var time_end = $(".time_end").text();
    var shopId = localStorage.getItem('shopId');
    var shopname = $("#shopname").val();
    var shopaddress = $("#shopaddress").val();
    var tel = $("#tel").val();
    var toolId = localStorage.getItem('toolId');
    var peoplenumber = String(parseInt($(".create_content_six_item_add").children('.create_content_six_item_one').children('span').text()));
    var activeContent = $(".create_content_five_textarea").val().replace(/\n/g,"<br>");
    var createnumber = $("#createnumber").val();
    var getpriceaddress = $("#getpriceaddress").val();
    var couponName = $(".create_content_six_item_add").children('.create_content_six_item_two').children('input').val();
    var number = $(".create_content_six_item_add").children('.create_content_six_item_three').children('input').val();
    formData.append('activityName',activitname);//活动名称
    formData.append('beginTime',time_begin);//活动开始时间
    formData.append('overTime',time_end);//活动结束时间
    formData.append('shopId',shopId);//店铺id
    formData.append('shopName',shopname);//店铺名称
    formData.append('shopAddress',shopaddress);//店铺地址
    formData.append('tel',tel);//店铺联系方式
    formData.append('toolId',toolId);//小工具id
    //活动人数
    formData.append('peopleNumber',peoplenumber);
    formData.append('activeContent',activeContent);//活动内容
    formData.append('createnumber',createnumber);//单人获奖限定次数
    formData.append('getpriceaddress',getpriceaddress);//兑奖地址
    formData.append('userId',localStorage.getItem('shopId'));//用户id
    formData.append('couponName',couponName);//优惠券名称
    formData.append('number',number);//优惠券张数
    console.log(formData);
    if(activitname===''||activitname===null||time_end===''||time_end===null||shopname===''||shopname===null
        ||shopaddress===''||shopaddress===null||tel===''||tel===null||peoplenumber===''||peoplenumber===null||
        activeContent===''||activeContent===null||createnumber===null||createnumber===''||getpriceaddress===''||
        getpriceaddress===null||couponName===null||couponName===''||number===null||number===''){
        alert('请正确输入信息！')
    }
    else {
        $.ajax({
            url: "http://www.youguangchina.cn/SuperMarket/activity/createActivity",
            method: "POST",
            data: formData,
            contentType:false,
            processData: false,
            cache:false,
            async: false,
            success:function (data) {
                console.log(data);
                if(data.activityId){
                    alert('创建活动成功！');
                    window.location.href = 'admin.html?toolId=toolId';
                }
                else {
                    alert("目前活动还未结束！");
                    window.location.href = 'admin.html?toolId=toolId';
                }
            },
            error:function (red) {
                console.log(red)
            }
        })
    }

});
//创建活动页-->上传二维码
function img_upload() {
    var file = $("#uploadFile").get(0).files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        $(".img_url").attr("src", reader.result);
    }
}
//数字限制
function change(e,k) {
    if(k === 0){//手机号输入
        if(e.val().length!==e.val().replace(/[^0-9]+/g, '').length){//判断字段中全是数字
            alert("内容不能含有除数字之外的字符！");
            e.val(null);
        }
        else if(e.val().length!==11){
            alert("请输出正确的手机号码！");
            e.val(null);
        }
    }
    if(e.val().length!==e.val().replace(/[^0-9]+/g, '').length){//判断字段中全是数字
        alert("内容不能含有除数字之外的字符！");
        e.val(null);
    }
}
//取消
$(".create_content_eight_cancel").click(function () {
    window.location.href = 'admin.html?toolId=toolId';
});

