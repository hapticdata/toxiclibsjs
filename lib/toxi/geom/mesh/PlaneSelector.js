define(["require", "exports", "module", "../../internals","./VertexSelector"], function(require, exports, module) {
var extend = require('../../internals').extend,
    VertexSelector = require('./VertexSelector');

/**
 * @class
 * @member toxi
 * @augments toxi.VertexSelector
 */
var PlaneSelector = function(mesh,plane,classifier, tolerance) {
    VertexSelector.apply(this,[mesh]);
    this.plane = plane;
    this.classifier = classifier;
    this.tolerances = (tolerance === undefined)? 0.0001 : tolerance;
};
extend(PlaneSelector,VertexSelector);
PlaneSelector.prototype.selectVertices = function() {
    this.clearSelection();
    var verts = this.mesh.getVertices();
    var l = verts.length;
    for (var i=0;i<l;i++) {
		var v = verts[i];
        if (this.plane.classifyPoint(v, this.tolerance) == this.classifier) {
            this.selection.add(v);
        }
    }
    return this;
};

module.exports = PlaneSelector;
});
