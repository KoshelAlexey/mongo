
var BSON = require('BSON');
var bson = new BSON();

function concept(data,rawData) {
    var raw = rawData;
    var localData = data;
    var result = [];

    for(var i = 0; localData[i] !== undefined;i++){
        var instance = {col:"",expect:{obj:{},size:""},min:{obj:{},size:""},max:{obj:{},size:""}};
        instance.col = localData[i].col;
        for(var a = 0; a<3; a++) {
            switch (a){
                case 0:
                    instance.expect.obj = buildObj(localData[i],raw,"expValue");
                    instance.expect.size = bson.calculateObjectSize(instance.expect.obj);
                break;
                case 1:
                    instance.min.obj = buildObj(localData[i],raw,"minValue");
                    instance.min.size = bson.calculateObjectSize(instance.min.obj);
                break;
                case 2:
                    instance.max.obj = buildObj(localData[i],raw,"maxValue");
                    instance.max.size = bson.calculateObjectSize(instance.max.obj);
                break;
            }
        }
        result[i] = instance;
    }
    // console.log(result)
    return result;
};


function buildObj(data,raw,opt) {
    var value = opt;
    var fields = data;
    var raw = raw;
    var res = {};

    raw.collections.forEach((col)=>{
        if(col.name === fields.col){
            for(var key in fields){
                col.fields.forEach((field)=>{
                    if(field.name === key){
                        if (key !== 'col' && key !== 'id') {
                            if (fields[key] === "string") {
                                var str = '';
                                for (var s = 0; s < field[value]; s++) {
                                    str += 'a';
                                }
                                res[key] = str;
                            }
                            else if (fields[key] === "number") {
                                res[key] = field[value]
                            }
                        }
                    }
                })

            }
        }
    });
    // res.id = new Date().getTime() + Math.floor(Math.random() * 100);
    return res;
};
// function minValueObj(data) {
//     var fields = data;
//     var res = {};
//
//     for (var j = 0; fields[j] !== undefined; j++) {
//         if (fields[j].type === "string") {
//             var str ='';
//             for(var s =0;s<fields[j].minValue; s++){
//                 str +='a';
//             }
//             res[fields[j].name]=str;
//         }
//         else if(fields[j].type === "number"){
//             res[fields[j].name]=fields[j].minValue
//         }
//     }
//     res.id = new Date().getTime() + Math.floor(Math.random() * 100);
//     return res;
// };
// function maxValueObj(data) {
//     var fields = data;
//     var res = {};
//
//     for (var j = 0; fields[j] !== undefined; j++) {
//         if (fields[j].type === "string") {
//             var str ='';
//             for(var s =0;s<fields[j].maxValue; s++){
//                 str +='a';
//             }
//             res[fields[j].name]=str;
//         }
//         else if(fields[j].type === "number"){
//             res[fields[j].name]=fields[j].maxValue
//         }
//     }
//     res.id = new Date().getTime() + Math.floor(Math.random() * 100);
//     return res;
// };

module.exports = concept;