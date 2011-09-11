toxi.MathUtils = {};
toxi.MathUtils.SQRT2 = Math.sqrt(2);
toxi.MathUtils.SQRT3 = Math.sqrt(3);
toxi.MathUtils.LOG2 = Math.log(2);
toxi.MathUtils.PI = 3.14159265358979323846;

/**
 * The reciprocal of PI: (1/PI)
 */
toxi.MathUtils.INV_PI = 1.0 / toxi.MathUtils.PI;
toxi.MathUtils.HALF_PI = toxi.MathUtils.PI / 2;
toxi.MathUtils.THIRD_PI = toxi.MathUtils.PI / 3;
toxi.MathUtils.QUARTER_PI = toxi.MathUtils.PI / 4;
toxi.MathUtils.TWO_PI = toxi.MathUtils.PI * 2;
toxi.MathUtils.THREE_HALVES_PI = toxi.MathUtils.TWO_PI - toxi.MathUtils.HALF_PI;
toxi.MathUtils.PI_SQUARED = toxi.MathUtils.PI * toxi.MathUtils.PI;

/**
 * Epsilon value
 */
toxi.MathUtils.EPS = 1.1920928955078125E-7;

/**
 * Degrees to radians conversion factor
 */
toxi.MathUtils.DEG2RAD = toxi.MathUtils.PI / 180;

/**
 * Radians to degrees conversion factor
 */
toxi.MathUtils.RAD2DEG = 180 / toxi.MathUtils.PI;
toxi.MathUtils.SHIFT23 = 1 << 23;
toxi.MathUtils.INV_SHIFT23 = 1.0 / toxi.MathUtils.SHIFT23;
toxi.MathUtils.SIN_A = -4.0 / (toxi.MathUtils.PI * toxi.MathUtils.PI);
toxi.MathUtils.SIN_B = 4.0 / toxi.MathUtils.PI;
toxi.MathUtils.SIN_P = 9.0 / 40;
toxi.MathUtils.abs = Math.abs;
/**
 * Rounds up the value to the nearest higher power^2 value.
 * 
 * @param x
 * @return power^2 value
 */
toxi.MathUtils.ceilPowerOf2 = function(x) {
    var pow2 = 1;
    while (pow2 < x) {
        pow2 <<= 1;
    }
    return pow2;
};

toxi.MathUtils.clip = function(a, _min, _max) {
    return a < _min ? _min : (a > _max ? _max : a);
};
/**
 * Clips the value to the 0.0 .. 1.0 interval.
 * 
 * @param a
 * @return clipped value
 * @since 0012
 */
toxi.MathUtils.clipNormalized = function(a) {
    if (a < 0) {
        return 0;
    } else if (a > 1) {
        return 1;
    }
    return a;
};

toxi.MathUtils.cos = Math.cos;

toxi.MathUtils.degrees = function(radians) {
    return radians * this.RAD2DEG;
};

/**
 * Fast cosine approximation.
 * 
 * @param x
 *            angle in -PI/2 .. +PI/2 interval
 * @return cosine
 */
toxi.MathUtils.fastCos = function(x) {
    return toxi.MathUtils.fastSin(x + ((x > toxi.MathUtils.HALF_PI) ? -toxi.MathUtils.THREE_HALVES_PI : toxi.MathUtils.HALF_PI));
};

/**
 * Fast sine approximation.
 * 
 * @param x
 *            angle in -PI/2 .. +PI/2 interval
 * @return sine
 */
toxi.MathUtils.fastSin = function(x) {
    x = toxi.MathUtils.SIN_B * x + toxi.MathUtils.SIN_A * x * Math.abs(x);
    return toxi.MathUtils.SIN_P * (x * Math.abs(x) - x) + x;
};

toxi.MathUtils.flipCoin = function(rnd) {
    return Math.random() < 0.5;
};

/**
 * This method is a *lot* faster than using (int)Math.floor(x).
 * 
 * @param x
 *            value to be floored
 * @return floored value as integer
 */

toxi.MathUtils.floor = function(x) {
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
toxi.MathUtils.floorPowerOf2 = function(x) {
  return parseInt( Math.pow(2, parseInt((Math.log(x) / toxi.MathUtils.LOG2),10)),10);
};

toxi.MathUtils.max =  function(a, b, c) {
	if(!c) return Math.max(a,b);
    return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
};

toxi.MathUtils.min = function(a, b, c) {
	if(!c)return Math.min(a,b);
    return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
};

/**
 * Returns a random number in the interval -1 .. +1.
 * 
 * @return random float
 */
toxi.MathUtils.normalizedRandom = function() {
  return Math.random() * 2 - 1;
};

toxi.MathUtils.radians = function(degrees) {
  return degrees * toxi.MathUtils.DEG2RAD;
};

toxi.MathUtils.random = function(min,max) {
	if(!min && !max)return Math.random();
	else if(!max){ //if only one is provided, then thats actually the max
		max = min;
		return Math.random()*max;
	}
    return Math.random() * (max - min) + min;
};

toxi.MathUtils.reduceAngle = function(theta) {
    theta %= toxi.MathUtils.TWO_PI;
    if (Math.abs(theta) > toxi.MathUtils.PI) {
        theta = theta - toxi.MathUtils.TWO_PI;
    }
    if (Math.abs(theta) > toxi.MathUtils.HALF_PI) {
        theta = toxi.MathUtils.PI - theta;
    }
    return theta;
};

toxi.MathUtils.sign = function(x) {
    return x < 0 ? -1 : (x > 0 ? 1 : 0);
};

toxi.MathUtils.sin = function(theta) {
   theta = toxi.MathUtils.reduceAngle(theta);
   if (Math.abs(theta) <= toxi.MathUtils.QUARTER_PI) {
       return toxi.MathUtils.fastSin(theta);
   }
   return toxi.MathUtils.fastCos(toxi.MathUtils.HALF_PI - theta);
};
