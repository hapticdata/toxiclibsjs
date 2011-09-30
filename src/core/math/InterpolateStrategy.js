
/**
 * Bezier curve interpolation with configurable coefficients. The curve
 * parameters need to be normalized offsets relative to the start and end values
 * passed to the {@link #interpolate(float, float, float)} method, but can
 * exceed the normal 0 .. 1.0 interval. Use symmetrical offsets to create a
 * symmetrical curve, e.g. this will create a curve with 2 dips reaching the
 * minimum and maximum values at 25% and 75% of the interval...
 * 
 * <p>
 * <code>BezierInterpolation b=new BezierInterpolation(3,-3);</code>
 * </p>
 * 
 * The curve will be a straight line with this configuration:
 * 
 * <p>
 * <code>BezierInterpolation b=new BezierInterpolation(1f/3,-1f/3);</code>
 * </p>
 */
toxi.BezierInterpolation = function(h1,h2) {
	this.c1 = h1;
	this.c2 = h2;
};

toxi.BezierInterpolation.prototype = {
	interpolate: function(a,b,t) {
		var tSquared = t * t;
	    var invT = 1.0 - t;
	    var invTSquared = invT * invT;
	    return (a * invTSquared * invT) + (3 * (this.c1 * (b - a) + a) * t * invTSquared) + (3 * (this.c2 * (b - a) + b) * tSquared * invT) + (b * tSquared * t);
	},

    setCoefficients:function(a, b) {
        this.c1 = a;
        this.c2 = b;
    }

};

/**
 * Implementation of the circular interpolation function.
 * 
 * i = a-(b-a) * (sqrt(1 - (1 - f) * (1 - f) ))
 */

/**
 * The interpolation slope can be flipped to have its steepest ascent
 * towards the end value, rather than at the beginning in the default
 * configuration.
 * 
 * @param isFlipped
 *            true, if slope is inverted
 */
toxi.CircularInterpolation = function(isFlipped) {
   if(isFlipped === undefined){
		this.isFlipped = false;
	}
};

