/**
 * Created by zhuqingsong on 2016/12/19.
 */

var conn = require('../util/mysql-conn.js');
var $ = require('underscore');
var counts = function(){
    this.table = 'doctor_count';
}

counts.prototype.findAll = function(data,callback){
    var that = this;
    var params = '';
    if(typeof data=='object') {

        for (key in data) {
            if (key == 'offset' || key == "rows") {
                continue;
            }
            params += ' and ' + key + '="' + data[key] + '"';
        }
    }
        var sql="";
        if(data.offset || data.rows){
            sql="select * from "+that.table+" where 1=1" + params + " limit " + data.offset + "," + data.rows;
        }else{
            sql="select * from "+that.table+" where 1=1" + params;
        }
        console.log(sql);
        var tempAccount={};
        conn.query(sql).then(function(row) {
            tempAccount = $.map(row, function (c) {   //返回字段定义
                return {
                    ID:c.id,
                    COUNT: c.count,
                }
            })
            callback(null,tempAccount);
        });
}

counts.prototype.update=function(data){
    var that = this;
    var sql ="update "+that.table+" set count = "+data+" where id=1";
    conn.query(sql).then(function(err,row){
        if(row.affectedRows > 0 ){
            return true;
        }else{
            return false;
        }
    })
}


counts.prototype.updateCount =function(data){
    var that = this;
    var sql ="update "+that.table+" set count = count + 1  where id=2";
    conn.query(sql).then(function(err,row){
        if(row.affectedRows > 0 ){
            return true;
        }else{
            return false;
        }
    })
}



var counts = new counts();
module.exports = counts;
