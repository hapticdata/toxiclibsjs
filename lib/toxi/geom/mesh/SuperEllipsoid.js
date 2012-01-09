define(["require", "exports", "module", "../../math/mathUtils","./TriangleMesh"], function(require, exports, module) {

var mathUtils = require('../../math/mathUtils');

var TriangleMesh = require('./TriangleMesh');

/**
 * @class
 * @member toxi
 */
var	SuperEllipsoid = function(n1,n2) {
	this.p1 = n1;
	this.p2 = n2;
};

SuperEllipsoid.prototype = {
	computeVertexFor: function(p,phi,theta) {
		phi -= mathUtils.HALF_PI;
		var cosPhi = mathUtils.cos(phi),
			cosTheta = mathUtils.cos(theta),
			sinPhi = mathUtils.sin(phi),
			sinTheta = mathUtils.sin(theta);

		var t = mathUtils.sign(cosPhi) * Math.pow(mathUtils.abs(cosPhi), this.p1);
		p.x = t * mathUtils.sign(cosTheta) * Math.pow(Math.abs(cosTheta), this.p2);
		p.y = mathUtils.sign(sinPhi) * Math.pow(Math.abs(sinPhi), this.p1);
		p.z = t * mathUtils.sign(sinTheta) * Math.pow(mathUtils.abs(sinTheta), this.p2);
		return p;
	},
 
	getPhiRange: function() {
		return mathUtils.TWO_PI;
	},

	getPhiResolutionLimit: function(res) {
		return res / 2;
	},

	getThetaRange: function() {
		return mathUtils.TWO_PI;
	},

	getThetaResolutionLimit: function(res) {
		return res;
	}
};

module.exports = SuperEllipsoid;
});
