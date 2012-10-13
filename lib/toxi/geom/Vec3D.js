define(["require", "exports", "module", "./Vec2D","./AABB","../math/mathUtils", "../internals"], function(require, exports, module) {

var internals = require('../internals'),
	Vec2D = require('./Vec2D'),
	AABB = require('./AABB'),
	mathUtils = require('../math/mathUtils');


/**
 * @member toxi
 * @class Creates a new vector with the given coordinates. Coordinates will default to zero
 * @param {Number} x the x
 * @param {Number} y the y
 * @param {Number} z the z
 */
var Vec3D = function(x, y, z){
	if( internals.tests.hasXYZ( x ) ){
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
		if( internals.tests.hasXYZ( a ) ){
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
		if( internals.tests.isAABB( box_or_min ) ){
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
		this.z = this.x * vec.y - vec.x * this.y;
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
		if( internals.tests.hasXYZ( vec ) ){
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
		if(typeof(id) == 'number'){
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
		if( internals.tests.hasXYZ( a ) ) { //if it was a vec3d that was passed
			return new Vec3D(this.x * a.x, this.y * a.y, this.z * a.z);
		}
		else if(b === undefined || c === undefined) { //if only one float was passed
			b = c = a;
		}
		return new Vec3D(this.x * a, this.y * b, this.z * c);
	},
	
	scaleSelf: function(a,b,c) {
		if( internals.tests.hasXYZ( a ) ){
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
		if( internals.tests.hasXYZ( a ) )
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
		if( internals.tests.hasXYZ( a ) ){
			return  new Vec3D(this.x - a.x, this.y - a.y, this.z - a.z);
		} else if(b === undefined || c === undefined) {
			b = c = a;
		}
		return new Vec3D(this.x - a, this.y - b, this.z - c);
	},
	
	subSelf: function(a,b,c){
		if( internals.tests.hasXYZ( a ) ){
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
