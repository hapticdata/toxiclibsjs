
define('toxi/internals',["require", "exports", "module"], function(require, exports, module) {
/**
 * @module toxi/libUtils
 * contains the helper functions for the library,
 * these are intended as 'protected', you can use them but it isnt
 * intended to be used directly outside of the library.
 */


var ifUndefinedElse = function(_if,_else){
	return (typeof _if !== 'undefined') ? _if : _else;
};

module.exports.extend = function(childClass,superClass){
	childClass.prototype = new superClass();
	childClass.constructor = childClass;
	childClass.prototype.parent = superClass.prototype;
};

module.exports.hasProperties = function(subject,properties){
	if(subject === undefined || typeof subject != 'object'){
		return false;
	}
	var i = 0,
		len = properties.length,
		prop;
	for(i = 0; i < len; i++){
		prop = properties[i];
		if(!(prop in subject)){
			return false;
		}
	}
	return true;
};
 //allow the library to assume Array.isArray has been implemented
module.exports.isArray = Array.isArray || function(a){
	return a.toString() == '[object Array]';	
};
//basic forEach, use native implementation is available
//from Underscore.js
var breaker = {};
module.exports.each = function(obj, iterator, context) {
    if (obj == null) return;
	if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
	  obj.forEach(iterator, context);
	} else if (obj.length === +obj.length) {
	  for (var i = 0, l = obj.length; i < l; i++) {
	    if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
	  }
	} else {
	  for (var key in obj) {
	    if (hasOwnProperty.call(obj, key)) {
	      if (iterator.call(context, obj[key], key, obj) === breaker) return;
	    }
	  }
	}
};

module.exports.removeItemFrom = function(item,array){
	var index = array.indexOf(item);
	if(index > -1){
		return array.splice(index,1);
	}
	return undefined;
};
//basic mixin function, copy over object properties to provided object
module.exports.mixin = function(destination,source){
	module.exports.each(source,function(val,key){
		destination[key] = val;
	});
};

module.exports.numberCompare = function(f1,f2){
	if(f1 == f2) return 0;
	if(f1 < f2) return -1;
	if(f1 > f2) return 1;	
};

//set up for use with typed-arrays
module.exports.Int32Array = (typeof Int32Array !== 'undefined') ? Int32Array : Array;
module.exports.Float32Array = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

//imitate the basic functionality of a Java Iterator

var ArrayIterator = function(collection){
	this.__it = collection.slice(0);
};
ArrayIterator.prototype = {
	hasNext: function(){
		return this.__it.length > 0;
	},
	next: function(){
		return this.__it.shift();
	}
};
var ObjectIterator = function(object){
	this.__obj = {};
	this.__keys = [];
	for(var prop in object){
		this.__obj[prop] = object[prop];
		this.__keys.push(prop);
	}
	this.__it = new ArrayIterator(this.__keys);
};
ObjectIterator.prototype = {
	hasNext: function(){
		return this.__it.hasNext();
	},
	next: function(){
		var key = this.__it.next();
		return this.__obj[key];
	}
};

var Iterator = function(collection){
	if(module.exports.isArray(collection)){
		return new ArrayIterator(collection);
	}
	return new ObjectIterator(collection);
};

module.exports.Iterator = Iterator;

});

