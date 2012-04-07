define(["require", "exports", "module", "../internals","./behaviors/GravityBehavior","../geom/Rect","../geom/Vec2D"], function(require, exports, module) {

var internals = require('../internals'),
	GravityBehavior = require('./behaviors/GravityBehavior'),
	Rect = require('../geom/Rect'),
	Vec2D = require('../geom/Vec2D');

var	VerletPhysics2D = function(gravity, numIterations, drag, timeStep){
	var opts = {
			numIterations: 50,
			drag: 0,
			timeStep: 1
		},
		args;
	if(arguments.length == 1 && (arguments[0].gravity || arguments[0].numIterations || arguments[0].timeStep || arguments[0].drag)){ //options object literal
		args = arguments[0];
		if(args.gravity !== undefined){
			gravity = args.gravity;
		}
		if(args.numIterations !== undefined){
			opts.numIterations = args.gravity;
		}
		if(args.drag !== undefined){
			opts.drag = args.drag;
		}
		if(args.timeStep !== undefined){
			opts.timeStep = args.timeStep;
		}
	}
	this.behaviors = [];
	this.particles = [];
	this.springs = [];
	this.numIterations = opts.numIterations;
	this.timeStep = opts.timeStep;
	this.setDrag(opts.drag);
	
	if(gravity){
		if( internals.tests.isParticleBehavior( gravity ) ){
			this.addBehavior(gravity);
		} else if( internals.tests.hasXY( gravity ) ){
			this.addBehavior(
				new GravityBehavior(
					new Vec2D(gravity)
				)
			);
		}
	}
};

VerletPhysics2D.addConstraintToAll = function(c, list){
	for(var i=0;i<list.length;i++){
		list[i].addConstraint(c);
	}
};

VerletPhysics2D.removeConstraintFromAll = function(c,list){
	for(var i=0;i<list.length;i++){
		list[i].removeConstraint(c);
	}
};

VerletPhysics2D.prototype = {
	
	addBehavior: function(behavior){
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
		var p,
			i = 0;
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
		var min = new Vec2D(Number.MAX_VALUE, Number.MAX_VALUE);
		var max = new Vec2D(Number.MIN_VALUE, Number.MIN_VALUE);
		var i = 0,
			p;
		for(i = 0;i<this.particles.length;i++){
			p = this.particles[i];
			min.minSelf(p);
			max.maxSelf(p);
		}
		return new Rect(min,max);
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
		return internals.removeItemFrom(c,this.behaviors);
	},
	
	removeParticle: function(p){
		return internals.removeItemFrom(p,this.particles);
	},
	
	removeSpring: function(s) {
		return internals.removeItemFrom(s,this.springs);
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
		var i = 0,
			j = 0,
			b,
			p;
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
		var i = 0,
			j = 0;
		for(i = this.numIterations; i > 0; i--){
			for(j = 0;j<this.springs.length;j++){
				var s = this.springs[j];
				s.update(i === 1);
			}
		}
	}
};

module.exports = VerletPhysics2D;
});
