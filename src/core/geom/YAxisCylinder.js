toxi.YAxisCylinder = function(pos,radius,length){
	toxi.AxisAlignedCylinder.apply(this,[pos,radius,length]);
};
toxi.extend(toxi.YAxisCylinder,toxi.AxisAlignedCylinder);

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