define('toxi/math/mathUtils',["require", "exports", "module"], function(require, exports, module) {
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

define('toxi/geom/Line3D',["require", "exports", "module", "../math/mathUtils"], function(require, exports, module) {

var mathUtils = require('../math/mathUtils');

/**
 @class
 @member toxi
 */
var Line3D = function(vec_a, vec_b) {
    this.a = vec_a;
    this.b = vec_b;
};

Line3D.prototype = {
	
	closestLineTo: function(l) {

       var p43 = l.a.sub(l.b);
       if (p43.isZeroVector()) {
           return new Line3D.LineIntersection(Line3D.LineIntersection.Type.NON_INTERSECTING);
       }

       var p21 = this.b.sub(this.a);
       if (p21.isZeroVector()) {
           return new Line3D.LineIntersection(Line3D.LineIntersection.Type.NON_INTERSECTING);
       }
       var p13 = this.a.sub(l.a);

       var d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z;
       var d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z;
       var d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z;
       var d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z;
       var d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z;

       var denom = d2121 * d4343 - d4321 * d4321;
       if (Math.abs(denom) < mathUtils.EPS) {
           return new Line3D.LineIntersection(Line3D.LineIntersection.Type.NON_INTERSECTING);
       }
       var numer = d1343 * d4321 - d1321 * d4343;
       var mua = numer / denom;
       var mub = (d1343 + d4321 * mua) / d4343;

       var pa = this.a.add(p21.scaleSelf(mua));
       var pb = l.a.add(p43.scaleSelf(mub));
       return new Line3D.LineIntersection(Line3D.LineIntersection.Type.INTERSECTING, new Line3D(pa, pb), mua,mub);
	},

   /**
    * Computes the closest point on this line to the given one.
    * 
    * @param p
    *            point to check against
    * @return closest point on the line
    */
	closestPointTo: function(p) {
       var v = this.b.sub(this.a);
       var t = p.sub(this.a).dot(v) / v.magSquared();
       // Check to see if t is beyond the extents of the line segment
       if (t < 0.0) {
           return this.a.copy();
       } else if (t > 1.0) {
           return this.b.copy();
       }
       // Return the point between 'a' and 'b'
       return this.a.add(v.scaleSelf(t));
	},

	copy: function() {
       return new Line3D(this.a.copy(), this.b.copy());
	},

	equals: function(obj) {
       if (this == obj) {
           return true;
       }
       if ((typeof(obj) != Line3D)) {
           return false;
       }
       return (this.a.equals(obj.a) || this.a.equals(l.b)) && (this.b.equals(l.b) || this.b.equals(l.a));
	},

   getDirection: function() {
       return this.b.sub(this.a).normalize();
   },

   getLength: function() {
       return this.a.distanceTo(this.b);
   },

   getLengthSquared: function() {
       return this.a.distanceToSquared(this.b);
   },

   getMidPoint: function() {
       return this.a.add(this.b).scaleSelf(0.5);
   },

   getNormal: function() {
       return this.b.cross(this.a);
   },

   hasEndPoint: function(p) {
       return this.a.equals(p) || this.b.equals(p);
   },


	offsetAndGrowBy: function(offset,scale,ref) {
		var m = this.getMidPoint(),
			d = this.getDirection(),
			n = this.a.cross(d).normalize();
       if (ref !== undefined && m.sub(ref).dot(n) < 0) {
           n.invert();
       }
       n.normalizeTo(offset);
       this.a.addSelf(n);
       this.b.addSelf(n);
       d.scaleSelf(scale);
       this.a.subSelf(d);
       this.b.addSelf(d);
       return this;
   },

   set: function(vec_a, vec_b) {
       this.a = vec_a;
       this.b = vec_b;
       return this;
   },


   splitIntoSegments: function(segments,stepLength, addFirst) {
       return Line3D.splitIntoSegments(this.a, this.b, stepLength, segments, addFirst);
   },


  toString: function() {
       return this.a.toString() + " -> " + this.b.toString();
   }
};

/**
    * Splits the line between A and B into segments of the given length,
    * starting at point A. The tweened points are added to the given result
    * list. The last point added is B itself and hence it is likely that the
    * last segment has a shorter length than the step length requested. The
    * first point (A) can be omitted and not be added to the list if so
    * desired.
    * 
    * @param a
    *            start point
    * @param b
    *            end point (always added to results)
    * @param stepLength
    *            desired distance between points
    * @param segments
    *            existing array list for results (or a new list, if null)
    * @param addFirst
    *            false, if A is NOT to be added to results
    * @return list of result vectors
    */
Line3D.splitIntoSegments = function(vec_a, vec_b, stepLength, segments, addFirst) {
    if (segments === undefined) {
        segments = [];
    }
    if (addFirst) {
        segments.push(vec_a.copy());
    }
    var dist = vec_a.distanceTo(vec_b);
    if (dist > stepLength) {
        var pos = vec_a.copy();
        var step = vec_b.sub(vec_a).limit(stepLength);
        while (dist > stepLength) {
            pos.addSelf(step);
            segments.push(pos.copy());
            dist -= stepLength;
        }
    }
    segments.push(vec_b.copy());
    return segments;
};


Line3D.LineIntersection = function(type,line,mua,mub){
	this.type = type;
	if(mua === undefined){ mua = 0; }
	if(mub === undefined){ mub = 0; }
	this.line = line;
	this.coeff = [mua,mub];
};

Line3D.LineIntersection.prototype = {
	
	getCoefficient: function(){
		return this.coeff;
	},
	
	getLength: function(){
		if(this.line === undefined){ return undefined; }
		return this.line.getLength();
	},
	
	getLine: function(){
		if(this.line === undefined){ return undefined; }
		return this.line.copy();
	},
	
	getType: function(){
		return this.type;
	},
	
	isIntersectionInside: function(){
		return this.type == Line3D.LineIntersection.Type.INTERSECTING && this.coeff[0] >= 0 && this.coeff[0] <= 1 && this.coeff[1] >=0 && this.coeff[1] <= 1;
	},
	
	toString: function(){
		return "type: "+this.type+ " line: "+this.line;
	}
};
	
Line3D.LineIntersection.Type = {
	NON_INTERSECTING: 0,
	INTERSECTING: 1
};

module.exports = Line3D;

});

define('toxi/geom/Vec2D',["require", "exports", "module", "../math/mathUtils","./Vec3D","./Vec3D","./Vec3D","./Vec3D", '../internals'], function(require, exports, module) {
var	mathUtils = require('../math/mathUtils');
var hasProperties = require('../internals').hasProperties;
/**
 @member toxi
 @class a two-dimensional vector class
 */
var	Vec2D = function(a,b){
	if(a instanceof Object && a.x !== undefined && a.y !== undefined){
		b = a.y;
		a = a.x;
	} else {
		if(a === undefined)a = 0;
		if(b === undefined)b = 0;
	}
	this.x = a;
	this.y = b;
};

Vec2D.Axis = {
	X: {
		getVector: function(){ return Vec2D.X_AXIS; },
		toString: function(){ return "Vec2D.Axis.X"; }
	},
	Y: {
		getVector: function(){ return Vec2D.Y_AXIS; },
		toString: function(){ return "Vec2D.Axis.Y"; }
	}
};

//private, 
var _getXY = function(a,b) {
	if(a instanceof Object){
		b = a.y;
		a = a.x;
	}
	else {
		if(a !== undefined && b === undefined){
			b = a;
		}
		else if(a === undefined){ a = 0; }
		else if(b === undefined){ b = 0; }
	}
	return {x: a, y: b};
};
//public
Vec2D.prototype = {

	abs: function() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    },

    add: function(a, b) {
		var v  = new Vec2D(a,b);
		v.x += this.x;
		v.y += this.y;
        return v;
    },
    
    /**
     * Adds vector {a,b,c} and overrides coordinates with result.
     * 
     * @param a
     *            X coordinate
     * @param b
     *            Y coordinate
     * @return itself
     */
    addSelf: function(a,b) {
		var v = _getXY(a,b);
        this.x += v.x;
        this.y += v.y;
        return this;
    },

	angleBetween: function(v, faceNormalize) {
		if(faceNormalize === undefined){
			var dot = this.dot(v);
			return Math.acos(this.dot(v));
		}
        var theta = (faceNormalize) ? this.getNormalized().dot(v.getNormalized()) : this.dot(v);
        return Math.acos(theta);
    },

	//bisect() is in Vec2D_post.js

    /**
     * Sets all vector components to 0.
     * 
     * @return itself
     */
    clear: function() {
        this.x = this.y = 0;
        return this;
    },
	
	compareTo: function(vec) {
        if (this.x == vec.x && this.y == vec.y) {
            return 0;
        }
        return this.magSquared() - vec.magSquared();
    },

	/**
     * Forcefully fits the vector in the given rectangle.
     * 
     * @param a
     *		either a Rectangle by itself or the Vec2D min
	 * @param b
	 *		Vec2D max
     * @return itself
     */
    constrain: function(a,b) {
		if(hasProperties(a,['x','y']) && hasProperties(b,['x','y'])){
			this.x = mathUtils.clip(this.x, a.x, b.x);
	        this.y = mathUtils.clip(this.y, a.y, b.y);
		} else if(hasProperties(a,['x','y','width','height'])){
            this.x = mathUtils.clip(this.x, a.x, a.x + a.width);
			this.y = mathUtils.clip(this.y, a.y, a.y + a.height);
		}
        return this;
    },
	
	copy: function() {
        return new Vec2D(this);
    },

    cross: function(v) {
        return (this.x * v.y) - (this.y * v.x);
    },

    distanceTo: function(v) {
        if (v !== undefined) {
            var dx = this.x - v.x;
            var dy = this.y - v.y;
            return Math.sqrt(dx * dx + dy * dy);
        } else {
            return NaN;
        }
    },

    distanceToSquared: function(v) {
        if (v !== undefined) {
            var dx = this.x - v.x;
            var dy = this.y - v.y;
            return dx * dx + dy * dy;
        } else {
            return NaN;
        }
    },

	dot: function(v) {
        return this.x * v.x + this.y * v.y;
    },

	equals: function(obj) {
        if (obj instanceof Object) {
            return this.x == obj.x && this.y == obj.y;
        }
        return false;
    },

	equalsWithTolerance: function(v, tolerance) {
        if (mathUtils.abs(this.x - v.x) < tolerance) {
            if (mathUtils.abs(this.y - v.y) < tolerance) {
                return true;
            }
        }
        return false;
    },

	floor: function() {
        this.x = mathUtils.floor(this.x);
        this.y = mathUtils.floor(this.y);
        return this;
    },

	/**
     * Replaces the vector components with the fractional part of their current
     * values
     * 
     * @return itself
     */
    frac: function() {
        this.x -= mathUtils.floor(this.x);
        this.y -= mathUtils.floor(this.y);
        return this;
    },

	getAbs: function() {
        return new Vec2D(this).abs();
    },

	getComponent: function(id) {
		if(typeof id == 'number')
		{			
			id = (id === 0) ? Vec2D.Axis.X : Vec2D.Axis.Y;
		}
		if(id == Vec2D.Axis.X){
			return this.x;
		} else if(id == Vec2D.Axis.Y){
			return this.y;
		}
		return 0;
    },

	getConstrained: function(r) {
        return new Vec2D(this).constrain(r);
    },

    getFloored: function() {
        return new Vec2D(this).floor();
    },

    getFrac: function() {
        return new Vec2D(this).frac();
    },

    getInverted: function() {
        return new Vec2D(-this.x, -this.y);
    },

    getLimited: function(lim) {
        if (this.magSquared() > lim * lim) {
            return this.getNormalizedTo(lim);
        }
        return new Vec2D(this);
    },

    getNormalized: function() {
        return new Vec2D(this).normalize();
    },

    getNormalizedTo: function(len) {
        return new Vec2D(this).normalizeTo(len);
    },
	 getPerpendicular: function() {
        return new Vec2D(this).perpendicular();
    },

    getReciprocal: function() {
        return new Vec2D(this).reciprocal();
    },

    getReflected: function(normal) {
        return new Vec2D(this).reflect(normal);
    },

    getRotated: function(theta) {
        return new Vec2D(this).rotate(theta);
    },

    getSignum: function() {
        return new Vec2D(this).signum();
    },
	
	heading: function() {
        return Math.atan2(this.y, this.x);
    },
    
    interpolateTo: function(v, f, s) {
		if(s === undefined){
			return new Vec2D(this.x + (v.x -this.x) * f, this.y + (v.y - this.y) * f);
		} else
		{
			return new Vec2D(s.interpolate(this.x,v.x,f),s.interpolate(this.y,v.y,f));
		}
    },

    /**
     * Interpolates the vector towards the given target vector, using linear
     * interpolation
     * 
     * @param v
     *            target vector
     * @param f
     *            interpolation factor (should be in the range 0..1)
     * @return itself, result overrides current vector
     */
    interpolateToSelf: function(v, f, s) {
		if(s === undefined) {
			this.x += (v.x - this.x) * f;
			this.y += (v.y - this.y) * f;
		} else {
			this.x = s.interpolate(this.x,v.x,f);
			this.y = s.interpolate(this.y,v.y,f);
		}
        return this;
    },

	invert: function() {
        this.x *= -1;
        this.y *= -1;
        return this;
    },

	isInCircle: function(sO,sR) {
        var d = this.sub(sO).magSquared();
        return (d <= sR * sR);
    },

    isInRectangle: function(rect) {
        if (this.x < rect.x || this.x > rect.x + rect.width) {
            return false;
        }
        if (this.y < rect.y || this.y > rect.y + rect.height) {
            return false;
        }
        return true;
    },

    isInTriangle: function(a,b,c) {
        var v1 = this.sub(a).normalize();
        var v2 = this.sub(b).normalize();
        var v3 = this.sub(c).normalize();

        var total_angles = Math.acos(v1.dot(v2));
        total_angles += Math.acos(v2.dot(v3));
        total_angles += Math.acos(v3.dot(v1));

        return (Math.abs(total_angles - mathUtils.TWO_PI) <= 0.005);
    },

	isMajorAxis: function(tol) {
        var ax = Math.abs(this.x);
        var ay = Math.abs(this.y);
        var itol = 1 - tol;
        if (ax > itol) {
            return (ay < tol);
        } else if (ay > itol) {
            return (ax < tol);
        }
        return false;
    },

    isZeroVector: function() {
        return Math.abs(this.x) < mathUtils.EPS && Math.abs(this.y) < mathUtils.EPS;
    },

    /**
     * Adds random jitter to the vector in the range -j ... +j using the default
     * {@link Random} generator of {@link MathUtils}.
     * 
     * @param a
     *            maximum x jitter or  Vec2D
     * @param b
     *            maximum y jitter or undefined
     * @return itself
     */
    jitter: function(a,b) {
		var v = _getXY(a,b);
		this.x += mathUtils.normalizedRandom() * v.x;
        this.y += mathUtils.normalizedRandom() * v.y;
        return this;
    },

	limit: function(lim) {
        if (this.magSquared() > lim * lim) {
            return this.normalize().scaleSelf(lim);
        }
        return this;
    },

    magnitude: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    magSquared: function() {
        return this.x * this.x + this.y * this.y;
    },

	max: function(v) {
        return new Vec2D(mathUtils.max(this.x, v.x), mathUtils.max(this.y, v.y));
    },

	maxSelf: function(v) {
        this.x = mathUtils.max(this.x, v.x);
        this.y = mathUtils.max(this.y, v.y);
        return this;
    },

    min: function(v) {
        return new Vec2D(mathUtils.min(this.x, v.x), mathUtils.min(this.y, v.y));
    },

	minSelf: function(v) {
        this.x = mathUtils.min(this.x, v.x);
        this.y = mathUtils.min(this.y, v.y);
        return this;
    },

    /**
     * Normalizes the vector so that its magnitude = 1
     * 
     * @return itself
     */
    normalize: function() {
        var mag = this.x * this.x + this.y * this.y;
        if (mag > 0) {
            mag = 1.0 / Math.sqrt(mag);
            this.x *= mag;
            this.y *= mag;
        }
        return this;
    },

    /**
     * Normalizes the vector to the given length.
     * 
     * @param len
     *            desired length
     * @return itself
     */
    normalizeTo: function(len) {
        var mag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (mag > 0) {
            mag = len / mag;
            this.x *= mag;
            this.y *= mag;
        }
        return this;
    },

    perpendicular: function() {
        var t = this.x;
        this.x = -this.y;
        this.y = t;
        return this;
    },
    
    positiveHeading: function() {
		var dist = Math.sqrt(this.x * this.x + this.y * this.y);
		if (this.y >= 0){
			return Math.acos(this.x / dist);
		}
		return (Math.acos(-this.x / dist) + mathUtils.PI);
    },

    reciprocal: function() {
        this.x = 1.0 / this.x;
        this.y = 1.0 / this.y;
        return this;
    },

	reflect: function(normal) {
        return this.set(normal.scale(this.dot(normal) * 2).subSelf(this));
    },

    /**
     * Rotates the vector by the given angle around the Z axis.
     * 
     * @param theta
     * @return itself
     */
    rotate: function(theta) {
        var co = Math.cos(theta);
        var si = Math.sin(theta);
        var xx = co * this.x - si * this.y;
        this.y = si * this.x + co * this.y;
        this.x = xx;
        return this;
    },

	roundToAxis: function() {
        if (Math.abs(this.x) < 0.5) {
            this.x = 0;
        } else {
            this.x = this.x < 0 ? -1 : 1;
            this.y = 0;
        }
        if (Math.abs(this.y) < 0.5) {
            this.y = 0;
        } else {
            this.y = this.y < 0 ? -1 : 1;
            this.x = 0;
        }
        return this;
    },

    scale: function(a, b) {
		var v = _getXY(a,b);
        return new Vec2D(this.x * v.x, this.y * v.y);
    },

    scaleSelf: function(a,b) {
		var v = _getXY(a,b);
        this.x *= v.x;
        this.y *= v.y;
        return this;
    },

	set: function(a,b){
		var v = _getXY(a,b);
		this.x = v.x;
		this.y = v.y;
		return this;
	},
	
	setComponent: function(id, val) {
		if(typeof id == 'number')
		{			
			id = (id === 0) ? Vec2D.Axis.X : Vec2D.Axis.Y;
		}
		if(id === Vec2D.Axis.X){
			this.x = val;
		} else if(id === Vec2D.Axis.Y){
			this.y = val;
		}
		return this;
	},
	
	/**
     * Replaces all vector components with the signum of their original values.
     * In other words if a components value was negative its new value will be
     * -1, if zero => 0, if positive => +1
     * 
     * @return itself
     */
	signum: function() {
        this.x = (this.x < 0 ? -1 : this.x === 0 ? 0 : 1);
        this.y = (this.y < 0 ? -1 : this.y === 0 ? 0 : 1);
        return this;
    },

	sub: function(a,b){
		var v = _getXY(a,b);
		return new Vec2D(this.x -v.x,this.y - v.y);
	},
	
	/**
     * Subtracts vector {a,b,c} and overrides coordinates with result.
     * 
     * @param a
     *            X coordinate
     * @param b
     *            Y coordinate
     * @return itself
     */
    subSelf: function(a,b) {
        var v = _getXY(a,b);
		this.x -= v.x;
        this.y -= v.y;
        return this;
    },

	tangentNormalOfEllipse: function(eO,eR) {
        var p = this.sub(eO);

        var xr2 = eR.x * eR.x;
        var yr2 = eR.y * eR.y;

        return new Vec2D(p.x / xr2, p.y / yr2).normalize();
    },
    

	//to3D** methods are in Vec2D_post.js
	
    toArray: function() {
        return [this.x,this.y];
    },

	toCartesian: function() {
        var xx = (this.x * Math.cos(this.y));
        this.y = (this.x * Math.sin(this.y));
        this.x = xx;
        return this;
    },

	toPolar: function() {
        var r = Math.sqrt(this.x * this.x + this.y * this.y);
        this.y = Math.atan2(this.y, this.x);
        this.x = r;
        return this;
    },

    toString: function() {
        var s = "{x:"+this.x+", y:"+this.y+"}";
        return s;
    }
	
};

//these requires are in the functions because of a circular dependency
Vec2D.prototype.bisect = function(b) {
    var Vec3D = require('./Vec3D');
    var diff = this.sub(b);
    var sum = this.add(b);
    var dot = diff.dot(sum);
    return new Vec3D(diff.x, diff.y, -dot / 2);
};

Vec2D.prototype.to3DXY = function() {
    var Vec3D = require('./Vec3D');
    return new Vec3D(this.x, this.y, 0);
};

Vec2D.prototype.to3DXZ = function() {
    var Vec3D = require('./Vec3D');
    return new Vec3D(this.x, 0, this.y);
};

Vec2D.prototype.to3DYZ = function() {
    var Vec3D = require('./Vec3D');
    return new Vec3D(0, this.x, this.y);
};

Vec2D.X_AXIS = new Vec2D(1,0); 
Vec2D.Y_AXIS = new Vec2D(0,1); 
Vec2D.ZERO = new Vec2D();
Vec2D.MIN_VALUE = new Vec2D(Number.MIN_VALUE,Number.MIN_VALUE);
Vec2D.MAX_VALUE = new Vec2D(Number.MAX_VALUE, Number.MAX_VALUE);
Vec2D.fromTheta = function(theta){
	return new Vec2D(Math.cos(theta),Math.sin(theta));
};
Vec2D.max = function(a,b){
	return new Vec2D(mathUtils.max(a.x,b.x), mathUtils.max(a.y,b.y));
};

Vec2D.min = function(a, b) {
    return new Vec2D(mathUtils.min(a.x, b.x), mathUtils.min(a.y, b.y));
};

Vec2D.randomVector = function(rnd){
	var v = new Vec2D(Math.random()*2 - 1, Math.random() * 2 - 1);
	return v.normalize();
};



module.exports = Vec2D;

});

define('toxi/geom/Matrix4x4',["require", "exports", "module", "../math/mathUtils","./Vec3D"], function(require, exports, module) {

var mathUtils = require('../math/mathUtils'),
	Vec3D = require('./Vec3D');

/**
 * @description Implements a simple row-major 4x4 matrix class, all matrix operations are
 * applied to new instances. Use {@link #transpose()} to convert from
 * column-major formats...
 * @exports Matrix4x4 as toxi.Matrix4x4
 * @constructor
 */
var Matrix4x4 = function(v11,v12,v13,v14,v21,v22,v23,v24,v31,v32,v33,v34,v41,v42,v43,v44){
	this.temp = [];
	this.matrix = [];
	var self = this;
	if(arguments.length === 0) { //if no variables were supplied
		this.matrix[0] = [1,0,0,0];
		this.matrix[1] = [0,1,0,0];
		this.matrix[2] = [0,0,1,0];
		this.matrix[3] = [0,0,0,1];
	} else if(v11 instanceof Number){ //if the variables were numbers
		var m1 = [v11,v12,v13,v14];
		var m2 = [v21,v22,v23,v24];
		var m3 = [v31,v32,v33,v34];
		var m4 = [v41,v42,v43,v44];
		this.matrix = [m1,m2,m3,m4];
	} else if(v11 instanceof Array) { //if it was sent in as one array
		var array = v11;
		if (array.length != 9 && array.length != 16) {
			throw new Error("Matrix4x4: Array length must == 9 or 16");
		}
		if (array.length == 16) {
			this.matrix = [];
			this.matrix[0] = array.slice(0,4);
			this.matrix[1] = array.slice(4,8);
			this.matrix[2] = array.slice(8,12);
			this.matrix[3] = array.slice(12);
		} else {
			this.matrix[0] = array.slice(0,3);
			this.matrix[0][3] = NaN;
			this.matrix[1] = array.slice(3,6);
			this.matrix[1][3] = NaN;
			this.matrix[2] = array.slice(6,9);
			this.matrix[2][3] = NaN;
			this.matrix[3] = [NaN,NaN,NaN,NaN];
		}
	} else if(v11 instanceof Matrix4x4){

	//else it should've been a Matrix4x4 that was passed in
		var m = v11,
			i = 0,
			j = 0,
			lenM,
			lenMM;

		if(m.matrix.length == 16){
			for(i=0;i<4;i++){
				this.matrix[i] = [m.matrix[i][0], m.matrix[i][1],m.matrix[i][2],m.matrix[i][3]];
			}
		} else {
			if(m.matrix.length == 4){
				lenM = m.matrix.length;
				for(i = 0; i < lenM; i++){
					lenMM = m.matrix[i].length;
					self.matrix[i] = [];
					for(j = 0; j < lenMM; j++){
						self.matrix[i][j] = m.matrix[i][j];
					}
				}
			}
			/*console.log("m.matrix.length: "+m.matrix.length);
			//should be a length of 9
			for(i=0;i<3;i++){
				this.matrix[i] = [m.matrix[i][0], m.matrix[i][1],m.matrix[i][2],NaN];
			}
			this.matrix[3] = [NaN,NaN,NaN,NaN];*/
		}
	} else {
		console.error("Matrix4x4: incorrect parameters used to construct new instance");
	}
};

Matrix4x4.prototype = {
	add: function(rhs) {
        var result = new Matrix4x4(this);
        return result.addSelf(rhs);
    },

    addSelf: function(m) {
        for (var i = 0; i < 4; i++) {
            var mi = this.matrix[i];
            var rhsm = m.matrix[i];
            mi[0] += rhsm[0];
            mi[1] += rhsm[1];
            mi[2] += rhsm[2];
            mi[3] += rhsm[3];
        }
        return this;
    },

    /**
     * Creates a copy of the given vector, transformed by this matrix.
     * 
     * @param v
     * @return transformed vector
     */
    applyTo: function(v) {
        return this.applyToSelf(new Vec3D(v));
    },

    applyToSelf: function(v) {
        for (var i = 0; i < 4; i++) {
            var m = this.matrix[i];
            this.temp[i] = v.x * m[0] + v.y * m[1] + v.z * m[2] + m[3];
        }
        v.set(this.temp[0], this.temp[1], this.temp[2]).scaleSelf((1.0 / this.temp[3]));
        return v;
    },

    copy: function() {
        return new Matrix4x4(this);
    },

    getInverted: function() {
        return new Matrix4x4(this).invert();
    },

    getRotatedAroundAxis: function(axis,theta) {
        return new Matrix4x4(this).rotateAroundAxis(axis, theta);
    },

    getRotatedX: function(theta) {
        return new Matrix4x4(this).rotateX(theta);
    },

    getRotatedY: function(theta) {
        return new Matrix4x4(this).rotateY(theta);
    },

    getRotatedZ: function(theta) {
        return new Matrix4x4(this).rotateZ(theta);
    },

    getTransposed: function() {
        return new Matrix4x4(this).transpose();
    },

    identity: function() {
        var m = this.matrix[0];
        m[1] = m[2] = m[3] = 0;
        m = this.matrix[1];
        m[0] = m[2] = m[3] = 0;
        m = this.matrix[2];
        m[0] = m[1] = m[3] = 0;
        m = this.matrix[3];
        m[0] = m[1] = m[2] = 0;
        this.matrix[0][0] = 1;
        this.matrix[1][1] = 1;
        this.matrix[2][2] = 1;
        this.matrix[3][3] = 1;
        return this;
    },

    /**
     * Matrix Inversion using Cramer's Method Computes Adjoint matrix divided by
     * determinant Code modified from
     * http://www.intel.com/design/pentiumiii/sml/24504301.pdf
     * 
     * @return itself
     */
	invert: function() {
        var tmp = [], //12
			src = [], //16
			dst = [], //16
			mat = this.toArray(),
			i = 0;

        for (i = 0; i < 4; i++) {
            var i4 = i << 2;
            src[i] = mat[i4];
            src[i + 4] = mat[i4 + 1];
            src[i + 8] = mat[i4 + 2];
            src[i + 12] = mat[i4 + 3];
        }

        // calculate pairs for first 8 elements (cofactors)
        tmp[0] = src[10] * src[15];
        tmp[1] = src[11] * src[14];
        tmp[2] = src[9] * src[15];
        tmp[3] = src[11] * src[13];
        tmp[4] = src[9] * src[14];
        tmp[5] = src[10] * src[13];
        tmp[6] = src[8] * src[15];
        tmp[7] = src[11] * src[12];
        tmp[8] = src[8] * src[14];
        tmp[9] = src[10] * src[12];
        tmp[10] = src[8] * src[13];
        tmp[11] = src[9] * src[12];

        // calculate first 8 elements (cofactors)
        var src0 = src[0],
			src1 = src[1],
			src2 = src[2],
			src3 = src[3],
			src4 = src[4],
			src5 = src[5],
			src6 = src[6],
			src7 = src[7];
		dst[0] = tmp[0] * src5 + tmp[3] * src6 + tmp[4] * src7;
		dst[0] -= tmp[1] * src5 + tmp[2] * src6 + tmp[5] * src7;
		dst[1] = tmp[1] * src4 + tmp[6] * src6 + tmp[9] * src7;
		dst[1] -= tmp[0] * src4 + tmp[7] * src6 + tmp[8] * src7;
		dst[2] = tmp[2] * src4 + tmp[7] * src5 + tmp[10] * src7;
		dst[2] -= tmp[3] * src4 + tmp[6] * src5 + tmp[11] * src7;
		dst[3] = tmp[5] * src4 + tmp[8] * src5 + tmp[11] * src6;
		dst[3] -= tmp[4] * src4 + tmp[9] * src5 + tmp[10] * src6;
		dst[4] = tmp[1] * src1 + tmp[2] * src2 + tmp[5] * src3;
		dst[4] -= tmp[0] * src1 + tmp[3] * src2 + tmp[4] * src3;
		dst[5] = tmp[0] * src0 + tmp[7] * src2 + tmp[8] * src3;
		dst[5] -= tmp[1] * src0 + tmp[6] * src2 + tmp[9] * src3;
		dst[6] = tmp[3] * src0 + tmp[6] * src1 + tmp[11] * src3;
		dst[6] -= tmp[2] * src0 + tmp[7] * src1 + tmp[10] * src3;
		dst[7] = tmp[4] * src0 + tmp[9] * src1 + tmp[10] * src2;
		dst[7] -= tmp[5] * src0 + tmp[8] * src1 + tmp[11] * src2;

        // calculate pairs for second 8 elements (cofactors)
		tmp[0] = src2 * src7;
		tmp[1] = src3 * src6;
		tmp[2] = src1 * src7;
		tmp[3] = src3 * src5;
		tmp[4] = src1 * src6;
		tmp[5] = src2 * src5;
		tmp[6] = src0 * src7;
		tmp[7] = src3 * src4;
		tmp[8] = src0 * src6;
		tmp[9] = src2 * src4;
		tmp[10] = src0 * src5;
		tmp[11] = src1 * src4;

        // calculate second 8 elements (cofactors)
		src0 = src[8];
		src1 = src[9];
		src2 = src[10];
		src3 = src[11];
		src4 = src[12];
		src5 = src[13];
		src6 = src[14];
		src7 = src[15];
		dst[8] = tmp[0] * src5 + tmp[3] * src6 + tmp[4] * src7;
		dst[8] -= tmp[1] * src5 + tmp[2] * src6 + tmp[5] * src7;
		dst[9] = tmp[1] * src4 + tmp[6] * src6 + tmp[9] * src7;
		dst[9] -= tmp[0] * src4 + tmp[7] * src6 + tmp[8] * src7;
		dst[10] = tmp[2] * src4 + tmp[7] * src5 + tmp[10] * src7;
		dst[10] -= tmp[3] * src4 + tmp[6] * src5 + tmp[11] * src7;
		dst[11] = tmp[5] * src4 + tmp[8] * src5 + tmp[11] * src6;
		dst[11] -= tmp[4] * src4 + tmp[9] * src5 + tmp[10] * src6;
		dst[12] = tmp[2] * src2 + tmp[5] * src3 + tmp[1] * src1;
		dst[12] -= tmp[4] * src3 + tmp[0] * src1 + tmp[3] * src2;
		dst[13] = tmp[8] * src3 + tmp[0] * src0 + tmp[7] * src2;
		dst[13] -= tmp[6] * src2 + tmp[9] * src3 + tmp[1] * src0;
		dst[14] = tmp[6] * src1 + tmp[11] * src3 + tmp[3] * src0;
		dst[14] -= tmp[10] * src3 + tmp[2] * src0 + tmp[7] * src1;
		dst[15] = tmp[10] * src2 + tmp[4] * src0 + tmp[9] * src1;
		dst[15] -= tmp[8] * src1 + tmp[11] * src2 + tmp[5] * src0;

		var det = 1.0 / (src[0] * dst[0] + src[1] * dst[1] + src[2] * dst[2] + src[3] * dst[3]);
		for (i = 0, k = 0; i < 4; i++) {
			var m = this.matrix[i];
			for (var j = 0; j < 4; j++) {
				m[j] = dst[k++] * det;
			}
		}
		return this;
    },

    multiply: function(a) {
		if(typeof(a) == "number"){
			return new Matrix4x4(this).multiply(a);
		}
		//otherwise it should be a Matrix4x4
		return new Matrix4x4(this).multiplySelf(a);
    },

    multiplySelf: function(a) {
		var i = 0,
			m;
		if(typeof(a) == "number"){
			for (i = 0; i < 4; i++) {
				m = this.matrix[i];
				m[0] *= a;
				m[1] *= a;
				m[2] *= a;
				m[3] *= a;
			}
			return this;
		}
		//otherwise it should be a matrix4x4
		var mm0 = a.matrix[0],
			mm1 = a.matrix[1],
			mm2 = a.matrix[2],
			mm3 = a.matrix[3];
        for (i = 0; i < 4; i++) {
            m = this.matrix[i];
            for (var j = 0; j < 4; j++) {
                this.temp[j] = m[0] * mm0[j] + m[1] * mm1[j] + m[2] * mm2[j] + m[3] * mm3[j];
            }
            m[0] = this.temp[0];
            m[1] = this.temp[1];
            m[2] = this.temp[2];
            m[3] = this.temp[3];
        }
        return this;
    },
    /**
     * Applies rotation about arbitrary axis to matrix
     * 
     * @param axis
     * @param theta
     * @return rotation applied to this matrix
     */
    rotateAroundAxis: function(axis, theta) {
        var x, y, z, s, c, t, tx, ty;
        x = axis.x;
        y = axis.y;
        z = axis.z;
        s = Math.sin(theta);
        c = Math.cos(theta);
        t = 1 - c;
        tx = t * x;
        ty = t * y;
		_TEMP.set(
			tx * x + c, tx * y + s * z, tx * z - s * y, 0, tx * y - s * z,
			ty * y + c, ty * z + s * x, 0, tx * z + s * y, ty * z - s * x,
			t * z * z + c, 0, 0, 0, 0, 1
		);
        return this.multiplySelf(_TEMP);
    },

    /**
     * Applies rotation about X to this matrix.
     * 
     * @param theta
     *            rotation angle in radians
     * @return itself
     */
    rotateX: function(theta) {
        _TEMP.identity();
        _TEMP.matrix[1][1] = _TEMP.matrix[2][2] = Math.cos(theta);
        _TEMP.matrix[2][1] = Math.sin(theta);
        _TEMP.matrix[1][2] = -_TEMP.matrix[2][1];
        return this.multiplySelf(_TEMP);
    },

    /**
     * Applies rotation about Y to this matrix.
     * 
     * @param theta
     *            rotation angle in radians
     * @return itself
     */
    rotateY: function(theta) {
        _TEMP.identity();
        _TEMP.matrix[0][0] = _TEMP.matrix[2][2] = Math.cos(theta);
        _TEMP.matrix[0][2] = Math.sin(theta);
        _TEMP.matrix[2][0] = -_TEMP.matrix[0][2];
        return this.multiplySelf(_TEMP);
    },

    // Apply Rotation about Z to Matrix
    rotateZ: function(theta) {
        _TEMP.identity();
        _TEMP.matrix[0][0] = _TEMP.matrix[1][1] = Math.cos(theta);
        _TEMP.matrix[1][0] = Math.sin(theta);
        _TEMP.matrix[0][1] = -_TEMP.matrix[1][0];
        return this.multiplySelf(_TEMP);
    },

    scale: function(a,b,c) {
		return new Matrix4x4(this).scaleSelf(a,b,c);
    },

    scaleSelf: function(a,b,c) {
		if(a instanceof Object){
			b = a.y;
			c = a.z;
			a = a.x;
		} else if(b === undefined || c === undefined) {
			b = a;
			c = a;
		}
        _TEMP.identity();
        _TEMP.matrix[0][0] = a;
        _TEMP.matrix[1][1] = b;
        _TEMP.matrix[2][2] = c;
        return this.multiplySelf(_TEMP);
    },

	set: function(a,b,c, d, e,f,g, h, i, j, k, l, m, n, o, p) {
		var mat;
		if(typeof(a) == "number"){
			mat = this.matrix[0];
			mat[0] = a;
			mat[1] = b;
			mat[2] = c;
			mat[3] = d;
			mat = this.matrix[1];
			mat[0] = e;
			mat[1] = f;
			mat[2] = g;
			mat[3] = h;
			mat = this.matrix[2];
			mat[0] = i;
			mat[1] = j;
			mat[2] = k;
			mat[3] = l;
			mat = this.matrix[3];
			mat[0] = m;
			mat[1] = n;
			mat[2] = o;
			mat[3] = p;
		} else {
			//it must be a matrix4x4
			for (var it_n = 0; it_n < 4; it_n++) {
	            mat = this.matrix[it_n];
				var mat_n = mat.matrix[it_n];
				mat[0] = mat_n[0];
				mat[1] = mat_n[1];
				mat[2] = mat_n[2];
				mat[3] = mat_n[3];
			}
		}
		return this;
    },

    setFrustrum: function(left,right,top,bottom,near,far){
    	var rl = (right - left),
    		tb = (top - bottom),
    		fn = (far - near);
    	

    	return this.set(
    		(2.0 * near) / rl,
    		0,
    		(left + right) / rl,
    		0,
    		0,
    		(2.0 * near) / tb,
    		(top + bottom) / tb,
    		0,
    		0,
    		0,
    		-(near + far) / fn,
    		(-2 * near * far) / fn,
    		0,
    		0,
    		-1,
    		0
    	);	
    },

    setOrtho: function(left,right,top,bottom,near,far){
    	var mat = [
    		2.0 / (right - left),
    		0, 
    		0, 
    		(left + right) / (right - left),
            0, 
            2.0 / (top - bottom), 
            0, 
            (top + bottom) / (top - bottom), 
            0,
            0,
            -2.0 / (far - near), 
            (far + near) / (far - near), 
            0, 
            0, 
            0, 
            1
    	];

    	return this.set.apply(this,mat);
    },

    setPerspective: function(fov,aspect,near,far){
    	var y = near * Math.tan(0.5 * mathUtils.radians(fov)),
    		x = aspect * y;
    	return this.setFrustrum(-x,x,y,-y,near,far);	
    },

    setPosition: function(x,y,z){
    	this.matrix[0][3] = x;
    	this.matrix[1][3] = y;
    	this.matrix[2][3] = z;
    	return this;	
    },

    setScale: function(sX,sY,sZ){
    	this.matrix[0][0] = sX;
    	this.matrix[1][1] = sY;
    	this.matrix[2][2] = sZ;
    	return this;	
    },

   
    sub: function(m) {
		return new Matrix4x4(this).subSelf(m);
    },

    subSelf: function(mat) {
        for (var i = 0; i < 4; i++) {
            var m = this.matrix[i];
            var n = mat.matrix[i];
            m[0] -= n[0];
            m[1] -= n[1];
            m[2] -= n[2];
            m[3] -= n[3];
        }
        return this;
    },

    /**
     * Copies all matrix elements into an linear array.
     * 
     * @param result
     *            array (or null to create a new one)
     * @return matrix as 16 element array
     */
    toArray: function(result) {
        if (result === undefined) {
            result = [];
        }
        for (var i = 0, k = 0; i < 4; i++) {
            var m = this.matrix[i];
            for (var j = 0; j < 4; j++) {
                result[k++] = m[j];
            }
        }
        return result;
    },

    toFloatArray:function(result) {
        return new Float32Array(this.toArray(result));
    },

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    toString: function() {
        return "| " + this.matrix[0][0] + " " + this.matrix[0][1] + " " + this.matrix[0][2] + " " + this.matrix[0][3] + " |\n" + "| " + this.matrix[1][0] + " " + this.matrix[1][1] + " " + this.matrix[1][2] + " " + this.matrix[1][3] + " |\n" + "| " + this.matrix[2][0] + " " + this.matrix[2][1] + " " + this.matrix[2][2] + " " + this.matrix[2][3] + " |\n" + "| " + this.matrix[3][0] + " " + this.matrix[3][1] + " " + this.matrix[3][2] + " " + this.matrix[3][3] + " |";
    },

    toTransposedFloatArray: function(result) {
        if (result === undefined) {
            result = [];
        }
        for (var i = 0, k = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                result[k++] = this.matrix[j][i];
            }
        }
        return result;
    },

    translate: function(dx,dy,dz) {
		return new Matrix4x4(this).translateSelf(dx, dy, dz);
    },

    translateSelf: function( dx, dy, dz) {
		if(dx instanceof Object){
			dy = dx.y;
			dz = dx.z;
			dx = dx.x;
		}
		_TEMP.identity();
		_TEMP.setPosition(dx,dy,dz);
		return this.multiplySelf(_TEMP);
    },

    /**
     * Converts the matrix (in-place) between column-major to row-major order
     * (and vice versa).
     * 
     * @return itself
     */
    transpose: function() {
        return this.set(
			this.matrix[0][0], this.matrix[1][0], this.matrix[2][0], this.matrix[3][0],
			this.matrix[0][1], this.matrix[1][1], this.matrix[2][1], this.matrix[3][1],
			this.matrix[0][2], this.matrix[1][2], this.matrix[2][2], this.matrix[3][2],
			this.matrix[0][3], this.matrix[1][3], this.matrix[2][3], this.matrix[3][3]
		);
	}
};

//private temp matrix
var _TEMP = new Matrix4x4();

module.exports = Matrix4x4;

});

