define(["require", "exports", "module", "../internals","../math/mathUtils","../math/LinearInterpolation"], function(require, exports, module) {


var numberCompare = require('../internals').numberCompare,
	mathUtils = require('../math/mathUtils'),
	LinearInterpolation = require('../math/LinearInterpolation');

//a protected comparator
var _GradPoint = function(p, c){
	this._pos = p;
	this._color = c;
};

_GradPoint.prototype = {
	compareTo: function(p){
		if(numberCompare(p._pos,this._pos) == 0){
			return 0;
		}
		return this._pos < p._pos ? -1 : 1;
	},
	getColor: function(){
		return this._color;
	},
	getPosition: function(){
		return this._pos;
	}
};

var ColorGradient = function(){
	this._gradient = [];
	this._interpolator = new LinearInterpolation();
};

ColorGradient.prototype = {
	/**
	* Adds a new color at specified position.
	* 
	* @param p
	* @param c
	*/
	addColorAt: function(p, c){
		this._gradient.push(new _GradPoint(p,c));
	},
	/**
	* Calculates the gradient from specified position.
	* 
	* @param pos
	* @param width
	* @return list of interpolated gradient colors
	*/
	calcGradient: function(pos, width){
		var start = this._gradient[0].getPosition(),
			last = this._gradient[this._gradient.length-1].getPosition();
		return this.calcGradient(start, Math.floor(last - start));
	},
	getGradientPoints: function(){
		return this._gradient;
	},
	/**
	* @return the interpolator
	*/
	getInterpolator: function(){
		return this._interpolator;
	},
	/**
	* @return the maximum dither amount.
	*/
	getMaxDither: function(){
		return this._maxDither;
	},
	/**
	* @param interpolator
	*            the interpolator to set
	*/
	setInterpolator: function(interpolator){
		this._interpolator = interpolator;
	},
	/**
	* Sets the maximum dither amount. Setting this to values >0 will jitter the
	* interpolated colors in the calculated gradient. The value range for this
	* parameter is 0.0 (off) to 1.0 (100%).
	* 
	* @param maxDither
	*/
	setMaxDither: function(maxDither){
		this._maxDither = mathUtils.clip(this._maxDither, 0, 1);
	}
};

module.exports = ColorGradient;
});
