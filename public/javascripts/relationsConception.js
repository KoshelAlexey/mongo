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
        return {wrn:"Relation warning!", msg:"Relation don't used. "+"Collection: "+thisColName+" "+"Field: "+field.name+"."}
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
            res.emb = {};
            if (!toTargetCollectionRelationsCheck(endCol, thisColName)){
                blackList.push(endCol.name);
            };
            for(var f = 0; endCol.fields[f] !== undefined;f++) {
                if(endCol.fields[f].type === "rel") {
                    if (recursionCheck(endCol.name)) {
                        res.emb.wrn = "Recursion warning!";
                        res.emb.msg = "Collection will include itself. "+"Collection: "+thisColName+" "+"Field: "+field.name+".";
                    }
                    else {
                        res.emb[endCol.fields[f].name] = relControl(endCol.fields[f], allCollect, allRelat, endCol.name, colName);
                        res.emb.meta = {};
                        res.emb.meta.field = field;
                        res.emb.meta.relation = thisRel;
                    }

                }
                else{
                    res.emb[endCol.fields[f].name] = endCol.fields[f];
                    res.emb.meta = {};
                    res.emb.meta.field = field;
                    res.emb.meta.relation = thisRel;
                }
            }

            return res
        }
            break;
        case 'oneToMany': {
            res.emb = {};
            res.link = {};
            if(field.maxValue < 50 || field.maxValue === undefined){

                for(var f = 0; endCol.fields[f] !== undefined;f++) {
                    if(endCol.fields[f].type === "rel") {
                        if (!recursionCheck(endCol.name)) {
                            res.emb[endCol.fields[f].name] = relControl(endCol.fields[f], allCollect, allRelat, endCol.name);
                            res.emb.meta = {};
                            res.emb.meta.field = field;
                            res.emb.meta.relation = thisRel;
                        }
                        else{
                            res.emb.wrn = "Recursion warning!";
                            res.emb.msg = "Collection will include itself. "+"Collection: "+thisColName+" "+"Field: "+field.name+".";
                        }
                    }
                    else{
                        res.emb[endCol.fields[f].name] = endCol.fields[f];
                        res.emb.meta = {};
                        res.emb.meta.field = field;
                        res.emb.meta.relation = thisRel;
                    }
                }
            }
            else{
                res.emb = {err:"Creation error!",msg:"Can't create element. Too many documents. Recommend max value <50. "+"Collection: "+thisColName+" "+"Field: "+field.name+"."}
            }

            var rec = 1;
            var colArr = [];
            colArr.push(endCol);
            collectionBuild(colArr,allRelat,rec);
            res.link.id = "link to: "+ endCol.name;
            res.link.meta = {};
            res.link.meta.field = field;
            res.link.meta.relation = thisRel;
            return res
        }
            break;
        case 'manyToOne': {
            res.emb = {};
            res.link = {};
            if (!toTargetCollectionRelationsCheck(endCol, thisColName)){
                blackList.push(endCol.name);
            };
            for(var f = 0; endCol.fields[f] !== undefined;f++) {
                if(endCol.fields[f].type === "rel") {
                    if (!recursionCheck(endCol.name)) {
                        res.emb[endCol.fields[f].name] = relControl(endCol.fields[f], allCollect, allRelat, endCol.name);
                        res.emb.meta = {};
                        res.emb.meta.field = field;
                        res.emb.meta.relation = thisRel;
                    }
                    else{
                        res.emb.wrn = "Recursion warning!";
                        res.emb.msg = "Collection will include itself. "+"Collection: "+thisColName+" "+"Field: "+field.name+".";
                    }
                }
                else{
                    res.emb[endCol.fields[f].name] = endCol.fields[f];
                    res.emb.meta = {};
                    res.emb.meta.field = field;
                    res.emb.meta.relation = thisRel;
                }
            }
            if(toTargetCollectionRelationsCheck(endCol, thisColName)){
                var rec = 1;
                var colArr = [];
                colArr.push(endCol);
                collectionBuild(colArr,allRelat,rec);
                res.link.id = "link to: "+ endCol.name;
                res.link.meta = {};
                res.link.meta.field = field;
                res.link.meta.relation = thisRel;
            }
            else{
                // res.link = "Target collection will not exist"
                res.link.err = "Link error!";
                res.link.msg = "Target collection will not exist.";
            }

            return res
        }
            break;
        case 'manyToMany': {
            res.link = {};
            var rec = 1;
            var colArr = [];
            colArr.push(endCol);
            collectionBuild(colArr,allRelat,rec);
            res.link.id = "link to: "+ endCol.name;
            res.link.meta = {};
            res.link.meta.field = field;
            res.link.meta.relation = thisRel;
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

function fromTargetCollectionRelationsCheck(collection) {
    var thisCol = collection;
    var allRelat = allRel;

    for (var j = 0; thisCol.fields[j] !== undefined; j++) {
        if (thisCol.fields[j].type === "rel") {
            for (var r = 0; allRelat[r] !== undefined; r++) {
                if (thisCol.fields[j].name === allRelat[r].beginField
                    && thisCol.name === allRelat[r].beginCollection) {
                    if (allRelat[r].type !== "oneToOne") {
                        return true
                    }
                }
            }

        }
    }
    return false
}

function toTargetCollectionRelationsCheck(collection, prColName) {
    var prewColName = prColName;
    var thisCol = collection;
    var allRelat = allRel;

    for (var r = 0; allRelat[r] !== undefined; r++) {
        if (allRelat[r].endCollection === thisCol.name &&
            allRelat[r].beginCollection !== prewColName &&
            allRelat[r].type !== "oneToOne") {
            return true
        }
    }
    return false
}

module.exports = relationsConception;