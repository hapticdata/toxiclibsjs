function Ray2D(a,b,d){
	var o, dir;
	if(typeof a == 'Number'){
		o = new Vec2D(a,b);
		dir = d.getNormalized();
	}
	else if(typeof a == 'Vec2D'){
		o = a;
		dir = b.getNormalized();
	}
	else {
		o = new Vec2D();
		dir = Vec2D.Y_AXIS.copy();
	}
	this.parent.init.call(this,o);
	this.dir = dir;
}

Ray2D.prototype = new Vec2D();
Ray2D.constructor = Ray2D;
Ray2D.prototype.parent = Vec2D.prototype;


Ray2D.prototype.getDirection = function() {
      return this.dir.copy();
}



/**
 * Calculates the distance between the given point and the infinite line
 * coinciding with this ray.
 * 
 * @param p
 * @return
 */
Ray2D.prototype.getDistanceToPoint = function(p) {
    var sp = p.sub(this);
    return sp.distanceTo(this.dir.scale(sp.dot(this.dir)));
}

Ray2D.prototype.getPointAtDistance = function(dist) {
    return this.add(this.dir.scale(dist));
}

/**
 * Uses a normalized copy of the given vector as the ray direction.
 * 
 * @param d
 *            new direction
 * @return itself
 */
Ray2D.prototype.setDirection = function(d) {
    this.dir.set(d).normalize();
    return this;
}


}

/**
 * Converts the ray into a 2D Line segment with its start point coinciding
 * with the ray origin and its other end point at the given distance along
 * the ray.
 * 
 * @param dist
 *            end point distance
 * @return line segment
 */
Ray2D.prototype.toLine2DWithPointAtDistance = function(dist) {
    return new Line2D(this, this.getPointAtDistance(dist));
}

Ray2D.prototype.toString = function() {
    return "origin: " + this.parent.toString.call(this) + " dir: " + this.dir;
}
