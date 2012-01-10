define(["require", "exports", "module", "../internals","../math/mathUtils","./Ray3D","./Vec3D","./mesh/TriangleMesh"], function(require, exports, module) {

var extend = require('../internals').extend,
	mathUtils = require('../math/mathUtils'),
	Ray3D = require('./Ray3D'),
	Vec3D = require('./Vec3D'),
	TriangleMesh = require('./mesh/TriangleMesh');

/**
 * @class
 * @member toxi
 * @augments Vec3D
 */
var	Plane = function(tri_or_origin,norm) {
	var origin, normal;
	if(arguments.length === 0){
		origin = new Vec3D();
		normal = Vec3D.Y_AXIS.copy();
	} else if(arguments.length == 1){ //it should've been a Triangle
		origin = arguments[0].computeCentroid();
		normal = arguments[0].computeNormal();
	} else { //Vec3D, Vec3D
		origin = arguments[0];
		normal = arguments[1].getNormalized();
	}
	Vec3D.apply(this,[origin]);
	this.normal = normal;
};
extend(Plane,Vec3D);
Plane.Classifier = {
	FRONT: "front",
	BACK: "back",
	ON_PLANE: "on plane"
};
Plane.XY = new Plane(new Vec3D(), Vec3D.Z_AXIS);
Plane.XZ = new Plane(new Vec3D(), Vec3D.Y_AXIS);
Plane.YZ = new Plane(new Vec3D(), Vec3D.X_AXIS);


/**
* Classifies the relative position of the given point to the plane using
* the given tolerance.
* @return One of the 3 classification types: FRONT, BACK, ON_PLANE
*/
Plane.prototype.classifyPoint = function(p, tolerance){
	var d = this.sub(p).normalize().dot(this.normal);
	if( d < -tolerance){
		return Plane.Classifier.FRONT;
	} else if( d > tolerance){
		return Plane.Classifier.BACK;
	}
	return Plane.Classifier.ON_PLANE;
};

Plane.prototype.containsPoint = function(p){
	return this.classifyPoint(p, mathUtils.EPS) == Plane.Classifier.ON_PLANE;
};

Plane.prototype.getDistanceToPoint = function(p){
	var sn = this.normal.dot(p.sub(this)),
		sd = this.normal.magSquared(),
		isec = p.add(this.normal.scale(sn / sd));
		return isec.distanceTo(p);
};

Plane.prototype.getIntersectionWithRay = function(r){
	var denom = this.normal.dot(r.getDirection()),
		u;
	if(denom > mathUtils.EPS){
		u = this.normal.dot(this.sub(r)) / denom;
		return r.getPointAtDistance(u);
	} else {
		return undefined;
	}
};

Plane.prototype.getProjectedPoint = function(p){
	var dir, proj;
	if(this.normal.dot(this.sub(p)) < 0){
		dir = this.normal.getInverted();
	} else {
		dir = this.normal;
	}
	proj = new Ray3D(p,dir).getPointAtDistance(this.getDistanceToPoint(p));
	return proj;
};
/**
* Calculates the distance of the vector to the given plane in the specified
* direction. A plane is specified by a 3D point and a normal vector
* perpendicular to the plane. Normalized directional vectors expected (for
* rayDir and planeNormal).
* 
* @param {Ray3D} ray intersection ray
* @return {Number} distance to plane in world units, -1 if no intersection.
*/

Plane.prototype.intersectRayDistance = function(ray){
	var d = this.normal.dot(this),
		numer = this.normal.dot(ray) + d,
		denom = this.normal.dot(ray.dir);

		//normal is orthogonal to vector, cant intersect
		if(mathUtils.abs(denom) < mathUtils.EPS){
			return -1;
		}
		return - (numer / denom);
};

/**
* Creates a TriangleMesh representation of the plane as a finite, squared
* quad of the requested size, centred around the current plane point.
* @param {TriangleMesh} mesh (optional)
* @param size desired edge length
* @return mesh
*/

Plane.prototype.toMesh = function(a,b){
	var size, mesh,
		p,
		n, m, a, b, c, d;
	if(arguments.length == 1){
		size = a;
		mesh = new TriangleMesh("plane", 4, 2);
	} else {
		mesh = a;
		size = b;
	}
};

module.exports = Plane;


});
