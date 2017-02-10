define(function(require, exports, module){

    var Vec3D = require('../geom/Vec3D'),
        VerletSpring3D = require('./VerletSpring3D');


    function constructor1(physics, plist, strength){
        this.physics = physics;
        this.particles = plist.slice(0);
        this.links = [];

        var prev, p, s;
        for(var i=0; i<this.particles.length; i++){
            p = this.particles[i];
            physics.addParticle(p);
            if(prev){
                s = this._createSpring(prev, p, prev.distanceTo(p), strength);
                this.links.push(s);
                physics.addSpring(s);
            }
            prev = p
        }
    }

    function constructor2(physics, pos, step, num, mass, strength){
        this.physics = physics;
        this.particles = [];
        this.links = [];

        var len = step.magnitude();
        pos = pos.copy();

        var prev, p, s;

        for(var i=0; i < num; i++){
            p = new VerletParticle3D(pos.copy(), mass);
            this.particles.push(p);
            physics.addParticle(p);

            if(prev){
                s = this._createSpring(prev, p, len, strength);
                this.links.push(s);
                physics.addSpring(s);
            }

            prev = p;
            pos.addSelf(step);
        }
    }


    var ParticleString3D = function(physics, plist, strength){
        var cnstr;
        if(arguments.length === 3){
            //(VerletPhysics3D physics, List<VerletParticle3D> plist, float strength)
            cnstr = constructor1;
        } else if(arguments.length === 6 ){
            //(VerletPhysics3D physics, Vec3D pos, Vec3D step, int num, float mass, float strength)
            cnstr = constructor2;
        } else {
            throw new Error('Invalid arguments');
        }

        cnstr.apply(this, arguments);
    };


    /**
     * Removes the entire string from the physics simulation, incl. all of its
     * particles & springs.
     */
    ParticleString3D.prototype.clear = function(){
        for(var i=0; i<this.links.length; i++){
            this.physics.removeSpringElements(this.links[i]);
        }
        this.particles = [];
        this.links = [];
    };


    /**
     * Creates a spring instance connecting 2 successive particles of the
     * string. Overwrite this method to create a string custom spring types
     * (subclassed from {@link VerletSpring3D}).
     *
     * @param a
     *            1st particle
     * @param b
     *            2nd particle
     * @param len
     *            rest length
     * @param strength
     * @return spring
     */
    ParticleString3D.prototype._createSpring = function(a, b, len, strength){
        return new VerletSpring3D(a, b, len, strength);
    };

    /**
     * Returns the first particle of the string.
     *
     * @return first particle
     */
    ParticleString3D.prototype.getHead = function(){
        return this.particles[0];
    };

    /**
     * Returns number of particles of the string.
     *
     * @return particle count
     */
    ParticleString3D.prototype.getNumParticles = function(){
        return this.particles.length;
    };

    /**
     * Returns last particle of the string.
     *
     * @return last particle
     */
    ParticleString3D.prototype.getTail = function(){
        return this.particles[this.particles.length-1];
    };


    module.exports = ParticleString3D;
});
