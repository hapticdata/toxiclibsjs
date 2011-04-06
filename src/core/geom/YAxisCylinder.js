toxi.YAxisCylinder = function(pos,radius,length){
	this.init(pos,radius,length);
};
toxi.YAxisCylinder.prototype = new toxi.AxisAlignedCylinder();
toxi.YAxisCylinder.constructor = toxi.YAxisCylinder;
toxi.YAxisCylinder.prototype.parent = toxi.AxisAlignedCylinder.prototype;
toxi.YAxisCylinder.prototype.containsPoint = function(p){
	if(toxi.MathUtils.abs(p.y - this.pos.y) < this.length * 0.5){
		var dx = p.x - this.pos.x;
		var dz = p.z - this.pos.z;
		if(Math.abs(dz * dz + dx * dx) < this.radiusSquared){
			return true;
		}
	}
	return false;
};
toxi.YAxisCylinder.prototype.getMajorAxis = function(){
	return toxi.Vec3D.Axis.Y;
};
toxi.YAxisCylinder.prototype.init = function(pos,radius,length){
	this.parent.init.call(this,pos,radius,length);
};