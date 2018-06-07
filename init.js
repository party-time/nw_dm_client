var dmws;

var initDmClient = function(){
    writelog('initDmClient start');
    var gui = require('nw.gui');
    var win = gui.Window.get();
    win.setAlwaysOnTop(true);
    if( _screenMove ){
        win.moveTo(_screenRect[2],_screenRect[3]-_screenRect[1]);
        win.enterFullscreen();
    }else{
        win.enterFullscreen();
    }
    //初始化弹幕展示区域的宽度
    initNW();
    bodyClick();
    getSocketIp();
}

var initNW = function(){
    $('body').css('background-color',_bgColor);
}

var bodyClick = function(){
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

var drawRegistModal = function(){
    var registCode = getCode();
    if( registCode == null) registCode='';
    $('body').css('cursor','auto');
    var htmlStr = '<div class="modal"><div class="modal-body">'+
    '<label class="control-label">注册码</label>'+
    '<div class="control-div">'+
        '<input type="text" id="registCode" value="'+registCode+'"/>'+
    '</div>'+
    '</div>'+
    '<div class="modal-footer"><button onclick="registClient()">发送</button></div>'+
    '</div>';
    $(htmlStr).appendTo($('body'));
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
                    $('.modal').remove();
                    $('body').css('cursor','url("/18888.cur"),auto');
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
    var wsUri = 'ws://' + ip + ':' + port + '/ws?code='+getCode()+'&clientType=0';
    dmws = new ReconnectingWebSocket(wsUri);

    dmws.onopen = function (evt) {
        //心跳检测
        setInterval(function () {
            dmws.send('{"type":"ping","clientType":0,"code":"'+getCode()+'"}');
        }, 10000);
    };

    dmws.onclose = function (evt) {
        console.log(evt);
    };

    dmws.onmessage = function (evt) {
        var object = JSON.parse(evt.data);
        drawDm(object,false);
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

//获取本地ip
var getLocalIp = function(){
    var os=require('os'),
        iptable={},
        ifaces=os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details,alias){
        if (details.family=='IPv4' && details.address !== '127.0.0.1' && !alias.internal ) {
            return details.address;
        }
      });
    }
}






