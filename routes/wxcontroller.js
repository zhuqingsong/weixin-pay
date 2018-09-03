/**
 * Created by zhuqingsong on 2016/7/13.
 */
var express = require('express');
var router = express.Router();
var tool = require('../util/tool.js');
var xml2js = require('xml2js');
var config = require('../util/wx-config.js');
var requestify = require("requestify");
var async = require('async');
var menu = require('../util/wx-create-menu.js');
var request = require('request');
/* GET users listing. */
router.get('/', function(req, res, next) {

    //res.json({"json":"fdfdsfd"});
    console.log("Request for  received.");
    var json = menu.menujson ;
    res.send(json);
});

router.get('/valide', function(req, res, next) {
    var echoStr = req.query.echostr;
    var token = 'zyshuyuan';
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var tmpArr = [token,timestamp,nonce];
        tmpArr.sort();
    var tmpStr = tmpArr.join("");
        tmpStr  = tool.sha1(tmpStr+"");
    if( tmpStr == signature ){
        res.send(echoStr);
    }else{
        return false;
    }
});

function mime(req){
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
}
router.post('/valide',function(req, res, next){
    if (req._body) return next();
        req.body = req.body || {};

    // ignore GET
    if ('GET' == req.method || 'HEAD' == req.method) return next();

    // check Content-Type
    if ('text/xml' != mime(req)) return next();

    // flag as parsed
    req._body = true;

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){
        var parseString = xml2js.parseString;
        parseString(buf, function(err, json) {
            if (err) {
                err.status = 400;
                next(err);
            } else {
                console.log(json.xml);
                req.body = json.xml;
                next();
            }
        });
    });
})


