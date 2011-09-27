toxi.Plane = function(tri_or_origin,norm) {
	var origin, normal;
	if(arguments.length === 0){
		origin = new toxi.Vec3D();
		normal = toxi.Vec3D.Y_AXIS.copy();
	} else if(arguments.length == 1){ //it should've been a Triangle
		origin = arguments[0].computeCentroid();
		normal = arguments[0].computeNormal();
	} else { //Vec3D, Vec3D
		origin = arguments[0];
		normal = arguments[1].getNormalized();
	}
	toxi.Vec3D.apply(this,[origin]);
	this.normal = normal;
};
toxi.extend(toxi.Plane,toxi.Vec3D);
toxi.Plane.Classifier = {
	FRONT: "front",
	BACK: "back",
	ON_PLANE: "on plane"
};
toxi.Plane.XY = new toxi.Plane(new toxi.Vec3D(), toxi.Vec3D.Z_AXIS);
toxi.Plane.XZ = new toxi.Plane(new toxi.Vec3D(), toxi.Vec3D.Y_AXIS);
toxi.Plane.YZ = new toxi.Plane(new toxi.Vec3D(), toxi.Vec3D.X_AXIS);


/**
* Classifies the relative position of the given point to the plane using
* the given tolerance.
* @return One of the 3 classification types: FRONT, BACK, ON_PLANE
*/
toxi.Plane.prototype.classifyPoint = function(p, tolerance){
	var d = this.sub(p).normalize().dot(this.normal);
	if( d < -tolerance){
		return toxi.Plane.Classifier.FRONT;
	} else if( d > tolerance){
		return toxi.Plane.Classifier.BACK;
	}
	return toxi.Plane.Classifier.ON_PLANE;
};

toxi.Plane.prototype.containsPoint = function(p){
	return this.classifyPoint(p, toxi.MathUtils.EPS) == toxi.Plane.Classifier.ON_PLANE;
};

toxi.Plane.prototype.getDistanceToPoint = function(p){
	var sn = this.normal.dot(p.sub(this)),
		sd = this.normal.magSquared(),
		isec = p.add(this.normal.scale(sn / sd));
		return isec.distanceTo(p);
};

toxi.Plane.prototype.getIntersectionWithRay = function(r){
	var denom = this.normal.dot(r.getDirection()),
		u;
	if(denom > toxi.MathUtils.EPS){
		u = this.normal.dot(this.sub(r)) / denom;
		return r.getPointAtDistance(u);
	} else {
		return undefined;
	}
};

toxi.Plane.prototype.getProjectedPoint = function(p){
	var dir, proj;
	if(this.normal.dot(this.sub(p)) < 0){
		dir = this.normal.getInverted();
	} else {
		dir = this.normal;
	}
	proj = new toxi.Ray3D(p,dir).getPointAtDistance(this.getDistanceToPoint(p));
	return proj;
};
/**
* Calculates the distance of the vector to the given plane in the specified
* direction. A plane is specified by a 3D point and a normal vector
* perpendicular to the plane. Normalized directional vectors expected (for
* rayDir and planeNormal).
* 
* @param {toxi.Ray3D} ray intersection ray
* @return {Number} distance to plane in world units, -1 if no intersection.
*/

toxi.Plane.prototype.intersectRayDistance = function(ray){
	var d = this.normal.dot(this),
		numer = this.normal.dot(ray) + d,
		denom = this.normal.dot(ray.dir);

		//normal is orthogonal to vector, cant intersect
		if(toxi.MathUtils.abs(denom) < toxi.MathUtils.EPS){
			return -1;
		}
		return - (numer / denom);
};

/**
* Creates a TriangleMesh representation of the plane as a finite, squared
* quad of the requested size, centred around the current plane point.
* @param {toxi.TriangleMesh} mesh (optional)
* @param size desired edge length
* @return mesh
*/

toxi.Plane.prototype.toMesh = function(a,b){
	var size, mesh,
		p,
		n, m, a, b, c, d;
	if(arguments.length == 1){
		size = a;
		mesh = new toxi.TriangleMesh("plane", 4, 2);
	} else {
		mesh = a;
		size = b;
	}
};

