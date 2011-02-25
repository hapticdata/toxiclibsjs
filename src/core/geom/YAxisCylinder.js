function YAxisCylinder(pos,radius,length){
	this.parent.init.call(this,pos,radius,length);
}

YAxisCylinder.prototype = new AxisAlignedCylinder();
YAxisCylinder.constructor = XAxisCylinder;
YAxisCylinder.prototype.parent = AxisAlignedCylinder.prototype;

YAxisCylinder.prototype.containsPoint = function(p){
	if(MathUtils.abs(p.y - this.pos.y) < this.length * 0.5){
		var dx = p.x - this.pos.x;
		var dz = p.z - this.pos.z;
		if(Math.abs(dz * dz + dx * dx) < this.radiusSquared){
			return true;
		}
	}
}


YAxisCylinder.prototype.getMajorAxis = function(){
	return Vec3D.Axis.Y;
}