var msgList = new Array();
var divMsgList = new Array();
var msgCount = 0;
var current_div_container;
var last_div_container;
var current_div_barrager;
var last_div_barrager;

var showWord = function(word){
    msgList.push("这是一个测试");
    msgList.push("这是一个测试123132");
    msgList.push("这是一个测试456456");
    msgList.push("这是一个测试789789");
    msgList.push("这是一个测试012012");
    //msgList.push("这是一个测试234234");
    //msgList.push("hahahaha6666");
    zoomIn();
}

function getRandomNum(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

var zoomIn = function(){
    var time = new Date().getTime();
    var barrager_id = 'barrage_' + time;
    if(msgList.length>0){
        var msg = msgList.shift();
        if( null == current_div_container || msgCount % 3 == 0){
            last_div_container  = current_div_container;
             var className = '';
            if(msgCount==0){
                className = 'first';
            }else{
                className = 'second';
            }
            current_div_container = $('<div  id="container_' + barrager_id + '" class="'+className+'">'+msg+'</div>').appendTo($('body'));
        }
        ++msgCount;
        if( null!= current_div_barrager){
            last_div_barrager = current_div_barrager;
        }
        current_div_barrager = $('<div  id="' + barrager_id + '" class="animated rubberBand danmuText">'+msg+'</div>').appendTo(current_div_container);
        var fontSize = getRandomNum(20,100);
        current_div_barrager.css('font-size',50);
        divMsgList.push(current_div_barrager);
        if(msgCount>0){
            //for(var i=0;i<divMsgList.length;i++){
                //divMsgList[i].animate({top:fontSize+"px"},2000);
           // }
        }
        current_div_barrager.on('webkitAnimationEnd', function () {
            for(var i=0;i<divMsgList.length;i++){
                var dTop = divMsgList[i].css('top');
                dTop = dTop.substring(0,dTop.length-2);
                var moveTop = dTop - 50;
                divMsgList[i].animate({top:moveTop+"px"},500,'linear',function(){
                    zoomIn();
                });
            }
        });
        if(msgCount % 3 == 0){
            current_div_barrager.on('webkitAnimationEnd', function () {
                //last_div_container.addClass("anticlockwise");
            });
        }

    }


}