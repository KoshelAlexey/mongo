'use strict';

mongoApp.service('userDbStructureService', function($http, $q, $rootScope) {
    return {
        sendUserStructure: function (collections, relations) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: 'http://localhost:5000/mongo/',
                // url: '',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {collections, relations}
            };
            $http(req).then(
                function resSuccess(response) {
                    console.dir(response.data);
                    $rootScope.$emit('console',response.data);
                    deferred.resolve(response.data);
                },
                function resError(response) {
                    var report = {};
                    report.err = "Connection error!";
                    report.msg = "Bad response from the server. Status: "+response.status;
                    $rootScope.$emit('localErr',report);
                    deferred.reject(response.status);
                }
            );
            return deferred.promise;
        },

        getStructure: function() {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: 'http://localhost:5000/mongo/',
                // url: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(req).then(
                function resSuccess(response) {
                    // console.dir(response);
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