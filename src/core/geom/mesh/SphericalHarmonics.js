/**
 * Spherical harmonics surface evaluator based on code by Paul Bourke:
 * http://local.wasp.uwa.edu.au/~pbourke/geometry/sphericalh/
 */
toxi.SphericalHarmonics = function(m) {
    this.m = m;
};

toxi.SphericalHarmonics.prototype = {

    // toxiclibs - FIXME check where flipped vertex order is coming from sometimes
    computeVertexFor: function(p,phi,theta) {
        var r = 0;
        r += Math.pow(toxi.MathUtils.sin(this.m[0] * theta), this.m[1]);
        r += Math.pow(toxi.MathUtils.cos(this.m[2] * theta), this.m[3]);
        r += Math.pow(toxi.MathUtils.sin(this.m[4] * phi), this.m[5]);
        r += Math.pow(toxi.MathUtils.cos(this.m[6] * phi), this.m[7]);

		var sinTheta = toxi.MathUtils.sin(theta);
        p.x = r * sinTheta * toxi.MathUtils.cos(phi);
        p.y = r * toxi.MathUtils.cos(theta);
        p.z = r * sinTheta * toxi.MathUtils.sin(phi);
        return p;
    },

    getPhiRange: function() {
        return toxi.MathUtils.TWO_PI;
    },

    getPhiResolutionLimit: function(res) {
        return res;
    },

    getThetaRange: function() {
        return toxi.MathUtils.PI;
    },

	getThetaResolutionLimit: function(res) {
        return res;
    }
};