var dmws;

var initDmClient = function(){
    writelog('initDmClient start');
    //初始化NW的属性
    initNW();
    bodyClick();
    startLocalSocketServer(function(){
        getSocketIp();
    });

}

var initNW = function(){
    var gui = require('nw.gui');
    var win = gui.Window.get();
    win.setAlwaysOnTop(true);
    writelog('initNW start');
    if( _screenMove ){
        win.moveTo(parseInt(_screenRect[2]),parseInt(_screenRect[3])-parseInt(_screenRect[1]));
        //win.moveTo(1440,0);
        win.enterFullscreen();
    }else{
        win.enterFullscreen();
    }
    $('body').css('background-color',_bgColor);
}

var bodyClick = function(){
    writelog('bodyClick start');
    var click_time=0,click_num=0;
    $('body').click(function(){
        if( click_num == 0){
            click_time = new Date().getTime();
            ++click_num;
        }else{
            var tt = new Date().getTime();
            if( tt-click_time<=1000 ){
                if( click_num == 3){
                    drawRegistModal();
                    click_num = 0;
                }
                // 一直点击
                ++click_num;
            }else if(tt-click_time>1000){
                click_num = 0;
            }
            click_time = tt;
        }
    })
}

var getCode = function(){
    return window.localStorage.getItem(_registCodeKey);
}

var getWlineY = function(){
    var y = window.localStorage.getItem(_wlineKey);
    if( null == y){
        return null;
    }else{
        return parseInt(y.replace('px',''));
    }
}

var drawRegistModal = function(){
    var registCode = getCode();
    if( registCode == null) registCode='';
    $('body').css('cursor','auto');
    var htmlStr = '<div class="modal"><div class="modal-header"><button type="button" class="close" onclick="closeRegistModal()">x</button></div>'+
    '<div class="modal-body"><label class="control-label">注册码</label>'+
    '<div class="control-div">'+
        '<input type="text" id="registCode" value="'+registCode+'"/>'+
    '</div>'+
    '</div>'+
    '<div class="modal-footer"><button onclick="registClient()">发送</button></div>'+
    '</div>';
    $(htmlStr).appendTo($('body'));
    var lineHtml = '<div class="wline" ></div>';
    $(lineHtml).appendTo($('body'));

    //增加可以拖动的白线
    var lineY = 100;
    writelog('lineY:'+getWlineY());
    if( getWlineY()){
        lineY = getWlineY();
    }
    $('.wline').css('top',lineY+'px');
    $('.wline').mousedown(function(e){
        var offset = $(this).offset();
        var y = e.pageY - offset.top;
        $(document).bind("mousemove",function(ev){
            $(".wline").stop();
            var _y = ev.pageY - y;
            $(".wline").animate({top:_y+"px"},10);
        });
    });

    $(document).mouseup(function(){
        writelog('mouseup');
        $('.wline').css("cursor","default");
        $(this).unbind("mousemove");
        if($('.wline')){
            window.localStorage.setItem(_wlineKey,$('.wline').css('top'));
        }
    });


}

var closeRegistModal = function(){
    $('.modal').remove();
    $('body').css('cursor','url("/18888.cur"),auto');
    $('.wline').remove();
    $(document).unbind("mouseup");
}

function getDiskSerialNum(callBack){
    const si = require('systeminformation');
    si.diskLayout(callBack);
}

var registClient = function(){
    getDiskSerialNum(function (r) {
        var disCode = r[0].serialNum;
        if (disCode){
            $.ajax({
                url: 'http://'+_baseUrl+'/v1/api/flash/regist?danmuClientCode='+disCode+'&registCode='+$('#registCode').val(),
                type: "get"
            }).done(function (data) {
                if(data.result == 200){
                    window.localStorage.setItem(_registCodeKey,$('#registCode').val());
                    closeRegistModal();
                }else{
                    alert('注册码提交失败');
                }
            });
        }else{
            alert('获取机器识别码错误');
        }
    });
}

var getSocketIp = function(){
    $.ajax({
      url: 'http://'+_baseUrl+'/distribute/client/login/'+ getCode(),
      type: "get"
    }).done(function (data) {
      var jsonD = JSON.parse(data);
      if(jsonD.code == 200){
          createSocket(jsonD.serverInfo.ip,jsonD.serverInfo.port);
      }else{
          alert('获取服务器ip失败');
      }
    });
}


var createSocket = function(ip,port){
    var wsUri = 'ws://' + ip + ':' + port + '/ws?code='+getCode()+'&clientType='+_clientType;
    dmws = new ReconnectingWebSocket(wsUri);

    dmws.onopen = function (evt) {
        //心跳检测
        setInterval(function () {
            dmws.send('{"type":"ping","clientType":'+_clientType+',"code":"'+getCode()+'"}');
        }, 10000);

        //当与服务器建立连接后，启动本地socker server
        getLocalIp(function(localIp){
            _localIp = localIp;
            writelog('getLocalIp connect local socket server'+localIp);
            dmws.send('{"type":"clientInfo","ip":"'+localIp+'","code":"'+getCode()+'","clientType":'+_clientType+',"number":'+_screen+'}');
        });
    };

    dmws.onclose = function (evt) {
        console.log(evt);
    };

    dmws.onmessage = function (evt) {
        var object = JSON.parse(evt.data);
        if(object.type == 'command'){
             //确认活动正常开始后发出
            if(object.data.type == 'partyStatus'){
                dm_partyId = object.data.partyId;

                if(object.data.partyTime){
                    dm_partyTime = object.data.partyTime;
                }
                if(object.data.movieTime){
                    dm_movieTime = object.data.movieTime;
                }
                writelog('object.data.status:'+object.data.status);

                //活动开始
                if(object.data.status == 1){
                    dm_currentParty = getParty(object.data.partyId);
                    writelog('party start');
                }else if(object.data.status == 2){//电影开始
                    //加载定时弹幕
                    dm_currentParty = getParty(object.data.partyId);
                    writelog('movie start dm_currentParty:'+dm_partyId);
                    timerDm(dm_partyId,1);
                }
            }
            dmws.send(JSON.stringify(object));
        }else if(object.type == 'clientInfo'){
            //获取本地其他node客户端列表
            getLocalServerList();
        }else{
            if(isMaster){
                drawDm(object,false);
            }
        }

    };
}

//下载资源
var rsyncResourceFile = function(){
    var child_process = require('child_process');
    child_process.exec('rsync -arvIz --delete --password-file=./rsync.secrets rsync_user@101.201.80.206::resource ./resource', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
}






