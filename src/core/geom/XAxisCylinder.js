toxi.XAxisCylinder = function(pos,radius,length){
	this.init(pos,radius,length);
};
toxi.XAxisCylinder.prototype = new toxi.AxisAlignedCylinder();
toxi.XAxisCylinder.constructor = toxi.XAxisCylinder;
toxi.XAxisCylinder.prototype.parent = toxi.AxisAlignedCylinder.prototype;

toxi.XAxisCylinder.prototype.containsPoint = function(p){
	if(toxi.MathUtils.abs(p.x - this.pos.x) < this.length * 0.5){
		var dy = p.y - this.pos.y;
		var dz = p.z - this.pos.z;
		if(Math.abs(dz * dz + dy * dy) < this.radiusSquared){
			return true;
		}
	}
	return false;
};
toxi.XAxisCylinder.prototype.getMajorAxis = function(){
	return toxi.Vec3D.Axis.X;
};
toxi.XAxisCylinder.prototype.init = function(pos,radius,length){
	this.parent.init.call(this,pos,radius,length);
};