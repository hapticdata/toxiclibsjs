define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class Implementation of the linear interpolation function
 * 
 * i = a + ( b - a ) * f
 * @member toxi
 */
var	LinearInterpolation = function(){};

LinearInterpolation.prototype = {
	interpolate: function(a, b, f) {
        return a + (b - a) * f;
	}
};

module.exports = LinearInterpolation;
});
