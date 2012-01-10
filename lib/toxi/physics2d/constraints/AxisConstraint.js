define(["require", "exports", "module"], function(require, exports, module) {
/**
 * Constrains a particle's movement by locking a given axis to a fixed value.
 */
var	AxisConstraint = function(axis,constraintAmount){
	this.axis = axis;
	this.constraint = constraintAmount;
};

AxisConstraint.prototype.applyConstraint = function(p){
	p.setComponent(this.axis,this.constraint);
};

module.exports = AxisConstraint;
});
