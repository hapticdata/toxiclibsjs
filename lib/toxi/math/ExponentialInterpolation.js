define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class Exponential curve interpolation with adjustable exponent. Use exp in the
 * following ranges to achieve these effects:
 * <ul>
 * <li>0.0 &lt; x &lt; 1.0 : ease in (steep changes towards b)</li>
 * <li>1.0 : same as {@link LinearInterpolation}</li>
 * <li>&gt; 1.0 : ease-out (steep changes from a)</li>
 * </ul>
 * @member toxi
 */
var	ExponentialInterpolation = function(exp) {
   this.exponent = (exp === undefined)?2 : exp;
};

ExponentialInterpolation.prototype = {
	interpolate: function(a, b, f) {
		return a + (b - a) * Math.pow(f, this.exponent);
    }
};

module.exports = ExponentialInterpolation;
});
