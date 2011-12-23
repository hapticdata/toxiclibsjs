/**
 * Constrains a particle's movement by locking a given axis to a fixed value.
 */
toxi.physics2d.AxisConstraint = function(axis,constraintAmount){
	this.axis = axis;
	this.constraint = constraintAmount;
};

toxi.physics2d.AxisConstraint.prototype.applyConstraint = function(p){
	p.setComponent(this.axis,this.constraint);
};