define(["require", "exports", "module", "../internals","./Vec3D","./mesh/SphereFunction"], function(require, exports, module) {

var	internals = require('../internals'),
	Vec3D = require('./Vec3D'),
	SphereFunction = require('./mesh/SphereFunction');
	
var	SurfaceMeshBuilder;
	require(['./mesh/SurfaceMeshBuilder'],function(SMB){
		SurfaceMeshBuilder = SMB;
	});




/**
 * @module toxi.geom.Sphere
 * @augments toxi.geom.Vec3D
 */
var	Sphere = function(a,b){
	if(a === undefined){
		Vec3D.apply(this,[new Vec3D()]);
		this.radius = 1;
	}
	else if( internals.tests.hasXYZ( a ) ){
		Vec3D.apply(this,[a]);
		if( internals.tests.isSphere( a ) ){
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

internals.extend(Sphere,Vec3D);


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
		if(typeof(arguments[0]) == 'object'){ //options object
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
