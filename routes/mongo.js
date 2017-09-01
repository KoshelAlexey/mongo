var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient;

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://111-PC:27001/shemaCheck');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected!");
});
mongoClient.connect("mongodb://111-PC:27001/shemaCheck", function(err, db) {
    if (err) {
        return console.log(err);
    }
    db.dropDatabase();
    // db.close();
});


// var testStatus = false;
// var testInfo = "";
// var shema = {};
// var doc = [];
// var shObj ={};
// var allSh = {};


var preSet = {};

router.post('/', function(req, res, next) {
    // var data =req.body;
    console.log(req.body);
    var data = {};
    data.collections = [];
    data.collections[data.collections.length]= req.body;
    console.log(data);
    res.send("its done");
    preSet = presetBuild(data);
    baseBuild(preSet);
    test();

});

router.get('/', function(req, res, next) {
    // Users.create()
});


// functions

function presetBuild(data) {
    var localData = data;
    var shema = {};
    var fields = {};
    var result = {};
    var shObj = {};
    for(var i = 0; localData.collections[i] !== undefined;i++){
        shObj = {};
        for(var j = 0;localData.collections[i].fields[j] !== undefined;j++) {

            shObj[localData.collections[i].fields[j].name] = localData.collections[i].fields[j].type;

        }
        shema = new mongoose.Schema(shObj,{versionKey:false});
        fields = shObj;
        result[localData.collections[i].name] = {"shema":shema, "fields":fields};

    }

    return result
};

function baseBuild(data) {
    var preSet = data;
    var collections = [];
    var fields = [];
    for (var key in preSet) {
        collections[collections.length] = db.model(key, preSet[key].shema);
        fields[fields.length] = preSet[key].fields
    }

    for(var i = 0;i<collections.length;i++){
        for(var j = 0; j<10; j++){              // number of documents
            collections[i].create((function () {
                var res = {};
                for(var field in fields[i]){
                    if(fields[i][field] === "string"){
                        res[field] = 'text'+j
                    }
                    if(fields[i][field] === "number"){
                        res[field] = j
                    }
                }

                    return res
            })())
        }
    }
    return fields
};

function test() {

};
module.exports = router;