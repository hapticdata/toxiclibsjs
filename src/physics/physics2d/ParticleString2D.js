/**
 * Utility builder/grouping/management class to connect a set of particles into
 * a physical string/thread. Custom spring types can be used by subclassing this
 * class and overwriting the
 * {@link #createSpring(VerletParticle2D, VerletParticle2D, float, float)}
 * method.
 */
 
 toxi.physics2d.ParticleString2D = function(physics,plist_pos,strength_step,num,mass,strength){
 	this.physics = physics;
	this.links = [];
	
 	var prev = undefined,
		p = undefined,
		s = undefined,
		i = 0;
	
 	if(arguments.length === 3){
 		var strength = strength_step;
 		var plist = plist_pos;
 		this.particles = plist || [];

	 	
	 	for(i = 0; i < this.particles.length; i++){
	 		p = this.particles[i];
	 		this.physics.addParticle(p);
	 		if(prev !== undefined){
	 			s = this.createSpring(prev,p,prev.distanceTo(p),stregnth_step);
	 			this.links.push(s);
	 			this.physics.addSpring(s);	
	 		}
	 		prev = p;
	 	}

 	} else {
 		var pos = plist_pos.copy();
 		var step = strength_step;
 		var len = step.magnitude();
 		this.particles = [];
		
		for(i = 0; i < num; i++){
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
 	}
 };
 
 /**
     * Creates a number of particles along a line and connects them into a
     * string using springs.
     * 
     * @param physics
     *            physics engine
     * @param pos
     *            start position
     * @param step
     *            step direction & distance between successive particles
     * @param num
     *            number of particles
     * @param mass
     *            particle mass
     * @param strength
     *            spring strength
     */
     
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
	
};