/**
 * Created by zhuqingsong on 2016/7/23.
 */

var express = require('express');
var router = express.Router();
var wxConfig  = require("../util/wx-config.js");
var tool = require("../util/tool.js");
var wxFun = require("../util/wx-fun.js");

router.post('/prepay',function(req,res,next){
    var appid = wxConfig.appid;
    var body = tool.good_body;
    var total = req.body.tfee;
    var timestamp=req.body.timestamp;
    var nonce_str = req.body.nonceStr;
    var openId = req.body.wxId;
    var userIp = tool.getClientIp(req);
    wxFun.getPackage(total,body,openId,nonce_str,userIp,function(prepayId){
        var sign = wxFun.getPaySign(prepayId,nonce_str,timestamp);
        res.json({"code":200,"appid":appid,"pg":prepayId,"paySign":sign,"signType":'MD5'});
    });
})

router.post('/prepayOld',function(req,res,next){
    var openId = req.query.wxId;
    var appid = wxConfig.appid;
    var body = tool.good_body;
    var total = req.body.tfee * 100;
    var timestamp=(new Date().getTime()).toString();
    var nonce_str = tool.generateNonceString(32);
    var userIp = tool.getClientIp(req);
    wxFun.getPackage(total,body,openId,nonce_str,userIp,function(prepayId){
        var sign = wxFun.getPaySign(prepayId,nonce_str,timestamp);
        res.json({"code":200,"appid":appid,"timestamp":timestamp,"noncestr":nonce_str,"pg":prepayId,"paySign":sign,"signType":'MD5'});
    });
})

router.get('/back',function(req,res,next){
    res.render("success.html",{ });
})

router.post('/config',function(req,res,next){
    var url = req.query.url;
    var expires = req.session.expires;
    var tick = req.session.ticket;
    var curTime = new Date().getTime();
    var timestamp=(new Date().getTime()).toString();
    var nonce_str = tool.generateNonceString(32);
    if(expires==undefined || tick==undefined || curTime - expires > 7000 ){
        wxFun.getTicket(function(ticket){
            req.session.expires = curTime;
            req.session.ticket = ticket;
            var configObj = wxFun.signConfig(ticket,url,nonce_str,timestamp);
            console.log(configObj);
            res.json(configObj);
        });
    }else{
         var configObj = wxFun.signConfig(tick,url,nonce_str,timestamp);
         res.json(configObj);
     }
})
module.exports = router;
