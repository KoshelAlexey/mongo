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

var presetBuild = require("../public/javascripts/presetBuild.js");
var baseBuild = require("../public/javascripts/baseBuild.js");

var preSet = {};
var baseSet = {};
var status = {shema:false,base:false,tests:false};

router.post('/', function(req, res, next) {
    var data =req.body;
    // var data = {};
    // data.collections = [];
    // data.collections[data.collections.length]= req.body;
    var p = new Promise(
        (resolve,reject)=>{
            resolve(presetBuild(data))
        });

    p.then(
        (data)=>{
            preSet = data;
            status.shema = true;
            res.send({message:"good",status:status});
        })
});

router.get('/', function(req, res, next) {
    if(req.query.build){
        var p = new Promise(
            (resolve,reject)=>{
                resolve(baseBuild(preSet,db))
            });
        p.then(
            (data)=>{
                baseSet = data;
                status.base = true;
                console.log(status)
                res.send({status:status})
            })
    }
    if(req.query.tests){
        var p = new Promise(
            (resolve,reject)=>{
                resolve(test(baseSet))
            });
        // p.then(
        //     (data)=>{
        //         baseSet = data;
        //         status.tests = true;
        //         res.send(status)
        //     })
    }
});


module.exports = router;