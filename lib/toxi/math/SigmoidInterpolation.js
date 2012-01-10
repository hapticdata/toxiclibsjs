define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class Initializes the s-curve with default sharpness = 2
 * @member toxi
 */
var	SigmoidInterpolation = function(s) {
	if(s === undefined){
		s = 2.0;
	}
	this.setSharpness(s);
};

SigmoidInterpolation.prototype = {	
	getSharpness: function() {
		return this.sharpness;
	},
	
	interpolate: function(a, b, f) {
	    f = (f * 2 - 1) * this.sharpPremult;
	    f = (1.0 / (1.0 + Math.exp(-f)));
	    return a + (b - a) * f;
	},
	
	setSharpness: function(s) {
	    this.sharpness = s;
	    this.sharpPremult = 5 * s;
	}
};

module.exports = SigmoidInterpolation;
});
