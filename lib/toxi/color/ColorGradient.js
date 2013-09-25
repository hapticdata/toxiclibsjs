define(function(require, exports, module) {


var filter = require('../internals').filter,
	numberComparator = require('../internals').numberComparator,
	mathUtils = require('../math/mathUtils'),
	LinearInterpolation = require('../math/LinearInterpolation'),
	ColorList = require('./ColorList');

//a protected object for every point on the gradient
var _GradPoint = function(p, c){
	this.pos = p;
	this.color = c;
};

_GradPoint.prototype = {
	compareTo: function(p){
		if(numberComparator(p.pos,this.pos) === 0){
			return 0;
		}
		return this.pos < p.pos ? -1 : 1;
	},
	getColor: function(){
		return this.color;
	},
	getPosition: function(){
		return this.pos;
	}
};

var ColorGradient = function(){
	this.gradient = [];
	this.interpolator = new LinearInterpolation();
	this.maxDither = 0;
};

ColorGradient.prototype = {
	/**
	* Adds a new color at specified position.
	* @param {Number} p position in the gradient
	* @param {toxi.color.TColor} c color to add
	*/
	addColorAt: function(p, c){
		this.gradient.push(new _GradPoint(p,c));
	},
	/**
	* Calculates the gradient from specified position.
	* @param {Number} pos position to start at (float)
	* @param {Number} width (integer)
	* @return list of interpolated gradient colors
	*/
	calcGradient: function(pos, width){
		if( arguments.length === 0 ){
			pos = this.gradient[0].getPosition();
			var last = this.gradient[this.gradient.length-1].getPosition();
			width = Math.floor(last - pos);
		}

		var result = new ColorList();
		if( this.gradient.length === 0 ){
			return result;
		}

		var frac = 0,
			currPoint, nextPoint,
			endPos = pos + width,
			i = 0,
			l = this.gradient.length;

		for( i=0; i<l; i++ ){
			if( this.gradient[i].pos < pos ){
				currPoint = this.gradient[i];
			}
		}

		var isPremature = (currPoint===undefined),
			activeGradient;
		if( !isPremature ){
			activeGradient = filter(this.gradient, function( g ){ return g.pos >= currPoint.pos; });
		} else {
			//start position is before 1st gradient color, so use whole
			activeGradient = this.gradient;
			currPoint = this.gradient[0];
		}

		var currWidth = 0;
		//start over with i, and use it to iterate
		i = 0;
		l = activeGradient.length;
		if( currPoint !== activeGradient[l-1] ){
			nextPoint = activeGradient[i];
			if( isPremature ){
				var d = currPoint.pos - pos;
				currWidth = mathUtils.abs( d ) > 0 ? 1 / d : 1;
			} else {
				if( nextPoint.pos - currPoint.pos > 0 ) {
					currWidth = 1 / (nextPoint.pos - currPoint.pos);
				}
			}
		}
		while( pos < endPos ){
			if( isPremature ){
				frac = 1 - (currPoint.pos - pos) * currWidth;
			} else {
				frac = (pos - currPoint.pos) * currWidth;
			}
			//switch to next color?
			if( frac > 1.0 ){
				currPoint = nextPoint;
				isPremature = false;
				i++;
				if( i < activeGradient.length ){
					nextPoint = activeGradient[i];
					if( currPoint !== activeGradient[l-1] ){
						currWidth = 1 / (nextPoint.pos - currPoint.pos);
					} else {
						currWidth = 0;
					}
					frac = (pos - currPoint.pos) * currWidth;
				}
			}
			if( currPoint  !== activeGradient[l-1] ){
				var ditheredFrac = mathUtils.clip( frac+mathUtils.normalizedRandom() * this.maxDither, 0, 1 );
				ditheredFrac = this.interpolator.interpolate( 0, 1, ditheredFrac );
				result.add( currPoint.color.getBlended(nextPoint.color, ditheredFrac) );
			} else {
				result.add( currPoint.color.copy() );
			}
			pos++;
		}
		return result;

	},
	getGradientPoints: function(){
		return this.gradient;
	},
	/**
	* @return the interpolator
	*/
	getInterpolator: function(){
		return this.interpolator;
	},
	/**
	* @return the maximum dither amount.
	*/
	getMaxDither: function(){
		return this.maxDither;
	},
	/**
	* @param interpolator the interpolator to set
	*/
	setInterpolator: function(interpolator){
		this.interpolator = interpolator;
	},
	/**
	* Sets the maximum dither amount. Setting this to values >0 will jitter the
	* interpolated colors in the calculated gradient. The value range for this
	* parameter is 0.0 (off) to 1.0 (100%).
	* @param {Number} maxDither
	*/
	setMaxDither: function(maxDither){
		this.maxDither = mathUtils.clip(maxDither, 0, 1);
	}
};
	module.exports = ColorGradient;
});
