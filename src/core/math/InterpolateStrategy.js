/**
 		T O X I C L I B S . JS  - 0.01
		a port of toxiclibs for Java / Processing written by Karsten Schmidt
		
		License				: GNU Lesser General Public version 2.1
		Developer			: Kyle Phillips: http://haptic-data.com
		Java Version		: http://toxiclibs.org
*/

/**
 * Initializes the s-curve with default sharpness = 2
 */
function SigmoidInterpolation(s) {
	if(s == undefined)s = 2.0;
    this.setSharpness(s);
}


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
