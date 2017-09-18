mongoApp.controller('consoleController', function ($scope ,$rootScope) {

    $scope.responseDataModel = {};
    $scope.consoleModel = {
        report:[]
    };

    $rootScope.$on('console', function (event,data) {
        $scope.responseDataModel = data;
        var respStat = {};
        respStat.timestamp = timeStampCreate();
        if(data){

            respStat.success = "Ok!";
            respStat.message = "Success request. You got data from the server.";
            $scope.consoleModel.report.push(respStat);
        }
        else{
            respStat.error = "Failed request";
            respStat.message = "Something wrong. Response haven't data. You can try resend your request.";
            $scope.consoleModel.report.push(respStat);
        }
        scan(data);

    });

    function scan(data) {
        var model = data;

        data.forEach((data, i)=>{
            if(typeof(data) === "object"){
                for(var key in data){
                    if (!data[key].type && key !== "collectionName"){
                        if(data[key].err){
                            var repot = {};
                            repot.timestamp = timeStampCreate();
                            repot.error = data[key].err;
                            repot.message = data[key].errmsg;
                            $scope.consoleModel.report.push(repot);
                        }
                        else{
                            console.dir(data[key])
                            var arr = [data[key]]
                            scan(arr);
                        }
                    }
                }
            }

        })

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
