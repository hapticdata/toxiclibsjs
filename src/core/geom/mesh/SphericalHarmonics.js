/**
 * Spherical harmonics surface evaluator based on code by Paul Bourke:
 * http://local.wasp.uwa.edu.au/~pbourke/geometry/sphericalh/
 */
function SphericalHarmonics(m) {
    this.m = m;
}

SphericalHarmonics.prototype = {

    // FIXME check where flipped vertex order is coming from sometimes
    computeVertexFor: function(p,phi,theta) {
        var r = 0;
        r += Math.pow(MathUtils.sin(this.m[0] * theta), this.m[1]);
        r += Math.pow(MathUtils.cos(this.m[2] * theta), this.m[3]);
        r += Math.pow(MathUtils.sin(this.m[4] * phi), this.m[5]);
        r += Math.pow(MathUtils.cos(this.m[6] * phi), this.m[7]);

		var sinTheta = MathUtils.sin(theta);
        p.x = r * sinTheta * MathUtils.cos(phi);
        p.y = r * MathUtils.cos(theta);
        p.z = r * sinTheta * MathUtils.sin(phi);
        return p;
    },

    getPhiRange: function() {
        return MathUtils.TWO_PI;
    },

    getPhiResolutionLimit: function(res) {
        return res;
    },

    getThetaRange: function() {
        return MathUtils.PI;
    },

	getThetaResolutionLimit: function(res) {
        return res;
    }
};