/**
 * Created by zhuqingsong on 2016/7/15.
 */

(function(window){
    function BMHome(){
        var that = this;
        $(function(){
            that._init();
            if(!getSession("wxid")){
                alert(222);
                getOpenId();
            }
        })
    }
    BMHome.prototype={
        FAG:true,
        _init:function(){
            var that = this;
            $(".over").click(function(){
                $(".ts").slideDown();
            })
            $(".ts .close").click(function(){
                $(".ts").slideUp();
            })
            $(".BTN").click(function(){
              alert(111)
                var wxid = 'o8YJY5HKE3nk5qt18WekL-_RrYsE';
                        var payData = {"wxid":wxid,"tfee":1};
                          _payAjax(payData,function(res){
                            alert(res)
                              if(res == "get_brand_wcpay_request:ok") {
                                  //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                  that.FAG=true;
                                  that.addUserMsg(wxid);
                              }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                                  alert("订单支付失败！");
                                  that.FAG=true;
                              }else if(res.err_msg == "get_brand_wcpay_request:fail"){
                                  alert("订单支付失败！");
                                  that.FAG=true;
                              }
                          })
                        })
        },
        _checkBm:function(wxid,callback){
            var that = this;
            var checkData = {"wxId":wxid};
            $.when(that._reqAjax(checkData,"/users/isReg")).done(function(obje){
                    callback(obje);
            })
        },
        addUserMsg:function(wxid){
            var that = this;
            var username = $("#username").val();
            var tel = $("#tel").val();
            var fnumber = $("#fnumber").val();
            var profession = $(".sel").val();
            var code = that.getParam("code");
            var data = {"username":username,"tel":tel,"num":fnumber,"profession":profession,"wxId":wxid};
            $.when(that._reqAjax(data,"/users/addUser")).done(function(obje){
                if(obje.noid){
                    window.location.href='/success?openId='+wxid;
                }
            })
        },
        _checkMsg:function(callback){
            var that = this;
            var username =$("#username").val();
            if(!$.trim(username)){
                $("#errts").html("亲,需要填写一个姓名.");
                $("#errts").addClass("ec").removeClass("tc");
                $("#username").focus();
                callback(false);
                return false;
            }else{
                $("#errts").html("已成功使用朋友券,系统将在补缴学费时减100元。");
                $("#errts").addClass("tc").removeClass("ec");
            }
            var tel = $("#tel").val();
            if(!that._checkTel(tel)){
                $("#errts").html("亲,请填写一个正确的手机号码.");
                $("#errts").addClass("ec").removeClass("tc");
                $("#tel").focus();
                callback(false);
                return false;
            }else{
                $("#errts").html("已成功使用朋友券,系统将在补缴学费时减100元。");
                $("#errts").addClass("tc").removeClass("ec");
            }
            var fnumber = $("#fnumber").val();
            if($.trim(fnumber)){
                var data = {"codeid":fnumber}
                $.when(that._reqAjax(data,"/users/checkCode")).done(function(obje){
                    if(obje.data==0){
                        $("#errts").html("亲,不存在的朋友券哦.");
                        $("#errts").addClass("ec").removeClass("tc");
                        $(".yh-box span.err").addClass("bg2").removeClass("bg1");
                        callback(false);
                        return false;
                    }else{
                        callback(true);
                        $(".yh-box").addClass("bg1").removeClass("bg2");
                        return false;
                    }
                })
            }else{
                callback(true);
                return false;
            }

        },
        _checkTel:function(tel){
           // var tel = 18767802354;
            var reg = /^0?1[3|5|7|8][0-9]\d{8}$/;
            if (reg.test(tel)) {
                return true;
            }else{
               return false;
            };
        },
        _reqAjax:function(data,url){
            var defer = $.Deferred();
            $.ajax({
                type : "POST",
                url : url,
                dataType:"json",
                //async: false,
                data : JSON.stringify(data),
                cache : false,
                contentType:"application/json; charset=utf-8",
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    // alert("返回数据错误");
                },
                success : function(response) {
                    //var resp=$.parseJSON(response);
                    //Strs = response;
                    defer.resolve(response)
                    //_public_.load_CLOSED();
                }
            });

            return defer.promise();
        },
        getParam:function(name){
            var search = document.location.search;
            var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");
            var matcher = pattern.exec(search);
            var items = null;
            if(null != matcher){
                try{
                    items = decodeURIComponent(decodeURIComponent(matcher[1]));
                }catch(e){
                    try{
                        items = decodeURIComponent(matcher[1]);
                    }catch(e){
                        items = matcher[1];
                    }
                }
            }
            return items;
        }
    }
    window.BMHome = new BMHome;
})(window);
