define(["require", "exports", "module", "../../geom/Vec3D", "../VerletParticle3D", '../../internals'], function(require, exports, module) {

    var internals = require('../../internals'),
        VerletParticle3D = require('../VerletParticle3D'),
        Vec3D = require('../../geom/Vec3D');

    var ConstantForceBehavior3D = function (force) {
        this._force = force;
        this._scaledForce = new Vec3D();
        this._timeStep = 0;
    };

    ConstantForceBehavior3D.prototype = {

        apply: function (p) {
            p.addForce(this._scaledForce);
        },

        configure: function (timeStep) {
            console.log(this)
            this._timeStep = timeStep;
            this.setForce(this._force);
        },

        getForce: function () {
            return this._force;
        },

        setForce: function (force) {
            this._force = force;
            this._scaledForce = force.scale(this._timeStep);
        }

    };

    module.exports = ConstantForceBehavior3D;
});
