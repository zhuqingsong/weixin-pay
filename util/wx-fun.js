/**
 * Created by zhuqingsong on 2016/7/23.
 */

var requestify = require("requestify");
var request = require('request');
var wxConfig = require("./wx-config.js");
var tool = require("./tool.js");
var async = require('async');
var xml2js = require("xml2js");
exports.getOpenId = function(code,callback){
    var appId = wxConfig.appid;
    var appKey = wxConfig.appsecret;
    var authAccessUrl = wxConfig.AuthToken+"&appid="+appId+"&secret="+appKey+"&code="+code;
    console.log(authAccessUrl);
    requestify.get(authAccessUrl).then(function(response) {
        // Get the response body
        var openJson = JSON.parse(response.getBody());
         callback(null,openJson.openid);
    });

}

exports.getPackage = function(total,body,openId,nonce_str,userIp,callback){
    var mch_id = (wxConfig.wxmchkey).toString();
    var appid = (wxConfig.appid).toString();
    var body = encodeURIComponent(body);
    var total_fee = total.toString();
    var nonceStr = nonce_str.toString();
    var openid = openId.toString();
    var out_trade_no = nonce_str.toString();
    var ip = userIp.toString();
    var notify_url = "http://bm.eyexing.com/wxpay/back";
    var wxKey = wxConfig.wxkey;
    var paraMap = {"appid":appid,"attach":"1111","body":body,"input_charset":"UTF-8",
        "mch_id":mch_id,"nonce_str":nonceStr,"notify_url":"http://bm.eyexing.com/wxpay/back","openid":openid,
        "out_trade_no":out_trade_no,"spbill_create_ip":ip,"total_fee":total_fee,"trade_type":"JSAPI"
    };
    var StringA ="appid="+appid+"&attach=1111&body="+body+"&input_charset=UTF-8&mch_id="+mch_id+"&nonce_str="+nonceStr+"&notify_url="+notify_url+"&openid="+openid+"&out_trade_no="+out_trade_no+"&spbill_create_ip="+ip+"&total_fee="+total_fee+"&trade_type=JSAPI";
    var strPackage = StringA+"&key="+wxKey;
    console.log(StringA);
    var sign = (tool.md5(strPackage)).toUpperCase();
    paraMap.sign = sign;
    var builder = new xml2js.Builder();
    var data = {xml:paraMap};
    var xml =  builder.buildObject(data);
    requestify.post('https://api.mch.weixin.qq.com/pay/unifiedorder',xml).then(function(response) {
        // Get the response body
        var parser = new xml2js.Parser();
        var prepay_id;
        console.log(response.getBody());
        parser.parseString(response.getBody(),function(err,json){
            prepay_id = json.xml.prepay_id[0];
            callback(prepay_id);
        });
    });
}
exports.getPaySign = function(strPackage,noncestr,timestamp){
    var appId = (wxConfig.appid).toString();
    var paternerKey = wxConfig.wxkey;
    var signType = "MD5";
    var nonceStr = noncestr.toString();
    var timestamp = timestamp.toString();
    var prepay_id = strPackage;
    var sign = "appId="+appId+"&nonceStr="+nonceStr+"&package=prepay_id="+prepay_id+"&signType=MD5&timeStamp="+timestamp+"&key="+paternerKey;
        sign = (tool.md5(sign)).toUpperCase();
    return sign;
}


exports.getTicket = function(callback){
    var ticket;
    async.waterfall([
        function(cb) {
            getToken(null,cb);
        },
        function(token,cb){
         var token = token.access_token;
         var url = wxConfig.GetTicket+token;
         requestify.get(url).then(function(response) {
                // Get the response body
                cb(null,response.getBody());
          });
        }
    ], function (err, result) {
        ticket = result.ticket;
        callback(ticket);
    });
}
// sign 加密
exports.signConfig = function(ticket,url,nonce_str,timestamp){
    var  AppId = wxConfig.appid;
    var string1;
    var signature = "";
    //注意这里参数名必须全部小写，且必须有序
    string1 = "jsapi_ticket=" + ticket +
        "&noncestr=" + nonce_str +
        "&timestamp=" + timestamp +
        "&url=" + url;
    console.log(string1);
    signature = tool.sha1(string1);
    var ret={"url":url,"jsapi_ticket":ticket,"nonceStr":nonce_str,"timestamp":timestamp,"signature":signature,"appid":AppId,"code":200};
    return ret;
}


exports.sendMsg = function(openid,xh){
    getToken(null,function(data,token){
        var Token = token.access_token;
        if(openid.length>0){
            for(var i=0;i<openid.length;i++){
              var msgTemple = tool.msgData(xh[i],openid[i]);
                 // msgTemple = JSON.stringify(msgTemple);
                //console.log(wxConfig.templeReq+Token);
                //console.log(msgTemple);
                request({
                    method:'POST',
                    url:wxConfig.templeReq+Token,
                    json:true,
                    body:msgTemple,
                },function(err,res,body){
                    console.log(body);
                })
            }
        }else{
            return false;
        }
    })
}

function getToken(data,callback){
    var appid = wxConfig.appid;
    var appsecret = wxConfig.appsecret;
    var url = wxConfig.AccessToken+"&appid="+appid+"&secret="+appsecret;
    requestify.get(url).then(function(response) {
        // Get the response body
        callback(null,response.getBody());
    });
}


exports.sendMsg2 = function(openid){
    getToken(null,function(data,token){
        var Token = token.access_token;
        if(openid.length>0){
            for(var i=0;i<openid.length;i++){
                var msgTemple = tool.msgTs(openid[i]);
                // msgTemple = JSON.stringify(msgTemple);
                //console.log(wxConfig.templeReq+Token);
                //console.log(msgTemple);
                request({
                    method:'POST',
                    url:wxConfig.templeReq+Token,
                    json:true,
                    body:msgTemple,
                },function(err,res,body){
                    console.log(body);
                })
            }
        }else{
            return false;
        }
    })
}
