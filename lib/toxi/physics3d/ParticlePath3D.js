define(function(require, exports, module){

    var Vec3D = require('../geom/Vec3D'),
        extend = require('../internals/extend'),
        Spline3D = require('../geom/Spline3D'),
        VerletParticle3D = require('./VerletParticle3D');



    var ParticlePath3D = function(points){
        Spline3D.call(this, points);
    };


    extend(ParticlePath3D, Spline3D);

    /**
     * Creates particles along the spline at the fixed interval given. The
     * precision of this interval will largely depend on the number of
     * subdivision vertices created, but can be adjusted via the related
     * parameter.
     *
     * @param physics
     *            physics instance
     * @param subDiv
     *            number spline segment subdivisions
     * @param step
     *            desired rest length between particles
     * @param mass
     *            desired particle mass
     * @return list of particles
     */
    ParticlePath3D.prototype.createParticles = function(physics, subDiv, step, mass){
        this.particles = [];

        var strip = this.toLineStrip3D(subDiv).getDecimatedVertices(step, true);

        var v, p;
        for(var i=0; i<strip.vertices.length; i++){
            v = strip.vertices[i];
            p = this._createSingleParticle(v, mass);
            this.particles.push(p);
            physics.addParticle(p);
        }

        return this.particles;
    };


    /**
     * Extension point for creating a custom/sub-classed VerletParticle
     * instance.
     *
     * @param pos
     * @param mass
     * @return particle
     */
    ParticlePath3D.prototype._createSingleParticle = function(pos, mass){
        return new VerletParticle3D(pos, mass);
    };



    module.exports = ParticlePath3D;

});
