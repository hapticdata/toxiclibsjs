define(["require", "exports", "module", "../../math/mathUtils"], function(require, exports, module) {

var mathUtils = require('../../math/mathUtils');

/**
 * @class Spherical harmonics surface evaluator based on code by Paul Bourke:
 * http://local.wasp.uwa.edu.au/~pbourke/geometry/sphericalh/
 * @member toxi
 */
var SphericalHarmonics = function(m) {
    this.m = m;
};

SphericalHarmonics.prototype = {
    // toxiclibs - FIXME check where flipped vertex order is coming from sometimes
    computeVertexFor: function(p,phi,theta) {
        var r = 0;
        r += Math.pow(mathUtils.sin(this.m[0] * theta), this.m[1]);
        r += Math.pow(mathUtils.cos(this.m[2] * theta), this.m[3]);
        r += Math.pow(mathUtils.sin(this.m[4] * phi), this.m[5]);
        r += Math.pow(mathUtils.cos(this.m[6] * phi), this.m[7]);

        var sinTheta = mathUtils.sin(theta);
        p.x = r * sinTheta * mathUtils.cos(phi);
        p.y = r * mathUtils.cos(theta);
        p.z = r * sinTheta * mathUtils.sin(phi);
        return p;
    },

    getPhiRange: function() {
        return mathUtils.TWO_PI;
    },

    getPhiResolutionLimit: function(res) {
        return res;
    },

    getThetaRange: function() {
        return mathUtils.PI;
    },

    getThetaResolutionLimit: function(res) {
        return res;
    }
};

module.exports = SphericalHarmonics;
});
