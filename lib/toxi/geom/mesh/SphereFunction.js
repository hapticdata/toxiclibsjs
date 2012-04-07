define(["require", "exports", "module", "../../math/mathUtils","../Vec3D","../Sphere"], function(require, exports, module) {

var mathUtils = require('../../math/mathUtils'),
	Vec3D = require('../Vec3D'),
	internals = require('../../internals'),
	Sphere = require('../Sphere');

/**
 * @class This implementation of a {@link SurfaceFunction} samples a given
 * {@link Sphere} instance when called by the {@link SurfaceMeshBuilder}.
 * @member toxi
 */
var	SphereFunction = function(sphere_or_radius) {
	if(sphere_or_radius === undefined){
		this.sphere = new Sphere(new Vec3D(),1);
	}
	
	if(internals.tests.isSphere( sphere_or_radius )){
		this.sphere = sphere_or_radius;
	}
	else{
		this.sphere = new Sphere(new Vec3D(),sphere_or_radius);
	}
	this.phiRange = mathUtils.PI;
	this.thetaRange = mathUtils.TWO_PI;
};

SphereFunction.prototype = {
	
	computeVertexFor: function(p,phi,theta) {
	    phi -= mathUtils.HALF_PI;
	    var cosPhi = mathUtils.cos(phi);
	    var cosTheta = mathUtils.cos(theta);
	    var sinPhi = mathUtils.sin(phi);
	    var sinTheta = mathUtils.sin(theta);
	    var t = mathUtils.sign(cosPhi) * mathUtils.abs(cosPhi);
	    p.x = t * mathUtils.sign(cosTheta) * mathUtils.abs(cosTheta);
	    p.y = mathUtils.sign(sinPhi) * mathUtils.abs(sinPhi);
	    p.z = t * mathUtils.sign(sinTheta) * mathUtils.abs(sinTheta);
	    return p.scaleSelf(this.sphere.radius).addSelf(this.sphere);
	},
	
	getPhiRange: function() {
	    return this.phiRange;
	},
	
	getPhiResolutionLimit: function(res) {
	    return res;
	},
	
	getThetaRange: function() {
	    return this.thetaRange;
	},
	
	getThetaResolutionLimit: function(res) {
	    return res;
	},
	
	setMaxPhi: function(max) {
	    this.phiRange = mathUtils.min(max / 2, mathUtils.PI);
	},
	
	setMaxTheta: function(max) {
	    this.thetaRange = mathUtils.min(max, mathUtils.TWO_PI);
	}
};

module.exports = SphereFunction;
});
