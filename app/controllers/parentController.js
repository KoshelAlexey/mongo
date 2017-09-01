'use strict';

mongoApp.controller('parentController',
    function renderingForm($scope, userDbStructureService) {
        $scope.dbStructure = {
            collections: [
                {
                    name: '',
                    fields: [
                        {
                            required: true,
                            searchable: false,
                            name: '',
                            selectedType:'',
                            type: [
                                {name: 'STRING', value: 'string'},
                                {name: 'NUMBER', value: 'number'},
                                {name: 'INTEGER', value: 'int'},
                                {name: 'DATE', value: 'date'}
                            ]
                        }
                    ],
                    // relatedCollections: [
                    //     {
                    //
                    //     }
                    // ]
                }
            ]
        };

        $scope.addField = function(collection) {
            var newField = {
                required: false,
                searchable: false,
                name: '',
                type: [
                    {name: 'STRING', value: 'string'},
                    {name: 'NUMBER', value: 'number'},
                    {name: 'INTEGER', value: 'int'},
                    {name: 'DATE', value: 'date'}
                ]
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
            var fieldsArr = [];
            for (var i = 0; i < collection.fields.length; i++) {
                // var fieldToServer = {};
                // fieldToServer.name = collection.fields[i].name;
                // fieldToServer.type = collection.fields[i].selectedType;
                var fieldToServer = {
                    name: collection.fields[i].name,
                    type: collection.fields[i].selectedType
                }
                fieldsArr.push(fieldToServer);
            }
            var dataToServer = {
                name: collection.name,
                fields: fieldsArr
            };
            console.dir(fieldsArr);
            userDbStructureService.sendUserStructure(dataToServer);
        };
});