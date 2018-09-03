/**
 * Created by zhuqingsong on 2016/5/13.
 */

var crypto = require('crypto');


exports.dqtime = '2016-08-01 00:00:00';

exports.good_body="shanghanlun";

exports.total_fee ="1";

exports.md5=function(text){
    return crypto.createHash('md5').update(text).digest('hex');
}

exports.sha1 =function(text){
    return crypto.createHash('sha1').update(text).digest('hex').toString('base64');
}

exports.cutstr=function(str,i){
    return str.substr(i,6);
}

exports.format=function(fmt){
    var date = new Date();
    var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
}

exports.formatUnix = function(sjc){
    var d = new Date(sjc);
    var unixTime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    return unixTime;
}

exports.fRandomBy = function(under, over){
    switch(arguments.length){
        case 1: return parseInt(Math.random()*under+1);
        case 2: return parseInt(Math.random()*(over-under+1) + under);
        default: return 0;
    }
}

exports.get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
};


exports.getDateTime = function(){
  var time = new Date();
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  var ymdhms = y +'年'+add0(m)+'月'+add0(d)+'日'+add0(h)+':'+add0(mm)+':'+add0(s);
    return ymdhms;
}

function add0(m){
  return m<10?'0'+m:m
}

exports.totalObj = function(totalPerson){
    var study_money = [4800,3600,2700,2000,1200];
    var voucher = [25,15,5,0];
    var resArr= {};
    if(totalPerson<=100){
        resArr.study_m=study_money[0];
    }
    if(totalPerson>100 && totalPerson<=300){
        resArr.study_m=study_money[1];
    }
    if(totalPerson>300 && totalPerson<=600){
        resArr.study_m=study_money[2];
    }
    if(totalPerson>600 && totalPerson<=1000){
        resArr.study_m=study_money[3];
    }
    if(totalPerson>1000){
        resArr.study_m=study_money[4];
    }
    if(totalPerson<=100){
        resArr.voucher_m=voucher[0];
    }
    if(totalPerson>100 && totalPerson<=300){
        resArr.voucher_m=voucher[1];
    }
    if(totalPerson>300 && totalPerson<=600){
        resArr.voucher_m=voucher[2];
    }
    if(totalPerson>600){
        resArr.voucher_m=voucher[3];
    }
    return resArr;
}
exports.generateNonceString = function(length){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = "";
    for (var i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
};

exports.getClientIp= function(req){
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

exports.msgData = function(noid,openid){
   var templeMsg ={
        "touser":openid,
        "template_id":"iA1uQmVmeNlSaaKlNeeYPd4km-WRRkDkUJt9LNNVIA8",
        "url":"http://bm.eyexing.com/lucky",
        "data":{
            "title": {
                "value":"尊敬的学员您好!",
                "color":"#000"
            },
            "headinfo":{
                "value":"恭喜您获得幸运学号！",
                "color":"#ff0000"
            },
            "program": {
                "value":"幸运学号:",
                "color":"#000"
            },
            "result": {
                "value":noid,
                "color":"#ff0000"
            },
            "remark":{
                "value":"请在报名截止日前,联系中医读经典官方客服微信号13552500763,提供学号+姓名，特别安排进班!",
                "color":"#173177"
            }
        }
    }
    return templeMsg;
}



exports.msgTs = function(openid){
    var templeMsg ={
        "touser":openid,
        "template_id":"7gS9pj4I9LozsCx51KhaRWl72gAu5PleCn2bcQKqUuA",
        "data":{
            "userName": {
                "value":"各位中医朋友！",
                "color":"#000"
            },
            "courseName":{
                "value":"肖相如伤寒论第二期学习班（全本篇）8月20号 开始补交学费,大家目前的补交学费金额已经扣除掉了报名费400元。请按照补交学费的显示的金额，在公众号内进行补交。",
                "color":"#ff0000"
            },
            "date": {
                "value":"8月24号",
                "color":"#ff0000"
            },
            "remark":{
                "value":"报名成功进班学习，可回复 1 \n操作错误等其他特殊情况咨询，可回复 2",
                "color":"#173177"
            }
        }
    }
    return templeMsg;
}
