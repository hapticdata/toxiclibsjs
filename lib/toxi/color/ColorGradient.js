define(function(require, exports, module) {


var filter = require('../internals').filter,
	numberCompare = require('../internals').numberCompare,
	mathUtils = require('../math/mathUtils'),
	LinearInterpolation = require('../math/LinearInterpolation'),
	ColorList = require('./ColorList');

//a protected comparator
var _GradPoint = function(p, c){
	this.pos = p;
	this.color = c;
};

_GradPoint.prototype = {
	compareTo: function(p){
		if(numberCompare(p.pos,this.pos) === 0){
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
	this._gradient = [];
	this._interpolator = new LinearInterpolation();
	this._maxDither = 0;
};

ColorGradient.prototype = {
	/**
	* Adds a new color at specified position.
	* @param p
	* @param c
	*/
	addColorAt: function(p, c){
		this._gradient.push(new _GradPoint(p,c));
	},
	/**
	* Calculates the gradient from specified position.
	* @param pos
	* @param width
	* @return list of interpolated gradient colors
	*/
	calcGradient: function(pos, width){
		if( arguments.length === 0 ){
			pos = this._gradient[0].getPosition();
			var last = this._gradient[this._gradient.length-1].getPosition();
			width = Math.floor(last - pos);
		}

		var result = new ColorList();
		if( this._gradient.length === 0 ){
			return result;
		}

		var frac = 0,
			currPoint, nextPoint,
			endPos = pos + width,
			i = 0,
			l = this._gradient.length;

		for( i=0; i<l; i++ ){
			if( this._gradient[i].pos < pos ){
				currPoint = this._gradient[i];
			}
		}

		var isPremature = (currPoint===undefined),
			activeGradient;
		if( !isPremature ){
			activeGradient = filter(this._gradient, function( g ){ return g.pos >= currPoint.pos; });
			console.log( activeGradient );
		} else {
			//start position is before 1st gradient color, so use whole
			activeGradient = this._gradient;
			currPoint = this._gradient[0];
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
			console.log('pos: ', pos + ' endPos: ', endPos );
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
				var ditheredFrac = mathUtils.clip( frac+mathUtils.normalizedRandom() * this._maxDither, 0, 1 );
				ditheredFrac = this._interpolator.interpolate( 0, 1, ditheredFrac );
				result.add( currPoint.color.getBlended(nextPoint.color, ditheredFrac) );
			} else {
				result.add( currPoint.color.copy() );
			}
			pos++;
		}
		return result;
		
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
	* @param maxDither
	*/
	setMaxDither: function(maxDither){
		this._maxDither = mathUtils.clip(maxDither, 0, 1);
	}
};
	module.exports = ColorGradient;
});
