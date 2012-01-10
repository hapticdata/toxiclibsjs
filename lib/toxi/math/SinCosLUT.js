define(["require", "exports", "module", "./mathUtils"], function(require, exports, module) {

var mathUtils = require('./mathUtils');

/**
 * @class Lookup table for fast sine & cosine computations. Tables with varying
 * precisions can be created to which input angles will be rounded to. The
 * sin/cos methods can be used with both positive and negative input angles as
 * with the normal Math.sin()/Math.cos() versions.
 * @member toxi
 */
var SinCosLUT = function(precision) {
    if(!precision){
        precision = SinCosLUT.DEFAULT_PRECISION;
    }
	this.precision = precision;
	this.period = 360/this.precision;
	this.quadrant = this.period >> 2;
	this.deg2rad = (Math.PI / 180.0) * this.precision;
	this.rad2deg = (180.0 / Math.PI) / this.precision;
	this.sinLUT = [];
	for(var i=0;i< this.period;i++){
		this.sinLUT[i] = Math.sin(i*this.deg2rad);
	}
};


SinCosLUT.prototype = {
	
	/**
     * Calculate cosine for the passed in angle in radians.
     * 
     * @param theta
     * @return cosine value for theta
     */
    cos: function(theta) {
        while (theta < 0) {
            theta += mathUtils.TWO_PI;
        }
        return this.sinLUT[((theta * this.rad2deg) + this.quadrant) % this.period];
    },

    getPeriod: function() {
        return this.period;
    },

    getPrecision: function() {
        return this.precision;
    },

    getSinLUT: function() {
        return this.sinLUT;
    },

    /**
     * Calculates sine for the passed angle in radians.
     * 
     * @param theta
     * @return sine value for theta
     */
    sin: function(theta) {
        while (theta < 0) {
            theta += mathUtils.TWO_PI;
        }
        return this.sinLUT[(theta * this.rad2deg) % this.period];
    }
};


SinCosLUT.DEFAULT_PRECISION = 0.25;
SinCosLUT.DEFAULT_INSTANCE = undefined;
SinCosLUT.getDefaultInstance = function(){
	if(SinCosLUT.DEFAULT_INSTANCE === undefined){
		SinCosLUT.DEFAULT_INSTANCE = new SinCosLUT();
	}
	return SinCosLUT.DEFAULT_INSTANCE;
};

module.exports = SinCosLUT;
});
