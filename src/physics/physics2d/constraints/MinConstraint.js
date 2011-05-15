toxi.physics2d.MinConstraint = function(axis,threshold){
	this.axis = axis;
	this.threshold = threhold;
};

toxi.physics2d.MinConstraint.prototype.apply = function(p){
	if(p.getComponent(this.axis) < this.threshold){
		p.setComponent(this.axis, this.threshold);
	}
};