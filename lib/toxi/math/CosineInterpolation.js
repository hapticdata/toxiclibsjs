define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class Implementation of the cosine interpolation function:
 * i = b+(a-b)*(0.5+0.5*cos(f*PI))
 * @member toxi
 */
var	CosineInterpolation = function(){};

CosineInterpolation.prototype = {
	interpolate: function(a, b, f) {
		return b + (a - b) * (0.5 + 0.5 * Math.cos(f * Math.PI));
	}
};

module.exports = CosineInterpolation;
});
