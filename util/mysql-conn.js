
/**
 * Created by zhuqingsong on 2016/4/22.
 */
 var mysql = require("mysql");
 var pool = mysql.createPool({
     host:"zqsdoctorapp.mysql.rds.aliyuncs.com",
     user:"zqs_admin",
     password:"zqs456ZQS321",
     database:"my_admin"
 });
 function query(sql){
     var p = new Promise(function(resolve, reject){
         pool.getConnection(function(err,connection){
             connection.query(sql, function (err,rows) {
                 if(err){
                     throw err;
                 }
                 resolve(rows);
                 connection.release();
             });
         })
     });
     return p;
 }
 exports.query = query;
