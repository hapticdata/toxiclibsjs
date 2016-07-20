define(["require", "exports", "module", "../internals","../geom/Vec3D"], function(require, exports, module) {

    var internals = require('../internals'),
        Vec3D = require('../geom/Vec3D'),
        VerletSpring3D = require('./VerletSpring3D');

    /**
	 * Implements a spring whose maximum relaxation distance at every time step can
	 * be limited to achieve better (if physically incorrect) stability of the whole
	 * spring system.
	 *
	 * Limit limits the velocity of the string.
	 */
	var VerletConstrainedSpring3D = function (a, b, len, str, limit) {
		VerletSpring3D.call(this, a, b, len, str);
	    /**
	     * Maximum relaxation distance for either end of the spring in world units
	     */
		this.limit = (typeof limit !== "undefined") ? limit : Number.MAX_VALUE;
	};

	internals.extend(VerletConstrainedSpring3D, VerletSpring3D);

	VerletConstrainedSpring3D.prototype.update = function (applyConstraints) {
        var delta = this.b.sub(this.a);
        // add minute offset to avoid div-by-zero errors
        var dist = delta.magnitude() + VerletSpring3D.EPS;

        var normDistStrength = (dist - this._restLength) / (dist * (this.a.getInvWeight() + this.b.getInvWeight())) * this._strength;

        if (!this.a.isLocked() && !this._isALocked) {
            this.a.addSelf( delta.scale( normDistStrength * this.a.getInvWeight() ).limit(this.limit) );
            if (applyConstraints) {
                this.a.applyConstraints();
            }
        }
        if (!this.b.isLocked() && !this._isBLocked) {
            this.b.addSelf( delta.scale( normDistStrength * this.b.getInvWeight() ).limit(this.limit) );
            if (applyConstraints) {
                this.b.applyConstraints();
            }
        }
    };

	module.exports = VerletConstrainedSpring3D;

});