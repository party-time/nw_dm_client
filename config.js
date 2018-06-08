var _baseProUrl = 'www.party-time.cn';
var _baseTestUrl = 'test.party-time.cn';
var _baseUrl;
var _proIp = '47.93.81.21';
var _testIp = '101.201.80.206';
var rsyncIp;

//客户端类型
var _clientType = 3;

//是否是局域网主机
var isMaster = true;

var configPath = './config';

//基本资源文件的路径
var _baseResourcePath = './resource';
//定时弹幕资源路径
var _timerDanmuPath = _baseResourcePath+'/timerDanmu';

//电影开始时间
var movieStartTime;

//活动列表
var _partyList;

//配置文件字符串
var configStr;

var _initConfigStatus = false;

var _registCodeKey = 'rck';

//弹幕文字大小
var _fontSize=50;

//弹幕移动速度
var _dmspeed=10;

//是否测试服务器 true：是 false：否
var _testServer=false;

//背景颜色
var _bgColor='#000';

//弹幕出现的方向 r从右往左 l从左往右
var _show='r';

//弹幕显示顺序 true：弹幕优先在顶端显示
var _topShow=true;

//表情的缩放比例
var _expressionScale='1';

//屏幕是否移动
var _screenMove = false;

//屏幕分辨率
var _screenRect;

//屏幕编号
var _screen;


var readConfig = function( callBack ){
    var fs = require("fs");
    var iconv = require('iconv-lite');
    fs.readFile(configPath,function(err, data) {
        if( err ){
            getConfig(callBack);
            writelog(err);
        }else{
            var texts = iconv.decode(data, 'utf-8');
            initConfigParam(texts,callBack);
            writelog(texts);
        }

    });
}

var initConfigParam = function(texts,callBack){
    var object = JSON.parse(texts);
    _fontSize = object.maxSize;
    _dmspeed = object.speed1;
    _testServer = object.testServer;
    _bgColor = object.bgColor;
    _show = object.show;
    _topShow = object.topShow;
    _expressionScale = object.expressionScale;
    if(_testServer){
        _baseUrl = _baseTestUrl;
        rsyncIp = _testIp;
    }else{
        _baseUrl = _baseProUrl;
        rsyncIp = _proIp
    }
    _partyList = object.partys;

    _screenMove = object.screenMove;

    _screenRect = object.screenRect;

    _screen = object.screen;

    if(callBack){
        callBack();
    }
}

var getConfig = function(callBack){
    $.ajax({
      url: 'http://'+_baseProUrl+'/v1/api/javaClient/config?code='+ getCode(),
      type: "get"
    }).done(function (data) {
      var jsonD = JSON.parse(data);
      if(jsonD.result == 200){
            var fs = require("fs");
            fs.writeFile(configPath,data,function (err) {
                if (err) throw err;
                writelog('config保存成功');
                initConfigParam(data,callBack);
            })
      }else{
          writelog('获取config失败');
      }
    });
}

//查找活动
var getParty = function(partyId){
    for(var i=0;i<_partyList.length;i++){
        if( _partyList[i].partyId == partyId){
            return _partyList[i];
        }
    }

}



