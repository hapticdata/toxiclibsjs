define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class Implementation of the circular interpolation function.
 * 
 * i = a-(b-a) * (sqrt(1 - (1 - f) * (1 - f) ))
 * @description The interpolation slope can be flipped to have its steepest ascent
 * towards the end value, rather than at the beginning in the default
 * configuration.
 * @member toxi
 * 
 * @param isFlipped
 *            true, if slope is inverted
 */
var	CircularInterpolation = function(isFlipped) {
   if(isFlipped === undefined){
		this.isFlipped = false;
	}
};

CircularInterpolation.prototype = {
	interpolate: function( a, b, f) {
        if (this.isFlipped) {
            return a - (b - a) * (Math.sqrt(1 - f * f) - 1);
        } else {
            f = 1 - f;
            return a + (b - a) * ( Math.sqrt(1 - f * f));
        }
    },

    setFlipped: function(isFlipped) {
        this.isFlipped = isFlipped;
    }
};

module.exports = CircularInterpolation;
});
