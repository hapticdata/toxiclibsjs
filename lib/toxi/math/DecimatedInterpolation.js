define(["require", "exports", "module", "./LinearInterpolation"], function(require, exports, module) {
var LinearInterpolation = require('./LinearInterpolation');
/**
 * @class Delivers a number of decimated/stepped values for a given interval. E.g. by
 * using 5 steps the interpolation factor is decimated to: 0, 20, 40, 60, 80 and
 * 100%. By default {@link LinearInterpolation} is used, however any other
 * {@link InterpolateStrategy} can be specified via the constructor.
 * @member toxi
 */
var	DecimatedInterpolation = function(steps,strategy) {
 if(steps === undefined){
	throw new Error("steps was not passed to constructor");
 }
 this.numSteps = steps;
 this.strategy = (strategy===undefined)? new LinearInterpolation() : strategy;
};

DecimatedInterpolation.prototype = {	
	interpolate: function(a,b,f) {
        var fd = Math.floor(f * this.numSteps) /  this.numSteps;
        return this.strategy.interpolate(a, b, fd);
	}
};

module.exports = DecimatedInterpolation;
});
