toxi.Ray3D = function(a,b,c,d){
	var o, dir;
	if(arguments.length == 4){
		o = new toxi.Vec3D(a,b,c);
		dir = d;
	}
	else if(arguments.length == 2){
		o = a;
		dir = b;
	}
	else {
		o = new toxi.Vec3D();
		dir = toxi.Vec3D.Y_AXIS.copy();
	}
	toxi.Vec3D.apply(this,[o]);
	this.dir = dir;
};

toxi.extend(toxi.Ray3D,toxi.Vec3D);

/**
	Returns a copy of the ray's direction vector.
	@return vector
*/
toxi.Ray3D.prototype.getDirection = function() {
    return this.dir.copy();
};

/**
	Calculates the distance between the given point and the infinite line
	coinciding with this ray.
	@param p
*/
toxi.Ray3D.prototype.getDistanceToPoint = function(p) {
    var sp = p.sub(this);
    return sp.distanceTo(this.dir.scale(sp.dot(this.dir)));
};

/**
	Returns the point at the given distance on the ray. The distance can be
	any real number.
	@param dist
	@return vector
*/
toxi.Ray3D.prototype.getPointAtDistance = function(dist) {
    return this.add(this.dir.scale(dist));
};

/**
  Uses a normalized copy of the given vector as the ray direction. 
  @param d new direction
  @return itself
*/
toxi.Ray3D.prototype.setDirection = function(d) {
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
toxi.Ray3D.prototype.toLine3DWithPointAtDistance = function(dist) {
    return new toxi.Line3D(this, this.getPointAtDistance(dist));
};

toxi.Ray3D.prototype.toString = function() {
    return "origin: " + this.parent.toString.call(this) + " dir: " + this.dir;
};