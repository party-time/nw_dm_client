/**
*弹幕使用
**/
var barrager = function(barrage){
    barrage = $.extend({
      close:true,
      bottom: 0,
      max: 10,
      speed: 6,
      color: '#fff',
      old_ie_color : '#000000'
    }, barrage || {});
    var time = new Date().getTime();
    var barrager_id = 'barrage_' + time;
    var id = '#' + barrager_id;
    var div_barrager = $("<div class='barrage' id='" + barrager_id + "'></div>").appendTo($('body'));

    var window_height = $(window).height() - 100;
    var bottom = (barrage.bottom == 0) ? Math.floor(Math.random() * window_height + 40) : barrage.bottom;
    div_barrager.css("bottom", bottom + "px");
    div_barrager_box = $("<div class='barrage_box cl'></div>").appendTo(div_barrager);
    if(barrage.img){
        div_barrager_box.append("<a class='portrait z' href='javascript:;'></a>");
        var img = $("<img src='' >").appendTo(id + " .barrage_box .portrait");
        img.attr('src', barrage.img);
    }

    div_barrager_box.append(" <div class='p'></div>");
    if(barrage.close){
        div_barrager_box.append(" <div class='close z'></div>");
    }

    var content = $("<a title='' href='' target='_blank'></a>").appendTo(id + " .barrage_box .p");
    content.attr({
        'href': barrage.href,
        'id': barrage.id
    }).empty().append(barrage.info);
    if(navigator.userAgent.indexOf("MSIE 6.0")>0  ||  navigator.userAgent.indexOf("MSIE 7.0")>0 ||  navigator.userAgent.indexOf("MSIE 8.0")>0  ){
        content.css('color', barrage.old_ie_color);
    }else{
        content.css('color', barrage.color);
    }

    var i = 0;
    div_barrager.css('margin-right', i);
    var looper = setInterval(barrager, barrage.speed);
    function barrager() {
        var window_width = $(window).width() + 500;
        if (i < window_width) {
            i += 1;
            $(id).css('margin-right', i);
        } else {
            $(id).remove();
            return false;
        }
    }

    div_barrager_box.mouseover(function() {
        clearInterval(looper);
    });

    div_barrager_box.mouseout(function() {
        looper = setInterval(barrager, barrage.speed);
    });

    $(id+'.barrage .barrage_box .close').click(function(){

        $(id).remove();

    })

 }

/**
*ajax获取弹幕使用
**/
var getDanmu = function(){
    $.ajax({
        url: "http://www.party-time.cn/v1/api/javaClient/findHistoryDanmu?partyId=5ad7ef2c91289c1be33698c0&count=300&id=",
        type: "get"
    }).done(function (data) {

        if (data.result == 200 || data.result == 403) {
            var itemList = new Array();
            for(var i=0;i<data.data.length;i++){
                var speed = 6;
                if(data.data[i].data.message.length>10){
                    speed = 12;
                }else{
                    speed = 8;
                }
                var item={
                     img:'', //图片
                     info:data.data[i].data.message, //文字
                     href:'', //链接
                     close:true, //显示关闭按钮
                     speed:speed, //延迟,单位秒,默认6
                     bottom:0, //距离底部高度,单位px,默认随机
                     color:'#fff', //颜色,默认白色
                     old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
               }
               itemList[i] = item;
            }
            var j=0;
            setInterval(function(){
                    barrager(itemList[j]);
                    ++j;
            },2000);
        }
    }).fail(function () {
        alert('获取弹幕失败!');
    });


 }

/**
* 视频播放
**/
var playVideo = function(){
    $('<video id="myvideo" autoplay loop></video>').appendTo($('body'));
    var video = document.getElementById("myvideo");
    video.src='59acfb6791289c66f33183a0.mp4';
    video.play();
    setInterval(function(){
        $('#myvideo').remove();
   },10*1000);
 }

var bling = function(){
    $('<div class="bling" >我是刘伟</div>').appendTo($('body'));
    var div=$(".bling");
    div.css('left','300px');
    div.css('top','300px');
    var i=0;
    div.animate({fontSize:'8em'},"slow");
    setInterval(function(){
        if( i==0 ){
            div.animate({fontSize:'1em'},"slow");
            i=1;
        }else if( i == 1){
            div.animate({fontSize:'8em'},"slow");
            i=0
        }

    },1000);
}





