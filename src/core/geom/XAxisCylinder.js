toxi.XAxisCylinder = function(pos,radius,length){
	toxi.AxisAlignedCylinder.apply(this,[pos,radius,length]);
};

toxi.extend(toxi.XAxisCylinder,toxi.AxisAlignedCylinder);

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
