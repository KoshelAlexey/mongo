
var mongoose = require('mongoose');

function presetBuild(data) {
    var localData = data;
    var shema = {};
    var fields = {};
    var options = {};
    var result = {};
    var shObject = {};
    var shIndex = {};

    for(var i = 0; localData.collections[i] !== undefined;i++){
        shObj = {};
        if(localData.collections[i].options){
            options = localData.collections[i].options
        }
        for(var j = 0;localData.collections[i].fields[j] !== undefined;j++) {

            shObject[localData.collections[i].fields[j].name] = localData.collections[i].fields[j].type;
            if(localData.collections[i].fields[j].searchable){
                shIndex = {[localData.collections[i].fields[j].name]:1}
            }
        }
        shema = new mongoose.Schema(shObject,{versionKey:false});
        shema.index(shIndex);
        fields = shObject;

        result[localData.collections[i].name] = {"shema":shema, "fields":fields, "options":options};
    }

    return result

};
module.exports = presetBuild;