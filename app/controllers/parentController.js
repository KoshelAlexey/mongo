'use strict';

mongoApp.controller('parentController',
    function renderingForm($scope, userDbStructureService, $http) {
        $scope.status = {shema:false,base:false,tests:false};

        $scope.colRelationSelect = [
                {name: 'Один к одному', value: 'oneToOne'},
                {name: 'Один ко многим', value: 'oneToMany'},
                {name: 'Многие к одному', value: 'manyToOne'},
                {name: 'Многие ко многим', value: 'manyToMany'}
            ];

        $scope.fieldTypesSelect = [
            {name: 'STRING', value: 'string'},
            {name: 'NUMBER', value: 'number'},
            {name: 'INTEGER', value: 'int'},
            {name: 'DATE', value: 'date'}
        ];

        $scope.dbStructure = {
            collections: [
                {
                    name: '',
                    fields: [
                        {
                            required: true,
                            searchable: false,
                            name: '',
                            type:''
                        }
                    ],
                    relations:[]
                }
            ]
        };

        $scope.addCollection = function(dbStructure) {
            var newCollection = {
                name: '',
                fields: [
                    {
                        required: true,
                        searchable: false,
                        name: '',
                        type:''
                    }
                ],
                relations:[]
            };
            dbStructure.collections.push(newCollection);
        };

        $scope.addRelation = function(collection) {
            var newRelation = {
                reliedTo:'',
                relationType:''
            };
            collection.relations.push(newRelation);
        };

        $scope.addField = function(collection) {
            var newField = {
                required: false,
                searchable: false,
                name:'',
                type:''
            };
            collection.fields.push(newField);
        };

        $scope.removeField = function(collection, field) {
            if (!field.required) {
                var fieldPosition = collection.fields.indexOf(field);
                collection.fields.splice(fieldPosition, 1);
            }
        };

        $scope.sendData  = function(collection){
            userDbStructureService.sendUserStructure(collection).then(
                (data)=>{
                    $scope.status = data.status;
                });
        };
        $scope.getBuild = function () {
            var req = {
                method: 'GET',
                url: 'http://localhost:5000/mongo/?build=true',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(req)
                .then((resp)=>{$scope.status = resp.data.status}

            );
        };
        $scope.startTest = function () {
            var req = {
                method: 'GET',
                url: 'http://localhost:5000/mongo/?tests=true',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(req)
                .then((resp)=>{$scope.status = resp.status}

                );
        }
});