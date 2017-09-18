'use strict';

mongoApp.controller('viewController', function renderingForm($scope, userDbStructureService) {
    $scope.viewShow = {show: false};

    var container = document.getElementById('container');
    var graph = new mxGraph(container);
    var levelCounter;


    $scope.main = function () {

            graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
        // console.log("dddd")
        // Checks if the browser is supported

        // Enables crisp rendering of rectangles in SVG
        mxConstants.ENTITY_SEGMENT = 20;

        // Creates the graph inside the given container
        graph.setDropEnabled(true);

        // Disables global features
        graph.collapseToPreferredSize = false;
        graph.constrainChildren = false;
        graph.cellsSelectable = false;
        graph.extendParentsOnAdd = false;
        graph.extendParents = false;
        graph.border = 10;

        // Sets global styles
        var style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
        style[mxConstants.STYLE_ROUNDED] = true;

        style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_FILLCOLOR] = '#ffffff';
        style[mxConstants.STYLE_SHAPE] = 'swimlane';
        style[mxConstants.STYLE_STARTSIZE] = 30;

        style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        style[mxConstants.STYLE_STROKECOLOR] = 'none';
        style[mxConstants.STYLE_FILLCOLOR] = 'none';
        style[mxConstants.STYLE_FOLDABLE] = false;
        graph.getStylesheet().putCellStyle('column', style);

        // Installs auto layout for all levels
        var layout = new mxStackLayout(graph, true);
        layout.border = graph.border;
        var layoutMgr = new mxLayoutManager(graph);
        layoutMgr.getLayout = function (cell) {
            if (!cell.collapsed) {
                if (cell.parent != graph.model.root) {
                    layout.resizeParent = true;
                    layout.horizontal = false;
                    layout.spacing = 10;
                }
                else {
                    layout.resizeParent = true;
                    layout.horizontal = true;
                    layout.spacing = 40;
                }

                return layout;
            }

            return null;
        };

        // Resizes the container
        graph.setResizeContainer(false);

        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();

        userDbStructureService.getStructure().then((data1) => {
            // var data = [{"f":{"s":{"t":{"fr":{"ft":{"sx":{"sv":{"et":{"required":true,"searchable":false,"name":"et","type":"string","expValue":"","minValue":"","maxValue":""},"id":{"required":true,"searchable":true,"name":"id","type":"et","expValue":"","minValue":"","maxValue":""}},"id":{"required":true,"searchable":true,"name":"id","type":"sv","expValue":"","minValue":"","maxValue":""}},"id":{"required":true,"searchable":true,"name":"id","type":"sx","expValue":"","minValue":"","maxValue":""}},"id":{"required":true,"searchable":true,"name":"id","type":"ft","expValue":"","minValue":"","maxValue":""}},"id":{"required":true,"searchable":true,"name":"id","type":"fr","expValue":"","minValue":"","maxValue":""}},"id":{"required":true,"searchable":true,"name":"id","type":"t","expValue":"","minValue":"","maxValue":""}},"id":{"required":true,"searchable":true,"name":"id","type":"s","expValue":"","minValue":"","maxValue":""}},"id":{"required":true,"searchable":true,"name":"id","type":"ff","expValue":"","minValue":"","maxValue":""},"collectionName":"ff"}]
            // var data = [{"f1":{"s1":{"t1":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t2":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t3":{"required":false,"searchable":false,"name":"t3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"third","expValue":"","minValue":"","maxValue":""}},"s2":{"t1":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t2":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t3":{"required":false,"searchable":false,"name":"t3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"third","expValue":"","minValue":"","maxValue":""}},"s3":{"required":false,"searchable":false,"name":"s3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"second","expValue":"","minValue":"","maxValue":""}},"f2":{"s1":{"t1":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t2":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t3":{"required":false,"searchable":false,"name":"t3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"third","expValue":"","minValue":"","maxValue":""}},"s2":{"t1":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t2":{"fr1":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr2":{"ft1":{"required":true,"searchable":false,"name":"ft1","type":"string","expValue":"","minValue":"","maxValue":""},"ft2":{"required":false,"searchable":false,"name":"ft2","type":"number"},"ft3":{"required":false,"searchable":false,"name":"ft3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"fifth","expValue":"","minValue":"","maxValue":""}},"fr3":{"required":false,"searchable":false,"name":"fr3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"forth","expValue":"","minValue":"","maxValue":""}},"t3":{"required":false,"searchable":false,"name":"t3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"third","expValue":"","minValue":"","maxValue":""}},"s3":{"required":false,"searchable":false,"name":"s3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"second","expValue":"","minValue":"","maxValue":""}},"f3":{"required":false,"searchable":false,"name":"f3","type":"string"},"id":{"required":true,"searchable":true,"name":"id","type":"first","expValue":"","minValue":"","maxValue":""},"collectionName":"first"}];
            // var data = [{"f":{"emb":{"fr":{"required":true,"searchable":false,"name":"fr","type":"number","expValue":"","minValue":"","maxValue":""},"id":{"required":true,"searchable":true,"name":"id","type":"rrr","expValue":"","minValue":"","maxValue":""}},"link":{"id":"link to: rrr"}},"id":{"required":true,"searchable":true,"name":"id","type":"fffff","expValue":"","minValue":"","maxValue":""},"collectionName":"fffff"},{"fr":{"required":true,"searchable":false,"name":"fr","type":"number","expValue":"","minValue":"","maxValue":""},"id":{"required":true,"searchable":true,"name":"id","type":"rrr","expValue":"","minValue":"","maxValue":""},"collectionName":"rrr"}];
            var data = [{"ff":{"tt":{"required":true,"searchable":false,"name":"tt","type":"string","expValue":"","minValue":"","maxValue":""},"id":{"required":true,"searchable":true,"name":"id","type":"t","expValue":"","minValue":"","maxValue":""}},"fff":{"required":false,"searchable":false,"name":"fff","type":"string"},"ffff":{"emb":{"ss":{"required":true,"searchable":false,"name":"ss","type":"string","expValue":"","minValue":"","maxValue":""},"sss":{"emb":{"frfr":{"required":true,"searchable":false,"name":"frfr","type":"string","expValue":"","minValue":"","maxValue":""},"id":{"required":true,"searchable":true,"name":"id","type":"fr","expValue":"","minValue":"","maxValue":""}},"link":{"id":"link to: fr"}},"id":{"required":true,"searchable":true,"name":"id","type":"s","expValue":"","minValue":"","maxValue":""}},"link":{"id":"link to: s"}},"id":{"required":true,"searchable":true,"name":"id","type":"f","expValue":"","minValue":"","maxValue":""},"collectionName":"f"},{"ss":{"required":true,"searchable":false,"name":"ss","type":"string","expValue":"","minValue":"","maxValue":""},"sss":{"emb":{"frfr":{"required":true,"searchable":false,"name":"frfr","type":"string","expValue":"","minValue":"","maxValue":""},"id":{"required":true,"searchable":true,"name":"id","type":"fr","expValue":"","minValue":"","maxValue":""}},"link":{"id":"link to: fr"}},"id":{"required":true,"searchable":true,"name":"id","type":"s","expValue":"","minValue":"","maxValue":""},"collectionName":"s"},{"frfr":{"required":true,"searchable":false,"name":"frfr","type":"string","expValue":"","minValue":"","maxValue":""},"id":{"required":true,"searchable":true,"name":"id","type":"fr","expValue":"","minValue":"","maxValue":""},"collectionName":"fr"}];
            console.dir(data);
            if (data) {
                try {
                    var wholeArr = [];

                    data.forEach(function (item, i) {
                        if (!item) {
                            return;
                        } else {
                            var subArr = [];
                            var outerWidth;
                            var localCounter = 1;

                            levelCounter = 1;
                            findLevels(item, localCounter);
                            outerWidth = 150 + levelCounter * 10;

                            // subArr[0] = graph.insertVertex(parent, null, '', 0, 0, outerWidth,
                            //     0);
                            // subArr[0].geometry.alternateBounds = new mxRectangle(0, 0, outerWidth, 0);
                            //
                            // var colNameField = graph.insertVertex(subArr[0], null, item.collectionName, 0, 0, outerWidth - 10,
                            //     30, 'MYSTYLE;swimlaneFillColor=yellow;fillOpacity=50;strokeWidth=3');
                            // subArr[0].geometry.alternateBounds = new mxRectangle(0, 0, outerWidth, 30);

                            // subArr.push(colNameField);

                            subArr[0] = graph.insertVertex(parent, null, item.collectionName, 0, 0, outerWidth,
                                30, 'MYSTYLE;swimlaneFillColor=yellow;fillOpacity=50;strokeWidth=3');
                            subArr[0].geometry.alternateBounds = new mxRectangle(0, 0, outerWidth, 30);

                            wholeArr[i] = subArr;
                        }
                    });
                    data.forEach(function (item, i) {
                        if (!item) {
                           return;
                        } else {
                            wholeArr.forEach(function (collArr, i) {
                                if (collArr[0].value === item.collectionName) {
                                    var outerWidth = collArr[0].geometry.width;

                                    for (var prop in item) {
                                        if (prop !== 'collectionName') {
                                            emb(item, prop, collArr, outerWidth, wholeArr);
                                        }
                                    }
                                }

                            });
                        }
                    });
                    console.dir(wholeArr);

                    // var col1 = graph.insertVertex(parent, null, '', 0, 0, 120, 0, 'column');
                    //
                    // var v1 = graph.insertVertex(col1, null, '1', 0, 0, 100, 30);
                    // v1.collapsed = true;
                    //
                    // var v11 = graph.insertVertex(v1, null, '1.1', 0, 0, 80, 30);
                    // v11.collapsed = true;
                    //
                    // var v111 = graph.insertVertex(v11, null, '1.1.1', 0, 0, 60, 30);
                    // var v112 = graph.insertVertex(v11, null, '1.1.2', 0, 0, 60, 30);
                    //
                    // var v12 = graph.insertVertex(v1, null, '1.2', 0, 0, 80, 30);
                    //
                    // var col2 = graph.insertVertex(parent, null, '', 0, 0, 120, 0, 'column');
                    //
                    // var v2 = graph.insertVertex(col2, null, '2', 0, 0, 100, 30);
                    // v2.collapsed = true;
                    //
                    // var v21 = graph.insertVertex(v2, null, '2.1', 0, 0, 80, 30);
                    // v21.collapsed = true;
                    //
                    // var v211 = graph.insertVertex(v21, null, '2.1.1', 0, 0, 60, 30);
                    // var v212 = graph.insertVertex(v21, null, '2.1.2', 0, 0, 60, 30);
                    //
                    // var v22 = graph.insertVertex(v2, null, '2.2', 0, 0, 80, 30);
                    //
                    // var v3 = graph.insertVertex(col2, null, '3', 0, 0, 100, 30);
                    // v3.collapsed = true;
                    //
                    // var v31 = graph.insertVertex(v3, null, '3.1', 0, 0, 80, 30);
                    // v31.collapsed = true;
                    //
                    // var v311 = graph.insertVertex(v31, null, '3.1.1', 0, 0, 60, 30);
                    // var v312 = graph.insertVertex(v31, null, '3.1.2', 0, 0, 60, 30);
                    //
                    // var v32 = graph.insertVertex(v3, null, '3.2', 0, 0, 80, 30);
                    //
                    // graph.insertEdge(parent, null, '', v111, v211);
                    // graph.insertEdge(parent, null, '', v112, v212);
                    // graph.insertEdge(parent, null, '', v112, v22);
                    //
                    // graph.insertEdge(parent, null, '', v12, v311);
                    // graph.insertEdge(parent, null, '', v12, v312);
                    // graph.insertEdge(parent, null, '', v12, v32);
                }
                finally {
                    // Updates the display
                    graph.getModel().endUpdate();
                }
            }
        })


    };

    function findLevels(obj, loc) {
        if (!obj) {
            return;
        } else {
            for (var prop in obj) {
                if (typeof obj[prop] === 'object' && obj[prop].type === undefined) {
                    var local = loc++;
                    findLevels(obj[prop], local);
                }
                if (local >= levelCounter) {
                    levelCounter = local;
                }
            }
        }
    }

    function emb(obj, propName, parentArr, contWidth, arrToGraph) {
        var innerWidth = contWidth - 10;
        var propValue = obj[propName];
        // console.dir(arrToGraph);

        if (typeof propValue !== 'object' || "type" in propValue) {
            var elArr = graph.insertVertex(parentArr[0], null, propName, 0, 0, innerWidth,
                30, 'MYSTYLE;swimlaneFillColor=white;fillColor=#ffffff;fillOpacity=100');
            parentArr.push(elArr);
        } else {
                var subArr = [];
                var parentElArr = graph.insertVertex(parentArr[0], null, propName, 0, 0, innerWidth,
                    30, 'MYSTYLE;strokeWidth=1;strokeColor=#000000');
                parentElArr.geometry.alternateBounds = new mxRectangle(0, 0, innerWidth, 30);
                subArr[0] = parentElArr;

                for (var key in propValue) {
                    if (key === 'link') {
                        var idValue = propValue[key].id;
                        var collName = idValue.slice(idValue.lastIndexOf(":") + 2);
                        var endColl = [];
                        arrToGraph.forEach(function(coll) {
                            if (coll[0].value === collName) {
                                endColl = coll;
                            }
                        });
                        var elArr = graph.insertVertex(subArr[0], null, propName + ' is linked to collection: ' + collName, 0, 0, innerWidth - 10,
                            30, 'MYSTYLE;swimlaneFillColor=white;fillColor=#ffffff;fillOpacity=100');
                        graph.insertEdge(parentElArr, null, '', elArr, endColl[0]);
                        var gr = graph.insertEdge(parentElArr, null, '', elArr, endColl[0]);
                        subArr.push(elArr);
                        console.dir(gr);
                    } else {
                        emb(propValue, key, subArr, innerWidth, arrToGraph)
                    }
                }
                parentArr.push(subArr);
            }
        // }
    }
});