/**
 * Created by zhuqingsong on 2016/7/11.
 */

exports.setRequestUrl = function(app){
    var routes = require('./routes/index'),
        controller = require('./routes/wxcontroller'),
        users = require('./routes/users'),
        active = require('./routes/active'),
        wxpay = require('./routes/wxpay');



/*    app.all("*",function(req,res,next){
     var path = req.originalUrl;
        var userName = req.session.name;
         var needLogin = require('./util/need-login');
         var err = "";
         if(needLogin(path)){
         var login = req.session.name;
         if(!login){
             err = new Error('Not Login');
             err.status = 500;
             res.redirect("/login");
             return;
         }else{
            next();
         }
         }else {
             next();
         }
     })*/
    app.use('/wx',controller);
    app.use('/', routes);
    app.use('/wxpay',wxpay);
    app.use('/active',active);
    app.use('/users', users);
}
