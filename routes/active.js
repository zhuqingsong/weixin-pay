var express = require('express');
var router = express.Router();
var requestify = require("requestify");
var request=require("request");
var model = require("../model/getModel.js");
var fs = require("fs");
var path = require('path');
var tool = require('../util/tool');
router.get('/', function(req, res, next) {


  var nameArr = ['扁鹊','陈修园','华佗','皇甫谧','黄帝','李时珍','刘渡舟','钱乙','神农','孙思邈','叶天士','张景岳','张仲景','李培生']


  //var nickname = req.cookies.nickname;
// console.log('headimgurl:'+req.cookies.headimgurl,nickname);
    var headimgurl = req.cookies.headimgurl;
    var fileName = Number(new Date());
        fileName = fileName + '.jpg'
    var uploadPath = path.resolve(__dirname, '../public/uploadImg/' + fileName);
    // var headimgurl = "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epcHqhK0CN3yXicLJicjw0F8FZ2FtIP4rznIKRWVMMRteUP6FAh5WLOUmrHHfr1CGDFprOq5icFP8eOw/132";
    var Usname = req.query.Usname;
    console.log(Usname);
    var data = {"id":2};
    var romNum = tool.fRandomBy(0,13);
    model.findOne('doctor_count',data,function(arg){
      download1(headimgurl,uploadPath,function(){
          headimgurl = "/uploadImg/"+fileName;
          var doctorimg = "/active/image/header/" + romNum + '.jpg';
          res.render('active', { "doctorname":nameArr[romNum],"doctorheader":doctorimg, "nickname": Usname, "headimgurl":headimgurl,"count":arg[0].count,"rom":romNum });
      })
    });


});


function download1(url,filename,fn){
        request(url).pipe(fs.createWriteStream(filename).on("close",function(err,res){
              if(err){
                  console.log(err);
              }else{
                    fn&&fn();
              }
        }))
}

router.get('/addteam', function(req, res, next) {
     console.log(1111);
      var sql = "select * from code_img where is_use=0 order by id asc limit 0,1";
      var myDate = new Date();
      var hours = myDate.getHours();
      console.log(hours);
      if(hours<9 || hours>=22){
         res.render('addteam', {"img":'fwh.png',"q_name":'' })
         return false;
      }
      model.findSql(sql,function(data){
          console.log(data)
          if(data.length>0){
              res.render('addteam', {"img":"kefuhao.jpg","q_name":"" })
          }else{
              res.redirect(301, '/active/updateSt');
          }
      })
})

router.get('/updateSt',function(req, res, next){
    res.render('updateSt', {})
})

router.post('/updatecode',function(req, res, next){
      var sql = "update code_img set is_use=1  where is_use=0 limit 1";
      model.findSql(sql,function(data){
          console.log(data)
          if(data.affectedRows > 0){
             res.json({"msg":"替换成功了",code:'1'});
          }else{
             res.json({"msg":"已没有可替换的二维码群了,联系祝青松",code:'0'});
          }
                //res.render('addteam', {"img":data[0].code_img,"q_name":data[0].q_name })
      })
})





router.get('/sh_subject_question',function(req, res, next) {
  var openid = req.cookies.openid;
  console.log(openid);
  var sql = "select * from sh_an where user_openid ='"+openid+"'"
  console.log(sql);
  model.findSql(sql,function(usermsg){
      console.log(usermsg);
      if(usermsg.length==0){
            var userData = {"user_openid":openid,"ans_num":5};
            model.insertData('sh_an',userData,function(usermsg){})
            res.render('sh_question',{});
            return false;
      }
      if(parseInt(usermsg[0].ans_num)>0){
            res.render('sh_question',{});
            return false;
      }else{
            res.redirect(301, '/nop');
            return false;
      }
  })
})


module.exports = router;
