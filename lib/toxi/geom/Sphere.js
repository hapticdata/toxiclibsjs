define(function( require ) {

	//2 modules defined
	var Sphere, SphereFunction;

	//Sphere
	(function(){
		var internals = require('../internals');
		var meshCommon = require('./mesh/meshCommon');
		var Vec3D = require('./Vec3D');
		/**
		 * @module toxi.geom.Sphere
		 * @augments toxi.geom.Vec3D
		 */
		Sphere = function(a,b){
			if(a === undefined){
				Vec3D.apply(this,[new Vec3D()]);
				this.radius = 1;
			} else if( internals.has.XYZ( a ) ){
				Vec3D.apply(this,[a]);
				if( internals.is.Sphere( a ) ){
					this.radius = a.radius;
				} else {
					this.radius = b;
				}
			} else {
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
		 * @param ray
		 * @return 2-element float array of intersection points or null if ray
		 * doesn't intersect sphere at all.
		 */
		Sphere.prototype.intersectRay = function(ray) {
			var result, a, b, t,
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

			var builder = new meshCommon.SurfaceMeshBuilder(new SphereFunction(this));
			return builder.createMesh(opts.mesh, opts.resolution, 1);
		};
	}());


	//toxi.geom.mesh.SphereFunction
	(function( Sphere ){
		//SphereFunction
		var mathUtils = require('../math/mathUtils'),
			Vec3D = require('./Vec3D'),
			internals = require('../internals');

		/**
		 * @class This implementation of a {@link SurfaceFunction} samples a given
		 * {@link Sphere} instance when called by the {@link SurfaceMeshBuilder}.
		 * @member toxi
		 */
		SphereFunction = function(sphere_or_radius) {
			if(sphere_or_radius === undefined){
				this.sphere = new Sphere(new Vec3D(),1);
			}

			if(internals.is.Sphere( sphere_or_radius )){
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
	}( Sphere ));

	Sphere.SphereFunction = SphereFunction;
	return Sphere;

});
