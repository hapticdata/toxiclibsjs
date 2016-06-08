define(["require", "exports", "module", "../internals","../geom/Vec3D"], function(require, exports, module) {

    var internals = require('../internals'),
        Vec3D = require('../geom/Vec3D');

    /**
     * @param a
     *            1st particle
     * @param b
     *            2nd particle
     * @param len
     *            desired rest length
     * @param str
     *            spring strength
     */
    var VerletSpring3D = function (a, b, len, str) {
        /**
         * Spring end points / particles
         */
        this.a = a;
        this.b = b;
        /**
         * Spring rest length to which it always wants to return too
         */
        this._restLength = len;
        /**
         * Spring strength, possible value range depends on engine configuration
         * (time step, drag)
         */
        this._restLengthSquared = len * len;
        this._strength = str;
        /**
         * Flag, if either particle is locked in space (only within the scope of
         * this spring)
         */
        this._isALocked = false;
        this._isBLocked = false;
    };

    VerletSpring3D.EPS = 1e-6;

    VerletSpring3D.prototype = {

        getRestLength: function () {
            return this._restLength;
        },

        getStrength: function () {
            return this._strength;
        },

        /**
         * (Un)Locks the 1st end point of the spring. <b>NOTE: this acts purely
         * within the scope of this spring instance and does NOT call
         * {@link VerletParticle3D#lock()}</b>
         * 
         * @param s
         * @return itself
         */
        lockA: function (s) {
            this._isALocked = s;
            return this;
        },

        /**
         * (Un)Locks the 2nd end point of the spring
         * 
         * @param s
         * @return itself
         */
        lockB: function (s) {
            this._isBLocked = s;
            return this;
        },

        setRestLength: function (len) {
            this._restLength = len;
            this._restLengthSquared = len * len;
            return this;
        },

        setStrength: function (strength) {
            this._strength = strength;
            return this;
        },

        update: function (applyConstraints) {
            var delta = this.b.sub(this.a);
            // add minute offset to avoid div-by-zero errors
            var dist = delta.magnitude() + VerletSpring3D.EPS;

            var normDistStrength = (dist - this._restLength) / (dist * (this.a.getInvWeight() + this.b.getInvWeight())) * this._strength;

            if (!this.a.isLocked() && !this._isALocked) {
                this.a.addSelf(delta.scale(normDistStrength * this.a.getInvWeight()));
                if (applyConstraints) {
                    this.a.applyConstraints();
                }
            }
            if (!this.b.isLocked() && !this._isBLocked) {
                this.b.addSelf(delta.scale(normDistStrength * this.b.getInvWeight()));
                if (applyConstraints) {
                    this.b.applyConstraints();
                }
            }
        }

    };

    module.exports = VerletSpring3D;

});