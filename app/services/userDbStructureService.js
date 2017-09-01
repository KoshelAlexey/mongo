'use strict';

mongoApp.service('userDbStructureService', function($http, $q) {
    return {
        sendUserStructure: function (dataToServer) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: '',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(dataToServer)
            };
            $http(req).then(
                function resSuccess(response) {
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