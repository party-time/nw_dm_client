var _localIp;

var localClient;

var localServerSocketList;

//获取本地ip
var getLocalIp = function(callback){
    var os=require('os'),
        iptable={},
        ifaces=os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details,alias){
        if (details.family=='IPv4' && details.address !== '127.0.0.1' && !alias.internal ) {
            callback(details.address);
            return details.address;
        }
      });
    }
}

var startLocalSocketServer = function(callback){
    localServerSocketList = new Array();
    var net = require('net');
    var HOST = '0.0.0.0';
    var PORT = 22223;
    writelog('startLocalSocketServer');
    net.createServer(function(sock) {

        // 我们获得一个连接 - 该连接自动关联一个socket对象
        writelog('CONNECTED: ');
        //获取局域网内其他server
        // 为这个socket实例添加一个"data"事件处理函数

        sock.on('connection',function(){
            localServerSocketList.push(sock);
        });

        sock.on('data', function(data) {
            console.log('DATA ' + data);
        });

        // 为这个socket实例添加一个"close"事件处理函数
        sock.on('close', function(data) {
            console.log('CLOSED: ' +
                sock.remoteAddress + ' ' + sock.remotePort);
        });

    }).listen(PORT, HOST);
    getLocalServerList();
    callback();
}

var connectLocalSocketServer = function(ip){
    var net = require('net');
    var PORT = 22223;
    var client = new net.Socket();
    isMaster=false;
    client.connect(PORT, ip, function() {
        console.log('CONNECTED TO: ' + ip + ':' + PORT);
        localCLient = client;
    });
    // 为客户端添加“data”事件处理函数
    // data是服务器发回的数据
    client.on('data', function(data) {
        console.log('DATA: ' + data);
        // 完全关闭连接
        //client.destroy();
        if(!isMaster){
            var object = JSON.parse(data);
            drawDm(object,false);
        }
    });
    // 为客户端添加“close”事件处理函数
    client.on('close', function() {
        console.log('Connection closed');
    });
}

var getLocalServerList = function(){
    $.ajax({
      url: 'http://'+_baseUrl+'/v1/api/javaClient/findclientList/'+ getCode(),
      type: "get"
    }).done(function (data) {
      if(data.result == 200){
            writelog('getLocalServerList');
            if(data.data.length > 1 ){
                for(var i=0;i<data.data.length;i++){
                    if(data.data[i].ip == _localIp && i>0){
                        writelog(data.data[i-1].ip );
                        connectLocalSocketServer(data.data[i-1].ip);
                    }
                }
            }
      }else{
          alert('获取本地客户端列表失败');
      }
    });
}

var sendLocalDm = function(dm){
    if(localServerSocketList && localServerSocketList.length>0){
        for(var i=0;i<localServerSocketList.length;i++){
            localServerSocketList[i].write(dm);
        }
        writelog(dm);
    }
}