toxi.Sphere = function(a,b){
	if(a === undefined){
		toxi.Vec3D.apply(this,[new toxi.Vec3D()]);
		this.radius = 1;
	}
	else if(a instanceof toxi.Vec3D){
		toxi.Vec3D.apply(this,[a]);
		if(a instanceof toxi.Sphere){
			this.radius = a.radius;
		}
		else {
			this.radius = b;
		}
	}
	else {
		toxi.Vec3D.apply(this,[new toxi.Vec3D()]);
		this.radius = a;
	}
};
toxi.extend(toxi.Sphere,toxi.Vec3D);


toxi.Sphere.prototype.containsPoint = function(p) {
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
 *         doesn't intersect sphere at all.
 */
toxi.Sphere.prototype.intersectRay = function(ray) {
    var result = null;
    var q = ray.sub(this),
		distSquared = q.magSquared();
    	v = -q.dot(ray.getDirection()),
    	d = this.radius * this.radius - (distSquared - v * v);
    if (d >= 0.0) {
        d = Math.sqrt(d),
        a = v + d,
        b = v - d;
        if (!(a < 0 && b < 0)) {
            if (a > 0 && b > 0) {
                if (a > b) {
                    var t = a;
                    a = b;
                    b = t;
                }
            } else {
                if (b > 0) {
                    var t = a;
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
 *            triangle to check for intersection
 * @param result
 *            a non-null vector for storing the result
 * @return true, if sphere intersects triangle ABC
 */
toxi.Sphere.prototype.intersectSphereTriangle = function(t,result) {
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
 *         point.
 */
toxi.Sphere.prototype.tangentPlaneNormalAt = function(q) {
    return this.sub(q).normalize();
};

toxi.Sphere.prototype.toMesh = function(mesh_or_res,res) {
    if(res === undefined){
    	var mesh = null;
    	var res = mesh_or_res;
    }
    else {
    	var mesh = mesh_or_res;
    	var res = res;
    }
    var builder = new toxi.SurfaceMeshBuilder(new toxi.SphereFunction(this));
    return builder.createMesh(mesh, res, 1);
};
