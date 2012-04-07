define(["require", "exports", "module", "../math/mathUtils","./Vec3D","./Vec3D","./Vec3D","./Vec3D", '../internals'], function(require, exports, module) {
var	mathUtils = require('../math/mathUtils');
var internals = require('../internals');

var hasXY = internals.tests.hasXY;
var isRect = internals.tests.isRect;

/**
 @member toxi
 @class a two-dimensional vector class
 */
var	Vec2D = function(a,b){
	if( hasXY( a ) ){
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
	if( hasXY( a ) ){
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
		if( hasXY( a ) && hasXY( b ) ){
			this.x = mathUtils.clip(this.x, a.x, b.x);
	        this.y = mathUtils.clip(this.y, a.y, b.y);
		} else if( isRect( a ) ){
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
        if ( hasXY( obj ) ) {
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
