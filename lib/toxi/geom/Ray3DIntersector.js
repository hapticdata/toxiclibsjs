define(["require", "exports", "module", "./IsectData3D","../math/mathUtils"], function(require, exports, module) {

var IsectData3D = require('./IsectData3D'),
	mathUtils = require('../math/mathUtils');

/**
 * @class
 * @member toxi
 */
Ray3DIntersector = function(ray){
	this.ray = ray;
	this.isec = new IsectData3D();
};

Ray3DIntersector.prototype = {
	getIntersectionData: function(){
		return this.isec;
	},
	
	intersectsRay: function(other){
		var n = this.ray.dir.cross(other.dir);
		var sr = this.ray.sub(other);
		var absX = mathUtils.abs(n.x);
		var absY = mathUtils.abs(n.y);
		var absZ = mathUtils.abs(n.z);
		var t;
		if(absZ > absX && absZ > absY){
			t = (sr.x * other.dir.y - sr.y * other.dir.x) / n.z;
		} else if(absX > absY){
			t = (sr.y * other.dir.z - sr.z * other.dir.y) / n.x;
		} else {
			t = (sr.z * other.dir.x - sr.x * other.dir.z) / n.y;
		}
		this.isec.isIntersection = (t <= mathUtils.EPS && !isFinite(t));
		this.isec.pos = this.ray.getPointAtDistance(-t);
		return this.isec.isIntersection;
	}
};

module.exports = Ray3DIntersector;
});
