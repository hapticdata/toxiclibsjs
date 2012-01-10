define(["require", "exports", "module", "../internals","./Vec3D","./Line3D"], function(require, exports, module) {

var extend = require('../internals').extend,
	Vec3D = require('./Vec3D'),
	Line3D = require('./Line3D');

/**
 * @class
 * @member toxi
 */
var	Ray3D = function(a,b,c,d){
	var o, dir;
	if(arguments.length == 4){
		o = new Vec3D(a,b,c);
		dir = d;
	}
	else if(arguments.length == 2){
		o = a;
		dir = b;
	}
	else {
		o = new Vec3D();
		dir = Vec3D.Y_AXIS.copy();
	}
	Vec3D.apply(this,[o]);
	this.dir = dir;
};

extend(Ray3D,Vec3D);

/**
	Returns a copy of the ray's direction vector.
	@return vector
*/
Ray3D.prototype.getDirection = function() {
    return this.dir.copy();
};

/**
	Calculates the distance between the given point and the infinite line
	coinciding with this ray.
	@param p
*/
Ray3D.prototype.getDistanceToPoint = function(p) {
    var sp = p.sub(this);
    return sp.distanceTo(this.dir.scale(sp.dot(this.dir)));
};

/**
	Returns the point at the given distance on the ray. The distance can be
	any real number.
	@param dist
	@return vector
*/
Ray3D.prototype.getPointAtDistance = function(dist) {
    return this.add(this.dir.scale(dist));
};

/**
  Uses a normalized copy of the given vector as the ray direction. 
  @param d new direction
  @return itself
*/
Ray3D.prototype.setDirection = function(d) {
    this.dir.set(d).normalize();
    return this;
};

/**
  Converts the ray into a 3D Line segment with its start point coinciding
  with the ray origin and its other end point at the given distance along
  the ray.
  
  @param dist end point distance
  @return line segment
*/
Ray3D.prototype.toLine3DWithPointAtDistance = function(dist) {
    return new Line3D(this, this.getPointAtDistance(dist));
};

Ray3D.prototype.toString = function() {
    return "origin: " + this.parent.toString.call(this) + " dir: " + this.dir;
};

module.exports = Ray3D;
});
