// uncompressed/toxi-physics2d-debug r43 - http://github.com/hapticdata/toxiclibsjs
toxi.physics2d = toxi.physics2d || {};

toxi.physics2d.removeItemFrom = function(item,array){
	var index = array.indexOf(item);
	if(index > -1){
		return array.splice(index,1);
	}
	return undefined;
};
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
toxi.physics2d.VerletSpring2D = function(a,b,len,str){
	this.a = a;
	this.b = b;
	this.restLength = len;
	this.strength = str;
};

toxi.physics2d.VerletSpring2D.EPS = 1e-6;

toxi.physics2d.VerletSpring2D.prototype = {
	getRestLength: function(){
		return this.restLength;
	},
	
	getStrength: function(){
		return this.strength;
	},
	
	lockA: function(s){
		this.isALocked = s;
		return this;
	},
	
	lockB: function(s){
		this.isALocked = s;
		return this;
	},
	
	setRestLength: function(len){
		this.restLength = len;
		this.restLengthSquared = len * len;
		return this;
	},
	
	setStrength: function(strength){
		this.strength = strength;
		return this;
	},
	
	update: function(applyConstraints){ //protected
		var delta = this.b.sub(this.a);
		//add minute offset to avoid div-by-zero errors
		var dist = delta.magnitude() + toxi.physics2d.VerletSpring2D.EPS;
		var normDistStrength = (dist - this.restLength) / (dist * (this.a.invWeight + this.b.invWeight)) * this.strength;
		if(!this.a.isLocked && !this.isALocked){
			this.a.addSelf(
				delta.scale(normDistStrength * this.a.invWeight)
			);
			if(applyConstraints){
				this.a.applyConstraints();
			}
		}
		if(!this.b.isLocked && !this.isBLocked){
			this.b.addSelf(
				delta.scale(-normDistStrength * this.b.invWeight)
			);
			if(applyConstraints){
				this.b.applyConstraints();
			}
		}
	}
};toxi.physics2d.AttractionBehavior = function(attractor,radius,strength,jitter){
	if(arguments.length < 3){
		throw { name: "IncorrectParameters", message: "Constructor received incorrect Parameters"};
	}
	this.jitter = jitter || 0;	
	this.attractor = attractor;
	this.strength = strength;
	this.setRadius(radius);
};

toxi.physics2d.AttractionBehavior.prototype = {
	applyBehavior: function(p){ //apply() is reserved, so this is now applyBehavior
		var delta = this.attractor.sub(p);
		var dist = delta.magSquared();
		if(dist < this.radiusSquared){
			var f = delta.normalizeTo((1.0 - dist / this.radiusSquared)).jitter(this.jitter).scaleSelf(this.attrStrength);
			p.addForce(f);
		}
	},
	
	configure: function(timeStep){
		this.timeStep = timeStep;
		this.setStrength(this.strength);
	},
	
	getAttractor: function(){
		return this.attractor;
	},
	
	getJitter: function(){
		return this.jitter;
	},
	
	getRadius: function(){
		return this.radius;
	},
	
	getStrength: function(){
		return this.strength;
	},
	
	setAttractor: function(attractor){
		this.attractor = attractor;
	},
	
	setJitter: function(jitter){
		this.jitter = jitter;
	},
	
	setRadius: function(r){
		this.radius = r;
		this.radiusSquared = r * r;
	},
	
	setStrength: function(strength){
		this.strength = strength;
		this.attrStrength = strength * this.timeStep;
	}
};
	
//expected to implement ParticleBehavior interface

toxi.physics2d.ConstantForceBehavior = function(force){
	this.force = force;
	this.scaleForce = new toxi.Vec2D();
	this.timeStep = 0;
};

toxi.physics2d.ConstantForceBehavior.prototype = {
	applyBehavior: function(p){ //apply() is reserved, so this is now applyBehavior
		p.addForce(this.scaledForce);
	},
	
	configure: function(timeStep){
		this.timeStep = timeStep;
		this.setForce(this.force);
	},
	
	getForce: function(){
		return this.force;
	},
	
	setForce: function(forceVec){
		this.force = forceVec;
		this.scaledForce = this.force.scale(this.timeStep);
	},
	
	toString: function(){
		return "behavior force: "+ this.force+ " scaledForce: "+this.scaledForce+ " timeStep: "+this.timeStep;
	}
};
toxi.physics2d.GravityBehavior = function(gravityVec){
	toxi.physics2d.ConstantForceBehavior.apply(this,[gravityVec]);
};

