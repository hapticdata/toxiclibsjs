define(["require", "exports", "module"], function(require, exports, module) {
var	MaxConstraint = function(axis,threshold){
	this.axis = axis;
	this.threshold = threshold;	
};

MaxConstraint.prototype.applyConstraint = function(p){
	if(p.getComponent(this.axis) > this.threshold){
		p.setComponent(this.axis,this.threshold);
	}
};

module.exports = MaxConstraint;
});
