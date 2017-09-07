var BSON = require('BSON');
var bson = new BSON();

function relationsConception(data) {
    var collections = data.collections;
    var relations = data.relations;
    var res = [];
    for(var i = 0; collections[i] !== undefined;i++) {
        var instance = {col: "",embded:{},link:{}};
        for(var j = 0; collections[i].fields[j]!== undefined;j++){
            if(collections[i].fields[j].type === "rel"){

                instance.embded[collections[i].fields[j].name] = embdedContent(collections[i].fields[j],collections,relations,collections[i].name);
                instance.link[collections[i].fields[j].name] = linkContent(collections[i].fields[j],collections,relations,collections[i].name);
            }
            else{
                instance.embded[collections[i].fields[j].name] = collections[i].fields[j].type;
                instance.link[collections[i].fields[j].name] = collections[i].fields[j].type;
            }
        }
        instance = objEqals(instance);
        instance.col = collections[i].name;
        res[i] = instance;
    }
    console.log(res)
    return res
}

function embdedContent(field,col,rel,colName) {
    var colName = colName;
    var field = field;
    var allCol = col;
    var allRel = rel;

    var res = {embded:{},link:{}};
    var thisRel = (function () {
        for(var r = 0; allRel[r] !== undefined;r++) {
            if (field.name === allRel[r].beginField
                && colName === allRel[r].beginCollection) {
                return allRel[r]
            }
        }
    })();
    var endCol = (function () {
        for(var c = 0; allCol[c] !== undefined;c++) {
            if(allCol[c].name === thisRel.endCollection){
                return allCol[c]
            }
        }
    })();

    switch (thisRel.type) {
        case 'oneToOne': {
            for(var f = 0; endCol.fields[f] !== undefined;f++) {

                if(endCol.fields[f].type === "rel") {
                    res.embded[endCol.fields[f].name] = embdedContent(endCol.fields[f], allCol, allRel, endCol.name);
                    res.link[endCol.fields[f].name] = linkContent(endCol.fields[f], allCol, allRel, endCol.name);
                }
                else{
                    res.embded[endCol.fields[f].name] = endCol.fields[f].type;
                    res.link[endCol.fields[f].name] = endCol.fields[f].type;
                }
            }
            res = objEqals(res);
            return res
        }
        break;
        case 'oneToMany': {
        }
        break;
        case 'manyToOne': {
        }
        break;
        case 'manyToMany': {
        }
        break;
    }
}

function linkContent(field,col,rel,colName) {
    var colName = colName;
    var field = field;
    var allCol = col;
    var allRel = rel;

    var res = {embded:{},link:{}};
    var thisRel = (function () {
        for(var r = 0; allRel[r] !== undefined;r++) {
            if (field.name === allRel[r].beginField
                && colName === allRel[r].beginCollection) {
                return allRel[r]
            }
        }
    })();
    var endCol = (function () {
        for(var c = 0; allCol[c] !== undefined;c++) {
            if(allCol[c].name === thisRel.endCollection){
                return allCol[c]
            }
        }
    })();

    switch (thisRel.type) {
        case 'oneToOne': {
            for(var f = 0; endCol.fields[f] !== undefined;f++) {
                if(endCol.fields[f].name === "id") {
                    res = {id: endCol.fields[f].type}
                }
            }
            console.log(res);
            return res
        }
            break;
        case 'oneToMany': {
        }
            break;
        case 'manyToOne': {
        }
            break;
        case 'manyToMany': {
        }
            break;
    }
}

function objEqals(obj) {
    var firstObj = obj.embded;
    var secondObj = obj.link;
    var s1 = JSON.stringify(firstObj);
    var s2 = JSON.stringify(secondObj);
    if(s1 === s2){
        return firstObj
    }
    else{
        return obj
    }
}

module.exports = relationsConception;