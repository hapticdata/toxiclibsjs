define(["require", "exports", "module", "../internals","../math/mathUtils","./Vec3D","./AxisAlignedCylinder"], function(require, exports, module) {

var extend = require('../internals').extend,
	mathUtils = require('../math/mathUtils'),
	Vec3D = require('./Vec3D'),
	AxisAlignedCylinder = require('./AxisAlignedCylinder');

/**
 @module toxi/XAxisCylinder
 @constructor 
 X-axis aligned Cylinder
 @member toxi
 @author Kyle Phillips
 @augments AxisAlignedCylinder
 */
var	XAxisCylinder = function(pos,radius,length){
	AxisAlignedCylinder.apply(this,[pos,radius,length]);
};

extend(XAxisCylinder,AxisAlignedCylinder);

XAxisCylinder.prototype.containsPoint = function(p){
	if(mathUtils.abs(p.x - this.pos.x) < this.length * 0.5){
		var dy = p.y - this.pos.y;
		var dz = p.z - this.pos.z;
		if(Math.abs(dz * dz + dy * dy) < this.radiusSquared){
			return true;
		}
	}
	return false;
};
XAxisCylinder.prototype.getMajorAxis = function(){
	return Vec3D.Axis.X;
};


module.exports = XAxisCylinder;
});
