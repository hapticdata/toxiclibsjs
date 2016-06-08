define(function(require, exports, module) {

    var internals = require('../internals'),
        AABB = require('../geom/AABB'),
        Vec3D = require('../geom/Vec3D');
    var id = 0;

    /**
     * An individual 3D particle for use by the VerletPhysics and VerletSpring
     * classes. A particle has weight, can be locked in space and its position
     * constrained inside an (optional) axis-aligned bounding box.
     *
     * params {
     *     vector : Vec3D
     *     x: Number 
     *     y: Number
     *     z: Number
     *     weight: Number
     * }
     */
    var VerletParticle3D = function (params) {
        if (!params) { params = {}; }
        this._isLocked = false;
        this.bounds = null;
        this.constraints = [];
        this.behaviors = [];
        this._force = new Vec3D();
        this._weight = 0;
        this._invWeight = 0;
        this.setWeight( (typeof params.weight !== "undefined") ? params.weight : 1 );
        this.x = (typeof params.vector !== "undefined") ? params.vector.x : params.x || 0;
        this.y = (typeof params.vector !== "undefined") ? params.vector.y : params.y || 0;
        this.z = (typeof params.vector !== "undefined") ? params.vector.z : params.z || 0;
        this._prev = new Vec3D(this);
        this._temp  = new Vec3D();
    };

    internals.extend(VerletParticle3D,Vec3D);

    VerletParticle3D.prototype.addBehavior = function (behavior, timeStep) {
        timeStep = (typeof timeStep !== "undefined") ? timeStep : 1;
        behavior.configure(timeStep);
        behaviors.push(behavior);
        return this;
    },

    /**
     * Adds the given constraint implementation to the list of constraints
     * applied to this particle at each time step.
     * 
     * @param c
     *            constraint instance
     * @return itself
     */
    VerletParticle3D.prototype.addConstraint = function (c) {
        constraints.push(c);
        return this;
    };

    VerletParticle3D.prototype.addForce = function (f) {
        this._force.addSelf(f);
        return this;
    };

    VerletParticle3D.prototype.addVelocity = function (v) {
        this._prev.subSelf(v);
        return this;
    };

    VerletParticle3D.prototype.applyBehaviors = function () {
        internals.each(this.behaviors, function (b) {
            b.apply(this);
        }, this);
    };

    VerletParticle3D.prototype.applyConstraints = function () {
        internals.each(this.constraints, function (pc) {
            pc.apply(this);
        }, this);
    };

    VerletParticle3D.prototype._applyForce = function () {
        this._temp.set(this);
        this.addSelf(this.sub(this._prev).addSelf(this._force.scale(this._weight)));
        this._prev.set(this._temp);
        this._force.clear();
    };

    /**
     * Removes any currently applied constraints from this particle.
     * 
     * @return itself
     */
    VerletParticle3D.prototype.clearConstraints = function () {
       this.constraints = [];
       return this;
    };

    VerletParticle3D.prototype.clearForce = function () {
        this._force.clear();
        return this;
    };

    VerletParticle3D.prototype.clearVelocity = function () {
        this._prev.set(this);
        return this;
    };

    /**
     * @return the inverse weight (1/weight)
     */
    VerletParticle3D.prototype.getInvWeight = function () {
        return this._invWeight;
    };

    /**
     * Returns the particle's position at the most recent time step.
     * 
     * @return previous position
     */
    VerletParticle3D.prototype.getPreviousPosition = function () {
        return this._prev;
    };

    VerletParticle3D.prototype.getVelocity = function () {
        return this.sub(this._prev);
    };

    /**
     * @return the weight
     */
    VerletParticle3D.prototype.getWeight = function () {
         return this._weight;
    };

    /**
     * @return true, if particle is locked
     */
    VerletParticle3D.prototype.isLocked = function () {
        return this._isLocked;
    };

    /**
     * Locks/immobilizes particle in space
     * 
     * @return itself
     */
    VerletParticle3D.prototype.lock = function () {
        this._isLocked = true;
        return this;
    };

    VerletParticle3D.prototype.removeBehavior = function (b) {
        return internals.removeItemFromReturningSuccessful(b, this.behaviors);
    };

    /**
     * Attempts to remove the given constraint instance from the list of active
     * constraints.
     * 
     * @param c
     *            constraint to remove
     * @return true, if successfully removed
     */
    VerletParticle3D.prototype.removeConstraint = function (c) {
        return internals.removeItemFromReturningSuccessful(c, this.constraints);
    };

    VerletParticle3D.prototype.scaleVelocity = function (scaleNumber) {
        this._prev.interpolateToSelf(this, 1 - scaleNumber);
        return this;
    };

    VerletParticle3D.prototype.setPreviousPosition = function (p) {
        this._prev.set(p);
        return this;
    };

    VerletParticle3D.prototype.setWeight = function (w) {
        this._weight = w;
        this._invWeight = 1 / w;
    };

    /**
     * Unlocks particle again
     * 
     * @return itself
     */
    VerletParticle3D.prototype.unlock = function () {
        this.clearVelocity();
        this._isLocked = false;
        return this;
    };

    VerletParticle3D.prototype.update = function () {
        if (!this._isLocked) {
            this.applyBehaviors();
            this._applyForce();
            this.applyConstraints();
        }
    };

    module.exports = VerletParticle3D;
});