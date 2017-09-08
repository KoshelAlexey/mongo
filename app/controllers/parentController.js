'use strict';

mongoApp.controller('parentController',
    function renderingForm($scope, userDbStructureService, $http) {

        $scope.status = {schema:false,base:false,tests:false};

            $scope.colRelationSelect = [
                {name: 'Один к одному', value: 'oneToOne'},
                {name: 'Один ко многим', value: 'oneToMany'},
                {name: 'Многие к одному', value: 'manyToOne'},
                {name: 'Многие ко многим', value: 'manyToMany'}
            ];

        $scope.fieldTypesSelect = [
            {name: 'STRING', value: 'string'},
            {name: 'INTEGER', value: 'integer'},
            {name: 'Связь с коллекциями', value: 'forRelation'}
        ];

        $scope.dbStructure = {
            collections: [
                {
                    name: '',
                    fields: [
                        {
                            required: true,
                            searchable: false,
                            name:'',
                            type:'',
                            expValue:'',
                            minValue:'',
                            maxValue:''
                        }
                    ],
                }
            ]
        };

        $scope.collRelations = [];

        $scope.addCollection = function(dbStructure) {
            var newCollection = {
                name: '',
                fields: [
                    {
                        required: true,
                        searchable: false,
                        name:'',
                        type:'',
                        expValue:'',
                        minValue:'',
                        maxValue:''
                    }
                ],
            };
            dbStructure.collections.push(newCollection);
        };

        $scope.addRelation = function(collRelations) {
            var newRelation = {
                collBegin:'',
                collBeginFields:[],
                fieldBegin:'',
                relationType:'',
                included:false,
                collEnd:'',
                collEndFields:[],
                fieldEnd:''
            };
            collRelations.push(newRelation);
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

        $scope.calcRange = function(data) {
            var value = Number(data.expValue);
            data.minValue = value - value / 2;
            data.maxValue = value + value / 2;
        };

        $scope.loadFieldsBegin = function(collections, collRel) {
            collections.forEach(function (singleColl) {
                if(singleColl.name === collRel.collBegin) {
                    var relFieldsArr = [];
                    singleColl.fields.forEach(function(field) {
                        if (field.type === 'forRelation') {
                            relFieldsArr.push(field);
                        }
                    });
                    if(relFieldsArr.length > 0) {
                        collRel.collBeginFields = relFieldsArr;
                    } else {
                        collRel.collBeginFields = [];
                    }
                    collRel.collEnd = '';
                }
            })
        };

        $scope.loadFieldsEnd = function(collections, collRel) {
            collections.forEach(function (singleColl) {
                if(singleColl.name === collRel.collEnd) {
                    collRel.collEndFields = singleColl.fields;
                }
            })
        };

        $scope.show = function(kuda, otkuda) {
            console.dir(kuda);
            console.dir(otkuda);
        }

        $scope.sendData  = function(collection){
            console.dir(collection);
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
                .then((resp)=>{$scope.status = resp.data.status}

                );
        }
});