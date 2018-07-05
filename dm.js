//当前屏幕弹幕数量
var currentDmCount=0;

//当前弹幕的底边
var currentDmBottom=-12345;

//活动开始时间
var dm_partyTime;
//电影开始时间
var dm_movieTime;

//正在进行的活动
var dm_partyId;

var dm_currentParty;

var isInitCss3 = false;


/**
*弹幕使用
**/
var barrager = function(barrage,removeCallBack){
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

    //var bottom = (barrage.bottom == 0) ? Math.floor(Math.random() * window_height + 40) : barrage.bottom;
    var bottom = dmBottom();
    div_barrager.css("bottom", bottom + "px");

    if(_show =='r'){
        if(barrager.isOpDanmu){
            div_barrager.css('left','-500px');
        }else{
            div_barrager.css('right','-500px');
        }

    }else if(_show == 'l'){
        if(barrager.isOpDanmu){
            div_barrager.css('right','-500px');
        }else{
            div_barrager.css('left','-500px');
        }
    }

    div_barrager_box = $("<div class='barrage_box cl'></div>").appendTo(div_barrager);
    if(barrage.img){
        //div_barrager_box.append("<div class='portrait1 z'></div>");
        var img = $("<img src='' >").appendTo(id + " .barrage_box");
        img.attr('src', barrage.img);
        img.css('width',100*_expressionScale+'px');
    }

    div_barrager_box.append(" <div class='p'></div>");
    var content = $("<p></p>").appendTo(id + " .barrage_box .p");
    content.append(barrage.info);


    if(navigator.userAgent.indexOf("MSIE 6.0")>0  ||  navigator.userAgent.indexOf("MSIE 7.0")>0 ||  navigator.userAgent.indexOf("MSIE 8.0")>0  ){
        content.css('color', barrage.old_ie_color);
    }else{
        content.css('color', barrage.color);
    }

    content.css('font-size',_fontSize);
    var pWidth = barrage.info.length * _fontSize;
    content.css('width',pWidth);

    ++currentDmCount;

    var i = 0;
    div_barrager.css('margin-right', i);
    var looper = setInterval(barrager, barrage.speed);

    function barrager() {
        var window_width = $(window).width() + pWidth;
        if (i < window_width) {
            i += 1;
            if(_show =='r'){
                $(id).css('margin-right', i);
            }else{
                $(id).css('margin-left', i);
            }
        } else {
            $(id).remove();
            --currentDmCount;
            if( currentDmCount<0){
                currentDmCount =0;
            }
            clearInterval(looper);
            if( removeCallBack ){
                removeCallBack();
            }
            return false;
        }
    }
}

//计算弹幕的高度
var dmBottom = function(isImg){
    var window_height = $(window).height() - 100;
    if(isImg){



    }else{
        if( currentDmBottom == -12345 ){
            if(_topShow){
                currentDmBottom = window_height;
            }else{
                currentDmBottom = 0;
            }
        }else{
            if(_topShow){
                currentDmBottom = currentDmBottom - _fontSize;
                if( currentDmBottom < 0 ){
                    currentDmBottom = window_height;
                }
            }else{
                currentDmBottom = currentDmBottom + _fontSize;
                if( currentDmBottom > window_height ){
                    currentDmBottom = 0;
                }
            }
        }
    }

    return currentDmBottom;
}


var initCss3Barrager = function(){
    if(!isInitCss3){
        let style = document.createElement('style');
        var heads = document.getElementsByTagName("head");
        if(heads.length)
        heads[0].appendChild(style);
        else
        document.documentElement.appendChild(style);
        let width = window.innerWidth;
        if(_show =='r'){
            style.sheet.insertRule('@-webkit-keyframes danmu { from { visibility: visible; -webkit-transform: translateX('+width+'px); } to { visibility: visible; -webkit-transform: translateX(0); } }', 0);
            style.sheet.insertRule('@-webkit-keyframes opDanmu { from { visibility: visible; -webkit-transform: translateX(-100%); } to { visibility: visible; -webkit-transform: translateX('+width+'px); } }', 0);
            style.sheet.insertRule('@-webkit-keyframes endDanmu { from { visibility: visible; -webkit-transform: translateX(0); } to { visibility: visible; -webkit-transform: translateX(-100%); } }', 0);
        }else if(_show == 'l'){
            style.sheet.insertRule('@-webkit-keyframes danmu { from { visibility: visible; -webkit-transform: translateX(-100%); } to { visibility: visible; -webkit-transform: translateX('+width+'px); } }', 0);
            style.sheet.insertRule('@-webkit-keyframes opDanmu { from { visibility: visible; -webkit-transform: translateX('+width+'px); } to { visibility: visible; -webkit-transform: translateX(-100%); } }', 0);
        }
        isInitCss3=true;
    }

}

