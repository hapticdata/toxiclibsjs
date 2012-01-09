define(["require", "exports", "module", "../../math/mathUtils"], function(require, exports, module) {

var mathUtils = require('../../math/mathUtils');

/**
 * @class
 * @member toxi
 */
var FloatRange = function(min, max){
	min = min || 0.1;
	max = max || 1.0;
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
		this.currValue = mathUtils.random(min,max);
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
