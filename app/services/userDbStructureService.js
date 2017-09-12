'use strict';

mongoApp.service('userDbStructureService', function($http, $q) {
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
                    deferred.resolve(response.data);
                },
                function resError(response) {

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
                    console.dir(response);
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