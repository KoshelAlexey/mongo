mongoApp.controller('consoleController', function ($scope ,$rootScope) {

    $scope.responseDataModel = {};
    $scope.consoleModel = {
        report:[]
    };

    $rootScope.$on('console', function (event,data) {
        $scope.responseDataModel = data;
        if(data){
            consoleLog("Ok!","Success request. You got data from the server.", "success");
        }
        else{
            consoleLog("Failed request","Something wrong. Response haven't data. You can try resend your request.", "error");
        }
        scan(data);

    });

    $rootScope.$on('localErr', function (event,data) {
        console.dir(data);
        consoleLog(data.err, data.msg, "error");

    });


    function scan(resp) {
        var model = resp;

        model.forEach((data, i)=>{
            if(typeof(data) === "object"){
                for(var key in data){
                    if (!data[key].type && key !== "collectionName"){
                        switch (key){
                            case "scs":{
                                consoleLog(data.scs,data.msg, "success");
                            }
                                break;
                            case "wrn":{
                                consoleLog(data.wrn,data.msg, "warning");
                            }
                                break;
                            case "err":{
                                consoleLog(data.err,data.msg, "error");
                            }
                                break;
                            default:{
                                var arr = [data[key]];
                                scan(arr);
                            }
                                break;
                        }
                    }
                }
            }
        })
    }

    function consoleLog(error, message, type) {
        var header = error;
        var msg = message;
        var line = {};

        line.timestamp = timeStampCreate();
        line[type] = header;
        line.message = msg;

        $scope.consoleModel.report.unshift(line);

    }
        
    function timeStampCreate() {
        var ts = "";
        var date = new Date();
        var hours = date.getHours();

        var min = (function () {
            var min = date.getMinutes();
            if(min < 10){
                return min = "0"+min
            }
            else{
                return min
            }
        })();
        var sec = (function () {
            var sec = date.getSeconds();
            if(sec < 10){
                return sec = "0"+sec
            }
            else{
                return sec
            }
        })();

        ts = hours+":"+min+":"+sec;
        return ts
    }
});
