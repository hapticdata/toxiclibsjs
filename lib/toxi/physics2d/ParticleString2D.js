define(["require", "exports", "module", "./VerletParticle2D","./VerletSpring2D"], function(require, exports, module) {

var VerletParticle2D = require('./VerletParticle2D'),
	VerletSpring2D = require('./VerletSpring2D');

/**
* Utility builder/grouping/management class to connect a set of particles into
* a physical string/thread. Custom spring types can be used by subclassing this
* class and overwriting the
* {@link #createSpring(VerletParticle2D, VerletParticle2D, float, float)}
method.
*/

 /**
  Construct a ParticleString2D,
  parameter options:
  1 - options object
  3 - VerletPhysics2D physics, Array<VerletParticle2D> plist, Number strength
  6 - VerletPhysics2D physic, Vec2D pos, Vec2D step, Number num, Number mass, Number strength
  */
  
var	ParticleString2D = function(){
	var opts = {
		physics: undefined,
		plist: undefined,
		pos: undefined,
		step: undefined,
		num: undefined,
		mass: undefined,
		strength: undefined
	},
	is6ParamConstructor = false;
	if(arguments.length === 0){
		throw new Error("Incorrect Parameters");
	} else if(arguments.length == 1){ //options object
		var arg = arguments[0];
		for(var prop in arg){
			opts[prop] = arg[prop];
		}
	} else {
		opts.physics = arguments[0];
		if(arguments.length == 6){
			opts.pos = arguments[1];
			opts.step = arguments[2];
			opts.num = arguments[3];
			opts.mass = arguments[4];
			opts.strength = arguments[5];
		} else {
			opts.plist = arguments[1];
			opts.strength = arguments[2];
		}
	}
	if(opts.num !== undefined && opts.pos !== undefined && opts.step !== undefined && opts.mass !== undefined){
		is6ParamConstructor = true;
	}
	if(!is6ParamConstructor && opts.plist === undefined){
		throw new Error("Incorrect Parameters, please supply plist or num, pos, step & mass");
	}
	
	
	this.physics = opts.physics;
	this.links = [];
	
	var prev,
		p,
		s,
		strength,
		i = 0;
	
	
	if(is6ParamConstructor){
		var pos = opts.pos.copy(),
			step = opts.step,
			mass = opts.mass,
			len = step.magnitude();
		this.particles = [];
		strength = opts.strength;
		
		for(i = 0; i < opts.num; i++){
			p = new VerletParticle2D(pos.copy(),mass);
			this.particles.push(p);
			this.physics.particles.push(p);
			if(prev !== undefined){
				s = this.createSpring(prev,p,len,strength);
				this.links.push(s);
				this.physics.addSpring(s);
			}
			prev = p;
			pos.addSelf(step);
		}
	} else {
		strength = opts.strength;
		this.particles = opts.plist || [];

		
		for(i = 0; i < this.particles.length; i++){
			p = this.particles[i];
			this.physics.addParticle(p);
			if(prev !== undefined){
				s = this.createSpring(prev,p,prev.distanceTo(p),strength);
				this.links.push(s);
				this.physics.addSpring(s);	
			}
			prev = p;
		}
	}
 }; 
ParticleString2D.prototype = {
	clear: function(){
		for(var i = 0, len = this.links.length; i < len; i++){
			this.physics.removeSpringElements(this.links[i]);
		}
		this.particles = [];
		this.links = [];
	},
	createSpring: function(a,b,len,strength){
		return new VerletSpring2D(a,b,len,strength);
	},
	
	getHead: function(){
		return this.particles[0];
	},
	
	getNumParticles: function(){
		return this.particles.length;
	},
	
	getTail: function(){
		return this.particles[this.particles.length-1];
	}
};

module.exports = ParticleString2D;
});
