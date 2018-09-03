const db = require('../util/mysql-conn.js');
module.exports.findAll = function(tablename,callback){
	var sql = "select * from " + tablename;
	db.query(sql).then(function(data){
		"use strict";
		callback(data);
	})
};


module.exports.insertData = function(tablename,data,callback){
	var keys = "" , values="";
	if(typeof data == 'object'){
			for(var key in data){
					keys +=key+',';
					values+='"'+data[key]+'",';
			}
	}else{
			callback(0);
			return false;
	}
	keys = keys.substr(0,keys.length-1);
	values = values.substr(0,values.length-1);
	var sql = "insert into "+tablename+ "("+keys+") values("+values+")";
	console.log(sql);
	db.query(sql).then(function(data){
		"use strict";
		callback(data);
	})
};


module.exports.findSql = function(sql,callback){
	db.query(sql).then(function(data){
		"use strict";
		callback(data);
	});
};

module.exports.findOne = function(tablename,data,callback){
	var param = "";
	if(typeof data == 'object'){
			for(var key in data){
					param += key + '="'+ data[key] +'" and ';
			}
	}else{
			callback(0);
			return false;
	}
	param = param.substr(0,param.length - 4);
	var sql = `select * from ${tablename} where ${param}`;
	console.log(sql);
	db.query(sql).then(function(data){
		"use strict";
		callback(data);
	});
};



module.exports.findMore = function(tablename,data,callback){
	var param = "";
	if(typeof data == 'object'){
			for(var key in data){
					param += key + '="'+ data[key] +'" or ';
			}
	}else{
			callback(0);
			return false;
	}
	param = param.substr(0,param.length - 3);
	var sql = `select * from ${tablename} where ${param}`;
	console.log(sql);
	db.query(sql).then(function(data){
		"use strict";
		callback(data);
	});
};



module.exports.updateCount = function(tablename,callback){
    var that = this;
    var sql ="update "+tablename+" set count = count + 1  where id=2";
    db.query(sql,function(err,row){
        if(row.affectedRows > 0 ){
						callback(true);
        }else{
						callback(false);
        }
    })
}
