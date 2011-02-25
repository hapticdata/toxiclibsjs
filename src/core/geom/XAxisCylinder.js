function XAxisCylinder(pos,radius,length){
	this.parent.init.call(this,pos,radius,length);
}

XAxisCylinder.prototype = new AxisAlignedCylinder();
XAxisCylinder.constructor = XAxisCylinder;
XAxisCylinder.prototype.parent = AxisAlignedCylinder.prototype;

XAxisCylinder.prototype.containsPoint = function(p){
	if(MathUtils.abs(p.x - this.pos.x) < this.length * 0.5){
		var dy = p.y - this.pos.y;
		var dz = p.z - this.pos.z;
		if(Math.abs(dz * dz + dy * dy) < this.radiusSquared){
			return true;
		}
	}
}


XAxisCylinder.prototype.getMajorAxis = function(){
	return Vec3D.Axis.X;
}