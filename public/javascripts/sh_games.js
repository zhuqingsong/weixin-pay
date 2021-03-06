/**
 * Created by zhuqingsong on 2016/12/19.
 */

(function(window, document){
    function Games(){
        this.init();
    };
    Array.prototype.indexof=function(value){
      var a = this;//为了增加方法扩展适应性。我这稍微修改了下
        for(var i = 0; i < a.length; i++) {
            if (a[i] == value)
                return i;
        }
    }
    Games.prototype = {
        hand:"",
        answer:"",
        ArrNum :[],
        EQ:0,
        time:30,
        flag:true,
        init:function(){
            var that = this;
                that.getFirst();
            var Q = ['A','B','C','D'];
            $(document).on("touchstart",".sh-list li",function(){
                if(!that.flag){
                    return false;
                }
                that.flag = false;
                var index = $(this).index(".sh-list li");
                if(Q[index] == that.answer){
                    ++that.EQ;
                    $(this).append('<i class="t"></li');
                    clearInterval(that.hand);
                    that.time = 30;
                    if(that.EQ>=10){
                        window.location.href=URL+"/sh_end?q="+that.EQ;
                        return false;
                    }
                    setTimeout(function(){
                        that.getFirst();
                        that.flag = true;
                    },500);
                }else{
                     that.flag = false;
                    $(this).append('<i class="f"></li');
                    var trindex  = Q.indexof(that.answer);
                    $(".sh-list li").eq(trindex).append('<i class="t"></li');
                    setTimeout(function(){
                        clearInterval(that.hand);
                        if(that.EQ<=5){
                            window.location.href=URL+"/sh_r";
                        }
                        if(that.EQ>6 && that.EQ<=9){
                            window.location.href=URL+"/sh_r2";
                        }
                    },1500)
                }
            });
        },
        getRandomNum:function(under, over){
            switch(arguments.length) {
                case 1:
                    return parseInt(Math.random() * under + 1);
                case 2:
                    return parseInt(Math.random() * (over - under + 1) + under);
                default:
                    return 0;
            }
        },
        _req:function(id,callback){
            var data = {"gId":id};
            $.when(ajax(data,"/shTitle")).done(function(obje){
                callback(obje);
            })
        },
        _setHtml: function (obje) {
            console.log(obje);
            obje.data.EQ=this.EQ + 1;
            // obje.data.IMG="img/ej.jpg";
            var that = this;
            var tmpl = $('#gameTmpl').html(), htmls = [];
           // $.each(obje,function(i, n){
                var html = tmpl.replace(/\[([^\[\]]+)\]/g, function(ct, $1){
                    return obje.data[$1];
                });
                htmls.push(html);
           // })
            $('#gameBox').html(htmls.join(""));
            this._time();
        },
        getFirst:function(){
            var that = this;
            var num=0;
            for(var i=0;i<10;i++){
                num = that.getRandomNum(601,850);
                if(that.ArrNum.indexOf(num)==-1 && num !="" && num !=undefined){
                    that.ArrNum.push(num);
                    break;
                }else{
                    continue ;
                }
            }
            that._req(num,function(obje){
                that._setHtml(obje);
                that.answer = obje.data.RESULT;
            })
        },
        _time:function(){
            var that = this;
          that.hand = setInterval(function(){
                --that.time;
              if(that.time<0){
                  clearInterval(that.hand);
                  if(that.EQ<=3){
                      window.location.href=URL+"/sh_r";
                  }
                  if(that.EQ>3 && that.EQ<=9){
                      window.location.href=URL+"/sh_r2";
                  }
              }else{
                  $("#Time").html(that.time);
              }
            },1000);
        }

    }

    window._games = new Games;
})(window, document);
