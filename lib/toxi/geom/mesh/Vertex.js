define(["require", "exports", "module", "../../internals","../Vec3D"], function(require, exports, module) {

var extend = require('../../internals').extend,
	Vec3D = require('../Vec3D');

/**
 * @class
 * @member toxi
 * @augments toxi.Vec3D
 */
var	Vertex = function(v,id) {
        Vec3D.apply(this,[v]);
        this.id = id;
        this.normal = new Vec3D();
};
extend(Vertex,Vec3D);

Vertex.prototype.addFaceNormal = function(n) {
    this.normal.addSelf(n);
};

Vertex.prototype.clearNormal = function() {
    this.normal.clear();
};

Vertex.prototype.computeNormal = function() {
    this.normal.normalize();
};

Vertex.prototype.toString = function() {
    return this.id + ": p: " + this.parent.toString.call(this) + " n:" + this.normal.toString();
};

module.exports = Vertex;
});
