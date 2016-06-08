define(["require", "exports", "module", "../internals","../geom/Vec3D"], function(require, exports, module) {

    var internals = require('../internals'),
        Vec3D = require('../geom/Vec3D'),
        VerletSpring3D = require('./VerletSpring3D');

    /**
     * Creates a pullback spring (default restlength=0.5) between 2 particles and
     * locks the first one given at the current position. The spring is only
     * enforced if the current length of the spring exceeds the rest length. This
     * behaviour is the opposite to the {@link VerletMinDistanceSpring3D}.
     */
    
    // This should be VerletPullBackSpring3D... but it is PullBackSpring3D in the Java implementation
    var PullBackSpring3D = function (a, b, len, str, limit) {
        VerletSpring3D.call(this, a, b, len, str);
        this.a.lock();
        this.setRestLength(0);
    };

    internals.extend(PullBackSpring3D, VerletSpring3D);

    PullBackSpring3D.prototype.update = function (applyConstraints) {
        if (this.b.distanceToSquared(this.b.a) > 0.5) {
            VerletSpring3D.prototype.call.update(this, applyConstraints);
        }
    };

    module.exports = PullBackSpring3D;

});