define(["require", "exports", "module", "../../geom/Vec3D", "../VerletParticle3D", '../../internals', './ConstantForceBehavior3D'], function(require, exports, module) {

    var internals = require('../../internals'),
        VerletParticle3D = require('../VerletParticle3D'),
        ConstantForceBehavior3D = require('./ConstantForceBehavior3D'),
        Vec3D = require('../../geom/Vec3D');

    var GravityBehavior3D = function (gravity, timeStep) {
        ConstantForceBehavior3D.call(this, gravity);
        if (typeof timeStep !== "undefined") {
            this.configure(timeStep);
        }
    };

    internals.extend(GravityBehavior3D, ConstantForceBehavior3D);

    GravityBehavior3D.prototype.setForce = function (force) {
        this._force = force;
        this._scaledForce = force.scale(this._timeStep * this._timeStep);
    };

    module.exports = GravityBehavior3D;
});