define('toxi/geom/Quaternion',["require", "exports", "module", "../math/mathUtils","./Matrix4x4"], function(require, exports, module) {

var mathUtils = require('../math/mathUtils'),
	Matrix4x4 = require('./Matrix4x4');

/**
 * @class
 * @member toxi
 */
var	Quaternion = function (qw,vx,y,z){
	if(arguments.length == 4){
		this.w = qw;
		this.x = vx;
		this.y = y;
		this.z = z;
	} else if(arguments.length == 2){
		this.x = vx.x;
		this.y = vx.y;
		this.z = vx.z;
		this.w = qw;
	} else if(arguments.length == 1) {
		this.w = q.w;
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
	}
};


Quaternion.prototype = {
	add: function(q){
		return new Quaternion(this.x + q.x, this.y + q.y, this.z + q.z, this.w + q.w);
	},
	addSelf: function(q){
		this.x += q.x;
		this.y += q.y;
		this.z += q.z;
		return this;
	},
	copy: function(){
		return new Quaternion(this.w,this.x,this.y,this.z);
	},
	dot: function(q){
		return (this.x * q.x) + (this.y * q.y) + (this.z * q.z) + (this.w * q.w);
	},
	getConjugate: function(){
		var q = new Quaternion();
		q.x = -this.x;
		q.y = -this.y;
		q.z = -this.z;
		q.w = w;
		return q;
	},
	identity: function(){
		this.w = 1.0;
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
		return this;
	},
	interpolateTo: function(target,t,is){
		return (arguments.length == 3) ? this.copy().interpolateTo(target,is.interpolate(0,1,t)) : this.copy().interpolateToSelf(target,t);
	},
	interpolateToSelf: function(target,t,is){
		if(arguments.length == 3){
			t = is.interpolate(0,1,t);
		}
		var scale,
			invscale,
			dot = mathUtils.clip(this.dot(target),-1,1);
			if((1.0-dot) >= mathUtils.EPS){
				var theta = Math.acos(dot);
				var invsintheta = 1.0 / Math.sin(theta);
				scale = (Math.sin(theta *(1.0 - t)) * invsintheta);
				invscale = (Math.sin(theta * t) * invsintheta);
			} else {
				scale = 1 - t;
				invscale = t;
			}
			if(dot < 0.0){
				this.w = scale * this.w - invscale * target.w;
				this.x = scale * this.x - invscale * target.x;
				this.y = scale * this.y - invscale * target.y;
				this.z = scale * this.z - invscale * target.z;
			} else {
				this.w = scale * w + invscale * target.w;
				this.x = scale * x + invscale * target.x;
				this.y = scale * y + invscale * target.y;
				this.z = scale * z + invscale * target.z;
			}
			return this;
	},
	magnitude: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	},
	multiply: function(q2){
		var res = new Quaternion();
		res.w = this.w * q2.w - x * q2.x - y * q2.y - z * q2.z;
		res.x = this.w * q2.x + x * q2.w + y * q2.z - z * q2.y;
		res.y = this.w * q2.y + y * q2.w + z * q2.x - x * q2.z;
		res.z = this.w * q2.z + z * q2.w + x * q2.y - y * q2.x;
		
		return res;
	},
	normalize: function(){
		var mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
		if(mag > mathUtils.EPS){
			mag = 1 / mag;
			this.x *= mag;
			this.y *= mag;
			this.z *= mag;
			this.w *= mag;
		}
		return this;
	},
	scale: function(t){
		return new Quaternion(this.x * t, this.y * t, this.z * t, this.w * t);
	},
	scaleSelf: function(t){
		this.x *= t;
		this.y *= t;
		this.z *= t;
		this.w *= t;
		return this;
	},
	set: function(w,x,y,z){
		if(arguments.length == 4){
			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;
		} else if(arguments.length == 2){
			this.w = w;
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
		}
		else { //must be 1
			this.w = q.w;
			this.x = q.x;
			this.y = q.y;
			this.z = q.z;
		}
		return this;
	},
	sub: function(q){
		return new Quaternion(this.x - q.x, this.y - q.y, this.z - q.z, this.w - q.w);
	},
	subSelf: function(q){
		this.x -= q.x;
		this.y -= q.y;
		this.z -= q.z;
		this.w -= q.w;
		return this;
	},
	toArray: function(){
		return [this.w,this.x,this.y,this.z];
	},
	toAxisAngle: function(){
		var res = [];
		var sa = Math.sqrt(1.0 - this.w * this.w);
		if(sa < mathUtils.EPS){
			sa = 1.0;
		} else {
			sa = 1.0 / sa;
		}
		res[0] = Math.acos(this.w) * 2.0;
		res[1] = this.x * sa;
		res[2] = this.y * sa;
		res[3] = this.z * sa;
		return res;
	},
	toMatrix4x4: function(result){
		if(result === undefined){
			result = new Matrix4x4();
		}
		var x2 = this.x + this.x;
		var y2 = this.y + this.y;
		var z2 = this.z + this.z;
		var xx = this.x * x2;
		var xy = this.x * y2;
		var xz = this.x * z2;
		var yy = this.y * y2;
		var yz = this.y * z2;
		var zz = this.z * z2;
		var wx = this.w * x2;
		var wy = this.w * y2;
		var wz = this.w * z2;
		
		var st = x2 +','+y2+','+z2+','+xx+','+xy+','+xz+','+yy+','+yz+','+zz+','+wx+','+wy+','+wz;
		return result.set(
			1 - (yy + zz), xy - wz, xz + wy, 0, xy + wz,
			1 - (xx + zz), yz - wx, 0, xz - wy, yz + wx, 1 - (xx + yy), 0,
			0, 0, 0, 1
		);
	},
	toString: function(){
		return "{axis: ["+this.x+","+this.y+","+this.z+"], w: "+this.w+"}";
	}
	
};

Quaternion.DOT_THRESHOLD = 0.9995;

Quaternion.createFromAxisAngle = function(axis,angle){
	angle *= 0.5;
	var sin = mathUtils.sin(angle),
		cos = mathUtils.cos(angle),
		q = new Quaternion(cos,axis.getNormalizedTo(sin));
	return q;
};

Quaternion.createFromEuler = function(pitch,yaw,roll){
	pitch *= 0.5;
	yaw *=0.5;
	roll *= 0.5;
	
	var sinPitch = mathUtils.sin(pitch),
		cosPitch = mathUtils.cos(pitch),
		sinYaw = mathUtils.sin(yaw),
		cosYaw = mathUtils.cos(yaw),
		sinRoll = mathUtils.sin(roll),
		cosRoll = mathUtils.cos(roll);
	
	var cosPitchCosYaw = cosPitch * cosYaw,
		sinPitchSinYaw = sinPitch * sinYaw;
		
		var q = new Quaternion();
		q.x = sinRoll * cosPitchCosYaw - cosRoll * sinPitchSinYaw;
		q.y = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
		q.z = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
		q.w = cosRoll * cosPitchCosYaw + sinRoll * sinPitchSinYaw;
		
		return q;
};

Quaternion.createFromMatrix = function(m){
	var s = 0.0;
	var q = [];
	var trace = m.matrix[0][0] + m.matrix[1][1] + m.matrix[2][2];
	
	if(trace > 0.0){
		s = Math.sqrt(trace + 1.0);
		q[3] = s * 0.5;
		s = 0.5 / s;
		q[0] = (m.matrix[1][2] - m.matrix[2][1] * s);
		q[1] = (m.matrix[2][0] - m.matrix[0][2] * s);
		q[2] = (m.matrix[0][1] - m.matrix[1][0] * s);
	} else {
		
		var nxt = [ 1, 2, 0 ];
        var i = 0, j = 0, k = 0;

        if (m.matrix[1][1] > m.matrix[0][0]) {
            i = 1;
        }

        if (m.matrix[2][2] > m.matrix[i][i]) {
            i = 2;
        }

        j = nxt[i];
        k = nxt[j];
        s = Math.sqrt((m.matrix[i][i] - (m.matrix[j][j] + m.matrix[k][k])) + 1.0);

        q[i] = s * 0.5;
        s = 0.5 / s;
        q[3] = (m.matrix[j][k] - m.matrix[k][j]) * s;
        q[j] = (m.matrix[i][j] + m.matrix[j][i]) * s;
        q[k] = (m.matrix[i][k] + m.matrix[k][i]) * s;
    }
    
     return new Quaternion(q[3],q[0],q[1],q[2]);
 };
 
 Quaternion.getAlignmentQuat = function(dir,forward){
		var target = dir.getNormalized(),
			axis = forward.cross(target),
			length = axis.magnitude() + 0.0001,
			angle = Math.atan2(length, forward.dot(target));
        return this.createFromAxisAngle(axis, angle);
 };

 module.exports = Quaternion;
});

