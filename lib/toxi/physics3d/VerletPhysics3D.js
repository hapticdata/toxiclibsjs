define(function(require, exports, module) {

    var internals = require('../internals'),
        GravityBehavior3D = require('./behaviors/GravityBehavior3D'),
        AABB = require('../geom/AABB'),
        Vec3D = require('../geom/Vec3D');
    var id = 0;

    /**
     * Initializes an Verlet engine instance with the passed in configuration.
     *
     * @param gravity
     *            optional/undefined/null 3D gravity vector
     * @param numIterations
     *            optional iterations per time step for verlet solver
     * @param drag
     *            optional drag value 0...1
     * @param timeStep
     *            optional time step for calculating forces
     */
    var VerletPhysics3D = function (gravity, numIterations, drag, timeStep) {

        if(arguments.length === 1 && !internals.has.XYZ(gravity)){
            //it must be an options object
            numIterations = gravity.numIterations;
            drag = gravity.drag;
            timeStep = gravity.timeStep;
            gravity = gravity.gravity;
        }

        /**
         * List of particles (Vec3D subclassed)
         */
        this.particles = [];
        /**
         * List of spring/sticks connectors
         */
        this.springs = [];
        /**
         * Default time step = 1.0
         */
        this._timeStep =  (typeof timeStep !== 'undefined') ? timeStep : 1;
        /**
         * Default iterations for verlet solver = 50
         */
        this.numIterations = (typeof numIterations !== 'undefined') ? numIterations : 50;
        /**
         * Optional 3D bounding box to constrain particles too
         */
        this.behaviors = [];
        this.constraints = [];
        this._worldBounds = null;
        this._drag = null;
        this.setDrag( (typeof drag !== 'undefined') ? drag : 1 );
        if (gravity !== null && typeof gravity !== 'undefined') {
            this.addBehavior(new GravityBehavior3D(gravity));
        }
    };

    VerletPhysics3D.addConstraintToAll = function (c, list) {
        for(var i=0;i<list.length;i++){
            list[i].addConstraint(c);
        }
    };

    VerletPhysics3D.removeConstraintFromAll = function(c, list){
        for(var i=0;i<list.length;i++){
            list[i].removeConstraint(c);
        }
    };

    VerletPhysics3D.prototype = {

        addBehavior: function (behavior) {
            behavior.configure(this._timeStep);
            this.behaviors.push(behavior);
        },

        addConstraint: function (constraint) {
            this.constraints.push(constraint);
        },

        /**
         * Adds a particle to the list
         *
         * @param p
         * @return itself
         */
        addParticle: function (p) {
            this.particles.push(p);
            return this;
        },

        /**
         * Adds a spring connector
         *
         * @param s
         * @return itself
         */
        addSpring: function (s) {
            if(!this.getSpring(s.a,s.b)){
                this.springs.push(s);
            }
            return this;
        },

        /**
         * Applies all global constraints and constrains all particle positions to
         * the world bounding box set
         */
        _applyConstraints: function () {
            for(var i=0; i<this.particles.length; i++){
                var p = this.particles[i];

                for(var j=0; j<this.constraints.length; j++){
                    var c = this.constraints[j];

                    c.applyConstraint(p);
                }

                if (p.bounds) {
                    p.constrain(p.bounds);
                }

                if (this._worldBounds){
                    p.constrain(this._worldBounds);
                }
            }
        },

        clear: function () {
            this.behaviors = [];
            this.constraints = [];
            this.particles = [];
            this.springs = [];
            return this;
        },

        // ? VerletPhysics2D has protected `constrainToBounds`? no mention to method in Java

        getCurrentBounds: function () {
            var min = new Vec3D(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE);
            var max = new Vec3D(Number.MIN_VALUE,Number.MIN_VALUE,Number.MIN_VALUE);

            for(var i=0; i<this.particles.length; i++){
                var p = this.particles[i];
                min.minSelf(p);
                max.maxSelf(p);
            }

            return AABB.fromMinMax(min, max);
        },

        getDrag: function () {
            return 1 - this._drag;
        },

        /**
         * @return the numIterations
         */
        getNumIterations: function () {
            return this.numIterations;
        },

        /**
         * Attempts to find the spring element between the 2 particles supplied
         *
         * @param a
         *            particle 1
         * @param b
         *            particle 2
         * @return spring instance, or undefined if not found
         */
        getSpring: function (a, b) {
            var s;
            for(var i=0; i<this.springs.length; i++){
              s = this.springs[i];
              if((s.a === a && s.b === b) || (s.a === b && s.b === a)){
                  return s;
              }
            }
            return undefined;
        },

        /**
         * @return the timeStep
         */
        getTimeStep: function () {
             return this._timeStep;
        },

        /**
         * @return the worldBounds
         */
        getWorldBounds: function () {
            return this._worldBounds;
        },

        removeBehavior: function (b) {
            return internals.removeItemFromReturningSuccessful(b, this.behaviors);
        },

        removeConstraint: function (c) {
            return internals.removeItemFromReturningSuccessful(c, this.constraints);
        },

        /**
         * Removes a particle from the simulation.
         *
         * @param p
         *            particle to remove
         * @return true, if removed successfully
         */
        removeParticle: function (p) {
            return internals.removeItemFromReturningSuccessful(p, this.particles);
        },

        /**
         * Removes a spring connector from the simulation instance.
         *
         * @param s
         *            spring to remove
         * @return true, if the spring has been removed
         */
        removeSpring: function (s) {
            return internals.removeItemFromReturningSuccessful(s, this.springs);
        },

        /**
         * Removes a spring connector and its both end point particles from the
         * simulation
         *
         * @param s
         *            spring to remove
         * @return true, only if spring AND particles have been removed successfully
         */
        removeSpringElements: function (s) {
            if (this.removeSpring(s)) {
                return (this.removeParticle(s.a) && this.removeParticle(s.b));
            }
            return false;
        },

        setDrag: function (drag) {
            this._drag = 1 - drag;
        },

        /**
         * @param numIterations
         *            the numIterations to set
         */
        setNumIterations: function (numIterations) {
             this.numIterations = numIterations;
        },

        /**
         * @param timeStep
         *            the timeStep to set
         */
        setTimeStep: function (timeStep) {
            this._timeStep = timeStep;
            internals.each(this.behaviors, function (b) {
                b.configure(timeStep);
            }, this);
        },

        /**
         * Sets bounding box
         *
         * @param world
         * @return itself
         */
        setWorldBounds: function (world) {
            this._worldBounds = world;
            return this;
        },

        /**
         * Progresses the physics simulation by 1 time step and updates all forces
         * and particle positions accordingly
         *
         * @return itself
         */
        update: function () {
            this._updateParticles();
            this._updateSprings();
            this._applyConstraints();
            return this;
        },

        /**
         * Updates all particle positions
         */
        _updateParticles: function () { //protected
            var i, j, b, p;

            for(i=0; i<this.behaviors.length; i++){
                b = this.behaviors[i];
                for(j=0; j<this.particles.length; j++){
                    p = this.particles[j];
                    b.applyBehavior(p);
                }
            }

            for(j=0; j<this.particles.length; j++){
                p = this.particles[j];
                p.scaleVelocity(this._drag);
                p.update();
            }
        },

        /**
         * Updates all spring connections based on new particle positions
         */
        _updateSprings: function () { //protected
            if (this.springs.length > 0) {
                for (var i = this.numIterations; i > 0; i--) {
                    for(var j=0; j<this.springs.length; j++){
                        var s = this.springs[j];
                        s.update(i == 1);
                    }
                }
            }
        }
    };


    module.exports = VerletPhysics3D;
});
