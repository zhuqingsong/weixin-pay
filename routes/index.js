var express = require('express');
var router = express.Router();
var async = require('async');
var games = require('../model/games.js');
var desc = require('../model/desc.js');
var counts = require('../model/count.js');
var model = require("../model/getModel.js");
var tool = require('../util/tool');
var config = require('../util/wx-config.js');
var requestify = require("requestify");
var wxFun = require("../util/wx-fun.js");
/* GET home page. */
router.get('/', function(req, res, next) {





    // return false;
    // if(!is_weixn(req)){
    //     res.json({"msg":"请在微信中打开本链接"});
    //     return false;
    // }

    //var userip = tool.get_client_ip(req);
    //var curtime = tool.getDateTime();
    //var pvdata = {"adr_pv":userip,"adr_uv":userip,"req_time":curtime,"sub_type":1}
    var redirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx157bfa6296f74e9f&redirect_uri=http://bm.eyexing.com/&response_type=code&scope=snsapi_userinfo#wechat_redirec";
    var romNum = tool.fRandomBy(0,13);
     res.render('index',{"headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epcHqhK0CN3yXicLJicjw0F8FZ2FtIP4rznIKRWVMMRteUP6FAh5WLOUmrHHfr1CGDFprOq5icFP8eOw/132","nickname":"祝青松","rom":romNum});
     return ;
    var code = req.query.code;
    var appid = config.appid;
    var appsecret = config.appsecret;
    var url = config.usermsgToken+"&appid="+appid+"&secret="+appsecret+"&code="+code+'&grant_type=authorization_code';
    var headimgurl = req.cookies.headimgurl;
    if( headimgurl == undefined || headimgurl == ""){
        if(code==undefined || code==""){
            res.redirect(301, redirectUrl);
            return false;
        }
        requestify.get(url).then(function(response) {
            var body =  JSON.parse(response.getBody());
            var useReq = config.userMsg + "access_token="+body.access_token+"&openid=" + body.openid + "&lang=zh_CN";
              requestify.get(useReq).then(function(response) {
                    var userMsg = JSON.parse(response.getBody());
                        userMsg.rom = romNum;
                    model.insertData('req_pv_uv',pvdata,function(st){console.log(st);})
                    res.render('index',userMsg);
              })
        });
    }else{
        var nickname = req.cookies.nickname;
        model.insertData('req_pv_uv',pvdata,function(st){console.log(st);})
        res.render('index',{"headimgurl":headimgurl,"nickname":nickname,"rom":romNum});
    }

})





router.get('/sh',function(req,res,next){
  var code = req.query.code;
  var appid = config.appid;
  var appsecret = config.appsecret;
  var redirectUrl  = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx157bfa6296f74e9f&redirect_uri=http://bm.eyexing.com/sh&response_type=code&scope=snsapi_base#wechat_redirec"
  var redirectUrl2 = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx157bfa6296f74e9f&redirect_uri=http://bm.eyexing.com/sh&response_type=code&scope=snsapi_userinfo#wechat_redirec"
  if(code==undefined || code==""){
      // openid = "oSAeZxJyYbpvA8VYv6rK4ON_0tmY";
      // res.render('sh',{'openid':openid});
      // return false;
      res.redirect(301, redirectUrl);
      return false;
  }
  ///openid = "oSAeZxJyYbpvA8VYv6rK4ON_0tmY";
  //res.render('sh',{'openid':openid});
  //return false;
  var url = config.usermsgToken+"&appid="+appid+"&secret="+appsecret+"&code="+code+'&grant_type=authorization_code';
  requestify.get(url).then(function(response) {
      var body =  JSON.parse(response.getBody());
      console.log('body:++' + body);
      var  openid = body.openid;
      if(openid==undefined){
          res.redirect(301, redirectUrl2);
          return false;
      }
      console.log('openid:++' + openid);
           //openid = "oSAeZxJyYbpvA8VYv6rK4ON_0tmY";
      res.render('sh',{'openid':openid});
    })
})