toxi.extend(toxi.physics2d.GravityBehavior,toxi.physics2d.ConstantForceBehavior);

toxi.physics2d.GravityBehavior.prototype.configure = function(timeStep){
	this.timeStep = timeStep;
    this.scaledForce = this.force.scale(timeStep * timeStep);
};//either Vec2D + angle
toxi.physics2d.AngularConstraint = function(theta_p,theta){

	if(arguments.length > 1){
		var p = theta_p;
		this.theta = theta;
		this.rootPos = new toxi.Vec2D(p);
	} else {
		this.rootPos = new toxi.Vec2D();
		this.theta = theta_p;
	}
	if(parseInt(this.theta,10) != this.theta){
		this.theta = toxi.MathUtils.radians(this.theta);
	}
};


toxi.physics2d.AngularConstraint.prototype.applyConstraint = function(p){
	var delta = p.sub(this.rootPos);
	var heading = toxi.MathUtils.floor(delta.heading() / this.theta) * this.theta;
	p.set(this.rootPos.add(toxi.Vec2D.fromTheta(heading).scaleSelf(delta.magnitude())));
};/**
 * Constrains a particle's movement by locking a given axis to a fixed value.
 */
toxi.physics2d.AxisConstraint = function(axis,constraintAmount){
	this.axis = axis;
	this.constraint = constraintAmount;
};

toxi.physics2d.AxisConstraint.prototype.applyConstraint = function(p){
	p.setComponent(this.axis,this.constraint);
};toxi.physics2d.CircularConstraint = function(a,b){
	if(arguments.length == 1){
		this.circle = a;
	} else {
		console.log("a: "+a);
		this.circle = new toxi.Circle(a,b);
	}
};

toxi.physics2d.CircularConstraint.prototype.applyConstraint = function(p){
	if(this.circle.containsPoint(p)){
		p.set(this.circle.add(p.sub(this.circle).normalizeTo(this.circle.getRadius())));
	}
};toxi.physics2d.MaxConstraint = function(axis,threshold){
	this.axis = axis;
	this.threshold = threshold;	
};

toxi.physics2d.MaxConstraint.prototype.applyConstraint = function(p){
	if(p.getComponent(this.axis) > this.threshold){
		p.setComponent(this.axis,this.threshold);
	}
};toxi.physics2d.MinConstraint = function(axis,threshold){
	this.axis = axis;
	this.threshold = threshold;
};

toxi.physics2d.MinConstraint.prototype.applyConstraint = function(p){
	if(p.getComponent(this.axis) < this.threshold){
		p.setComponent(this.axis, this.threshold);
	}
};toxi.physics2d.RectConstraint = function(a,b){
	if(arguments.length == 1){
		this.rect = a.copy();
	} else if(arguments.length > 1){
		this.rect = new toxi.Rect(a,b);
	}
	this.intersectRay = new toxi.Ray2D(this.rect.getCentroid(), new toxi.Vec2D());
};

toxi.physics2d.RectConstraint.prototype = {
	applyConstraint: function(p){
		if(this.rect.containsPoint(p)){
			p.set(this.rect.intersectsRay(this.intersectRay.setDirection(this.intersectRay.sub(p)),0,Number.MAX_VALUE));
		}
	},
	
	getBox: function(){
		return this.rect.copy();
	},
	
	setBox: function(rect){
		this.rect = rect.copy();
		this.intersectRay.set(this.rect.getCentroid());
	}	
};toxi.physics2d.ParticlePath2D = function(points){
	toxi.Spline2D.call(this,points);
	this.particles = [];
};
toxi.extend(toxi.physics2d.ParticlePath2D,toxi.Spline2D);

