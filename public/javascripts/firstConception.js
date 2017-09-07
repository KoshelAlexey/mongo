
var BSON = require('BSON');
var bson = new BSON();

function concept(data) {
    var localData = data;
    var result = [];

    for(var i = 0; localData[i] !== undefined;i++){
        var instance = {col:"",expect:{obj:{},size:""},min:{obj:{},size:""},max:{obj:{},size:""}};
        instance.col = localData[i].name;
        for(var a = 0; a<3; a++) {
            switch (a){
                case 0:
                    instance.expect.obj = expValueObj(localData[i].fields);
                    instance.expect.size = bson.calculateObjectSize(instance.expect.obj);
                break;
                case 1:
                    instance.min.obj = minValueObj(localData[i].fields);
                    instance.min.size = bson.calculateObjectSize(instance.min.obj);
                break;
                case 2:
                    instance.max.obj = maxValueObj(localData[i].fields);
                    instance.max.size = bson.calculateObjectSize(instance.max.obj);
                break;
            }
        }
        result[i] = instance;
    }

    return result;
};


function expValueObj(data) {
    var fields = data;
    var res = {};
    for (var j = 0; fields[j] !== undefined; j++) {
        if (fields[j].type === "string") {
            var str = '';
            for (var s = 0; s < fields[j].expValue; s++) {
                str += 'a';
            }
            res[fields[j].name] = str;
        }
        else if (fields[j].type === "number") {
            res[fields[j].name] = fields[j].expValue
        }
    }
    res.id = new Date().getTime() + Math.floor(Math.random() * 100);
    return res;
};
function minValueObj(data) {
    var fields = data;
    var res = {};

    for (var j = 0; fields[j] !== undefined; j++) {
        if (fields[j].type === "string") {
            var str ='';
            for(var s =0;s<fields[j].minValue; s++){
                str +='a';
            }
            res[fields[j].name]=str;
        }
        else if(fields[j].type === "number"){
            res[fields[j].name]=fields[j].minValue
        }
    }
    res.id = new Date().getTime() + Math.floor(Math.random() * 100);
    return res;
};
function maxValueObj(data) {
    var fields = data;
    var res = {};

    for (var j = 0; fields[j] !== undefined; j++) {
        if (fields[j].type === "string") {
            var str ='';
            for(var s =0;s<fields[j].maxValue; s++){
                str +='a';
            }
            res[fields[j].name]=str;
        }
        else if(fields[j].type === "number"){
            res[fields[j].name]=fields[j].maxValue
        }
    }
    res.id = new Date().getTime() + Math.floor(Math.random() * 100);
    return res;
};

module.exports = concept;