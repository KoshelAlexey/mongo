'use strict';

mongoApp.controller('parentController',
    function renderingForm($scope, userDbStructureService, $http, $rootScope) {

        $scope.status = {schema:false,base:false,tests:false};

            $scope.colRelationSelect = [
                {name: 'Один к одному', value: 'oneToOne'},
                {name: 'Один ко многим', value: 'oneToMany'},
                {name: 'Многие к одному', value: 'manyToOne'},
                {name: 'Многие ко многим', value: 'manyToMany'}
            ];

        $scope.fieldTypesSelect = [
            {name: 'STRING', value: 'string'},
            {name: 'NUMBER', value: 'number'},
            {name: 'Связь с коллекциями', value: 'rel'}
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

        $scope.goUp = function () {
            window.scrollTo(0,0);
        };

        $scope.goDown = function () {
            var height = document.getElementsByTagName("html")[0].offsetHeight;
            window.scrollTo(0,height);
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
                        if (field.type === 'rel') {
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

        $scope.sendData  = function(collections, relations){
            var relArr = [];
            collections.forEach(function(colItem) {
                var idCheck = false;
                colItem.fields.forEach(function(field) {
                    if (field.name === 'id') {
                        field.required = true;
                        field.searchable = true;
                        field.name = 'id';
                        field.type = colItem.name;
                        field.expValue = '';
                        field.minValue = '';
                        field.maxValue = '';
                        idCheck = true;
                    }
                });
                if (!idCheck) {
                       colItem.fields.push(
                            {
                                required: true,
                                searchable: true,
                                name: 'id',
                                type: colItem.name,
                                expValue: '',
                                minValue: '',
                                maxValue: ''
                            }
                       );
                }
            });
            relations.forEach(function(relItem) {
                var rel = {};
                rel.beginCollection = relItem.collBegin;
                rel.beginField = relItem.fieldBegin;
                rel.type = relItem.relationType;
                rel.included = relItem.included;
                rel.endCollection = relItem.collEnd;
                rel.endField = relItem.fieldEnd;
                rel.targeValue = '';
                rel.range = '';
                relArr.push(rel);
            });
            console.dir(collections);
            if(!simpleValidation(collections)){
                userDbStructureService.sendUserStructure(collections, relArr).then(
                    (data)=>{
                        $scope.status = data.status;
                    });
            };
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
        function simpleValidation(collections) {
            var allCol = collections;
            var error = false;
            var report = {};
            report.header = "Bad primary data!";
            report.type = "error";


            for (var i = 0;  allCol[i] !== undefined;i++){
                if(allCol[i].name === ""){
                    report.msg = "Collection name don't specified. "+ "Collection #"+i;
                    $rootScope.$emit('localErr',report);
                    error = true;
                }
                for (var f = 0;  allCol[i].fields[f] !== undefined;f++){
                    if(allCol[i].fields[f].required === true && allCol[i].fields[f].name === ""){
                        report.msg = "Name of required field don't specified. "+ "Collection #"+i+" Field #"+f;
                        $rootScope.$emit('localErr',report);
                        error = true;
                    }
                    if(allCol[i].fields[f].type === ""){
                        report.msg = "Field type don't specified. "+ "Collection #"+i+" Field #"+f;
                        $rootScope.$emit('localErr',report);
                        error = true;
                    }
                }
            }

            return error;
        }
});