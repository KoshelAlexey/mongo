var recDepth = 0;
var blackList = [];
var finalResult =[];

function relationsConception(data) {
    var collections = data.collections;
    var relations = data.relations;
    var res = [];
    collectionBuild(collections,relations);
    res = finalResult;
    finalResult = [];
    blackList = [];
    return res

}

function collectionBuild(col,rel) {
    var collections = col;
    var relations = rel;
    var res = [];

    for(var i = 0; collections[i] !== undefined;i++) {
        if(!blackListCheck(collections[i].name)){
            var instance = {};
            for(var j = 0; collections[i].fields[j]!== undefined;j++){
                if(collections[i].fields[j].type === "rel"){
                    instance[collections[i].fields[j].name] = relControl(collections[i].fields[j],collections,relations,collections[i].name)
                }
                else{
                    instance[collections[i].fields[j].name] = collections[i].fields[j];

                    // instance.link[collections[i].fields[j].name] = collections[i].fields[j];
                }
            }
        }
        else{
            continue
        }

        // instance = objEqals(instance);
        instance.collectionName = collections[i].name;
        res[i] = instance;

    }
    if(res.length !== 0){
        finalResult=res
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

function relControl(thisField,col,rel,collectName) {
    var colName = collectName;
    var field = thisField;
    var allCol = col;
    var allRel = rel;

    var res = {};
    var thisRel = (function () {
        for(var r = 0; allRel[r] !== undefined;r++) {
            if (field.name === allRel[r].beginField
                && colName === allRel[r].beginCollection) {
                return allRel[r]
            }
        }
    })();
    if(!thisRel){
        return "relation don't used"
    }
    var endCol = (function () {
        for(var c = 0; allCol[c] !== undefined;c++) {
            if(allCol[c].name === thisRel.endCollection){
                return allCol[c]
            }
        }
    })();

    switch (thisRel.type) {
        case 'oneToOne': {
            blackList.push(endCol.name);
            for(var f = 0; endCol.fields[f] !== undefined;f++) {
                if(endCol.fields[f].type === "rel") {
                    if (recDepth < 50 ){
                        recDepth ++;
                        res[endCol.fields[f].name] = relControl(endCol.fields[f], allCol, allRel, endCol.name);
                    }
                    else{
                        res = "to deep recursion"
                    }
                }
                else{
                    res[endCol.fields[f].name] = endCol.fields[f];
                }
            }

            recDepth = 0;
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

            collectionBuild(endCol,allRel);
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

module.exports = relationsConception;