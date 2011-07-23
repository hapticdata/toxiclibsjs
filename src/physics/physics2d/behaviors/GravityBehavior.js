toxi.physics2d.GravityBehavior = function(gravityVec){
	toxi.physics2d.ConstantForceBehavior.apply(this,[gravityVec]);
};

toxi.extend(toxi.physics2d.GravityBehavior,toxi.physics2d.ConstantForceBehavior);

toxi.physics2d.GravityBehavior.prototype.configure = function(timeStep){
	this.timeStep = timeStep;
    this.scaledForce = this.force.scale(timeStep * timeStep);
};