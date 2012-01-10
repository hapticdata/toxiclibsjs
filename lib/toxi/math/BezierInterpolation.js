define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class Bezier curve interpolation with configurable coefficients. The curve
 * parameters need to be normalized offsets relative to the start and end values
 * passed to the {@link #interpolate(float, float, float)} method, but can
 * exceed the normal 0 .. 1.0 interval. Use symmetrical offsets to create a
 * symmetrical curve, e.g. this will create a curve with 2 dips reaching the
 * minimum and maximum values at 25% and 75% of the interval...
 * @member toxi
 * 
 * @example
 * <p>
 * <code>BezierInterpolation b=new BezierInterpolation(3,-3);</code>
 * </p>
 * 
 * The curve will be a straight line with this configuration:
 * 
 * <p>
 * <code>BezierInterpolation b=new BezierInterpolation(1f/3,-1f/3);</code>
 * </p>
 */
var	BezierInterpolation = function(h1,h2) {
	this.c1 = h1;
	this.c2 = h2;
};

BezierInterpolation.prototype = {
	interpolate: function(a,b,t) {
		var tSquared = t * t;
	    var invT = 1.0 - t;
	    var invTSquared = invT * invT;
	    return (a * invTSquared * invT) + (3 * (this.c1 * (b - a) + a) * t * invTSquared) + (3 * (this.c2 * (b - a) + b) * tSquared * invT) + (b * tSquared * t);
	},

    setCoefficients:function(a, b) {
        this.c1 = a;
        this.c2 = b;
    }

};

module.exports = BezierInterpolation;

});
