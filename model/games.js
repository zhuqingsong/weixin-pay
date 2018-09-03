/**
 * Created by zhuqingsong on 2016/12/19.
 */

var conn = require('../util/mysql-conn.js');
var $ = require('underscore');
var games = function(){
    this.table = 'doctor_sh';
}

games.prototype.findAll = function(data,callback){
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

            console.log(row);

            tempAccount = $.map(row, function (c) {   //返回字段定义
                return {
                    ID:c.id,
                    TITLE: c.q_tit,
                    ONE: c.a_one,
                    TWO: c.a_two,
                    THREE: c.a_three,
                    FOUR: c.a_four,
                    RESULT: c.a_result,
                }
            })
            callback(null,tempAccount);
        });
}



games.prototype.findAlltab = function(tablename,data,callback){
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
            sql="select * from "+tablename+" where 1=1" + params + " limit " + data.offset + "," + data.rows;
        }else{
            sql="select * from "+tablename+" where 1=1" + params;
        }
        console.log(sql);
        var tempAccount={};
        conn.query(sql).then(function(row) {

            console.log(row);

            tempAccount = $.map(row, function (c) {   //返回字段定义
                return {
                    ID:c.id,
                    TITLE: c.q_tit,
                    ONE: c.a_one,
                    TWO: c.a_two,
                    THREE: c.a_three,
                    FOUR: c.a_four,
                    RESULT: c.a_result,
                    IMG:c.img_name
                }
            })
            callback(null,tempAccount);
        });
}


games.prototype.fintCount = function(data,callback){
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
    var sql = "select count(*) as count from " + that.table + " where 1=1" + params;
    conn.query(sql).then(function(row) {
        var count = $.map(row, function (c) {   //返回字段定义
            return {
                total:c.count,
            }
        })
        callback(null,count);
    });
}

var Games = new games();
module.exports = Games;
