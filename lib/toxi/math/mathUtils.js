define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class
 * @static
 * @member toxi
 * @description math utilities
 */
MathUtils = {};
MathUtils.SQRT2 = Math.sqrt(2);
MathUtils.SQRT3 = Math.sqrt(3);
MathUtils.LOG2 = Math.log(2);
MathUtils.PI = 3.14159265358979323846;

/**
 * The reciprocal of PI: (1/PI)
 */
MathUtils.INV_PI = 1.0 / MathUtils.PI;
MathUtils.HALF_PI = MathUtils.PI / 2;
MathUtils.THIRD_PI = MathUtils.PI / 3;
MathUtils.QUARTER_PI = MathUtils.PI / 4;
MathUtils.TWO_PI = MathUtils.PI * 2;
MathUtils.THREE_HALVES_PI = MathUtils.TWO_PI - MathUtils.HALF_PI;
MathUtils.PI_SQUARED = MathUtils.PI * MathUtils.PI;

/**
 * Epsilon value
 */
MathUtils.EPS = 1.1920928955078125E-7;

/**
 * Degrees to radians conversion factor
 */
MathUtils.DEG2RAD = MathUtils.PI / 180;

/**
 * Radians to degrees conversion factor
 */
MathUtils.RAD2DEG = 180 / MathUtils.PI;
MathUtils.SHIFT23 = 1 << 23;
MathUtils.INV_SHIFT23 = 1.0 / MathUtils.SHIFT23;
MathUtils.SIN_A = -4.0 / (MathUtils.PI * MathUtils.PI);
MathUtils.SIN_B = 4.0 / MathUtils.PI;
MathUtils.SIN_P = 9.0 / 40;
MathUtils.abs = Math.abs;
/**
 * Rounds up the value to the nearest higher power^2 value.
 * 
 * @param x
 * @return power^2 value
 */
MathUtils.ceilPowerOf2 = function(x) {
    var pow2 = 1;
    while (pow2 < x) {
        pow2 <<= 1;
    }
    return pow2;
};

MathUtils.clip = function(a, _min, _max) {
    return a < _min ? _min : (a > _max ? _max : a);
};
/**
 * Clips the value to the 0.0 .. 1.0 interval.
 * 
 * @param a
 * @return clipped value
 * @since 0012
 */
MathUtils.clipNormalized = function(a) {
    if (a < 0) {
        return 0;
    } else if (a > 1) {
        return 1;
    }
    return a;
};

MathUtils.cos = Math.cos;

MathUtils.degrees = function(radians) {
    return radians * this.RAD2DEG;
};

/**
 * Fast cosine approximation.
 * 
 * @param x
 *            angle in -PI/2 .. +PI/2 interval
 * @return cosine
 */
MathUtils.fastCos = function(x) {
    return MathUtils.fastSin(x + ((x > MathUtils.HALF_PI) ? -MathUtils.THREE_HALVES_PI : MathUtils.HALF_PI));
};

/**
 * Fast sine approximation.
 * 
 * @param x
 *            angle in -PI/2 .. +PI/2 interval
 * @return sine
 */
MathUtils.fastSin = function(x) {
    x = MathUtils.SIN_B * x + MathUtils.SIN_A * x * Math.abs(x);
    return MathUtils.SIN_P * (x * Math.abs(x) - x) + x;
};

MathUtils.flipCoin = function(rnd) {
    return Math.random() < 0.5;
};

/**
 * This method is a *lot* faster than using (int)Math.floor(x).
 * 
 * @param x
 *            value to be floored
 * @return floored value as integer
 */

MathUtils.floor = function(x) {
   var y = parseInt(x,10);
   if (x < 0 && x != y) {
       y--;
   }
   return y;
};

/**
 * Rounds down the value to the nearest lower power^2 value.
 * 
 * @param x
 * @return power^2 value
 */
MathUtils.floorPowerOf2 = function(x) {
  return parseInt( Math.pow(2, parseInt((Math.log(x) / MathUtils.LOG2),10)),10);
};

MathUtils.max =  function(a, b, c) {
	if(!c) return Math.max(a,b);
    return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
};

MathUtils.min = function(a, b, c) {
	if(!c)return Math.min(a,b);
    return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
};

/**
 * Returns a random number in the interval -1 .. +1.
 * 
 * @return random float
 */
MathUtils.normalizedRandom = function() {
  return Math.random() * 2 - 1;
};

MathUtils.radians = function(degrees) {
  return degrees * MathUtils.DEG2RAD;
};

MathUtils.random = function(rand,min,max) {
  if(arguments.length == 2) {
    max = min;
    min = rand;
    rand = Math.random;
  }
	if(!min && !max)return Math.random();
	else if(!max){ //if only one is provided, then thats actually the max
		max = min;
		return rand()*max;
	}
    return rand() * (max - min) + min;
};

MathUtils.reduceAngle = function(theta) {
    theta %= MathUtils.TWO_PI;
    if (Math.abs(theta) > MathUtils.PI) {
        theta = theta - MathUtils.TWO_PI;
    }
    if (Math.abs(theta) > MathUtils.HALF_PI) {
        theta = MathUtils.PI - theta;
    }
    return theta;
};

MathUtils.sign = function(x) {
    return x < 0 ? -1 : (x > 0 ? 1 : 0);
};

MathUtils.sin = function(theta) {
   theta = MathUtils.reduceAngle(theta);
   if (Math.abs(theta) <= MathUtils.QUARTER_PI) {
       return MathUtils.fastSin(theta);
   }
   return MathUtils.fastCos(MathUtils.HALF_PI - theta);
};

module.exports = MathUtils;

});
