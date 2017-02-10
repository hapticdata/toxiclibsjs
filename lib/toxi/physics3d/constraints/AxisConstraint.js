define(["require", "exports", "module"], function(require, exports, module) {


    /**
     * Constrains a particle's movement by locking a given axis to a fixed value.
     *
     * @param axis
     *            axis to lock
     * @param constraint
     *            constrain the axis to this value
     */
    var AxisConstraint = function (axis, constraint) {
        this.axis = axis;
        this.constraint = constraint;
    };

    AxisConstraint.prototype = {
        /*
         * (non-Javadoc)
         *
         * @see toxi.physics.IParticleConstraint#apply(toxi.physics.VerletParticle)
         */
        applyConstraint: function (p) {
            p.setComponent(this.axis, this.constraint);
        }

    };

    module.exports = AxisConstraint;
});
