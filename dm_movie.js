var msgList = new Array();
var divMsgList = new Array();
var msgCount = 0;
var current_div_container;
var last_div_container;
var current_div_barrager;
var last_div_barrager;


var dWord = function(info,color,size,animate){
    this.info = info;
    if( null == color){
        this.color = '#fff';
    }else{
        this.color = color;
    }
    this.size = size+'px';
    this.sizeNum = size;
    this.animate = animate;
}

var showWord = function(){
    msgList.push(new dWord('今天','#fff',120,'bounceInRight'));
    msgList.push(new dWord("我想对我妈妈说",'#fff',30,'bounceInUp'));
    msgList.push(new dWord("小时候",'#fff',100,'zoomIn'));
    msgList.push(new dWord("你为了让我过的更好",'#fff',30,'flipInX'));
    //msgList.push(new dWord("这是一个测试012012"));
    //msgList.push("这是一个测试234234");
    //msgList.push("hahahaha6666");
    //zoomIn();
    drawDWord();
}

function getRandomNum(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

var drawDWord = function(){
    var dWord = msgList.shift();
    if( null == current_div_container){
        current_div_container = $('<div  id="container" class="first"></div>').appendTo($('body'));
    }
    var div_b = $('<div class="danmuText animated '+dWord.animate+'">'+dWord.info+'</div>').appendTo(current_div_container);
    div_b.css('color',dWord.color);
    div_b.css('font-size',dWord.size);
    div_b.on('webkitAnimationEnd', function () {
          //console.log(div_b.html()+' divMsgList.length'+divMsgList.length);
          divMsgList.push(div_b);
          if(divMsgList.length > 0 && msgList.length > 0 ){
                for(var i=0;i<divMsgList.length;i++){
                    var dTop = divMsgList[i].css('top');
                    dTop = dTop.substring(0,dTop.length-2);
                    var moveTop = (dTop - div_b.height())-20;
                    if( moveTop < 0 ){
                        moveTop = 0;
                    }
                    console.log('moveTop='+moveTop);
                    //当无法移动时需要缩小当前画面
                    if( moveTop == 0){
                        //current_div_container.css("-webkit-transform","scale(0.8)");
                    }
                    //判断当向上移动最后一条文字时 需要递归去重新画
                    if( i == divMsgList.length-1 ){
                        divMsgList[i].animate({top:moveTop+"px"},500,'linear',function(){
                            drawDWord();
                        });
                    }else{
                        divMsgList[i].animate({top:moveTop+"px"},500,'linear');
                    }
                }
          }
    });
}