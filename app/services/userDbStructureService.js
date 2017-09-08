'use strict';

mongoApp.service('userDbStructureService', function($http, $q) {
    return {
        sendUserStructure: function (dataToServer) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                // url: 'http://localhost:5000/mongo/',
                url: '',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(dataToServer)
            };
            $http(req).then(
                function resSuccess(response) {
                    console.dir(response)
                    deferred.resolve(response.data);
                },
                function resError(response) {

                    deferred.reject(response.status);
                }
            );
            return deferred.promise;
        }
    }
});