define('toxi/geom/Triangle3D',["require", "exports", "module", "../math/mathUtils","./Vec3D","./Line3D","./AABB"], function(require, exports, module) {

var mathUtils = require('../math/mathUtils'),
    Vec3D = require('./Vec3D'),
    Line3D = require('./Line3D'),
    AABB = require('./AABB');

/**
 * @class
 * @member toxi
 * @param {toxi.Vec3D} a
 * @param {toxi.Vec3D} b
 * @param {toxi.Vec3D} c
 */
var Triangle3D = function(a,b,c){
	if(arguments.length == 3){
		this.a = a;
		this.b = b;
		this.c = c;
	}
};

Triangle3D.createEquilateralFrom = function(a, b) {
    var c = a.interpolateTo(b, 0.5);
    var dir = b.sub(a);
    var n = a.cross(dir.normalize());
    c.addSelf(n.normalizeTo(dir.magnitude() * mathUtils.SQRT3 / 2));
    return new Triangle3D(a, b, c);
};

Triangle3D.isClockwiseInXY = function(a, b, c) {
	var determ = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
	return (determ < 0.0);
};

Triangle3D.isClockwiseInXZ = function(a, b,c) {
	var determ = (b.x - a.x) * (c.z - a.z) - (c.x - a.x) * (b.z - a.z);
	return (determ < 0.0);
};

Triangle3D.isClockwiseInYZ = function(a,b,c) {
    var determ = (b.y - a.y) * (c.z - a.z) - (c.y - a.y) * (b.z - a.z);
    return (determ < 0.0);
};


Triangle3D.prototype = {
	closestPointOnSurface: function(p) {
        var ab = this.b.sub(this.a);
        var ac = this.c.sub(this.a);
        var bc = this.c.sub(this.b);

        var pa = p.sub(this.a);
        var pb = p.sub(this.b);
        var pc = p.sub(this.c);

        var ap = a.sub(this.p);
        var bp = b.sub(this.p);
        var cp = c.sub(this.p);

        // Compute parametric position s for projection P' of P on AB,
        // P' = A + s*AB, s = snom/(snom+sdenom)
        var snom = pa.dot(ab);

        // Compute parametric position t for projection P' of P on AC,
        // P' = A + t*AC, s = tnom/(tnom+tdenom)
        var tnom = pa.dot(ac);

        if (snom <= 0.0 && tnom <= 0.0) {
            return this.a; // Vertex region early out
        }

        var sdenom = pb.dot(this.a.sub(this.b));
        var	tdenom = pc.dot(this.a.sub(this.c));

        // Compute parametric position u for projection P' of P on BC,
        // P' = B + u*BC, u = unom/(unom+udenom)
        var unom = pb.dot(bc);
        var udenom = pc.dot(this.b.sub(this.c));

        if (sdenom <= 0.0 && unom <= 0.0) {
            return this.b; // Vertex region early out
        }
        if (tdenom <= 0.0 && udenom <= 0.0) {
            return this.c; // Vertex region early out
        }

        // P is outside (or on) AB if the triple scalar product [N PA PB] <= 0
        var n = ab.cross(ac);
        var vc = n.dot(ap.crossSelf(bp));

        // If P outside AB and within feature region of AB,
        // return projection of P onto AB
        if (vc <= 0.0 && snom >= 0.0 && sdenom >= 0.0) {
            // return a + snom / (snom + sdenom) * ab;
            return this.a.add(ab.scaleSelf(snom / (snom + sdenom)));
        }

        // P is outside (or on) BC if the triple scalar product [N PB PC] <= 0
        var va = n.dot(bp.crossSelf(cp));
        // If P outside BC and within feature region of BC,
        // return projection of P onto BC
        if (va <= 0.0 && unom >= 0.0 && udenom >= 0.0) {
            // return b + unom / (unom + udenom) * bc;
            return this.b.add(bc.scaleSelf(unom / (unom + udenom)));
        }

        // P is outside (or on) CA if the triple scalar product [N PC PA] <= 0
        var vb = n.dot(cp.crossSelf(ap));
        // If P outside CA and within feature region of CA,
        // return projection of P onto CA
        if (vb <= 0.0 && tnom >= 0.0 && tdenom >= 0.0) {
            // return a + tnom / (tnom + tdenom) * ac;
            return this.a.add(ac.scaleSelf(tnom / (tnom + tdenom)));
        }

        // P must project inside face region. Compute Q using barycentric
        // coordinates
        var u = va / (va + vb + vc);
        var v = vb / (va + vb + vc);
        var w = 1.0 - u - v; // = vc / (va + vb + vc)
        // return u * a + v * b + w * c;
        return this.a.scale(u).addSelf(this.b.scale(v)).addSelf(this.c.scale(w));
    },
    
    computeCentroid: function() {
        this.centroid = this.a.add(this.b).addSelf(this.c).scaleSelf(1 / 3);
        return this.centroid;
    },
    
    computeNormal: function() {
        this.normal = this.a.sub(this.c).crossSelf(this.a.sub(this.b)).normalize();
        return this.normal;
    },
    
    containsPoint: function(p) {
        if (p.equals(this.a) || p.equals(this.b) || p.equals(this.c)) {
            return true;
        }
        var v1 = p.sub(this.a).normalize();
        var v2 = p.sub(this.b).normalize();
        var v3 = p.sub(this.c).normalize();

        var total_angles = Math.acos(v1.dot(v2));
        total_angles += Math.acos(v2.dot(v3));
        total_angles += Math.acos(v3.dot(v1));

        return (mathUtils.abs(total_angles - mathUtils.TWO_PI) <= 0.005);
    },

   flipVertexOrder: function() {
        var t = this.a;
        this.a = this.c;
        this.c = this.t;
        return this;
    },

    fromBarycentric: function(p) {
        return new Vec3D(this.a.x * p.x + this.b.x * p.y + this.c.x * p.z, this.a.y * p.x + this.b.y * p.y + this.c.y * p.z, this.a.z * p.x + this.b.z * p.y + this.c.z * p.z);
    },

    getBoundingBox: function() {
        var min = Vec3D.min(Vec3D.min(this.a, this.b), this.c);
        var max = Vec3D.max(Vec3D.max(this.a, this.b), this.c);
        return AABB.fromMinMax(min, max);
    },
    getClosestPointTo: function(p) {
        var edge = new Line3D(this.a, this.b);
        var Rab = edge.closestPointTo(p);
        var Rbc = edge.set(this.b, this.c).closestPointTo(p);
        var Rca = edge.set(this.c, this.a).closestPointTo(p);

        var dAB = p.sub(Rab).magSquared();
        var dBC = p.sub(Rbc).magSquared();
        var dCA = p.sub(Rca).magSquared();

        var min = dAB;
        var result = Rab;

        if (dBC < min) {
            min = dBC;
            result = Rbc;
        }
        if (dCA < min) {
            result = Rca;
        }

        return result;
    },

    isClockwiseInXY: function() {
        return Triangle3D.isClockwiseInXY(this.a, this.b, this.c);
    },

    isClockwiseInXZ: function() {
        return Triangle3D.isClockwiseInXY(this.a, this.b, this.c);
    },

    isClockwiseInYZ: function() {
        return Triangle3D.isClockwiseInXY(this.a, this.b, this.c);
    },
    
    set: function(a2, b2, c2) {
        this.a = a2;
        this.b = b2;
        this.c = c2;
    },

    toBarycentric: function(p) {
        var  e = b.sub(this.a).cross(this.c.sub(this.a));
        var  n = e.getNormalized();

        // Compute twice area of triangle ABC
        var areaABC = n.dot(e);
        // Compute lambda1
        var areaPBC = n.dot(this.b.sub(p).cross(this.c.sub(p)));
        var l1 = areaPBC / areaABC;

        // Compute lambda2
        var areaPCA = n.dot(this.c.sub(p).cross(this.a.sub(p)));
        var l2 = areaPCA / areaABC;

        // Compute lambda3
        var l3 = 1.0 - l1 - l2;

        return new Vec3D(l1, l2, l3);
    },

    toString: function() {
        return "Triangle: " + this.a + "," + this.b + "," + this.c;
    }

};

module.exports = Triangle3D;
});

define('toxi/geom/mesh/Face',["require", "exports", "module", "../Triangle3D"], function(require, exports, module) {

var Triangle3D = require('../Triangle3D');

/** 
 * @class
 * @member toxi
 */
var Face = function(a,b,c,uvA,uvB,uvC) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normal = this.a.sub(this.c).crossSelf(this.a.sub(this.b)).normalize();
    this.a.addFaceNormal(this.normal);
    this.b.addFaceNormal(this.normal);
    this.c.addFaceNormal(this.normal);
    
    if(uvA !== undefined){
		this.uvA = uvA;
		this.uvB = uvB;
		this.uvC = uvC;
    }
};

Face.prototype = {
	computeNormal: function() {
        this.normal = this.a.sub(this.c).crossSelf(this.a.sub(this.b)).normalize();
    },

	flipVertexOrder: function() {
        var t = this.a;
        this.a = this.b;
        this.b = t;
        this.normal.invert();
    },
	
	getCentroid: function() {
        return this.a.add(this.b).addSelf(this.c).scale(1.0 / 3);
    },
    
    getClass: function(){
		return "Face";
	},

    getVertices: function(verts) {
        if (verts !== undefined) {
            verts[0] = this.a;
            verts[1] = this.b;
            verts[2] = this.c;
        } else {
            verts = [ this.a, this.b, this.c ];
        }
        return verts;
    },

    toString: function() {
        return this.getClass() + " " + this.a + ", " + this.b + ", " + this.c;
    },

    /**
     * Creates a generic {@link Triangle3D} instance using this face's vertices.
     * The new instance is made up of copies of the original vertices and
     * manipulating them will not impact the originals.
     * 
     * @return triangle copy of this mesh face
     */
    toTriangle: function() {
        return new Triangle3D(this.a.copy(), this.b.copy(), this.c.copy());
    }
};

module.exports = Face;
});

define('toxi/geom/mesh/Vertex',["require", "exports", "module", "../../internals","../Vec3D"], function(require, exports, module) {

var extend = require('../../internals').extend,
	Vec3D = require('../Vec3D');

/**
 * @class
 * @member toxi
 * @augments toxi.Vec3D
 */
var	Vertex = function(v,id) {
        Vec3D.apply(this,[v]);
        this.id = id;
        this.normal = new Vec3D();
};
extend(Vertex,Vec3D);

Vertex.prototype.addFaceNormal = function(n) {
    this.normal.addSelf(n);
};

Vertex.prototype.clearNormal = function() {
    this.normal.clear();
};

Vertex.prototype.computeNormal = function() {
    this.normal.normalize();
};

Vertex.prototype.toString = function() {
    return this.id + ": p: " + this.parent.toString.call(this) + " n:" + this.normal.toString();
};

module.exports = Vertex;
});

