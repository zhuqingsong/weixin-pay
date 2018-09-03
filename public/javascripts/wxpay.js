/**
 * Created by zhuqingsong on 2016/7/23.
 */

var timeStampBox,nonceStrBox;
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
function wxshare(url,title,img,q,num){
    wx.ready(function(){
         wx.onMenuShareTimeline({
            title:title, // 分享标题
            link: url,   // 分享链接
            imgUrl:img, // 分享图标
            success: function () {
                if(q!=undefined && q!=null && q!=""){
                    window.location.href=URL+"/share2?q="+q;
                }

                if(num!=undefined && num!=null && num!="") {
                    $.ajax({
                        url: URL + "/count",
                        type: "post",
                        dataType: "json",
                        data: {"count": parseInt(num) + 1},
                        success: function (r) {
                            console.log(r);
                        }
                    })
                }

                addDT();
            },
            cancel: function () {
                window.location.href= URL + '/sh';
            }
        });
    })
}

function wxsharefriend(url,title,desc,img,q,num){
    wx.ready(function() {
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: url, // 分享链接
            imgUrl: img, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                if(q!=undefined && q!=null && q!=""){
                    window.location.href=URL+"/share2?q="+q;
                }
                if(num!=undefined && num!=null && num!="") {
                    $.ajax({
                        url: URL + "/count",
                        type: "post",
                        dataType: "json",
                        data: {"count": parseInt(num) + 1},
                        success: function (r) {
                            console.log(r);
                        }
                    })
                }
                //$.cookie('f','1',{expires: 7, path:'/'});
                addDT();
            },
            cancel: function () {
                window.location.href=URL + '/sh';
            }
        });
    })
}

function wxshareQQ(url,title,desc,img,q,num){
    wx.ready(function() {
        wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: url, // 分享链接
            imgUrl: img, // 分享图标
            success: function () {
                if(q!=undefined && q!=null && q!=""){
                    window.location.href=URL+"/share2?q="+q;
                }
                if(num!=undefined && num!=null && num!="") {
                    $.ajax({
                        url: URL + "/count",
                        type: "post",
                        dataType: "json",
                        data: {"count": parseInt(num) + 1 },
                        success: function (r) {
                            console.log(r);
                        }
                    })
                }
                  addDT();
            },
            cancel: function () {
                window.location.href=URL + '/sh';
            }
        });
    })
}


function addDT(){
  $.ajax({
      url: URL + "/sharefirend",
      type: "post",
      dataType: "json",
      data: {},
      success: function (r) {
          if(r.code==200){
            location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx157bfa6296f74e9f&redirect_uri=http://bm.eyexing.com/sh?f=1&response_type=code&scope=snsapi_base#wechat_redirec";
          }
      }
  })
}

function ansnum(){
    $.ajax({
        url: URL + "/answerror",
        type: "post",
        dataType: "json",
        data: { },
        success: function (r) {
           if(r.code==200){
              console.log("成功");
           }
        }
    })

}


function addoctor(){
   $(".add-code").show();
   $("i.share-close").click(function(event) {
      $(".add-code").hide()
   });
}

function sharedoctor(){
  $("body").append('<div class="share-doctor"></div>');
   $(".share-doctor").click(function(){
       $(this).remove();
   })
}

function _getParam(name){
    var search = document.location.search;
    var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");
    var matcher = pattern.exec(search);
    var items = null;
    if(null != matcher){
        try{
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        }catch(e){
            try{
                items = decodeURIComponent(matcher[1]);
            }catch(e){
                items = matcher[1];
            }
        }
    }
    return items;
}


function _reqPay(data,callback){
      // if (typeof WeixinJSBridge != "undefined"){
    wx.ready(function() {
            $.ajax({
                url:URL+"/wxpay/prepay",
                type:"post",
                data:{"timestamp":timeStampBox,"nonceStr":nonceStrBox,"wxId":data.wxid,"tfee":data.tfee},
                dataType:"json",
                success:function(r){
                    wx.chooseWXPay({
                        timestamp:timeStampBox, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: nonceStrBox, // 支付签名随机串，不长于 32 位
                        package: "prepay_id="+ r.pg, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: r.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: r.paySign, // 支付签名
                        success: function (res) {
                            callback(res);
                        },
                        fail:function(res){
                             alert(JSON.stringify(res));
                        }
                    })
                }
            });
    })
}

function _payAjax(data,callback){
    if (typeof WeixinJSBridge != "undefined"){
      alert(URL+"/wxpay/prepayOld?wxId="+data.wxid);
        $.ajax({
            url:URL+"/wxpay/prepayOld?wxId="+data.wxid,
            type:"post",
            data:{ "tfee":data.tfee  },
            dataType:"json",
            success:function(r){
              alert(r.code);
                if(r && r.code && r.code == "200"){
                    WeixinJSBridge.invoke("getBrandWCPayRequest", {
                            "appId" : r.appid,     //公众号名称，由商户传入
                            "timeStamp": r.timestamp,  //时间戳，自1970年以来的秒数
                            "nonceStr" : r.noncestr,   //随机串
                            "package" : "prepay_id="+ r.pg,
                            "signType" : r.signType,         //微信签名方式:
                            "paySign" : r.paySign //微信签名
                        },
                        function(res){
                            callback(res.err_msg);
                        }
                    );
                }else{
                   alert("订单支付失败！");
                }
            }
        });
    }else{
        alert("请使用微信浏览器打开.");
    }
}


function updateStatus(wxid,callback){
    var data = {"wxId":wxid};
    $.ajax({
        type : "POST",
        url : URL+'/users/updateSts',
        dataType:"json",
        //async: false,
        data : JSON.stringify(data),
        cache : false,
        contentType:"application/json; charset=utf-8",
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            // alert("返回数据错误");
        },
        success : function(response) {
            if(response.data){
                callback(1);
            }else{
                callback(0);
            }
        }
    });
}
