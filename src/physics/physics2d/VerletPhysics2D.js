toxi.physics2d.VerletPhysics2D = function(gravity, numIterations, drag, timeStep){
	this.behaviors = [];
	this.particles = [];
	this.springs = [];
	this.numIterations = (numIterations === undefined) ? 50 : numIterations;
	this.timeStep = (timeStep === undefined) ? 1 : timeStep;
	this.setDrag(drag || 0);
	
	if(gravity !== undefined){
		this.addBehavior(new toxi.physics2d.GravityBehavior(gravity));
	}

}

toxi.physics2d.VerletPhysics2D.addConstraintToAll = function(c, list){
	for(var i=0;i<list.length;i++){
		list[i].addConstraint(c);
	}
}

toxi.physics2d.VerletPhysics2D.removeConstraintFromAll = function(c,list){
	for(var i=0;i<list.length;i++){
		list[i].removeConstraint(c);
	}
}

toxi.physics2d.VerletPhysics2D.prototype = {
	
	addBehavior: function(behavior){
		if(behavior === undefined){
			throw { name: "TypeError",
					message: "Incorrect Parameters for toxi.physics2d.VerletPhysics2D addBehavior"
				};
		}
		behavior.configure(this.timeStep);
		this.behaviors.push(behavior);
	},
	
	addParticle: function(p){
		this.particles.push(p);
		return this;
	},
	
	addSpring: function(s){
		if(this.getSpring(s.a,s.b) === undefined){
			this.springs.push(s);
		}
		return this;
	},
	
	clear: function(){
		this.particles = [];
		this.springs = [];
		return this;
	},
	
	constrainToBounds: function(){ //protected
		var p = undefined;
		var i = 0;
		for(i=0;i<this.particles.length;i++){
			p = this.particles[i];
			if(p.bounds !== undefined){
				p.constrain(p.bounds);
			}
		}
		if(this.worldBounds !== undefined){
			for(i=0;i<this.particles.length;i++){
				p = this.particles[i];
				p.constrain(this.worldBounds);
			}
		}
	},
	
	getCurrentBounds: function(){
		var min = new toxi.Vec2D(Number.MAX_VALUE, Number.MAX_VALUE);
		var max = new toxi.Vec2D(Number.MIN_VALUE, Number.MIN_VALUE);
		var i = 0;
		var p = undefined;
		for(i = 0;i<this.particles.length;i++){
			p = this.particles[i];
			min.minSelf(p);
			max.maxSelf(p);
		}
		return new toxi.Rect(min,max);
	},
	
	getDrag: function() {
		return 1 - this.drag;
	},
	
	getNumIterations: function(){
		return this.numIterations;
	},
	
	getSpring: function(a,b){
		var i = 0;
		for(i = 0;i<this.springs.length;i++){
			var s = this.springs[i];
			if((s.a === a && s.b === b) || (s.a === b && s.b === b)){
				return s;
			}
		}
		return undefined;
	},
	
	getTimeStep: function(){
		return this.timeStep;
	},
	
	getWorldBounds: function(){
		return this.worldBounds;
	},
	
	removeBehavior: function(c){
		return toxi.physics2d.removeItemFrom(c,this.behaviors);
	},
	
	removeParticle: function(p){
		return toxi.physics2d.removeItemFrom(p,this.particles);
	},
	
	removeSpring: function(s) {
		return toxi.physics2d.removeItemFrom(s,this.springs);
	},
	
	removeSpringElements: function(s){
		if(this.removeSpring(s) !== undefined){
			return (this.removeParticle(s.a) && this.removeParticle(s.b));
		}
		return false;
	},
	
	setDrag: function(drag){
		this.drag = 1 - drag;
	},
	
	setNumIterations: function(numIterations){
		this.numIterations = numIterations;
	},
	
	setTimeStep: function(timeStep){
		this.timeStep = timeStep;
		var i =0;
		for(i = 0;i<this.behaviors.length;i++){
			var b = this.behaviors[i];
			b.configure(timeStep);
		}
	},
	
	setWorldBounds: function(world){
		this.worldBounds = world;
		return this;
	},
	
	update: function(){
		this.updateParticles();
		this.updateSprings();
		this.constrainToBounds();
		return this;
	},
	
	updateParticles: function(){
		var i = 0;
		var j = 0;
		var b = undefined;
		var p = undefined;
		for(i = 0;i<this.behaviors.length;i++){
			b = this.behaviors[i];
			for(j = 0;j<this.particles.length;j++){
				p = this.particles[j];
				b.applyBehavior(p);
			}
		}
		for(j = 0;j<this.particles.length;j++){
			p = this.particles[j];
			p.scaleVelocity(this.drag);
			p.update();
		}
	},
	
	updateSprings: function(){
		var i = 0;
		var j = 0;
		for(i = this.numIterations; i > 0; i--){
			for(j = 0;j<this.springs.length;j++){
				var s = this.springs[j];
				s.update(i === 1);
			}
		}
	}

};