toxi.CircularInterpolation.prototype = {
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



/**
 * Implementation of the cosine interpolation function:
 * 
 * i = b+(a-b)*(0.5+0.5*cos(f*PI))
 */
toxi.CosineInterpolation = function(){};

toxi.CosineInterpolation.prototype = {
	interpolate: function(a, b, f) {
		return b + (a - b) * (0.5 + 0.5 * Math.cos(f * Math.PI));
	}
};



/**
 * Delivers a number of decimated/stepped values for a given interval. E.g. by
 * using 5 steps the interpolation factor is decimated to: 0, 20, 40, 60, 80 and
 * 100%. By default {@link LinearInterpolation} is used, however any other
 * {@link InterpolateStrategy} can be specified via the constructor.
 */
toxi.DecimatedInterpolation = function(steps,strategy) {
 if(steps === undefined){
	throw new Error("steps was not passed to constructor");
 }
 this.numSteps = steps;
 this.strategy = (strategy===undefined)? new toxi.LinearInterpolation() : strategy;
};

toxi.DecimatedInterpolation.prototype = {	
	interpolate: function(a,b,f) {
        var fd = Math.floor(f * this.numSteps) /  this.numSteps;
        return this.strategy.interpolate(a, b, fd);
	}
};

/**
 * Exponential curve interpolation with adjustable exponent. Use exp in the
 * following ranges to achieve these effects:
 * <ul>
 * <li>0.0 &lt; x &lt; 1.0 : ease in (steep changes towards b)</li>
 * <li>1.0 : same as {@link LinearInterpolation}</li>
 * <li>&gt; 1.0 : ease-out (steep changes from a)</li>
 * </ul>
 */
toxi.ExponentialInterpolation = function(exp) {
   this.exponent = (exp === undefined)?2 : exp;
};

toxi.ExponentialInterpolation.prototype = {
	interpolate: function(a, b, f) {
		return a + (b - a) * Math.pow(f, this.exponent);
    }
};

/**
 * Implementations of 2D interpolation functions (currently only bilinear).
 */

/**
 * @param x
 *            x coord of point to filter (or Vec2D p)
 * @param y
 *            y coord of point to filter (or Vec2D p1)
 * @param x1
 *            x coord of top-left corner (or Vec2D p2)
 * @param y1
 *            y coord of top-left corner
 * @param x2
 *            x coord of bottom-right corner
 * @param y2
 *            y coord of bottom-right corner
 * @param tl
 *            top-left value
 * @param tr
 *            top-right value (do not use if first 3 are Vec2D)
 * @param bl
 *            bottom-left value (do not use if first 3 are Vec2D)
 * @param br
 *            bottom-right value (do not use if first 3 are Vec2D)
 * @return interpolated value
 */
toxi.Interpolation2D = {};
toxi.Interpolation2D.bilinear = function(_x, _y, _x1,_y1, _x2, _y2, _tl, _tr, _bl, _br) {
	var x,y,x1,y1,x2,y2,tl,tr,bl,br;
	if(_x instanceof Object) //if the first 3 params are passed in as Vec2Ds
	{
		x = _x.x;
		y = _x.y;
		
		x1 = _y.x;
		y1 = _y.y;
		
		x2 = _x1.x;
		y2 = _x1.y;
		
		tl = _y1;
		tr = _x2;
		bl = _y2;
		br = _tl;
	} else {
		x = _x;
		y = _y;
		x1 = _x1;
		y1 = _y1;
		x2 = _x2;
		y2 = _y2;
		tl = _tl;
		tr = _tr;
		bl = _bl;
		br = _br;
	}
    var denom = 1.0 / ((x2 - x1) * (y2 - y1));
    var dx1 = (x - x1) * denom;
    var dx2 = (x2 - x) * denom;
    var dy1 = y - y1;
    var dy2 = y2 - y;
    return (tl * dx2 * dy2 + tr * dx1 * dy2 + bl * dx2 * dy1 + br* dx1 * dy1);
};

/**
 * Implementation of the linear interpolation function
 * 
 * i = a + ( b - a ) * f
 */

toxi.LinearInterpolation = function(){};

toxi.LinearInterpolation.prototype = {
	interpolate: function(a, b, f) {
        return a + (b - a) * f;
	}
};

/**
 * Initializes the s-curve with default sharpness = 2
 */
toxi.SigmoidInterpolation = function(s) {
	if(s === undefined){
		s = 2.0;
	}
	this.setSharpness(s);
};

toxi.SigmoidInterpolation.prototype = {	
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

/**
 * Defines a single step/threshold function which returns the min value for all
 * factors &lt; threshold and the max value for all others.
 */
toxi.ThresholdInterpolation = function(threshold) {
	this.threshold = threshold;
};

toxi.ThresholdInterpolation.prototype = {
	interpolate: function(a, b, f) {
		return f < this.threshold ? a : b;
	}
};
    
    
/**
 * This class provides an adjustable zoom lens to either bundle or dilate values
 * around a focal point within a given interval. For a example use cases, please
 * have a look at the provided ScaleMapDataViz and ZoomLens examples.
 */


toxi.ZoomLensInterpolation = function(lensPos, lensStrength) {
	this.leftImpl = new toxi.CircularInterpolation();
	this.rightImpl = new toxi.CircularInterpolation();
	this.lensPos = lensPos || 0.5;
	this.lensStrength = lensStrength || 1;
	this.absStrength = Math.abs(this.lensStrength);
	this.leftImpl.setFlipped(this.lensStrength > 0);
	this.rightImpl.setFlipped(this.lensStrength < 0);
};

toxi.ZoomLensInterpolation.prototype = {
	interpolate: function(min,max,t) {
	    var val = min + (max - min) * t;
	    if (t < this.lensPos) {
	        val += (this.leftImpl.interpolate(min, min + (max - min) * this.lensPos, t/ this.lensPos) - val)* this.absStrength;
	    } else {
	        val += (this.rightImpl.interpolate(min + (max - min) * this.lensPos, max,(t - this.lensPos) / (1 - this.lensPos)) - val) * this.absStrength;
	    }
	    return val;
	},
	
	setLensPos: function(pos, smooth) {
	    this.lensPos += (toxi.MathUtils.clipNormalized(pos) - this.lensPos) * smooth;
	},
	
	setLensStrength: function(str, smooth) {
	    this.lensStrength += (toxi.MathUtils.clip(str, -1, 1) - this.lensStrength) * smooth;
	    this.absStrength = toxi.MathUtils.abs(this.lensStrength);
	    this.leftImpl.setFlipped(this.lensStrength > 0);
	    this.rightImpl.setFlipped(this.lensStrength < 0);
	}
};
