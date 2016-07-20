define(["require", "exports", "module", "../../geom/Vec3D", "../VerletParticle3D", '../../internals'], function(require, exports, module) {

    var internals = require('../../internals'),
        VerletParticle3D = require('../VerletParticle3D'),
        Vec3D = require('../../geom/Vec3D');

    // arguments
    //     attractor <Vec3D>
    //     radius <Number>
    //     strength <Number>
    //     jittler <Number> optional
    var AttractionBehavior3D = function (attractor, radius, strength, jitter) {
        this._attractor = attractor;
        this._attrStrength = 0;
        this._radius = strength;
        this._radiusSquared = 0;
        this._strength = strength;
        this._jitter = jitter || 0;
        this._timeStep = 0;
    };


    AttractionBehavior3D.prototype = {

        apply: function (p) {
            var delta = attractor.sub(p);
            var dist = delta.magSquared();
            if (dist < this._radiusSquared) {
                var f = delta.normalizeTo((1 - dist / this._radiusSquared))
                    .jitter(this._jitter).scaleSelf(this._attrStrength);
                p.addForce(f);
            }
        },

        configure: function (timeStep) {
            this._timeStep = timeStep;
            this.setStrength(this._strength);
        },

        getAttractor: function () {
            return this._attractor;
        },

        getJitter: function () {
            return this._jitter;
        },

        getRadius: function () {
            return this._radius;
        },

        getStrength: function () {
            return this._strength;
        },

        setAttractor: function (attractor) {
            this._attractor = attractor;
        },

        setJitter: function (jitter) {
            this._jitter = jitter;
        },

        setRadius: function (r) {
            this._radius = r;
            this._radiusSquared = r * r;
        },

        setStrength: function (strength) {
            this._strength = strength;
            this._attrStrength = strength * this._timeStep;
        }

    };

    module.exports = AttractionBehavior3D;
});