(function(){
	//protected
	var createSingleParticle = function(pos,mass){
		return new toxi.physics2d.VerletParticle2D(pos,mass);
	};
	
	//public
	toxi.physics2d.ParticlePath2D.prototype.createParticles = function(physics,subDiv,step,mass){
		this.particles = [];
		this.computeVertices(subDiv);
		var i = 0;
		var dv = this.getDecimatedVertices(step,true);
		for(i = 0; i < dv; i++){
			var p = this.createSingleParticle(v,mass);
			this.particles.push(p);
			physics.addParticle(p);
		}
		return this.particles;
	};


})();/**
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
  
toxi.physics2d.ParticleString2D = function(){
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
			p = new toxi.physics2d.VerletParticle2D(pos.copy(),mass);
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
toxi.physics2d.ParticleString2D.prototype = {
	clear: function(){
		for(var i = 0, len = this.links.length; i < len; i++){
			this.physics.removeSpringElements(s);
		}
		this.particles.clear();
		this.links.clear();
	},
	createSpring: function(a,b,len,strength){
		return new toxi.physics2d.VerletSpring2D(a,b,len,strength);
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
	
};/**
* Creates a pullback spring (default restlength=0.5) between 2 particles and
* locks the first one given at the current position. The spring is only
* enforced if the current length of the spring exceeds the rest length. This
* behaviour is the opposite to the {@link VerletMinDistanceSpring2D}.
*/
 
 toxi.physics2d.PullBackString2D = function(a,b,strength){
	toxi.physics2d.VerletSpring2D.apply(this,[a,b,0,strength]);
	a.lock();
	this.setRestLength(0.5);
 };
 toxi.extend(toxi.physics2d.PullBackString2D,toxi.physics2d.VerletSpring2D);

 toxi.physics2d.PullBackString2D.prototype.update = function(applyConstraints){
	if(this.b.distanceToSquared(this.a) > this.restLengthSquared){
		this.parent.update.call(this,applyConstraints);
	}
 };toxi.physics2d.VerletConstrainedSpring2D = function(particleA, particleB, len, str, limit){
	toxi.physics2d.VerletSpring2D.call(this,particleA,particleB,len,str);
	this.limit = (limit === undefined) ? Number.MAX_VALUE : limit;
};

toxi.extend(toxi.physics2d.VerletConstrainedSpring2D,toxi.physics2d.VerletSpring2D);


toxi.physics2d.VerletConstrainedSpring2D.update = function(applyConstraints){
	var delta = this.b.sub(this.a);
    // add minute offset to avoid div-by-zero errors
    var dist = delta.magnitude() + toxi.physics2d.VerletSpring2D.EPS;
    var normDistStrength = (dist - this.restLength) / (dist * (this.a.invWeight + this.b.invWeight))* this.strength;
    if (!this.a.isLocked && !this.isALocked) {
        this.a.addSelf(delta.scale(normDistStrength * this.a.invWeight).limit(this.limit));
        if (applyConstraints) {
            this.a.applyConstraints();
        }
    }
    if (!this.b.isLocked && !this.isBLocked) {
        this.b.subSelf(delta.scale(normDistStrength * this.b.invWeight).limit(this.limit));
        if (applyConstraints) {
            this.b.applyConstraints();
        }
    }
};toxi.physics2d.VerletMinDistanceSpring2D = function(particleA,particleB,len,str){
	toxi.physics2d.VerletSpring2D.call(this,particleA,particleB,len,str);
	this.setRestLength(len);
};


toxi.extend(toxi.physics2d.VerletMinDistanceSpring2D,toxi.physics2d.VerletSpring2D);

toxi.physics2d.VerletMinDistanceSpring2D.prototype.update = function(applyConstraints){
	if(this.b.distanceToSquared(this.a) < this.restLengthSquared){
		this.parent.update.call(this,applyConstraints);
	}
};toxi.physics2d.VerletPhysics2D = function(gravity, numIterations, drag, timeStep){
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
		if(gravity instanceof toxi.physics2d.GravityBehavior){
			this.addBehavior(gravity);
		} else if(gravity instanceof Object && gravity.hasOwnProperty('x') && gravity.hasOwnProperty('y')){
			this.addBehavior(
				new toxi.physics2d.GravityBehavior(
					new toxi.Vec2D(gravity)
				)
			);
		}
	}
};

toxi.physics2d.VerletPhysics2D.addConstraintToAll = function(c, list){
	for(var i=0;i<list.length;i++){
		list[i].addConstraint(c);
	}
};

toxi.physics2d.VerletPhysics2D.removeConstraintFromAll = function(c,list){
	for(var i=0;i<list.length;i++){
		list[i].removeConstraint(c);
	}
};

toxi.physics2d.VerletPhysics2D.prototype = {
	
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
		var min = new toxi.Vec2D(Number.MAX_VALUE, Number.MAX_VALUE);
		var max = new toxi.Vec2D(Number.MIN_VALUE, Number.MIN_VALUE);
		var i = 0,
			p;
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