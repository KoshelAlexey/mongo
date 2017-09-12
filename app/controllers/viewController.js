'use strict';

mongoApp.controller('viewController', function renderingForm($scope, userDbStructureService) {
    $scope.viewShow = {show: false};

    var container = document.getElementById('container');
    var graph = new mxGraph(container);


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

        userDbStructureService.getStructure().then((data) => {
            if (data) {


                try {
                    var wholeArr = [];
                    data.forEach(function (item, i) {
                        var subArr = [];
                        subArr[0] = graph.insertVertex(parent, null, item.col, 0, 0, 120, 50);
                        for (var prop in item) {
                            if (prop !== 'col') {
                                function emb(fieldObj, fieldProp, arr) {
                                    console.log(fieldProp);
                                    if (fieldProp === 'embded') {
                                        for (var key in fieldProp[fieldProp]) {
                                            var ttt = fieldProp[fieldProp];
                                            if (typeof(ttt[key]) === 'object') {
                                                var subArr = [];
                                                emb(item, prop, subArr);
                                            } else {
                                                arr.push(graph.insertVertex(arr[0], null, key, 0, 0, 100, 30))
                                            }
                                        }
                                    }
                                }
                                emb(item, prop, subArr);
                            }
                        }
                        wholeArr[i] = subArr;
                        console.dir(subArr);
                    });
                    // return wholeArr;
                    console.dir(wholeArr);
                    // var wholeArr = [];
                    // for (var i = 0; i < data.length; i++) {
                    //     wholeArr[i] = graph.insertVertex(parent, null, data[i].col, 0, 0, 120, 0, 'column');
                    //     for (var prop in data[i]) {
                    //         if (prop !== col) {
                    //
                    //         }
                    //     }
                    // }

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
});