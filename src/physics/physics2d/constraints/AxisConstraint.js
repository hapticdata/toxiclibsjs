/**
 * Constrains a particle's movement by locking a given axis to a fixed value.
 */
toxi.physics2d.AxisConstraint = function(axis,constraint){
	this.axis = axis;
	this.constraint = constraint;
};

toxi.physics2d.AxisConstraint.prototype.apply = function(p){
	p.setComponent(this.axis,this.constraint);
};