define('toxi/geom/mesh/TriangleMesh',[
	"require", 
	"exports", 
	"module", 
	"../../math/mathUtils",
	"../Matrix4x4",
	"./Face",
	"../Vec3D",
	"../AABB",
	"../Sphere",
	"../Triangle3D",
	"../Quaternion",
	"./Vertex"
], function(require, exports, module) {

var	mathUtils = require('../../math/mathUtils'),
	Matrix4x4 = require('../Matrix4x4'),
	Face = require('./Face'),
	Vec3D = require('../Vec3D'),
	AABB = require('../AABB'),
	Sphere = require('../Sphere'),
	Triangle3D = require('../Triangle3D'),
	Quaternion = require('../Quaternion'),
	Vertex = require('./Vertex');



/**
 * @class
 * @member toxi
 */
var	TriangleMesh = function(name,numV,numF){
	if(name === undefined)name = "untitled";
	if(numV === undefined)numV = TriangleMesh.DEFAULT_NUM_VERTICES;
	if(numF === undefined)numF = TriangleMesh.DEFAULT_NUM_FACES;
	this.setName(name);
	this.matrix = new Matrix4x4();
	this.vertices = [];
	this.__verticesObject = {};
	this.faces = [];
	this.numVertices = 0;
	this.numFaces = 0;
	this.uniqueVertexID = -1;
	return this;
};


//statics
TriangleMesh.DEFAULT_NUM_VERTICES = 1000;
TriangleMesh.DEFAULT_NUM_FACES = 3000;
TriangleMesh.DEFAULT_STRIDE = 4;

TriangleMesh.prototype = {
	addFace: function(a,b,c,n,uvA,uvB,uvC){
	    if(uvC === undefined){ //then it wasnt the 7 param method
	        if(uvB === undefined){ //then it wasnt the 6 param method
	            //its either the 3 or 4 param method
	            if(uvA === undefined){
	                //3 param method
	                n = undefined;
	                uvA = undefined;
	                uvB = undefined;
	                uvC = undefined;
	            } else {
	                //4 param method
	                uvA = undefined;
	                uvB = undefined;
	                uvC = undefined;
	            }
	        } else {
	            //6 param method
	            //pass down the chain
	            uvC = uvB;
	            uvB = uvA;
	            uvA = n;
	        }
	    }
	    //7 param method
	    var va = this.__checkVertex(a);
	    var vb = this.__checkVertex(b);
	    var vc = this.__checkVertex(c);
	
	    if(va.id === vb.id || va.id === vc.id || vb.id === vc.id){
	        //console.log("ignoring invalid face: "+a + ", " +b+ ", "+c);
	    } else {
	        if(n !== undefined){
	            var nc = va.sub(vc).crossSelf(va.sub(vb));
	            if(n.dot(nc)<0){
	                var t = va;
	                va = vb;
	                vb = t;
	            }
	        }
	        var f = new Face(va,vb,vc,uvA,uvB,uvC);
	        //console.log(f.toString());
	        this.faces.push(f);
	        this.numFaces++;
	    }
	    return this;
	},
	
	addMesh: function(m){
	    var l = m.getFaces().length;
	    for(var i=0;i<l;i++){
	        var f = m.getFaces()[i];
	        this.addFace(f.a,f.b,f.c);
	    }
	    return this;
	},
	
	center: function(origin){
	    this.computeCentroid();
	    var delta = (origin !== undefined) ? origin.sub(this.centroid) : this.centroid.getInverted();
	    var l = this.vertices.length;
	    for(var i=0;i<l;i++){
	        var v = this.vertices[i];
	        v.addSelf(delta);
	    }
	    this.getBoundingBox();
	    return this.bounds;
	},
	
	__checkVertex: function(v){
		var vString = v.toString();
	    var vertex = this.__verticesObject[vString];
	    if(vertex === undefined){
	        vertex = this.createVertex(v,this.uniqueVertexID++);
	        this.__verticesObject[vString] = vertex;
	        this.vertices.push(vertex);
	        this.numVertices++;
	    }
	    return vertex;
	},
	
	clear: function(){
	    this.vertices = [];
	    this.faces = [];
	    this.bounds = undefined;
	    this.numVertices = 0;
	    this.numFaces = 0;
	    return this;
	},
	
	computeCentroid: function(){
	    this.centroid.clear();
	    var l = this.vertices.length;
	    for(var i=0;i<l;i++){
	        this.centroid.addSelf(this.vertices[i]);
	    }
	    return this.centroid.scaleSelf(1.0/this.numVertices).copy();
	},
	
	computeFaceNormals: function(){
	    var l = this.faces.length;
	    for(var i=0;i<l;i++){
	        this.faces[i].computeNormal();
	    }
	},
	
	computeVertexNormals: function(){
	    var l = this.vertices.length,
	        i = 0;
	    for(i=0;i<l;i++){
	        this.vertices[i].clearNormal();
	    }
	    l = this.faces.length;
	    for(i=0;i<l;i++){
	        var f = this.faces[i];
	        f.a.addFaceNormal(f);
	        f.b.addFaceNormal(f);
	        f.c.addFaceNormal(f);
	    }
	    l = this.vertices.length;
	    for(i=0;i<l;i++){
	        this.vertices[i].computeNormal();
	    }
	    return this;
	},
	
	copy: function(){
	    var m = new TriangleMesh(this.name+"-copy",this.numVertices,this.numFaces);
	    var l = this.faces.length;
	    for(var i=0;i<l;i++){
	        var f = this.faces[i];
	        m.addFace(f.a,f.b,f.c,f.normal,f.uvA,f.uvB,f.uvC);
	    }
	    return m;
	},
	
	createVertex: function(v,id){
	    return new Vertex(v,id);
	},
	
	faceOutwards: function(){
	    this.computeCentroid();
	    var l = this.faces.length;
	    for(var i=0;i<l;i++){
	        var f = this.faces[i];
	        var n = f.getCentroid().sub(this.centroid);
	        var dot = n.dot(f.normal);
	        if(dot <0) {
	            f.flipVertexOrder();
	        }
	    }
	    return this;
	},
	
	flipVertexOrder: function(){
	    var l = this.faces.length;
	    for(var i=0;i<l;i++){
	        var f = this.faces[i];
	        var t = f.a;
	        f.a = f.b;
	        f.b = t;
	        f.normal.invert();
	    }
	    return this;
	},
	
	flipYAxis: function(){
	    this.transform(new Matrix4x4().scaleSelf(1,-1,1));
	    this.flipVertexOrder();
	    return this;
	},
	
	getBoundingBox:function(){
	    var minBounds = Vec3D.MAX_VALUE.copy();
	    var maxBounds = Vec3D.MIN_VALUE.copy();
	    var l = this.vertices.length;

	    for(var i=0;i<l;i++){
	    	var v = this.vertices[i];
	        minBounds.minSelf(v);
	        maxBounds.maxSelf(v);
	    }
	    this.bounds = AABB.fromMinMax(minBounds,maxBounds);
	    return this.bounds;
	},
	
	getBoundingSphere:function(){
	    var radius = 0;
	    this.computeCentroid();
	    var l = this.vertices.length;
	    for(var i=0;i<l;i++){
	        var v = this.vertices[i];
	        radius = mathUtils.max(radius,v.distanceToSquared(this.centroid));
	    }
	    return new Sphere(this.centroid,Math.sqrt(radius));
	},
	
	getClosestVertexToPoint: function(p){
	    var closest,
	        minDist = Number.MAX_VALUE,
	        l = this.vertices.length;
	    for(var i=0;i<l;i++){
	        var v = this.vertices[i];
	        var d = v.distanceToSquared(p);
	        if(d<minDist){
	            closest = v;
	            minDist = d;
	        }
	    }
	    return closest;
	},
	
	/**
	 * Creates an array of unravelled normal coordinates. For each vertex the
	 * normal vector of its parent face is used. This method can be used to
	 * translate the internal mesh data structure into a format suitable for
	 * OpenGL Vertex Buffer Objects (by choosing stride=4). For more detail,
	 * please see {@link #getMeshAsVertexArray(float[], int, int)}
	 * 
	 * @see #getMeshAsVertexArray(float[], int, int)
	 * 
	 * @param normals
	 *            existing float array or null to automatically create one
	 * @param offset
	 *            start index in array to place normals
	 * @param stride
	 *            stride/alignment setting for individual coordinates (min value
	 *            = 3)
	 * @return array of xyz normal coords
	 */
	getFaceNormalsAsArray: function(normals, offset, stride) {
	    if(arguments.length === 0){
	        normals = undefined;
	        offset = 0;
	        stride = TriangleMesh.DEFAULT_STRIDE;
	    } else if(arguments.length == 1 && arguments[0] instanceof Object){ //options object
	        var opts = arguments[0];
	        normals = opts.normals;
	        offset = opts.offset;
	        stride = opts.stride;
	    }
	    stride = mathUtils.max(stride, 3);
	    if (normals === undefined) {
	        normals = [];
	    }
	    var i = offset;
	    var l = this.faces.length;
	    for (var j=0;j<l;j++) {
	        var f = this.faces[j];
	        normals[i] = f.normal.x;
	        normals[i + 1] = f.normal.y;
	        normals[i + 2] = f.normal.z;
	        i += stride;
	        normals[i] = f.normal.x;
	        normals[i + 1] = f.normal.y;
	        normals[i + 2] = f.normal.z;
	        i += stride;
	        normals[i] = f.normal.x;
	        normals[i + 1] = f.normal.y;
	        normals[i + 2] = f.normal.z;
	        i += stride;
	    }
	    return normals;
	},
	
	getFaces: function() {
	    return this.faces;
	},
	
	/**
	 * Builds an array of vertex indices of all faces. Each vertex ID
	 * corresponds to its position in the {@link #vertices} HashMap. The
	 * resulting array will be 3 times the face count.
	 * 
	 * @return array of vertex indices
	 */
	getFacesAsArray: function() {
	    var faceList = [];
	    var i = 0;
	    var l = this.faces.length;
	    for (var j=0;j<l;j++) {
	        var f = this.faces[j];
	        faceList[i++] = f.a.id;
	        faceList[i++] = f.b.id;
	        faceList[i++] = f.c.id;
	    }
	    return faceList;
	},
	
	getIntersectionData: function() {
	    return this.intersector.getIntersectionData();
	},
	
	
	/**
	 * Creates an array of unravelled vertex coordinates for all faces. This
	 * method can be used to translate the internal mesh data structure into a
	 * format suitable for OpenGL Vertex Buffer Objects (by choosing stride=4).
	 * The order of the array will be as follows:
	 * 
	 * <ul>
	 * <li>Face 1:
	 * <ul>
	 * <li>Vertex #1
	 * <ul>
	 * <li>x</li>
	 * <li>y</li>
	 * <li>z</li>
	 * <li>[optional empty indices to match stride setting]</li>
	 * </ul>
	 * </li>
	 * <li>Vertex #2
	 * <ul>
	 * <li>x</li>
	 * <li>y</li>
	 * <li>z</li>
	 * <li>[optional empty indices to match stride setting]</li>
	 * </ul>
	 * </li>
	 * <li>Vertex #3
	 * <ul>
	 * <li>x</li>
	 * <li>y</li>
	 * <li>z</li>
	 * <li>[optional empty indices to match stride setting]</li>
	 * </ul>
	 * </li>
	 * </ul>
	 * <li>Face 2:
	 * <ul>
	 * <li>Vertex #1</li>
	 * <li>...etc.</li>
	 * </ul>
	 * </ul>
	 * 
	 * @param verts
	 *            an existing target array or null to automatically create one
	 * @param offset
	 *            start index in arrtay to place vertices
	 * @param stride
	 *            stride/alignment setting for individual coordinates
	 * @return array of xyz vertex coords
	 */
	getMeshAsVertexArray: function(verts, offset, stride) {
	    if(verts ===undefined){
	        verts = undefined;
	    }
	    if(offset === undefined){ 
	        offset = 0;
	    }
	    if(stride === undefined){
	        stride = TriangleMesh.DEFAULT_STRIDE;
	    }
	    stride = mathUtils.max(stride, 3);
	    if (verts === undefined) {
	        verts = [];
	    }
	    var i = 0,//offset
	        l = this.faces.length;
	    for (var j=0;j<l;++j) {
	        var f = this.faces[j];
	        verts[i] = f.a.x;
	        verts[i + 1] = f.a.y;
	        verts[i + 2] = f.a.z;
	        i += stride;
	        verts[i] = f.b.x;
	        verts[i + 1] = f.b.y;
	        verts[i + 2] = f.b.z;
	        i += stride;
	        verts[i] = f.c.x;
	        verts[i + 1] = f.c.y;
	        verts[i + 2] = f.c.z;
	        i += stride;
	    }
	    return verts;
	},
	
	getNumFaces: function() {
	    return this.numFaces;
	},
	
	getNumVertices: function() {
	    return this.numVertices;
	},
	
	getRotatedAroundAxis: function(axis,theta) {
	    return this.copy().rotateAroundAxis(axis, theta);
	},
	
	getRotatedX: function(theta) {
	    return this.copy().rotateX(theta);
	},
	
	getRotatedY: function(theta) {
	    return this.copy().rotateY(theta);
	},
	
	getRotatedZ: function(theta) {
	    return this.copy().rotateZ(theta);
	},
	
	getScaled: function(scale) {
	    return this.copy().scale(scale);
	},
	
	getTranslated: function(trans) {
	    return this.copy().translate(trans);
	},
	
	getUniqueVerticesAsArray: function() {
	    var verts = [];
	    var i = 0;
	    var l = this.vertices.length;
	    for (var j=0;i<l;j++) {
	        var v = this.vertices[j];
	        verts[i++] = v.x;
	        verts[i++] = v.y;
	        verts[i++] = v.z;
	    }
	    return verts;
	},
	
	getVertexAtPoint: function(v) {
		var index;
		for(var i=0;i<this.vertices.length;i++){
			if(this.vertices[i].equals(v)){
				index = i;
			}
		}
	    return this.vertices[index];
	},
	//my own method to help
	getVertexIndex: function(vec) {
	    var index = -1;
	    var l = this.vertices.length;
	    for(var i=0;i<l;i++)
	    {
	        var vert = this.vertices[i];
	        if(vert.equals(vec))
	        {
	            matchedVertex =i;
	        }
	    }
	    return matchedVertex;
	
	},
	
	getVertexForID: function(id) {
	    var vertex,
			l = this.vertices.length;
	    for (var i=0;i<l;i++) {
	        var v = this.vertices[i];
	        if (v.id == id) {
	            vertex = v;
	            break;
	        }
	    }
	    return vertex;
	},
	
	/**
	 * Creates an array of unravelled vertex normal coordinates for all faces.
	 * This method can be used to translate the internal mesh data structure
	 * into a format suitable for OpenGL Vertex Buffer Objects (by choosing
	 * stride=4). For more detail, please see
	 * {@link #getMeshAsVertexArray(float[], int, int)}
	 * 
	 * @see #getMeshAsVertexArray(float[], int, int)
	 * 
	 * @param normals
	 *            existing float array or null to automatically create one
	 * @param offset
	 *            start index in array to place normals
	 * @param stride
	 *            stride/alignment setting for individual coordinates (min value
	 *            = 3)
	 * @return array of xyz normal coords
	 */
	getVertexNormalsAsArray: function(normals, offset,stride) {
	    if(offset === undefined)offset = 0;
	    if(stride === undefined)stride = TriangleMesh.DEFAULT_STRIDE;
	    stride = mathUtils.max(stride, 3);
	    if (normals === undefined) {
	        normals = [];
	    }
	    var i = offset;
	    var l = this.faces.length;
	    for (var j=0;j<l;j++) {
	        var f = this.faces[j];
	        normals[i] = f.a.normal.x;
	        normals[i + 1] = f.a.normal.y;
	        normals[i + 2] = f.a.normal.z;
	        i += stride;
	        normals[i] = f.b.normal.x;
	        normals[i + 1] = f.b.normal.y;
	        normals[i + 2] = f.b.normal.z;
	        i += stride;
	        normals[i] = f.c.normal.x;
	        normals[i + 1] = f.c.normal.y;
	        normals[i + 2] = f.c.normal.z;
	        i += stride;
	    }
	    return normals;
	},
	
	getVertices: function() {
	    return this.vertices;
	},
	
	handleSaveAsSTL: function(stl,useFlippedY) {
	    /*f (useFlippedY) {
	        stl.setScale(new Vec3D(1, -1, 1));
	        for (Face f : faces) {
	            stl.face(f.a, f.b, f.c, f.normal, STLWriter.DEFAULT_RGB);
	        }
	    } else {
	        for (Face f : faces) {
	            stl.face(f.b, f.a, f.c, f.normal, STLWriter.DEFAULT_RGB);
	        }
	    }
	    stl.endSave();
	     console.log(numFaces + " faces written");
	    */
	    console.log("TriangleMesh.handleSaveAsSTL() currently not implemented");
	
	},
	
	
	intersectsRay: function(ray) {
	    var tri = this.intersector.getTriangle();
	    var l = this.faces.length;
	    for (var i =0;i<l;i++) {
	        tri.a = f.a;
	        tri.b = f.b;
	        tri.c = f.c;
	        if (this.intersector.intersectsRay(ray)) {
	            return true;
	        }
	    }
	    return false;
	},
	
	perforateFace: function(f, size) {
	    var centroid = f.getCentroid();
	    var d = 1 - size;
	    var a2 = f.a.interpolateTo(centroid, d);
	    var b2 = f.b.interpolateTo(centroid, d);
	    var c2 = f.c.interpolateTo(centroid, d);
	    this.removeFace(f);
	    this.addFace(f.a, b2, a2);
	    this.addFace(f.a, f.b, b2);
	    this.addFace(f.b, c2, b2);
	    this.addFace(f.b, f.c, c2);
	    this.addFace(f.c, a2, c2);
	    this.addFace(f.c, f.a, a2);
	    return new Triangle3D(a2, b2, c2);
	},
	
	 /**
	 * Rotates the mesh in such a way so that its "forward" axis is aligned with
	 * the given direction. This version uses the positive Z-axis as default
	 * forward direction.
	 * 
	 * @param dir
	 *            new target direction to point in
	 * @return itself
	 */
	pointTowards: function(dir) {
	    return this.transform( Quaternion.getAlignmentQuat(dir, Vec3D.Z_AXIS).toMatrix4x4(), true);
	},
	
	removeFace: function(f) {
	    var index = -1;
	    var l = this.faces.length;
	    for(var i=0;i<l;i++){
	        if(this.faces[i] == f){
	            index = i;
	            break;
	        }
	    }
	    if(index > -1){
	        this.faces.splice(index,1);
	    }
	},
	
	
	rotateAroundAxis: function(axis, theta) {
	    return this.transform(this.matrix.identity().rotateAroundAxis(axis, theta));
	},
	
	rotateX: function(theta) {
	    return this.transform(this.matrix.identity().rotateX(theta));
	},
	
	rotateY: function(theta) {
	    return this.transform(this.matrix.identity().rotateY(theta));
	},
	
	rotateZ: function(theta) {
	    return this.transform(this.matrix.identity().rotateZ(theta));
	},
	
	saveAsOBJ: function(obj) {
	    console.log("TriangleMesh.saveAsOBJ() currently not implemented");
	},
	
	saveAsSTL: function(a,b,c){
	    console.log("TriangleMesh.saveAsSTL() currently not implemented");
	},
	
	scale: function(scale) {
	    return this.transform(this.matrix.identity().scaleSelf(scale));
	},
	
	setName: function(name) {
	    this.name = name;
	    return this;
	},
	
	toString: function() {
	    return "TriangleMesh: " + this.name + " vertices: " + this.getNumVertices() + " faces: " + this.getNumFaces();
	},
	
	toWEMesh: function() {
	  /*  return new WETriangleMesh(name, vertices.size(), faces.size())
	            .addMesh(this);
	   */
	   console.log("TriangleMesh.toWEMesh() currently not implemented");
	},
	
	/** 
	* Applies the given matrix transform to all mesh vertices. If the 
	* updateNormals flag is true, all face normals are updated automatically, 
	* however vertex normals need a manual update. 
	* @param mat 
	* @param updateNormals 
	* @return itself 
	*/ 
    transform: function(mat,updateNormals) {
		if(updateNormals === undefined){
			updateNormals = true;
		}
		var l = this.vertices.length;
		for(var i=0;i<l;i++){
			var v = this.vertices[i];
			v.set(mat.applyTo(v));
		}
		if(updateNormals){
			this.computeFaceNormals();
		}
		return this;
    },

    translate: function(x,y,z){
    	if(arguments.length == 1){
    		y = x.y;
    		z = x.z;
    		x = x.x;
    	}
    	return this.transform(this.matrix.identity().translateSelf(x,y,z));
    },
	
	updateVertex: function(orig,newPos) {
	    var vi = this.getVertexIndex(orig);
	    if (vi > -1) {
	        this.vertices.splice(v,1);
	        this.vertices[vi].set(newPos);
	        this.vertices.push(v);
	    }
	    return this;
	}
};

exports.TriangleMesh = TriangleMesh;
module.exports = TriangleMesh;

});

