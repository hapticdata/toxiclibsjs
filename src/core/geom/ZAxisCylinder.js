function ZAxisCylinder(pos,radius,length){
	this.parent.init.call(this,pos,radius,length);
}

ZAxisCylinder.prototype = new AxisAlignedCylinder();
ZAxisCylinder.constructor = ZAxisCylinder;
ZAxisCylinder.prototype.parent = AxisAlignedCylinder.prototype;

ZAxisCylinder.prototype.containsPoint = function(p){
	 if (MathUtils.abs(p.z - this.pos.z) < this.length * 0.5) {
            float dx = p.x - this.pos.x;
            float dy = p.y - this.pos.y;
            if (Math.abs(dx * dx + dy * dy) < this.radiusSquared) {
                return true;
            }
	}
}


ZAxisCylinder.prototype.getMajorAxis = function(){
	return Vec3D.Axis.Z;
}