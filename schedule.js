//下载全部资源
var downloadResourceSchedule = function(){
    var schedule = require("node-schedule");
    schedule.scheduleJob('*/5 * * * *', function(){
        writelog('downloadResource 2:30');
        rsyncResourceFile();
    });

    var schedule1 = require("node-schedule");
    schedule1.scheduleJob('30 8 * * *', function(){
        writelog('downloadResource 8:30');
        rsyncResourceFile();
    });

}