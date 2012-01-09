define(["require", "exports", "module", "../internals","../math/mathUtils","./Vec3D","./AxisAlignedCylinder"], function(require, exports, module) {

var extend = require('../internals').extend,
	mathUtils = require('../math/mathUtils'),
	Vec3D = require('./Vec3D'),
	AxisAlignedCylinder = require('./AxisAlignedCylinder');

/**
 @member toxi
 @constructor Z-axis aligned Cylinder
 */
var	ZAxisCylinder = function(pos,radius,length){
	AxisAlignedCylinder.apply(this,[pos,radius,length]);
};
extend(ZAxisCylinder,AxisAlignedCylinder);
ZAxisCylinder.prototype.containsPoint = function(p){
	 if (mathUtils.abs(p.z - this.pos.z) < this.length * 0.5) {
            var dx = p.x - this.pos.x;
            var dy = p.y - this.pos.y;
            if (Math.abs(dx * dx + dy * dy) < this.radiusSquared) {
                return true;
            }
	}
	return false;
};
ZAxisCylinder.prototype.getMajorAxis = function(){
	return Vec3D.Axis.Z;
};

module.exports = ZAxisCylinder;
});
