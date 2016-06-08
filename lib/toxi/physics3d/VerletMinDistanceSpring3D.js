define(["require", "exports", "module", "../internals","../geom/Vec3D"], function(require, exports, module) {

    var internals = require('../internals'),
        Vec3D = require('../geom/Vec3D'),
        VerletSpring3D = require('./VerletSpring3D');

    /**
     * Implements a string which will only enforce its rest length if the current
     * distance is less than its rest length. This is handy if you just want to
     * ensure objects are at least a certain distance from each other, but don't
     * care if it's bigger than the enforced minimum.
     */
	var VerletMinDistanceSpring3D = function (a, b, len, str, limit) {
		VerletSpring3D.call(this, a, b, len, str);
	};

	internals.extend(VerletMinDistanceSpring3D, VerletSpring3D);

	VerletMinDistanceSpring3D.prototype.update = function (applyConstraints) {
        if (this.b.distanceToSquared(this.a) < this._restLength) {
            VerletSpring3D.prototype.call.update(this, applyConstraints);
        }
    };

	module.exports = VerletMinDistanceSpring3D;

});