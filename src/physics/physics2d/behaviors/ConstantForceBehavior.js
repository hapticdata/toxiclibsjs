//expected to implement ParticleBehavior interface

toxi.physics2d.ConstantForceBehavior = function(force){
	this.initConstantForceBehavior(force);
};

toxi.physics2d.ConstantForceBehavior.prototype = {
	apply: function(p){
		p.addForce()
	},
	
	configure: function(timeStep){
		this.timeStep = timeStep;
		this.setForce(this.force);
	},
	
	getForce: function(){
		return this.force;
	},
	
	initConstantForceBehavior: function(force){
		this.force = force;
		console.log("took: "+this.force);
		this.scaleForce = new toxi.Vec2D();
		this.timeStep = 0;
	},
	setForce: function(forceVec){
		this.force = forceVec;
		this.scaledForce = this.force.scale(this.timeStep);
	}
};
