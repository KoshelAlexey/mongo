var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient;

var mongoose = require('mongoose');

var fs = require('fs');

var db = mongoose.createConnection('mongodb://111-PC:27001/schemaCheck');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected to db!");
});

mongoClient.connect("mongodb://111-PC:27001/schemaCheck", function(err, db) {
    if (err) {
        return console.log(err);
    }
    db.dropDatabase();
    // db.close();
});

var presetBuild = require("../public/javascripts/presetBuild.js");
var baseBuild = require("../public/javascripts/baseBuild.js");
var concept = require("../public/javascripts/firstConception.js");
var relationsConception = require("../public/javascripts/relationsConception.js");

var preSet = {};
var baseSet = {};
var status = {schema:false,base:false,tests:false};
var preSchema = {};

router.post('/', function(req, res, next) {
    var rawData =req.body;
    fs.writeFile('./data/raw_data.txt',JSON.stringify(rawData), function (error) {
        if(error) throw error;
        var d = fs.readFileSync('./data/raw_data.txt', 'utf8');
    });

    var p = new Promise(
        (resolve,reject)=>{
            resolve(relationsConception(rawData))
        });
    p.then(
        (data)=>{
            preSchema = data;
            res.send("done");
        })
    // console.log(data)
    // var p = new Promise(
    //     (resolve,reject)=>{
    //         resolve(presetBuild(data))
    //     });
    //
    // p.then(
    //     (data)=>{
    //         preSet = data;
    //         status.schema = true;
    //         res.send({message:"good",status:status});
    //     })
});

router.get('/', function(req, res, next) {
    res.send(preSchema)
    // if(req.query.build){
    //     var p = new Promise(
    //         (resolve,reject)=>{
    //             resolve(baseBuild(preSet,db))
    //         });
    //     p.then(
    //         (data)=>{
    //             baseSet = data;
    //             status.base = true;
    //             console.log(status)
    //             res.send({status:status})
    //         })
    // }
    // if(req.query.tests){
    //     var p = new Promise(
    //         (resolve,reject)=>{
    //             resolve(test(baseSet))
    //         });
        // p.then(
        //     (data)=>{
        //         baseSet = data;
        //         status.tests = true;
        //         res.send(status)
        //     })
    }
);


module.exports = router;