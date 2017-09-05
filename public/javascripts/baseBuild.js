
var mongoose = require('mongoose');

function baseBuild(data,base) {
    var db = base;
    var preSet = data;
    var collections = [];
    var fields = [];

    for (var key in preSet) {
        collections[collections.length] = db.model(key, preSet[key].shema);
        fields[fields.length] = preSet[key].fields
    }

    for(var i = 0;i<collections.length;i++){
        var res = [];
        for(var j = 0; j<1000; j++){              // number of documents
            res[j] = {}
            for(var field in fields[i]){
                if(fields[i][field] === "string"){
                    res[j][field] = 'text'+j
                }
                if(fields[i][field] === "number"){
                    res[j][field] = j
                }
            }
        }
        collections[i].create(res)
    }
    return workData={collections:collections, fields:fields};
};
module.exports = baseBuild;