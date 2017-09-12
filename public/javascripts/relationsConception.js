var recDepth = 0;
var blackList = [];

function relationsConception(data) {
    var collections = data.collections;
    var relations = data.relations;
    var res = [];
    for(var i = 0; collections[i] !== undefined;i++) {
        if(!blackListCheck(collections[i].name)){
            var instance = {};
            for(var j = 0; collections[i].fields[j]!== undefined;j++){
                if(collections[i].fields[j].type === "rel"){
                    instance[collections[i].fields[j].name] = relControl(collections[i].fields[j],collections,relations,collections[i].name)
                    // instance[collections[i].fields[j].name] = embedContent(collections[i].fields[j],collections,relations,collections[i].name);
                    // instance.link[collections[i].fields[j].name] = linkContent(collections[i].fields[j],collections,relations,collections[i].name);
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
        instance.col = collections[i].name;
        res[i] = instance;
    }
    return res
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

function relControl(field,col,rel,colName) {
    var colName = colName;
    var field = field;
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
                    if (recDepth < 50){
                        recDepth ++;
                        res[endCol.fields[f].name] = relControl(endCol.fields[f], allCol, allRel, endCol.name);
                    }
                    else{
                        res.embed = "to deep recursion"
                    }
                    // res.link[endCol.fields[f].name] = linkContent(endCol.fields[f], allCol, allRel, endCol.name);
                }
                else{
                    recDepth = 0;
                    res[endCol.fields[f].name] = endCol.fields[f];
                    // res.link[endCol.fields[f].name] = endCol.fields[f];
                }
            }
            // res = objEqals(res);
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

function embedContent(field,col,rel,colName) {
    var colName = colName;
    var field = field;
    var allCol = col;
    var allRel = rel;


    var res = {embed:{},link:{}};
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
                    if (recDepth < 50){
                        recDepth ++;
                        res.embed[endCol.fields[f].name] = embedContent(endCol.fields[f], allCol, allRel, endCol.name);
                    }
                    else{
                        res.embed = "to deep recursion"
                    }
                    res.link[endCol.fields[f].name] = linkContent(endCol.fields[f], allCol, allRel, endCol.name);
                }
                else{
                    recDepth = 0;
                    res.embed[endCol.fields[f].name] = endCol.fields[f];
                    res.link[endCol.fields[f].name] = endCol.fields[f];
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

    var res = {embed:{},link:{}};
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
                    res = {id: endCol.fields[f]}
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
    var firstObj = obj.embed;
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