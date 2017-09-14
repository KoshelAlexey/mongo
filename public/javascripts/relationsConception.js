var blackList = [];
var stopRecur = [];
var reservedName = [];
var finalResult =[];
var allCol = {};
var allRel = {};

function relationsConception(data) {
    var collections = data.collections;
    allCol=collections;
    var relations = data.relations;
    allRel = relations;
    var res = [];

    collectionBuild(collections,relations);
    res = finalResult;
    finalResult = [];
    blackList = [];
    return res
}

function collectionBuild(col,rel,recurs) {
    var collections = col;
    var relations = rel;
    var res = [];
    var rec = recurs;

    for(var i = 0; collections[i] !== undefined;i++) {
        if(!existCheck(collections[i].name) && !reserveCheck(collections[i].name)){
            reservedName.push(collections[i].name);
            if(!blackListCheck(collections[i].name) || rec === 1){
                var instance = {};
                for(var j = 0; collections[i].fields[j]!== undefined;j++){
                    if(collections[i].fields[j].type === "rel"){
                        instance[collections[i].fields[j].name] = relControl(collections[i].fields[j],allCol,allRel,collections[i].name)
                    }
                    else{
                        instance[collections[i].fields[j].name] = collections[i].fields[j];
                    }
                }
            }
            else{
                continue
            }
        }
        else{
            continue
        }
        reservedName = [];
        stopRecur = [];
        // instance = objEqals(instance);
        instance.collectionName = collections[i].name;
        finalResult.push(instance);

    }
    // if(res.length !== 0){
    //     finalResult=res
    // }

}



function relControl(thisField,col,rel,colName) {
    var thisColName = colName;
    var field = thisField;
    var allCollect = col;
    var allRelat = rel;

    stopRecur.push(thisColName);
    var res = {};
    var thisRel = (function () {
        for(var r = 0; allRelat[r] !== undefined;r++) {
            if (field.name === allRelat[r].beginField
                && thisColName === allRelat[r].beginCollection) {
                return allRelat[r]
            }
        }
    })();
    if(!thisRel){
        return "relation don't used"
    }
    var endCol = (function () {
        for(var c = 0; allCollect[c] !== undefined;c++) {
            if(allCollect[c].name === thisRel.endCollection){
                return allCollect[c]
            }
        }
    })();


    switch (thisRel.type) {
        case 'oneToOne': {
            if (!relationsCheck(endCol.name)){
                blackList.push(endCol.name);
            };
            for(var f = 0; endCol.fields[f] !== undefined;f++) {
                if(endCol.fields[f].type === "rel") {
                    if (recursionCheck(endCol.name)) {
                        res[endCol.fields[f].name] = "recursion"
                    }
                    else {
                        res[endCol.fields[f].name] = relControl(endCol.fields[f], allCollect, allRelat, endCol.name, colName);
                    }

                }
                else{
                    res[endCol.fields[f].name] = endCol.fields[f];
                }
            }

            return res
        }
            break;
        case 'oneToMany': {
            res.emb = {};
            res.link = {};
            if(field.maxValue < 50){
                for(var f = 0; endCol.fields[f] !== undefined;f++) {
                    if(endCol.fields[f].type === "rel") {
                        if (!recursionCheck(endCol.name)) {
                            res.emb[endCol.fields[f].name] = relControl(endCol.fields[f], allCollect, allRelat, endCol.name);
                        }
                        else{
                            res.emb[endCol.fields[f].name] = "recursion"
                        }
                    }
                    else{
                        res.emb[endCol.fields[f].name] = endCol.fields[f];
                    }
                }
            }
            else{
                res.emb = "Too many documents. Recomed value <50"
            }

            var rec = 1;
            var colArr = [];
            colArr.push(endCol);
            collectionBuild(colArr,allRelat,rec);
            res.link.id = "link to: "+ endCol.name;

            return res
        }
            break;
        case 'manyToOne': {
            res.emb = {};
            res.link = {};
            for(var f = 0; endCol.fields[f] !== undefined;f++) {
                if(endCol.fields[f].type === "rel") {
                    if (!recursionCheck(endCol.name)) {
                        res.emb[endCol.fields[f].name] = relControl(endCol.fields[f], allCollect, allRelat, endCol.name);
                    }
                    else{
                        res.emb[endCol.fields[f].name] = "recursion"
                    }
                }
                else{
                    res.emb[endCol.fields[f].name] = endCol.fields[f];
                }
            }

            var rec = 1;
            var colArr = [];
            colArr.push(endCol);
            collectionBuild(colArr,allRelat,rec);
            res.link.id = "link to: "+ endCol.name;

            return res
        }
            break;
        case 'manyToMany': {
            var rec = 1;
            var colArr = [];
            colArr.push(endCol);
            collectionBuild(colArr,allRelat,rec);
            res.id = "link to: "+ endCol.name;
            return res
        }
            break;
    }
}

// function objEqals(obj) {
//     var firstObj = obj.embed;
//     var secondObj = obj.link;
//     var s1 = JSON.stringify(firstObj);
//     var s2 = JSON.stringify(secondObj);
//     if(s1 === s2){
//         return firstObj
//     }
//     else{
//         return obj
//     }
// }
function reserveCheck(collectionName) {
    var colName = collectionName;
    if(reservedName.some(
            (item)=>{
                if(item===colName){
                    return true
                }
            })){
        return true
    }
    else{
        return false
    }
}

function recursionCheck(collectionName) {
    var colName = collectionName;
    if(stopRecur.some(
            (item)=>{
                if(item===colName){
                    return true
                }
            })){
        return true
    }
    else{
        return false
    }
}

function existCheck(collectionName) {
    var colName = collectionName;
    if(finalResult.some(
            (item)=>{
                if(item.collectionName===colName){
                    return true
                }
            })){
        return true
    }
    else{
        return false
    }
}

function blackListCheck(collectionsName){
    var colName = collectionsName;
    if(blackList.some(
            (item)=>{
                if(item===colName){
                    return true
                }
            })){
        return true
    }
    else{
        return false
    }
}

function relationsCheck(collectionsName) {
    var thisColName = collectionsName;
    var allCollect = allCol;
    var allRelat = allRel

    for(var i = 0; allCollect[i] !== undefined;i++) {
        if (allCollect[i].name === thisColName) {
            for (var j = 0; allCollect[i].fields[j] !== undefined; j++) {
                if (allCollect[i].fields[j].type === "rel") {
                    for (var r = 0; allRelat[r] !== undefined; r++) {
                        if (allCollect[i].fields[j].name === allRelat[r].beginField
                            && thisColName === allRelat[r].beginCollection) {
                            if (allRelat[r].type !== "oneToOne") {
                                return true
                            }
                        }
                    }

                }
            }
            return false
        }
    }
}

module.exports = relationsConception;