//css3弹幕
var css3Barrager = function(barrage,removeCallBack){
    var time = new Date().getTime();
    var barrager_id = 'barrage_' + time;

    var innerHtml =barrage.info;
    if(barrage.img){
        innerHtml='<img src="'+barrage.img+'" style="width:'+100*_expressionScale+'px" />';
    }

    var className = 'danmu';
     if(barrage.isOpDanmu){
        className='opDanmu';
     }

    var div_barrager = $("<div class='"+className+"' id='" + barrager_id + "'>"+innerHtml+"</div>").appendTo($('body'));
    div_barrager.css('color',barrage.color);
    var bottom;
    if(barrage.bottom == 0){
        bottom = dmBottom();
        barrage.bottom = bottom;
    }else{
        bottom = barrage.bottom;
    }
    div_barrager.css('bottom',bottom+'px');
    var speed = 10*(1.1-_dmspeed);
    div_barrager.css('animationDuration',speed+'s');
    div_barrager.css('font-size',_fontSize);
    ++currentDmCount;

    var screenWidth = window.innerWidth;
    var divWidth = div_barrager.width();


    div_barrager.on('webkitAnimationEnd', function () {
        --currentDmCount;
        if( currentDmCount<0){
            currentDmCount =0;
        }
        var dt = (divWidth+5)/(screenWidth/speed);

        writelog('div_barrager time:'+dt);
        $(this).addClass('endDanmu').css('animationDuration',dt+'s').on('webkitAnimationEnd',function(){
                $(this).remove();
                if( removeCallBack ){
                    removeCallBack();
                }
        });
        //如果是局域网主机，需要像本地其他机器推送弹幕
        if(isMaster){
            sendLocalDm(JSON.stringify(barrage));
        }
    });
}


/**
* 视频播放
**/
var playVideo = function(videoUrl){
    $('<video id="myvideo" autoplay loop></video>').appendTo($('body'));
    var video = document.getElementById("myvideo");
    video.src=videoUrl;
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


var timerDm = function(partyId,num){
    var fs = require("fs");
    var timerDmPath = _timerDanmuPath+'/'+partyId;
    var timerDmFilePath = timerDmPath + '/' + partyId + '_'+num+'.json';
    fs.readFile(timerDmFilePath,'utf-8',function(err, data) {
        if( err ){
            writelog(err);
        }else{
            var schedule = require("node-schedule");
            schedule.scheduleJob('*/1 * * * * *', function(){
                var objectList = JSON.parse(data);
                var i=0;
                var now = new Date();
                if( now.getTime() - movieStartTime.getTime() == objectList[i].beginTime){
                    drawDm(objectList[i],true);
                    ++i;
                }
            });
        }
    });

}


var drawDm = function(object , isTimer){
    initCss3Barrager();
    var bottom = 0 ;
    if(object.bottom){
        bottom = object.bottom;
    }
    var item={
         img:'', //图片
         info:'' , //文字
         href:'', //链接
         close:false, //显示关闭按钮
         speed:0, //延迟,单位秒,默认6
         bottom:bottom, //距离底部高度,单位px,默认随机
         color:object.data.color.replace('0x','#'), //颜色,默认白色
         old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
         type:object.type
    }
    if(object.data){
        item.info = object.data.message;
        item.color = object.data.color.replace('0x','#');
    }else if(object.info){
        item.info = object.info;
    }else if( object.color){
        item.color = object.color;
    }

    if (object.type == 'pDanmu') {
        dmws.send('{"type":"danmucount","clientType":"'+_clientType+'","code":"'+getCode()+'","partyId":"'+dm_currentParty.partyId+'","data":'+currentDmCount+'}');
        css3Barrager(item,function(){
            dmws.send('{"type":"danmucount","clientType":"'+_clientType+'","code":"'+getCode()+'","partyId":"'+dm_currentParty.partyId+'","data":'+currentDmCount+'}');
        });
    }else if( object.type == 'expression' ){
        var expressionId = '';
        if(object.data.expression){
            expressionId = object.data.expression;
        }else{
            expressionId = object.data.idd;
        }
        writelog('expressionId:'+expressionId);
        var expressionUrl = '';
        writelog(JSON.stringify(dm_currentParty));
        for(var i=0;i<dm_currentParty.expressions.length;i++){
            if(dm_currentParty.expressions[i].id == expressionId){
                expressionUrl = dm_currentParty.expressions[i].url;
            }
        }
        writelog('expressionUrl:'+expressionUrl);
        item.img = expressionUrl;
        css3Barrager(item);
    }else if( object.type == 'bling' ){

    }else if( object.type == 'opDanmu' ){
        item.isOpDanmu = true;
        css3Barrager(item);
    }else if( object.type == 'vedio' ){
        var videoId = object.data.idd;
        var videoUrl = '';
        writelog(JSON.stringify(dm_currentParty));
        for(var i=0;i<dm_currentParty.localVideoUrl.length;i++){
            if(dm_currentParty.localVideoUrl[i].id == videoId){
                expressionUrl = dm_currentParty.localVideoUrl[i].url;
            }
        }
        playVideo(videoUrl);
    }

}






