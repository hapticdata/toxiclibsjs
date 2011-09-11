toxi.physics2d.VerletParticle2D = function(x,y,w){
	this.force = new toxi.Vec2D();
	if(x instanceof toxi.Vec2D){
		if(x instanceof toxi.physics2d.VerletParticle2D){
			
			y = x.y;
			w = x.weight;
			x = x.x;
			this.isLocked = x.isLocked;
			
		} else if(y === undefined){
			y = x.y;
			w = 1;
			x = x.x;
		} else {
			w = y;
			y = x.y;
			x = x.x;
		}
	}
	toxi.Vec2D.apply(this,[x,y]);
	this.isLocked = false;
	this.prev = new toxi.Vec2D(this);
	this.temp = new toxi.Vec2D();
	w = w || 1;
	this.setWeight(w);
};

toxi.extend(toxi.physics2d.VerletParticle2D,toxi.Vec2D);

toxi.physics2d.VerletParticle2D.prototype.addBehavior = function(behavior,timeStep){
	if(this.behaviors === undefined){
		this.behaviors = [];
	}
	if(behavior === undefined){
		throw { name: "TypeError", message: "behavior was undefined"};
	}
	timeStep = (timeStep === undefined)? 1 : timeStep;
	behavior.configure(timeStep);
	this.behaviors.push(behavior);
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.addConstraint = function(c){
	if(this.constraints === undefined){
		this.constraints = [];
	}
	this.constraints.push(c);
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.addForce = function(f){
	this.force.addSelf(f);
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.addVelocity = function(v){
	this.prev.subSelf(v);
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.applyBehaviors = function(){
	if(this.behaviors !== undefined){
		var i = 0;
		for(i = 0;i<this.behaviors.length;i++){
			this.behaviors[i].applyBehavior(this);
		}
	}
};

toxi.physics2d.VerletParticle2D.prototype.applyConstraints = function(){
	if(this.constraints !== undefined){
		var i =0;
		for(i =0;i<this.constraints.length;i++){
			this.constraints[i].applyConstraint(this);
		}
	}
};


toxi.physics2d.VerletParticle2D.prototype.clearForce = function(){
	this.force.clear();
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.clearVelocity = function(){
	this.prev.set(this);
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.getInvWeight = function(){
	return this.invWeight;
};

toxi.physics2d.VerletParticle2D.prototype.getPreviousPosition = function(){
	return this.prev;
};

toxi.physics2d.VerletParticle2D.prototype.getVelocity = function(){
	return this.sub(this.prev);
};

toxi.physics2d.VerletParticle2D.prototype.getWeight = function(){
	return this.weight;
};

toxi.physics2d.VerletParticle2D.prototype.lock = function(){
	this.isLocked = true;
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.removeAllBehaviors = function(){
	this.behaviors = [];
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.removeAllConstraints = function(){
	this.constraints = [];
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.removeBehavior = function(b){
	return toxi.physics2d.removeItemFrom(b,this.behaviors);
};

toxi.physics2d.VerletParticle2D.prototype.removeConstraint = function(c){
	return toxi.physics2d.removeItemFrom(c,this.constraints);
};

toxi.physics2d.VerletParticle2D.prototype.scaleVelocity = function(scl){
	this.prev.interpolateToSelf(this,1 - scl);
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.setPreviousPosition = function(p){
	this.prev.set(p);
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.setWeight = function(w){
	this.weight = w;
	this.invWeight = (w !== 0) ? 1 / w : 0; //avoid divide by zero
};

toxi.physics2d.VerletParticle2D.prototype.unlock = function() {
	this.clearVelocity();
	this.isLocked = false;
	return this;
};

toxi.physics2d.VerletParticle2D.prototype.update = function(){
	
	if(!this.isLocked){
		var that = this;
		this.applyBehaviors();
		//applyForce protected
		(function(){
			that.temp.set(that);
			that.addSelf(that.sub(that.prev).addSelf(that.force.scale(that.weight)));
			that.prev.set(that.temp);
			that.force.clear();
		})();
		this.applyConstraints();
	}
};
