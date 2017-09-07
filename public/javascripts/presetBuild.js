
var mongoose = require('mongoose');

function presetBuild(data) {
    var localData = data;
    var schema = {};
    var fields = {};
    var options = {};
    var result = {};
    var shObject = {};
    var shIndex = {};

    for(var i = 0; localData.collections[i] !== undefined;i++){
        shObject = {};
        if(localData.collections[i].options){
            options = localData.collections[i].options
        }
        for(var j = 0;localData.collections[i].fields[j] !== undefined;j++) {

            shObject[localData.collections[i].fields[j].name] = localData.collections[i].fields[j].type;
            if(localData.collections[i].fields[j].searchable){
                shIndex = {[localData.collections[i].fields[j].name]:1}
            }
        }
        schema = new mongoose.Schema(shObject,{versionKey:false});
        schema.index(shIndex);
        fields = shObject;

        result[localData.collections[i].name] = {"schema":schema, "fields":fields, "options":options};
    }

    return result

};
module.exports = presetBuild;