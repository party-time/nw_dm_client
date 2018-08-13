var msgList = new Array();
var divMsgList = new Array();
var msgCount = 0;
var current_div_turn;
var last_div_turn;
var current_div_paragraph;
var divMsgIndex = 0;
var firstDiv;
var firstDivTop = 400;


var dWord = function(info,color,size,animate,type){
    this.info = info;
    if( null == color){
        this.color = '#fff';
    }else{
        this.color = color;
    }
    this.size = size+'px';
    this.animate = animate;
    //0是向左倒 1是向右倒 2是文字
    if( null == type){
        this.type = 2;
    }else{
        this.type = type;
    }

}

var showWord = function(){
    msgList.push(new dWord('今天','#fff',130,'bounceInRight'));
    msgList.push(new dWord('我想对我妈妈说','#fff',20,'bounceInUp'));
    msgList.push(new dWord('小时候','#fff',90,'zoomIn'));
    msgList.push(new dWord('你为了让我过的更好','#fff',20,'flipInX'));
    msgList.push(new dWord('你独自去广东工作','#fff',30,'flipInX'));
    msgList.push(new dWord('到自己创业','#fff',100,'flipInX'));
    msgList.push(new dWord('经历了很多的坎坷','#fff',20,'flipInX'));
    msgList.push(new dWord('','',20,'',0));
    msgList.push(new dWord('经历了很多的坎坷','#fff',20,'flipInX'));
    //msgList.push("hahahaha6666");
    //zoomIn();
    drawDWord();
}

var animationEnd = (function(el) {
  var animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement('div'));

function getRandomNum(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}


var drawDWord = function(){
    var dWord = msgList.shift();
    //当无法取得弹幕对象 就退出
    if( null == dWord){
        return;
    }
    ++msgCount;
    if( null == current_div_turn || dWord.type < 2){
        last_div_turn = current_div_turn;
        current_div_turn = $('<div class="turnDiv"></div>').appendTo($('body'));
        current_div_paragraph = null;
    }
    if( null == current_div_paragraph){
        current_div_paragraph = $('<div class="paragraph"></div>').appendTo(current_div_turn);
    }
    if( null != last_div_turn){
        if(dWord.type == 0){
            last_div_turn.css('transform-origin','0 100%');
            last_div_turn.addClass('leftRotate');
            setTimeout(function(){
                drawDWord();
            },500)
        }
    }
    var div_b = $('<div class="danmuText animated '+dWord.animate+'">'+dWord.info+'</div>').appendTo(current_div_paragraph);
    div_b.css('color',dWord.color);
    div_b.css('font-size',dWord.size);
    //第一条弹幕出现的位置
    if(msgCount==1){
        div_b.css('margin-top',firstDivTop+'px');
        firstDiv = div_b;
    }else{
        div_b.css('margin-top','20px');
    }
    div_b.on('webkitAnimationEnd', function () {
        var dTop = firstDiv.css('margin-top');
        dTop = dTop.substring(0,dTop.length-2);
        var moveTop = dTop - div_b.height();
        if( moveTop < 0 ){
            //moveTop = 0;
        }
        //判断当前div的高度 当div的高度大于初始高度时 缩小画面
        var cdch = current_div_paragraph.height();
        var windowHeight = window.innerHeight;
        console.log('cdch='+cdch+'windowHeight='+windowHeight);
        if( cdch > firstDivTop && cdch < windowHeight){
            current_div_paragraph.addClass('animated divZoom fast');
            current_div_paragraph.one(animationEnd,function(){
                  firstDiv.animate({marginTop:moveTop+"px"},500,'linear',function(){
                          drawDWord();
                  });
            });

        }else if(cdch > windowHeight){
            console.log('firstDiv1'+new Date());
            console.log('firstDiv2'+new Date());
            current_div_paragraph.css('transform-origin','0 100%');
            current_div_paragraph.addClass('divZoomOut');
            current_div_paragraph.one(animationEnd,function(){
                    console.log('firstDiv3'+new Date());
                    firstDiv.animate({marginTop:moveTop+"px"},500,'linear',function(){
                          drawDWord();
                    });
            });
        }else{
            //判断当向上移动最后一条文字时 需要递归去重新画
            firstDiv.animate({marginTop:moveTop+"px"},500,'linear',function(){
                    drawDWord();
            });
        }
    });
}