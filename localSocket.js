var _localIp;

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

var startLocalSocketServer = function(){
    var net = require('net');
    var HOST = '0.0.0.0';
    var PORT = 22223;
    var server = net.createServer();
    server.listen(PORT, HOST);
    writelog('startLocalSocketServer connect local socket server');
    getLocalIp(function(localIp){
        _localIp = localIp;
        writelog('getLocalIp connect local socket server'+localIp);
        dmws.send('{"type":"clientInfo","ip":"'+localIp+'","code":"'+getCode()+'","clientType":'+_clientType+',"number":'+_screen+'}');
    });

    server.on('connection', function(sock) {
        writelog('connect local socket server'+localIp);
    });

    server.on('data', function(sock) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // 回发该数据，客户端将收到来自服务端的数据
        sock.write('You said "' + data + '"');
    });
    // 为这个socket实例添加一个"close"事件处理函数
    server.on('close', function(sock) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
}

var connectLocalSocketServer = function(ip){
    var net = require('net');
    var PORT = 22223;
    var client = new net.Socket();
    client.connect(PORT, ip, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        // 建立连接后立即向服务器发送数据，服务器将收到这些数据
        client.write('I am Chuck Norris!');
    });
    // 为客户端添加“data”事件处理函数
    // data是服务器发回的数据
    client.on('data', function(data) {
        console.log('DATA: ' + data);
        // 完全关闭连接
        client.destroy();

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
      var jsonD = JSON.parse(data);
      if(jsonD.result == 200){
        for(var i=0;i<jsonD.data.length;i++){
            if(jsonD.data[i].ip == _localIp && i>0){
                connectLocalSocketServer(jsonD.data[i-1].ip);
            }
        }
      }else{
          alert('获取本地客户端列表失败');
      }
    });

}