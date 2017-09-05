
var mongoose = require('mongoose');

function test(data) {

    var baseSet = data;
    var collections = baseSet.collections;
    var fields = baseSet.fields;
    var res = [{}];

    for(var i = 0;i<collections.length;i++) {
        res[i].colname = collections[i].name
        for (var key in fields[i]) {
            var dateStart = new Date();
            collections[i].find({[key]: "text700"})
        }
    }
};
module.exports = test;