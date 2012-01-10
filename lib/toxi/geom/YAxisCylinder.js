define(["require", "exports", "module", "../internals","../math/mathUtils","./Vec3D","./AxisAlignedCylinder"], function(require, exports, module) {

var extend = require('../internals').extend,
	mathUtils = require('../math/mathUtils'),
	Vec3D = require('./Vec3D'),
	AxisAlignedCylinder = require('./AxisAlignedCylinder');
	
/**
 @member toxi
 @class Y-axis aligned Cylinder
 */
var	YAxisCylinder = function(pos,radius,length){
	AxisAlignedCylinder.apply(this,[pos,radius,length]);
};
extend(YAxisCylinder,AxisAlignedCylinder);

YAxisCylinder.prototype.containsPoint = function(p){
	if(mathUtils.abs(p.y - this.pos.y) < this.length * 0.5){
		var dx = p.x - this.pos.x;
		var dz = p.z - this.pos.z;
		if(Math.abs(dz * dz + dx * dx) < this.radiusSquared){
			return true;
		}
	}
	return false;
};
YAxisCylinder.prototype.getMajorAxis = function(){
	return Vec3D.Axis.Y;
};

module.exports = YAxisCylinder;

});