define('toxi/geom/AABB',["require", "exports", "module", "../internals","./Vec3D","./mesh/TriangleMesh","../math/mathUtils"], function(require, exports, module) {

var	extend = require('../internals').extend,
	Vec3D = require('./Vec3D'),
	TriangleMesh = require('./mesh/TriangleMesh'),
	mathUtils = require('../math/mathUtils');

/**
 @class Axis-aligned Bounding Box
 @member 
 */
var AABB = function(a,b){
	var vec,
		extent;
	if(a === undefined){
		Vec3D.apply(this);
		this.setExtent(new Vec3D());
	} else if(typeof(a) == "number") {
		Vec3D.apply(this,[new Vec3D()]);
		this.setExtent(a);
	} else if(a instanceof Vec3D) {
		Vec3D.apply(this,[a]);
		if(b === undefined && a instanceof AABB) {
			this.setExtent(a.getExtent());
		} else {
			if(typeof b == "number"){
				this.setExtent(new Vec3D(b,b,b));
			}else { //should be an AABB
				this.setExtent(b);
			}
		}
	}
	
	
};

extend(AABB,Vec3D);

AABB.fromMinMax = function(min,max){
	var a = Vec3D.min(min, max);
	var b = Vec3D.max(min, max);
	return new AABB(a.interpolateTo(b,0.5),b.sub(a).scaleSelf(0.5));
};

AABB.prototype.containsPoint = function(p) {
    return p.isInAABB(this);
};
	
AABB.prototype.copy = function() {
    return new AABB(this);
};
	
	/**
	 * Returns the current box size as new Vec3D instance (updating this vector
	 * will NOT update the box size! Use {@link #setExtent(ReadonlyVec3D)} for
	 * those purposes)
	 * 
	 * @return box size
	 */
AABB.prototype.getExtent = function() {
   return this.extent.copy();
};
	
AABB.prototype.getMax = function() {
   // return this.add(extent);
   return this.max.copy();
};

AABB.prototype.getMin = function() {
   return this.min.copy();
};

AABB.prototype.getNormalForPoint = function(p) {
    p = p.sub(this);
    var pabs = this.extent.sub(p.getAbs());
    var psign = p.getSignum();
    var normal = Vec3D.X_AXIS.scale(psign.x);
    var minDist = pabs.x;
    if (pabs.y < minDist) {
        minDist = pabs.y;
        normal = Vec3D.Y_AXIS.scale(psign.y);
    }
    if (pabs.z < minDist) {
        normal = Vec3D.Z_AXIS.scale(psign.z);
    }
    return normal;
};

    /**
     * Adjusts the box size and position such that it includes the given point.
     * 
     * @param p
     *            point to include
     * @return itself
     */
AABB.prototype.includePoint = function(p) {
    this.min.minSelf(p);
    this.max.maxSelf(p);
    this.set(this.min.interpolateTo(this.max, 0.5));
    this.extent.set(this.max.sub(this.min).scaleSelf(0.5));
    return this;
};

/**
* Checks if the box intersects the passed in one.
* 
* @param box
*            box to check
* @return true, if boxes overlap
*/
AABB.prototype.intersectsBox = function(box) {
    var t = box.sub(this);
    return Math.abs(t.x) <= (this.extent.x + box.extent.x) && Math.abs(t.y) <= (this.extent.y + box.extent.y) && Math.abs(t.z) <= (this.extent.z + box.extent.z);
};

/**
 * Calculates intersection with the given ray between a certain distance
 * interval.
 * 
 * Ray-box intersection is using IEEE numerical properties to ensure the
 * test is both robust and efficient, as described in:
 * 
 * Amy Williams, Steve Barrus, R. Keith Morley, and Peter Shirley: "An
 * Efficient and Robust Ray-Box Intersection Algorithm" Journal of graphics
 * tools, 10(1):49-54, 2005
 * 
 * @param ray
 *            incident ray
 * @param minDist
 * @param maxDist
 * @return intersection point on the bounding box (only the first is
 *         returned) or null if no intersection
 */

AABB.prototype.intersectsRay = function(ray, minDist, maxDist) {
    var invDir = ray.getDirection().reciprocal();
    var signDirX = invDir.x < 0;
    var signDirY = invDir.y < 0;
    var signDirZ = invDir.z < 0;
    var bbox = signDirX ? this.max : this.min;
    var tmin = (bbox.x - ray.x) * invDir.x;
    bbox = signDirX ? this.min : this.max;
    var tmax = (bbox.x - ray.x) * invDir.x;
    bbox = signDirY ? this.max : this.min;
    var tymin = (bbox.y - ray.y) * invDir.y;
    bbox = signDirY ? this.min : this.max;
    var tymax = (bbox.y - ray.y) * invDir.y;
    if ((tmin > tymax) || (tymin > tmax)) {
        return null;
    }
    if (tymin > tmin) {
        tmin = tymin;
    }
    if (tymax < tmax) {
        tmax = tymax;
    }
    bbox = signDirZ ? max : min;
    var tzmin = (bbox.z - ray.z) * invDir.z;
    bbox = signDirZ ? min : max;
    var tzmax = (bbox.z - ray.z) * invDir.z;
    if ((tmin > tzmax) || (tzmin > tmax)) {
        return null;
    }
    if (tzmin > tmin) {
        tmin = tzmin;
    }
    if (tzmax < tmax) {
        tmax = tzmax;
    }
    if ((tmin < maxDist) && (tmax > minDist)) {
        return ray.getPointAtDistance(tmin);
    }
    return undefined;
};

/**
 * @param c
 *            sphere centre
 * @param r
 *            sphere radius
 * @return true, if AABB intersects with sphere
 */

AABB.prototype.intersectsSphere = function(c, r) {
	if(arguments.length == 1){ //must've been a sphere
		r = c.radius;
	}
    var s, 
		d = 0;
    // find the square of the distance
    // from the sphere to the box
    if (c.x < this.min.x) {
        s = c.x - this.min.x;
        d = s * s;
    } else if (c.x > this.max.x) {
        s = c.x - this.max.x;
        d += s * s;
    }

    if (c.y < this.min.y) {
        s = c.y - this.min.y;
        d += s * s;
    } else if (c.y > this.max.y) {
        s = c.y - this.max.y;
        d += s * s;
    }

    if (c.z < this.min.z) {
        s = c.z - this.min.z;
        d += s * s;
    } else if (c.z > this.max.z) {
        s = c.z - this.max.z;
        d += s * s;
    }

    return d <= r * r;
};

AABB.prototype.intersectsTriangle = function(tri) {
	// use separating axis theorem to test overlap between triangle and box
	// need to test for overlap in these directions:
	//
	// 1) the {x,y,z}-directions (actually, since we use the AABB of the
	// triangle
	// we do not even need to test these)
	// 2) normal of the triangle
	// 3) crossproduct(edge from tri, {x,y,z}-directin)
	// this gives 3x3=9 more tests
	var v0, 
		v1, 
		v2,
		normal, 
		e0, 
		e1, 
		e2, 
		f;

	// move everything so that the boxcenter is in (0,0,0)
	v0 = tri.a.sub(this);
	v1 = tri.b.sub(this);
	v2 = tri.c.sub(this);

	// compute triangle edges
	e0 = v1.sub(v0);
	e1 = v2.sub(v1);
	e2 = v0.sub(v2);

	// test the 9 tests first (this was faster)
	f = e0.getAbs();
	if (this.testAxis(e0.z, -e0.y, f.z, f.y, v0.y, v0.z, v2.y, v2.z, this.extent.y, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(-e0.z, e0.x, f.z, f.x, v0.x, v0.z, v2.x, v2.z, this.extent.x, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(e0.y, -e0.x, f.y, f.x, v1.x, v1.y, v2.x, v2.y, this.extent.x, this.extent.y)) {
	    return false;
	}

	f = e1.getAbs();
	if (this.testAxis(e1.z, -e1.y, f.z, f.y, v0.y, v0.z, v2.y, v2.z, this.extent.y, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(-e1.z, e1.x, f.z, f.x, v0.x, v0.z, v2.x, v2.z, this.extent.x, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(e1.y, -e1.x, f.y, f.x, v0.x, v0.y, v1.x, v1.y, this.extent.x, this.extent.y)) {
	    return false;
	}

	f = e2.getAbs();
	if (this.testAxis(e2.z, -e2.y, f.z, f.y, v0.y, v0.z, v1.y, v1.z, this.extent.y, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(-e2.z, e2.x, f.z, f.x, v0.x, v0.z, v1.x, v1.z, this.extent.x, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(e2.y, -e2.x, f.y, f.x, v1.x, v1.y, v2.x, v2.y, this.extent.x, this.extent.y)) {
	    return false;
	}

	// first test overlap in the {x,y,z}-directions
	// find min, max of the triangle each direction, and test for overlap in
	// that direction -- this is equivalent to testing a minimal AABB around
	// the triangle against the AABB

	// test in X-direction
	if (mathUtils.min(v0.x, v1.x, v2.x) > this.extent.x || mathUtils.max(v0.x, v1.x, v2.x) < -this.extent.x) {
	    return false;
	}

	// test in Y-direction
	if (mathUtils.min(v0.y, v1.y, v2.y) > this.extent.y || mathUtils.max(v0.y, v1.y, v2.y) < -this.extent.y) {
	    return false;
	}

	// test in Z-direction
	if (mathUtils.min(v0.z, v1.z, v2.z) > this.extent.z || mathUtils.max(v0.z, v1.z, v2.z) < -this.extent.z) {
	    return false;
	}

	// test if the box intersects the plane of the triangle
	// compute plane equation of triangle: normal*x+d=0
	normal = e0.cross(e1);
	var d = -normal.dot(v0);
	if (!this.planeBoxOverlap(normal, d, extent)) {
	    return false;
	}
	return true;
};

AABB.prototype.planeBoxOverlap = function(normal, d, maxbox) {
    var vmin = new Vec3D();
    var vmax = new Vec3D();

    if (normal.x > 0.0) {
        vmin.x = -maxbox.x;
        vmax.x = maxbox.x;
    } else {
        vmin.x = maxbox.x;
        vmax.x = -maxbox.x;
    }

    if (normal.y > 0.0) {
        vmin.y = -maxbox.y;
        vmax.y = maxbox.y;
    } else {
        vmin.y = maxbox.y;
        vmax.y = -maxbox.y;
    }

    if (normal.z > 0.0) {
        vmin.z = -maxbox.z;
        vmax.z = maxbox.z;
    } else {
        vmin.z = maxbox.z;
        vmax.z = -maxbox.z;
    }
    if (normal.dot(vmin) + d > 0.0) {
        return false;
    }
    if (normal.dot(vmax) + d >= 0.0) {
        return true;
    }
    return false;
};
		
/**
 * Updates the position of the box in space and calls
 * {@link #updateBounds()} immediately
 * 
 * @see geom.Vec3D#set(float, float, float)
 */

AABB.prototype.set = function(a,b,c) {
		if(a  instanceof AABB) {
			this.extent.set(a.extent);
			return Vec3D.set.apply(this,[a]);
		}
		if(a instanceof Vec3D){
			b = a.y;
			c = a.z;
			a = a.a;
		}
		this.x = a;
		this.y = b;
		this.z = c;
		this.updateBounds();
		return this;
 };


AABB.prototype.setExtent = function(extent) {
        this.extent = extent.copy();
        return this.updateBounds();
};

AABB.prototype.testAxis = function(a, b, fa, fb, va, vb, wa, wb, ea, eb) {
    var p0 = a * va + b * vb;
    var p2 = a * wa + b * wb;
    var min;
	var max;
    if (p0 < p2) {
        min = p0;
        max = p2;
    } else {
        min = p2;
        max = p0;
    }
    var rad = fa * ea + fb * eb;
    return (min > rad || max < -rad);
};

AABB.prototype.toMesh = function(mesh){
	if(mesh === undefined){
		mesh = new TriangleMesh("aabb",8,12);	
	}
	var a = new Vec3D(this.min.x,this.max.y,this.max.z),
		b = new Vec3D(this.max.x,this.max.y,this.max.z),
		c = new Vec3D(this.max.x,this.min.y, this.max.z),
		d = new Vec3D(this.min.x, this.min.y, this.max.z),
		e = new Vec3D(this.min.x, this.max.y, this.min.z),
		f = new Vec3D(this.max.x, this.max.y, this.min.z),
		g = new Vec3D(this.max.x, this.min.y, this.min.z),
		h = new Vec3D(this.min.x, this.min.y, this.min.z);
		
	// front
	mesh.addFace(a, b, d, undefined, undefined, undefined, undefined);
	mesh.addFace(b, c, d, undefined, undefined, undefined, undefined);
	// back
	mesh.addFace(f, e, g, undefined, undefined, undefined, undefined);
	mesh.addFace(e, h, g, undefined, undefined, undefined, undefined);
	// top
	mesh.addFace(e, f, a, undefined, undefined, undefined, undefined);
	mesh.addFace(f, b, a, undefined, undefined, undefined, undefined);
	// bottom
	mesh.addFace(g, h, d, undefined, undefined, undefined, undefined);
	mesh.addFace(g, d, c, undefined, undefined, undefined, undefined);
	// left
	mesh.addFace(e, a, h, undefined, undefined, undefined, undefined);
	mesh.addFace(a, d, h, undefined, undefined, undefined, undefined);
	// right
	mesh.addFace(b, f, g, undefined, undefined, undefined, undefined);
	mesh.addFace(b, g, c, undefined, undefined, undefined, undefined);
	return mesh;

};


AABB.prototype.toString = function() {
   return "<aabb> pos: "+this.parent.toString()+" ext: "+this.extent.toString();
};

/**
* Updates the min/max corner points of the box. MUST be called after moving
* the box in space by manipulating the public x,y,z coordinates directly.
* 
* @return itself
*/
AABB.prototype.updateBounds = function() {
  // this is check is necessary for the constructor
  if (this.extent !== undefined) {
      this.min = this.sub(this.extent);
      this.max = this.add(this.extent);
  }
  return this;
};

module.exports = AABB;

});

define('toxi/geom/Vec3D',["require", "exports", "module", "./Vec2D","../math/mathUtils"], function(require, exports, module) {

var	Vec2D, AABB;
require(['./Vec2D','./AABB'],function(v2,AB){
	Vec2D = v2;
	AABB = AB;
});
var	mathUtils = require('../math/mathUtils');

/**
 * @member toxi
 * @class Creates a new vector with the given coordinates. Coordinates will default to zero
 * @param {Number} x the x
 * @param {Number} y the y
 * @param {Number} z the z
 */
var Vec3D = function(x, y, z){
	if(typeof x == 'object' && x.x !== undefined && x.y !== undefined && x.z !== undefined){
		this.x = x.x;
		this.y = x.y;
		this.z = x.z;
	} else if(x === undefined){ //if none or all were passed
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
	} else {
		this.x = x;
		this.y = y;
		this.z = z;
	}
};
	
Vec3D.prototype = {
	
	abs: function(){
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
		return this;
	},
	
	add: function(a,b,c){
		if(a instanceof Object){
			return new Vec3D(this.x+a.x,this.y+a.y,this.z+a.z);
		}
		return new Vec3D(this.x+a,this.y+b,this.z+c);
		
	},
	/**
	 * Adds vector {a,b,c} and overrides coordinates with result.
	 * 
	 * @param a
	 *            X coordinate
	 * @param b
	 *            Y coordinate
	 * @param c
	 *            Z coordinate
	 * @return itself
	 */
	addSelf: function(a,b,c){
		if(a !== undefined && b!== undefined && c !== undefined){
			this.x += a;
			this.y += b;
			this.z += c;
		} else {
			this.x += a.x;
			this.y += a.y;
			this.z += a.z;
		}
		return this;
	},
	
	angleBetween: function(vec, faceNormalizeBool){
		var theta;
		if(faceNormalizeBool){
			theta = this.getNormalized().dot(vec.getNormalized());
		} else {
			theta = this.dot(vec);
		}
		return Math.acos(theta);
	},
	
	
	clear: function(){
		this.x = this.y = this.z = 0;
		return this;
	},
	
	compareTo: function(vec){
		if(this.x == vec.x && this.y == vec.y && this.z == vec.z){
			return 0;
		}
		return (this.magSquared() - vec.magSqaured());
	},
	/**
	 * Forcefully fits the vector in the given AABB specified by the 2 given
	 * points.
	 * 
	 * @param box_or_min
	 *		either the AABB box by itself, or your min Vec3D with accompanying max
	 * @param max
	 * @return itself
	 */
	constrain: function(box_or_min, max){
		var min;
		if(box_or_min instanceof AABB){
			max = box_or_min.getMax();
			min = box_or_min.getMin();
		} else {
			min = box_or_min;
		}
		this.x = mathUtils.clip(this.x, min.x, max.x);
		this.y = mathUtils.clip(this.y, min.y, max.y);
		this.z = mathUtils.clip(this.z, min.z, max.z);
	   return this;
	},
	
	copy: function(){
		return new Vec3D(this);
	},
	
	cross: function(vec){
		return new Vec3D(this.y*vec.z - vec.y * this.z, this.z * vec.x - vec.z * this.x,this.x * vec.y - vec.x * this.y);
	},
	
	crossInto: function(vec, vecResult){
		var vx = vec.x;
		var vy = vec.y;
		var vz = vec.z;
		result.x = this.y * vz - vy * this.z;
		result.y = this.z * vx-vz * this.x;
		result.z = this.x * vy - vx * this.y;
		return result;
	},
	/**
	 * Calculates cross-product with vector v. The resulting vector is
	 * perpendicular to both the current and supplied vector and overrides the
	 * current.
	 * 
	 * @param v
	 *            the v
	 * 
	 * @return itself
	 */
	crossSelf: function(vec){
		var cx = this.y * vec.z - vec.y * this.z;
		var cy = this.z * vec.x - vec.z * this.x;
		this.z = vec.y - vec.x * this.y;
		this.y = cy;
		this.x = cx;
		return this;
	},
	
	distanceTo: function(vec){
		if(vec !== undefined){
			var dx = this.x - vec.x;
			var dy = this.y - vec.y;
			var dz = this.z - vec.z;
			return Math.sqrt(dx * dx + dy * dy + dz * dz);
		}
		return NaN;
	},
	
	distanceToSquared: function(vec){
		if(vec !== undefined){
			var dx = this.x - vec.x;
			var dy = this.y - vec.y;
			var dz = this.z - vec.z;
			return dx * dx + dy*dy + dz*dz;
		}
		return NaN;
	},
	
	dot: function(vec){
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	},
	
	equals: function(vec){
		if(vec instanceof Object){
			return this.x == vec.x && this.y == vec.y && this.z == vec.z;
		}
		return false;
	},
	
	equalsWithTolerance: function(vec,tolerance){
		if(Math.abs(this.x-vec.x) < tolerance){
			if(Math.abs(this.y - vec.y) < tolerance){
				if(Math.abs(this.z - vec.z) < tolerance){
					return true;
				}
			}
		}
		return false;
	},
	
	floor: function(){
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	},
	/**
	 * Replaces the vector components with the fractional part of their current
	 * values.
	 * 
	 * @return itself
	 */
	frac: function(){
		this.x -= Math.floor(this.x);
		this.y -= Math.floor(this.y);
		this.z -= Math.floor(this.z);
		return this;
	},
	
	getAbs: function(){
		return new Vec3D(this).abs();
	},
	
	getComponent: function(id){
		if(id instanceof Number){
			if(id === Vec3D.Axis.X){
				id = 0; 
			} else if(id === Vec3D.Axis.Y){
				id = 1;
			} else {
				id = 2;
			}
		}
		switch(id){
			case 0:
			return this.x;
			case 1:
			return this.y;
			case 2:
			return this.z;
		}
	},
	
	getConstrained: function(box){
		return new Vec3D(this).constrain(box);
	},
	
	getFloored: function(){
		return new Vec3D(this).floor();
	},
	
	getFrac: function(){
		return new Vec3D(this).frac();
	},
	
	getInverted: function(){
		return new Vec3D(-this.x,-this.y,-this.z);
	},
	
	getLimited: function(limit){
		if(this.magSquared() > limit * limit){
			return this.getNormalizedTo(limit);
		}
		return new Vec3D(this);
	},
	
	getNormalized: function(){
		return new Vec3D(this).normalize();
	},
	
	getNormalizedTo: function(length){
		return new Vec3D(this).normalizeTo(length);
	},
	
	getReciprocal: function(){
		return this.copy().reciprocal();
	},
	
	getReflected: function(normal){
		return this.copy().reflect(normal);
	},
	
	getRotatedAroundAxis: function(vec_axis,theta){
		return new Vec3D(this).rotateAroundAxis(vec_axis,theta);
	},
	
	getRotatedX: function(theta){
		return new Vec3D(this).rotateX(theta);
	},
	
	getRotatedY: function(theta){
		return new Vec3D(this).rotateY(theta);
	},
	
	getRotatedZ: function(theta){
		return new Vec3D(this).rotateZ(theta);
	},
	
	getSignum: function(){
		return new Vec3D(this).signum();
	},
	
	headingXY: function(){
		return Math.atan2(this.y,this.x);
	},
	
	headingXZ: function(){
		return Math.atan2(this.z,this.x);
	},
	
	headingYZ: function(){
		return Math.atan2(this.y,this.z);
	},
	
	immutable: function(){
		return this; //cant make read-only in javascript, implementing to avoid error
	},
	
	interpolateTo: function(v,f,s) {
		if(s === undefined){
			return new Vec3D(this.x + (v.x - this.x)*f, this.y + (v.y - this.y) * f, this.z + (v.z - this.z)*f);
		}
		return new Vec3D(s.interpolate(this.y,v.y,f),s.interpolate(this.y,v.y,f),s.interpolate(this.z,v.z,f));
		
	},
	
	interpolateToSelf: function(v,f,s){
		if(s === undefined){
			this.x += (v.x-this.x)*f;
			this.y += (v.y-this.y)*f;
			this.z += (v.z-this.z)*f;
		} else {
			this.x = s.interpolate(this.x,v.x,f);
			this.y = s.interpolate(this.y,v.y,f);
			this.z = s.interpolate(this.z,v.z,f);
		}
		return this;
	},
	
	
	
	invert: function(){
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		return this;
	},
	
	isInAABB: function(box_or_origin, boxExtent){
		if(boxExtent) {
			var w = boxExtent.x;
			if(this.x < box_or_origin.x - w || this.x > box_or_origin.x + w){
				return false;
			}
			w = boxExtent.y;
			if(this.y < box_or_origin.y - w || this.y > box_or_origin.y + w){
				return false;
			}
			w = boxExtent.y;
			if(this.z < box_or_origin.z - w || this.y > box_or_origin.z + w){
				return false;
			}
		}
		return true;	
	},
	
	isMajorAxis: function(tol){
		var ax = mathUtils.abs(this.x);
		var ay = mathUtils.abs(this.y);
		var az = mathUtils.abs(this.z);
		var itol = 1 - tol;
		if (ax > itol) {
			if (ay < tol) {
				return (az < tol);
			}
		} else if (ay > itol) {
		   if (ax < tol) {
			   return (az < tol);
		   }
	   } else if (az > itol) {
		   if (ax < tol) {
			   return (ay < tol);
		   }
	   }
	   return false;
	},

	isZeroVector: function(){
		return Math.abs(this.x) < mathUtils.EPS && Math.abs(this.y) < mathUtils.EPS && mathUtils.abs(this.z) < mathUtils.EPS;
	},
  
	/**
	 * Add random jitter to the vector in the range -j ... +j using the default
	 * {@link Random} generator of {@link MathUtils}.
	 * 
	 * @param j
	 *            the j
	 * 
	 * @return the vec3 d
	 */
	jitter: function(a,b,c){
		if(b === undefined || c === undefined){
			b = c = a;
		}
		this.x += mathUtils.normalizedRandom()*a;
		this.y += mathUtils.normalizedRandom()*b;
		this.z += mathUtils.normalizedRandom()*c;
		return this;
	},
	
	limit: function(lim){
		if(this.magSquared() > lim * lim){
			return this.normalize().scaleSelf(lim);
		}
		return this;
	},
	
	magnitude: function(){
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	},
	
	magSquared: function(){
		return this.x*this.x+this.y*this.y+this.z*this.z;
	},
	
	maxSelf: function(vec){
		this.x = Math.max(this.x,vec.x);
		this.y = Math.max(this.y,vec.y);
		this.z = Math.max(this.z,vec.z);
		return this;
	},
	
	minSelf: function(vec){
		this.x = Math.min(this.x,vec.x);
		this.y = Math.min(this.y,vec.y);
		this.z = Math.min(this.z,vec.z);
		return this;
	},
	
	modSelf: function(basex,basey,basez){
		if(basey === undefined || basez === undefined){
			basey = basez = basex;
		}
		this.x %= basex;
		this.y %= basey;
		this.z %= basez;
		return this;
	},
	
	
	normalize: function(){
		var mag = Math.sqrt(this.x*this.x + this.y * this.y + this.z * this.z);
		if(mag > 0) {
			mag = 1.0 / mag;
			this.x *= mag;
			this.y *= mag;
			this.z *= mag;
		}
		return this;
	},
	
	normalizeTo: function(length){
		var mag = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
		if(mag>0){
			mag = length / mag;
			this.x *= mag;
			this.y *= mag;
			this.z *= mag;
		}
		return this;
	},
	
	reciprocal: function(){
		this.x = 1.0 / this.x;
		this.y = 1.0 / this.y;
		this.z = 1.0 / this.z;
		return this;
	},
	
	reflect: function(normal){
		return this.set(normal.scale(this.dot(normal)*2).subSelf(this));
	},
	/**
	 * Rotates the vector around the giving axis.
	 * 
	 * @param axis
	 *            rotation axis vector
	 * @param theta
	 *            rotation angle (in radians)
	 * 
	 * @return itself
	 */
	rotateAroundAxis: function(vec_axis,theta){
		var ax = vec_axis.x,
			ay = vec_axis.y,
			az = vec_axis.z,
			ux = ax * this.x,
			uy = ax * this.y,
			uz = ax * this.z,
			vx = ay * this.x,
			vy = ay * this.y,
			vz = ay * this.z,
			wx = az * this.x,
			wy = az * this.y,
			wz = az * this.z;
			si = Math.sin(theta);
			co = Math.cos(theta);
		var xx = (ax * (ux + vy + wz) + (this.x * (ay * ay + az * az) - ax * (vy + wz)) * co + (-wy + vz) * si);
		var yy = (ay * (ux + vy + wz) + (this.y * (ax * ax + az * az) - ay * (ux + wz)) * co + (wx - uz) * si);
		var zz = (az * (ux + vy + wz) + (this.z * (ax * ax + ay * ay) - az * (ux + vy)) * co + (-vx + uy) * si);
		this.x = xx;
		this.y = yy;
		this.z = zz;
		return this;
	},
	/**
	 * Rotates the vector by the given angle around the X axis.
	 * 
	 * @param theta
	 *            the theta
	 * 
	 * @return itself
	 */
	rotateX: function(theta){
		var co = Math.cos(theta);
		var si = Math.sin(theta);
		var zz = co *this.z - si * this.y;
		this.y = si * this.z + co * this.y;
		this.z = zz;
		return this;
	},
	/**
	 * Rotates the vector by the given angle around the Y axis.
	 * 
	 * @param theta
	 *            the theta
	 * 
	 * @return itself
	 */
   rotateY:function(theta) {
		var co = Math.cos(theta);
		var si = Math.sin(theta);
		var xx = co * this.x - si * this.z;
		this.z = si * this.x + co * this.z;
		this.x = xx;
		return this;
	},

	/**
	 * Rotates the vector by the given angle around the Z axis.
	 * 
	 * @param theta
	 *            the theta
	 * 
	 * @return itself
	 */
	rotateZ:function(theta) {
		var co = Math.cos(theta);
		var si = Math.sin(theta);
		var xx = co * this.x - si * this.y;
		this.y = si * this.x + co * this.y;
		this.x = xx;
		return this;
	},

	/**
	 * Rounds the vector to the closest major axis. Assumes the vector is
	 * normalized.
	 * 
	 * @return itself
	 */
	 roundToAxis:function() {
		if (Math.abs(this.x) < 0.5) {
			this.x = 0;
		} else {
			this.x = this.x < 0 ? -1 : 1;
			this.y = this.z = 0;
		}
		if (Math.abs(this.y) < 0.5) {
			this.y = 0;
		} else {
			this.y = this.y < 0 ? -1 : 1;
			this.x = this.z = 0;
		}
		if (Math.abs(this.z) < 0.5) {
			this.z = 0;
		} else {
			this.z = this.z < 0 ? -1 : 1;
			this.x = this.y = 0;
		}
		return this;
	},

	scale:function(a,b,c) {
		if(a instanceof Vec3D) { //if it was a vec3d that was passed
			return new Vec3D(this.x * a.x, this.y * a.y, this.z * a.z);
		}
		else if(b === undefined || c === undefined) { //if only one float was passed
			b = c = a;
		}
		return new Vec3D(this.x * a, this.y * b, this.z * c);
	},
	
	scaleSelf: function(a,b,c) {
		if(a instanceof Object){
			this.x *= a.x;
			this.y *= a.y;
			this.z *= a.z;
			return this;
		} else if(b === undefined || c === undefined) {
			b = c = a;
		}
		this.x *= a;
		this.y *= b;
		this.z *= c;
		return this;
	},
	
	set: function(a,b,c){
		if(a instanceof Object)
		{
			this.x = a.x;
			this.y = a.y;
			this.z = a.z;
			return this;
		} else if(b === undefined || c === undefined) {
			b = c = a;
		}
		this.x = a;
		this.y = b;
		this.z = c;
		return this;
	},
	
	setXY: function(v){
		this.x = v.x;
		this.y = v.y;
		return this;
	},
	
	shuffle:function(nIterations){
		var t;
		for(var i=0;i<nIterations;i++) {
			switch(Math.floor(Math.random()*3)){
				case 0:
				t = this.x;
				this.x = this.y;
				this.z = t;
				break;
				
				case 1:
				t = this.x;
				this.x = this.z;
				this.z = t;
				break;
				
				case 2:
				t = this.y;
				this.y = this.z;
				this.z = t;
				break;
			}
		}
		return this;
	},
	/**
	 * Replaces all vector components with the signum of their original values.
	 * In other words if a components value was negative its new value will be
	 * -1, if zero => 0, if positive => +1
	 * 
	 * @return itself
	 */
	signum: function(){
		this.x = (this.x < 0 ? -1 : this.x === 0 ? 0 : 1);
		this.y = (this.y < 0 ? -1 : this.y === 0 ? 0 : 1);
		this.z = (this.z < 0 ? -1 : this.z === 0 ? 0 : 1);
		return this;
	},
	
	sub: function(a,b,c){
		if(a instanceof Object){
			return  new Vec3D(this.x - a.x, this.y - a.y, this.z - a.z);
		} else if(b === undefined || c === undefined) {
			b = c = a;
		}
		return new Vec3D(this.x - a, this.y - b, this.z - c);
	},
	
	subSelf: function(a,b,c){
		if(a instanceof Object){
			this.x -= a.x;
			this.y -= a.y;
			this.z -= a.z;
			return this;
		}
		else if(b === undefined || c === undefined){
			b = c= a;
		}
		this.x -= a;
		this.y -= b;
		this.z -= c;
		return this;
	},
	
	to2DXY: function(){
		return new Vec2D(this.x,this.y);
	},
	
	to2DXZ: function(){
		return new Vec2D(this.x,this.z);
	},
	
	to2DYZ: function(){
		return new Vec2D(this.y,this.z);
	},
	
	toArray: function(){
		return [this.x,this.y,this.z];
	},
	
	toArray4:function(w){
		var ta = this.toArray();
		ta[3] = w;
		return ta;
	},
	
	toCartesian: function(){
		var a = (this.x * Math.cos(this.z));
		var xx = (a * Math.cos(this.y));
		var yy = (this.x * Math.sin(this.z));
		var zz = (a * Math.sin(this.y));
		this.x = xx;
		this.y = yy;
		this.z = zz;
		return this;
	},
	
	toSpherical: function(){
		var xx = Math.abs(this.x) <= mathUtils.EPS ? mathUtils.EPS : this.x;
		var zz = this.z;

		var radius = Math.sqrt((xx * xx) + (this.y * this.y) + (zz * zz));
		this.z = Math.asin(this.y / radius);
		this.y = Math.atan(zz / xx) + (xx < 0.0 ? Math.PI : 0);
		this.x = radius;
		return this;
	},
	
	toString: function(){
		return "[ x: "+this.x+ ", y: "+this.y+ ", z: "+this.z+"]";
	}
};
/**
  * Defines vector with all coords set to Float.MIN_VALUE. Useful for
  * bounding box operations.
  */
Vec3D.MIN_VALUE = new Vec3D(Number.MIN_VALUE,Number.MIN_VALUE,Number.MIN_VALUE);
/**
  * Defines vector with all coords set to Float.MAX_VALUE. Useful for
  * bounding box operations.
 */
Vec3D.MAX_VALUE = new Vec3D(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE);
/**
 * Creates a new vector from the given angle in the XY plane. The Z
 * component of the vector will be zero.
 * 
 * The resulting vector for theta=0 is equal to the positive X axis.
 * 
 * @param theta
 *            the theta
 * 
 * @return new vector in the XY plane
 */
Vec3D.fromXYTheta = function(theta) {
	return new Vec3D(Math.cos(theta),Math.sin(theta),0);
};
/**
 * Creates a new vector from the given angle in the XZ plane. The Y
 * component of the vector will be zero.
 * 
 * The resulting vector for theta=0 is equal to the positive X axis.
 * 
 * @param theta
 *            the theta
 * 
 * @return new vector in the XZ plane
 */
 Vec3D.fromXZTheta = function(theta) {
		return new Vec3D(Math.cos(theta), 0, Math.sin(theta));
 };

/**
 * Creates a new vector from the given angle in the YZ plane. The X
 * component of the vector will be zero.
 * 
 * The resulting vector for theta=0 is equal to the positive Y axis.
 * 
 * @param theta
 *            the theta
 * 
 * @return new vector in the YZ plane
 */
Vec3D.fromYZTheta = function(theta) {
	return new Vec3D(0, Math.cos(theta), Math.sin(theta));
};

/**
 * Constructs a new vector consisting of the largest components of both
 * vectors.
 * 
 * @param b
 *            the b
 * @param a
 *            the a
 * 
 * @return result as new vector
 */
Vec3D.max = function(a, b) {
	return new Vec3D(Math.max(a.x, b.x), Math.max(a.y,b.y), Math.max(a.z, b.z));
};

/**
 * Constructs a new vector consisting of the smallest components of both
 * vectors.
 * 
 * @param b
 *            comparing vector
 * @param a
 *            the a
 * 
 * @return result as new vector
 */
Vec3D.min = function(a,b) {
	return new Vec3D(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};


/**
 * Static factory method. Creates a new random unit vector using the Random
 * implementation set as default for the {@link MathUtils} class.
 * 
 * @return a new random normalized unit vector.
 */

Vec3D.randomVector = function() {
	var v = new Vec3D(Math.random()*2 - 1, Math.random() * 2 -1, Math.random()* 2 - 1);
	return v.normalize();
};
Vec3D.ZERO = new Vec3D(0,0,0);
Vec3D.X_AXIS = new Vec3D(1,0,0);
Vec3D.Y_AXIS = new Vec3D(0,1,0);
Vec3D.Z_AXIS = new Vec3D(0,0,1);
Vec3D.Axis = {
	X: {
		getVector: function(){ 
			return Vec3D.X_AXIS;
		},
		toString: function(){
			return "Vec3D.Axis.X";
		}
	},
	Y: {
		getVector: function(){ 
			return Vec3D.Y_AXIS;
		},
		toString: function(){
			return "Vec3D.Axis.Y";
		}
	},
	Z: {
		getVector: function(){ 
			return Vec3D.Z_AXIS;
		},
		toString: function(){
			return "Vec3D.Axis.Z";
		}
	}
};

module.exports = Vec3D;

});

define('toxi/geom/mesh/SurfaceMeshBuilder',[
	"require", 
	"exports", 
	"module", 
	"./TriangleMesh",
	"../Vec3D"], function(require, exports, module) {

var TriangleMesh = require('./TriangleMesh');
var Vec3D = require('../Vec3D');

/**
 * @class An extensible builder class for {@link TriangleMesh}es based on 3D surface
 * functions using spherical coordinates. In order to create mesh, you'll need
 * to supply a {@link SurfaceFunction} implementation to the builder.
 * @member toxi
 */
var	SurfaceMeshBuilder = function(func) {
	this.func = func;
};

SurfaceMeshBuilder.prototype = {
	/*
		create a mesh from a surface,
		parameter options:
			1 - Object options
			1 - Number resolution
			3 - TriangleMesh mesh, Number resolution, Number size
			4 - TriangleMesh mesh, Number resolution, Number size, boolean isClosed
	*/
	createMesh: function() {
		var opts = {
			mesh: undefined,
			resolution: 0,
			size: 1,
			isClosed: true
		};
		if(arguments.length == 1){
			if(typeof arguments[0] == 'object'){ //options object
				var arg = arguments[0];
				//if a mesh was provided as an option, use it, otherwise make one
				opts.mesh = arg.mesh;
				opts.resolution = arg.res || arg.resoultion || 0;
				if(arg.size !== undefined){
					opts.size = arg.size;
				}
				if(arg.isClosed !== undefined){
					opts.isClosed = arg.isClosed;
				}
			} else { //resolution Number
				opts.resolution = arguments[0];
			}
		} else if(arguments.length > 2){
			opts.mesh = arguments[0];
			opts.resolution = arguments[1];
			opts.size = arguments[2];
			if(arguments.length == 4){
				opts.isClosed = arguments[3];
			}
		}
		var mesh = opts.mesh;
		if(mesh === undefined || mesh === null){
			mesh = new TriangleMesh(); 
		}
		
		var a = new Vec3D(),
			b = new Vec3D(),
			pa = new Vec3D(),
			pb = new Vec3D(),
			a0 = new Vec3D(),
			b0 = new Vec3D(),
			phiRes = this.func.getPhiResolutionLimit(opts.resolution),
			phiRange = this.func.getPhiRange(),
			thetaRes = this.func.getThetaResolutionLimit(opts.resolution),
			thetaRange = this.func.getThetaRange(),
			pres = 1.0 / (1 == opts.resolution % 2 ? opts.resolution - 0 : opts.resolution);
		for (var p = 0; p < phiRes; p++) {
			var phi = p * phiRange * pres;
			var phiNext = (p + 1) * phiRange * pres;
			for (var t = 0; t <= thetaRes; t++) {
				var theta = t * thetaRange / opts.resolution;
				var func = this.func;
				a =	func.computeVertexFor(a, phiNext, theta).scaleSelf(opts.size);
				b = func.computeVertexFor(b, phi, theta).scaleSelf(opts.size);
				if (b.distanceTo(a) < 0.0001) {
					b.set(a);
				}
				if (t > 0) {
					if (t == thetaRes && opts.isClosed) {
						a.set(a0);
						b.set(b0);
					}
					mesh.addFace(pa, pb, a);
					mesh.addFace(pb, b, a);
				} else {
					a0.set(a);
					b0.set(b);
				}
				pa.set(a);
				pb.set(b);
			}
		}
		return mesh;
	},
	
	
	/**
	@return the function
	*/
	getFunction: function() {
		return this.func;
	},

	setFunction: function(func) {
		this.func = func;
	}
};
module.exports = SurfaceMeshBuilder;
});

define('toxi/geom/mesh/SphereFunction',["require", "exports", "module", "../../math/mathUtils","../Vec3D","../Sphere"], function(require, exports, module) {

var mathUtils = require('../../math/mathUtils'),
	Vec3D = require('../Vec3D'),
	internals = require('../../internals'),
	Sphere = require('../Sphere');

/**
 * @class This implementation of a {@link SurfaceFunction} samples a given
 * {@link Sphere} instance when called by the {@link SurfaceMeshBuilder}.
 * @member toxi
 */
var	SphereFunction = function(sphere_or_radius) {
	if(sphere_or_radius === undefined){
		this.sphere = new Sphere(new Vec3D(),1);
	}
	
	if(internals.hasProperties(sphere_or_radius,['x','y','z','radius'])){
		this.sphere = sphere_or_radius;
	}
	else{
		this.sphere = new Sphere(new Vec3D(),sphere_or_radius);
	}
	this.phiRange = mathUtils.PI;
	this.thetaRange = mathUtils.TWO_PI;
};

SphereFunction.prototype = {
	
	computeVertexFor: function(p,phi,theta) {
	    phi -= mathUtils.HALF_PI;
	    var cosPhi = mathUtils.cos(phi);
	    var cosTheta = mathUtils.cos(theta);
	    var sinPhi = mathUtils.sin(phi);
	    var sinTheta = mathUtils.sin(theta);
	    var t = mathUtils.sign(cosPhi) * mathUtils.abs(cosPhi);
	    p.x = t * mathUtils.sign(cosTheta) * mathUtils.abs(cosTheta);
	    p.y = mathUtils.sign(sinPhi) * mathUtils.abs(sinPhi);
	    p.z = t * mathUtils.sign(sinTheta) * mathUtils.abs(sinTheta);
	    return p.scaleSelf(this.sphere.radius).addSelf(this.sphere);
	},
	
	getPhiRange: function() {
	    return this.phiRange;
	},
	
	getPhiResolutionLimit: function(res) {
	    return res;
	},
	
	getThetaRange: function() {
	    return this.thetaRange;
	},
	
	getThetaResolutionLimit: function(res) {
	    return res;
	},
	
	setMaxPhi: function(max) {
	    this.phiRange = mathUtils.min(max / 2, mathUtils.PI);
	},
	
	setMaxTheta: function(max) {
	    this.thetaRange = mathUtils.min(max, mathUtils.TWO_PI);
	}
};

module.exports = SphereFunction;
});

define('toxi/geom/Sphere',["require", "exports", "module", "../internals","./Vec3D","./mesh/SurfaceMeshBuilder","./mesh/SphereFunction"], function(require, exports, module) {

var	extend = require('../internals').extend,
	Vec3D = require('./Vec3D'),
	SphereFunction = require('./mesh/SphereFunction');
	
var	SurfaceMeshBuilder = require('./mesh/SurfaceMeshBuilder');

/**
 * @module toxi.geom.Sphere
 * @augments toxi.geom.Vec3D
 */
var	Sphere = function(a,b){
	if(a === undefined){
		Vec3D.apply(this,[new Vec3D()]);
		this.radius = 1;
	}
	else if(a instanceof Vec3D){
		Vec3D.apply(this,[a]);
		if(a instanceof Sphere){
			this.radius = a.radius;
		}
		else {
			this.radius = b;
		}
	}
	else {
		Vec3D.apply(this,[new Vec3D()]);
		this.radius = a;
	}
};

extend(Sphere,Vec3D);


Sphere.prototype.containsPoint = function(p) {
	var d = this.sub(p).magSquared();
	return (d <= this.radius * this.radius);
};

/**
 * Alternative to {@link SphereIntersectorReflector}. Computes primary &
 * secondary intersection points of this sphere with the given ray. If no
 * intersection is found the method returns null. In all other cases, the
 * returned array will contain the distance to the primary intersection
 * point (i.e. the closest in the direction of the ray) as its first index
 * and the other one as its second. If any of distance values is negative,
 * the intersection point lies in the opposite ray direction (might be
 * useful to know). To get the actual intersection point coordinates, simply
 * pass the returned values to {@link Ray3D#getPointAtDistance(float)}.
 * 
 * @param ray
 * @return 2-element float array of intersection points or null if ray
 * doesn't intersect sphere at all.
 */
Sphere.prototype.intersectRay = function(ray) {
	var result,
		a,
		b,
		t,
		q = ray.sub(this),
		distSquared = q.magSquared(),
		v = -q.dot(ray.getDirection()),
		d = this.radius * this.radius - (distSquared - v * v);
	if (d >= 0.0) {
		d = Math.sqrt(d);
		a = v + d;
		b = v - d;
		if (!(a < 0 && b < 0)) {
			if (a > 0 && b > 0) {
				if (a > b) {
					t = a;
					a = b;
					b = t;
				}
			} else {
				if (b > 0) {
					t = a;
					a = b;
					b = t;
				}
			}
		}
		result = [a,b];
	}
	return result;
};

/**
 * Considers the current vector as centre of a collision sphere with radius
 * r and checks if the triangle abc intersects with this sphere. The Vec3D p
 * The point on abc closest to the sphere center is returned via the
 * supplied result vector argument.
 * 
 * @param t
 *			triangle to check for intersection
 * @param result
 *			a non-null vector for storing the result
 * @return true, if sphere intersects triangle ABC
 */
Sphere.prototype.intersectSphereTriangle = function(t,result) {
	// Find Vec3D P on triangle ABC closest to sphere center
	result.set(t.closestPointOnSurface(this));

	// Sphere and triangle intersect if the (squared) distance from sphere
	// center to Vec3D p is less than the (squared) sphere radius
	var v = result.sub(this);
	return v.magSquared() <= this.radius * this.radius;
};

/**
 * Calculates the normal vector on the sphere in the direction of the
 * current point.
 * 
 * @param q
 * @return a unit normal vector to the tangent plane of the ellipsoid in the
 * point.
 */
Sphere.prototype.tangentPlaneNormalAt = function(q) {
	return this.sub(q).normalize();
};

Sphere.prototype.toMesh = function() {
	//this fn requires SurfaceMeshBuilder, loading it here to avoid circular dependency
	//var SurfaceMeshBuilder = require('./mesh/SurfaceMeshBuilder');

	//if one argument is passed it can either be a Number for resolution, or an options object
	//if 2 parameters are passed it must be a TriangleMesh and then a Number for resolution
	var opts = {
		mesh: undefined,
		resolution: 0
	};
	if(arguments.length === 1){
		if(arguments[0] instanceof Object){ //options object
			opts.mesh = arguments[0].mesh;
			opts.resolution = arguments[0].res || arguments[0].resolution;
		} else { //it was just the resolution Number
			opts.resolution = arguments[0];
		}
	} else {
		opts.mesh = arguments[0];
		opts.resolution = arguments[1];
	}
	var builder = new SurfaceMeshBuilder(new SphereFunction(this));
	return builder.createMesh(opts.mesh, opts.resolution, 1);
};

module.exports = Sphere;
});

define('main',['toxi/geom/Sphere'], function(Sphere){

  console.log("using require.js");
  console.log(new Sphere(200).toMesh(undefined,20));


/*require(["toxi/geom"],function(Vec3D,AABB){
    for(var i=0;i<arguments.length;i++){
        console.log(arguments[i]);
    }
});*/
});
