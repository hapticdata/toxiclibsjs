define(["require", "exports", "module", "../../internals","./VertexSelector"], function(require, exports, module) {

var extend = require('../../internals').extend,
    VertexSelector = require('./VertexSelector');

/**
 * @class
 * @member toxi
 * @augments toxi.VertexSelector
 */
var BoxSelector = function(mesh,box) {
    VertexSelector.apply(this,[mesh]);
    this.box = box;
};

extend(BoxSelector,VertexSelector);

BoxSelector.prototype.selectVertices = function() {
    this.clearSelection();
    var verts = this.mesh.getVertices();
    var l = verts.length;
    for (var i=0;i<l;i++) {
		var v = verts[i];
        if (this.box.containsPoint(v)) {
            this.selection.add(v);
        }
    }
    return this;
};


module.exports = BoxSelector;

});
