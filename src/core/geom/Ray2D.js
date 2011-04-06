toxi.Ray2D = function(a,b,d){
	var o, dir;
	if(typeof a == 'Number'){
		o = new toxi.Vec2D(a,b);
		dir = d.getNormalized();
	}
	else if(a instanceof toxi.Vec2D){
		o = a;
		dir = b.getNormalized();
	}
	else {
		o = new toxi.Vec2D();
		dir = toxi.Vec2D.Y_AXIS.copy();
	}
	this.parent.init.call(this,o);
	this.dir = dir;
}

toxi.Ray2D.prototype = new toxi.Vec2D();
toxi.Ray2D.constructor = toxi.Ray2D;
toxi.Ray2D.prototype.parent = toxi.Vec2D.prototype;


toxi.Ray2D.prototype.getDirection = function() {
      return this.dir.copy();
}



/**
 * Calculates the distance between the given point and the infinite line
 * coinciding with this ray.
 */
toxi.Ray2D.prototype.getDistanceToPoint = function(p) {
    var sp = p.sub(this);
    return sp.distanceTo(this.dir.scale(sp.dot(this.dir)));
}

toxi.Ray2D.prototype.getPointAtDistance = function(dist) {
    return this.add(this.dir.scale(dist));
}

/**
 * Uses a normalized copy of the given vector as the ray direction.
 * 
 * @param d
 *            new direction
 * @return itself
 */
toxi.Ray2D.prototype.setDirection = function(d) {
    this.dir.set(d).normalize();
    return this;
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
toxi.Ray2D.prototype.toLine2DWithPointAtDistance = function(dist) {
    return new toxi.Line2D(this.copy(), this.getPointAtDistance(dist));
}

toxi.Ray2D.prototype.toString = function() {
    return "origin: " + this.parent.toString.call(this) + " dir: " + this.dir;
}
