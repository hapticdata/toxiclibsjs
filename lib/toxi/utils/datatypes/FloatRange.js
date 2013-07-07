define(["require", "exports", "module", "../../math/mathUtils"], function(require, exports, module) {

var mathUtils = require('../../math/mathUtils');

/**
 * construct a new `FloatRange`
 * provides utilities for dealing with a range of Numbers.
 * @param {Number} [min=0] the minimum in the range
 * @param {Number} [max=1.0] the maximum in the range
 * @constructor
 */
var FloatRange = function(min, max){
	min = min || 0.0;
	max = typeof max === 'number' ? max : 1.0;
	// swap if necessary
	if(min > max){
		var t= max;
		max = min;
		min = t;
	}
	this.min = min;
	this.max = max;
	this.currValue = min;
};

FloatRange.prototype = {
	adjustCurrentBy: function(val){
		return this.setCurrent(this.currValue + val);
	},
	copy: function(){
		var range = new FloatRange(this.min,this.max);
		range.currValue = this.currValue;
		return range;
	},
    /**
     * Returns the value at the normalized position <code>(0.0 = min ... 1.0 =
     * max-EPS)</code> within the range. Since the max value is exclusive, the
     * value returned for position 1.0 is the range max value minus
     * {@link MathUtils#EPS}. Also note the given position is not being clipped
     * to the 0.0-1.0 interval, so when passing in values outside that interval
     * will produce out-of-range values too.
     * @param {Number} perc
     * @return {Number} value within the range
     */
	getAt: function(perc){
		return this.min + (this.max - this.min - mathUtils.EPS) * perc;
	},
	getCurrent: function(){
		return this.currValue;
	},
	getMedian: function(){
		return (this.min + this.max) * 0.5;
	},
	getRange: function(){
		return this.max - this.min;
	},
	isValueInRange: function(val){
		return val >= this.min && val <= this.max;
	},
	pickRandom: function(){
		this.currValue = mathUtils.random(this.min,this.max);
		return this.currValue;
	},
    setCurrent: function( val ){
        this.currValue = mathUtils.clip( val, this.min, this.max );
        return this.currValue;
    },
	/*
	seed: function(seed){
		throw new Error("Not yet Implemented");
	},
	setRandom: function(rnd){
		
	}
	*/
	toArray: function(step){
		var range = [],
			v = this.min;
		while(v < this.max){
			range.push(v);
			v += step;
		}
		return range;
	},
	toString: function(){
		return "FloatRange: " + this.min + " -> " + this.max;
	}
};

module.exports = FloatRange;
});