router.post('/sharefirend',function(req,res,next){
    var openid  = req.cookies.openid;
    var sql = "update sh_an set ans_num = ans_num + 3 where user_openid ='"+openid+"'";
    model.findSql(sql,function(data){
          if(data.affectedRows>0){
            var userip = tool.get_client_ip(req);
            var curtime = tool.getDateTime();
            var pvdata = {"adr_pv":userip,"adr_uv":userip,"req_time":curtime,"sub_type":3}
            model.insertData('req_pv_uv',pvdata,function(st){console.log(st);})
              res.json({"code":200})
          }else{
              res.json({"code":100})
          }
    })
})


router.post('/answerror',function(req,res,next){
   var openid  = req.cookies.openid;
   var data = {"user_openid":openid};
   model.findOne('sh_an',data,function(arg){
       if(arg[0].ans_num>0){
         var sql = "update sh_an SET ans_num = ans_num - 1 where user_openid = '" + openid + "'";
         console.log(sql);
         model.findSql(sql,function(data){
               if(data.affectedRows>0){
                   res.json({"code":200})
               }else{
                   res.json({"code":100})
               }
         })
       }else{
            res.json({"code":100});
       }
   })
})


router.get('/zygame',function(req,res,next){
    var code = req.query.code;
    var rUrl = config.cyFj;
    // if(code==undefined || code==""){
    //     res.redirect(301, rUrl);
    //     return false;
    // }
    var userip = tool.get_client_ip(req);
    var curtime = tool.getDateTime();
    var pvdata = {"adr_pv":userip,"adr_uv":userip,"req_time":curtime,"sub_type":2}
    model.insertData('req_pv_uv',pvdata,function(st){console.log(st);})
    res.render('zygame',{});
})

router.post('/setPeople',function(req, res, next){
    model.updateCount('doctor_count',function(st){
        console.log(st);
    })

    res.json({"code":200});
})

router.get('/subject', function(req, res, next) {
  res.render('subject');
});


router.get('/sh_r', function(req, res, next) {
  res.render('sh_r');
})

router.get('/sh_r2', function(req, res, next) {
  res.render('sh_r2');
})


router.get('/nop', function(req, res, next) {
  res.render('noppor');
})


router.get('/sh_end', function(req, res, next) {
  res.render('sh_end');
})


router.get('/sh_xxr', function(req, res, next) {
  res.render('sh_xxr');
})

router.post('/getTitle',function(req,res,next){
  var gId = req.body.gId;
  console.log(gId);
  var data = {"id":gId};
  async.parallel([
    function(cb){
      games.findAlltab('doctor_cy',data,cb);
    }
  ],function(err,results){
    console.log(11111);
    console.log(results);
    res.json({"data":results[0][0]});
  })
})


router.post('/shTitle',function(req,res,next){
  var gId = req.body.gId;
  console.log(gId);
  var data = {"id":gId};
  async.parallel([
    function(cb){
      games.findAll(data,cb);
    }
  ],function(err,results){
      // results[0][0].IMG="病人、年老体弱，少气声低，小便清长，甚至有余理不尽，夜间尤重，证属_________。";
      // results[0][0].ONE="天气你邮费多少的身份来到";
      // results[0][0].TWO="凉快地方的佛挡杀佛";
      // results[0][0].THREE="大风大浪发动机乱收费打瞌睡了反倒是家乐福的康师傅就"
      // results[0][0].FOUR="气温回暖大幅度的"
    res.json({"data":results[0][0]});
  })
})

router.post('/count',function(req,res,next){
   var count = req.body.count;
    async.parallel([
      function(cb){
        counts.update(count,cb);
      }
    ],function(err,results){
      console.log(results[0][0]);
      res.json({"data":results[0][0]});
    })
});

router.get('/share1',function(req,res,next){

   res.render('share', { });
})

router.get('/share2',function(req,res,next){
   // var tc = tool.fRandomBy(1,15);
    async.parallel([
      function(cb){
        var data = {"id":1};
        counts.findAll(data,cb);
      }
    ],function(err,results){
      var ct = results[0][0].COUNT;
          ct = ct + 1;
      res.render('share2', {"data":ct});
    })
})

router.get('/share3',function(req,res,next){

  res.render('share3', { });
})


router.post('/getOpenId',function(req,res,next){
    var code = req.query.code;
    async.parallel([
        function(cb){
            wxFun.getOpenId(code,cb);
        }
    ],function(err,results){
        res.json({ "wxId": results });
    })
})

module.exports = router;
