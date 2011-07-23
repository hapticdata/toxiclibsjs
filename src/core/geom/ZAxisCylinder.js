toxi.ZAxisCylinder = function(pos,radius,length){
	toxi.AxisAlignedCylinder.apply(this,[pos,radius,length]);
};
toxi.extend(toxi.ZAxisCylinder,toxi.AxisAlignedCylinder);
toxi.ZAxisCylinder.prototype.containsPoint = function(p){
	 if (MathUtils.abs(p.z - this.pos.z) < this.length * 0.5) {
            var dx = p.x - this.pos.x;
            var dy = p.y - this.pos.y;
            if (Math.abs(dx * dx + dy * dy) < this.radiusSquared) {
                return true;
            }
	}
	return false;
};
toxi.ZAxisCylinder.prototype.getMajorAxis = function(){
	return toxi.Vec3D.Axis.Z;
};