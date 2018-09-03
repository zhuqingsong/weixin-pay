/**
 * Created by zhuqingsong on 2016/7/22.
 */

function ajax(data,url){
    var defer = $.Deferred();
    $.ajax({
        type : "POST",
        url : url,
        dataType:"json",
        //async: false,
        data : JSON.stringify(data),
        cache : false,
        contentType:"application/json; charset=utf-8",
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            // alert("返回数据错误");
        },
        success : function(response) {
            //var resp=$.parseJSON(response);
            //Strs = response;
            defer.resolve(response)
            //_public_.load_CLOSED();
        }
    });
    return defer.promise();
}


function wxInit(){
    //alert(location.href.split('#')[0]);
    var hr = encodeURIComponent(location.href.split('#')[0]);
    $.ajax({
        url:URL+"/wxpay/config?url="+hr,
        type:"post",
        dataType:"json",
        success:function(r){
            var resp= r ;
            timeStampBox = resp.timestamp;
            nonceStrBox = resp.nonceStr;
            if(resp.code=="200"){
                wx.config({
                    debug: false,
                    appId:resp.appid,
                    timestamp:resp.timestamp,
                    nonceStr:resp.nonceStr,
                    signature:resp.signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'chooseWXPay',
                    ],
                });
            }
        }
    })
}