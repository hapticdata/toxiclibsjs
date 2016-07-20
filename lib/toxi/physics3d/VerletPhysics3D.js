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
    var VerletPhysics3D = function (gravity, numIterations, drag,
            timeStep) {

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
        this._numIterations = (typeof numIterations !== 'undefined') ? numIterations : 50;
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
            this.constraints.add(constraint);
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
            if(typeof this.getSpring(s.a,s.b) === 'undefined'){
                this.springs.push(s);
            }
            return this;
        },

        /**
         * Applies all global constraints and constrains all particle positions to
         * the world bounding box set
         */
        applyConstaints: function () {
            internals.each(this.particles, function (p) {
                internals.each(this.constraints, function (c) {
                    c.apply(p);
                }, this);
                if (typeof p.bounds !== 'undefined' && p.bounds !== null) {
                    p.constrain(p.bounds);
                }
                if (this._worldBounds !== 'undefined' && this._worldBounds !== null) {
                    p.constrain(this._worldBounds);
                }
            }, this);
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
            internals.each(this.particles,function () {
                min.minSelf(p);
                max.maxSelf(p);
            },this);
            return AABB.fromMinMax(min, max);
        },

        getDrag: function () {
            return 1 - this._drag;
        },

        /**
         * @return the numIterations
         */
        getNumIterations: function () {
            return this._numIterations;
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
        getSpring: function () {
            return internals.find(this.springs, function (s) {
               if ((s.a == this.a && s.b == this.b) || (s.a == this.b && s.b == this.a)) {
                    return s;
                }
            }, this);
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
             this._numIterations = numIterations;
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
            this.applyConstaints();
            return this;
        },

        /**
         * Updates all particle positions
         */
        _updateParticles: function () { //protected
            internals.each(this.behaviors, function (b) {
                internals.each(this.particles, function (p) {
                    b.apply(p);
                }, this);
            }, this);
            internals.each(this.particles, function (p) {
                p.scaleVelocity(this._drag);
                p.update();
            }, this);
        },

        /**
         * Updates all spring connections based on new particle positions
         */
        _updateSprings: function () { //protected
            if (this.springs.length > 0) {
                for (var i = this._numIterations; i > 0; i--) {
                    internals.each(this.springs, function (s) {
                        s.update(i == 1);
                    }, this);
                }
            }
        }
    };


    module.exports = VerletPhysics3D;
});
