/**
 * Created by zhuqingsong on 2016/7/28.
 */

function setSession(order,list){
    sessionStorage.setItem(order, JSON.stringify(list));
}
function getSession(order){
    var orders = JSON.parse(sessionStorage.getItem(order));
    return orders;
}

function getParam(name){
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
function getOpenId () {
    var code = getParam("code");
    alert(code);
    $.ajax({
        url: URL + "/getOpenId?code="+code,
        type: "post",
        dataType: "json",
        success: function (r) {
            alert(r.wxId);
            setSession("wxid", r.wxId);
        }
    })
}
