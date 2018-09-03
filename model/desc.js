/**
 * Created by zhuqingsong on 2016/12/19.
 */

var conn = require('../util/mysql-conn');
var $ = require('underscore');
var desc = function(){
    this.table = 'doctor_desc';
}

desc.prototype.findAll = function(data,callback){
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
        var tempAccount={};
        conn.query(sql).then(function(row) {
            tempAccount = $.map(row, function (c) {   //返回字段定义
                return {
                    ID:c.id,
                    DESC: c.d_desc,
                }
            })
            callback(null,tempAccount);
        });
}

var Desc = new desc();
module.exports = Desc;
