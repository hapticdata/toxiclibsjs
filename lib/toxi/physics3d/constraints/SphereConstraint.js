define(function(require, exports, module){

    var Sphere = require('../../geom/Sphere');

    /**
     * This class implements a spherical constraint for 3D
     * {@linkplain VerletParticle3D}s. The constraint can be configured in two ways: A
     * bounding sphere not allowing particles to escape or alternatively does not
     * allow particles to enter the space occupied by the sphere.
     */


    /**
     * Creates a new instance using the sphere definition and constraint mode
     * given.
     *
     * @param {Sphere} sphere
     *            sphere instance
     * @param {boolean} isBoundary
     *            constraint mode. Use {@linkplain #INSIDE} or
     *            {@linkplain #OUTSIDE} to specify constraint behaviour.
     * @constructor
     */
    var SphereConstraint = function(sphere, isBoundary){
        if(arguments.length === 3){
            //received new SphereConstraint(Vec3D origin, float radius, boolean isBoundary)
            sphere = new Sphere(arguments[0], arguments[1]);
            isBoundary = arguments[2];
        }

        this.sphere = sphere;
        this.isBoundingSphere = isBoundary;
    };


    SphereConstraint.prototype.applyConstraint = function(p){
        var isInside = this.sphere.containsPoint(p);
        if((this.isBoundingSphere && !isInside) || (!this.isBoundingSphere && isInside)){
            p.set(
                this.sphere.add(p.subSelf(this.sphere).normalizeTo(this.sphere.radius))
            );
        }
    };

    module.exports = SphereConstraint;

});