router.post('/valide',function(req,res,next){
    var toUserName = req.body.ToUserName;
    var formUserName = req.body.FromUserName;
    var time =new Date().getMilliseconds();
    var msgType = req.body.MsgType;
    var event = req.body.Event;
    var eventKey = req.body.EventKey;
    var content = req.body.Content;
    console.log(msgType + "tttttttttttttt");
    console.log(content +"kkkkkkkkkkkkkkkkkkkkk");
    var xmlStr= "";
    if(eventKey=="TEACH_KT" && event=="CLICK"){
        console.log(eventKey + event);
        xmlStr = "<xml>"+
            "<ToUserName><![CDATA["+formUserName+"]]></ToUserName>"+
            "<FromUserName><![CDATA["+toUserName+"]]></FromUserName>"+
            "<CreateTime>"+ time +"</CreateTime>"+
            "<MsgType><![CDATA[news]]></MsgType>"+
            "<ArticleCount>2</ArticleCount>"+
            "<Articles><item>"+
            "<Title><![CDATA[肖相如教授-少阳病和小柴胡汤(上)]]></Title>"+
            "<PicUrl><![CDATA[http://bm.eyexing.com/images/xxr1.jpg]]></PicUrl>"+
            "<Url><![CDATA["+config.msg5+"]]></Url>"+
            "</item><item>"+
            "<Title><![CDATA[肖相如教授-少阳病和小柴胡汤(下)]]></Title>"+
            "<PicUrl><![CDATA[http://bm.eyexing.com/images/xxr.jpg]]></PicUrl>"+
            "<Url><![CDATA["+config.msg6+"]]></Url>"+
            "</item>"+
            "</Articles>"+
            "</xml>";
    }

    if(eventKey=="CONTACT_SERVICE" && event=="CLICK"){
        xmlStr = "<xml>"+
            "<ToUserName><![CDATA["+formUserName+"]]></ToUserName>" +
            "<FromUserName><![CDATA["+toUserName+"]]></FromUserName>"+
            "<CreateTime>"+time+"</CreateTime>"+
            "<MsgType><![CDATA[text]]></MsgType>"+
            "<Content><![CDATA[联系客服：团长吴泽栋（316401724）微信号进行咨询，或手机:13552500763进行咨询!]]></Content>"+
            "<FuncFlag>0</FuncFlag>"+
            "</xml>";
    }

    if(msgType=="text" && content=="1"){
        xmlStr = "<xml>"+
            "<ToUserName><![CDATA["+formUserName+"]]></ToUserName>" +
            "<FromUserName><![CDATA["+toUserName+"]]></FromUserName>"+
            "<CreateTime>"+time+"</CreateTime>"+
            "<MsgType><![CDATA[text]]></MsgType>"+
            "<Content><![CDATA[请联系招生负责人团长吴泽栋微信316401724，提供姓名和学号，邀请您进班学习!]]></Content>"+
            "<FuncFlag>0</FuncFlag>"+
            "</xml>";
    }

    if(msgType=="text" && content=="2"){
        xmlStr = "<xml>"+
            "<ToUserName><![CDATA["+formUserName+"]]></ToUserName>" +
            "<FromUserName><![CDATA["+toUserName+"]]></FromUserName>"+
            "<CreateTime>"+time+"</CreateTime>"+
            "<MsgType><![CDATA[text]]></MsgType>"+
            "<Content><![CDATA[请联系招生负责人团长吴泽栋微信316401724，进行咨询解决!]]></Content>"+
            "<FuncFlag>0</FuncFlag>"+
            "</xml>";
    }

    if(eventKey=="BM_TASTE" && event=="CLICK"){
        xmlStr = "<xml>"+
            "<ToUserName><![CDATA["+formUserName+"]]></ToUserName>"+
            "<FromUserName><![CDATA["+toUserName+"]]></FromUserName>"+
            "<CreateTime>"+ time +"</CreateTime>"+
            "<MsgType><![CDATA[news]]></MsgType>"+
            "<ArticleCount>1</ArticleCount>"+
            "<Articles><item>"+
            "<Title><![CDATA[报名攻略 活动亮点]]></Title>"+
            "<PicUrl><![CDATA[http://bm.eyexing.com/images/xxr1.jpg]]></PicUrl>"+
            "<Url><![CDATA["+config.BmTaste+"]]></Url>"+
            "</item>"+
            "</Articles>"+
            "</xml>";
    }


    if(eventKey=="ACTIVE_DETAIL" && event=="CLICK"){
        xmlStr = "<xml>"+
          "<ToUserName><![CDATA["+formUserName+"]]></ToUserName>" +
          "<FromUserName><![CDATA["+toUserName+"]]></FromUserName>"+
          "<CreateTime>"+time+"</CreateTime>"+
          "<MsgType><![CDATA[text]]></MsgType>"+
          "<Content><![CDATA[报名请联系中医课代表微信：smzy125，领取试听课程 ]]></Content>"+
          "<FuncFlag>0</FuncFlag>"+
          "</xml>";
    }

    // if(msgType[0] == 'event'){
    //     if("subscribe"==event[0]){
    //       xmlStr = "<xml>"+
    //           "<ToUserName><![CDATA["+formUserName+"]]></ToUserName>"+
    //           "<FromUserName><![CDATA["+toUserName+"]]></FromUserName>"+
    //           "<CreateTime>"+ time +"</CreateTime>"+
    //           "<MsgType><![CDATA[news]]></MsgType>"+
    //           "<ArticleCount>1</ArticleCount>"+
    //           "<Articles><item>"+
    //           "<Title><![CDATA[弘扬中医改为 踏青识本草]]></Title>"+
    //           "<PicUrl><![CDATA[http://bm.eyexing.com/img/focus_img.jpg]]></PicUrl>"+
    //           "<Url><![CDATA["+config.cyFj+"]]></Url>"+
    //           "</item>"+
    //           "</Articles>"+
    //       "</xml>";
    //     }
    // }

    console.log(xmlStr);
    res.contentType('text/xml');
    res.send(xmlStr);
})

router.get("/createMenu",function(req,res,next){
    console.log("11111111111111111");
    async.parallel([
        function(cb) {
            getToken(null,cb);
        }
    ], function (err, result) {
        console.log(result[0].access_token);
        // var jsonData = JSON.stringify(menu.menujson);
            jsonData = "";
        var url = config.CreateMenus+result[0].access_token;
       /* request({
            method:'POST',
            url:url,
            json:true,
            body:jsonData,
        },function(err,res,body){
            console.log(body);
        })*/
    });
})



function getToken(data,callback){
    var appid = config.appid;
    var appsecret = config.appsecret;
    var url = config.AccessToken+"&appid="+appid+"&secret="+appsecret;

    requestify.get(url).then(function(response) {
        // Get the response body
        callback(null,response.getBody());
    });
}

module.exports = router;
