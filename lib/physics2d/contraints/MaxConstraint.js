toxi.physics2d.MaxConstraint = function(axis,threshold){
	this.axis = axis;
	this.threshold = threshold;	
};

toxi.physics2d.MaxConstraint.prototype.applyConstraint = function(p){
	if(p.getComponent(this.axis) > this.threshold){
		p.setComponent(this.axis,this.threshold);
	}
};