/**
 * This class overrides {@link Ellipse} to define a 2D circle and provides
 * several utility methods for it, including factory methods to construct
 * circles from points.
 */
 
toxi.Circle = function(a,b,c) {
	if(arguments.length == 1){
		if(a instanceof toxi.Circle){
			toxi.Ellipse.apply(this,[a,a.radius.x]);
		} else {
			toxi.Ellipse.apply(this,[0,0,a]);
		}
	} else if(arguments.length == 2){
		toxi.Ellipse.apply(this,[a,b]);
	} else {
		console.log("hit");
		toxi.Ellipse.apply(this,[a,b,c,c]);
	}
};

toxi.extend(toxi.Circle,toxi.Ellipse);





/**
 * Factory method to construct a circle which has the two given points lying
 * on its perimeter. If the points are coincident, the circle will have a
 * radius of zero.
 * 
 * @param p1
 * @param p2
 * @return new circle instance
 */
toxi.Circle.from2Points = function(p1,p2) {
    var m = p1.interpolateTo(p2, 0.5);
    var distanceTo = m.distanceTo(p1);
    return new toxi.Circle(m, distanceTo);
};

/**
 * Factory method to construct a circle which has the three given points
 * lying on its perimeter. The function returns null, if the 3 points are
 * co-linear (in which case it's impossible to find a circle).
 * 
 * Based on CPP code by Paul Bourke:
 * http://local.wasp.uwa.edu.au/~pbourke/geometry/circlefrom3/
 * 
 * @param p1
 * @param p2
 * @param p3
 * @return new circle instance or null
 */
toxi.Circle.from3Points = function(p1,p2,p3) {
    var circle,
		deltaA = p2.sub(p1),
		deltaB = p3.sub(p2),
		centroid,
		radius;
	if (toxi.MathUtils.abs(deltaA.x) <= 0.0000001 && toxi.MathUtils.abs(deltaB.y) <= 0.0000001) {
		centroid = new toxi.Vec2D(p2.x + p3.x, p1.y + p2.y).scaleSelf(0.5);
		radius = centroid.distanceTo(p1);
		circle = new toxi.Circle(centroid, radius);
	} else {
		var aSlope = deltaA.y / deltaA.x;
		var bSlope = deltaB.y / deltaB.x;
		if (toxi.MathUtils.abs(aSlope - bSlope) > 0.0000001 && aSlope !== 0) {
			var x = (aSlope * bSlope * (p1.y - p3.y) + bSlope * (p1.x + p2.x) - aSlope * (p2.x + p3.x)) / (2 * (bSlope - aSlope));
			var y = -(x - (p1.x + p2.x) / 2) / aSlope + (p1.y + p2.y) / 2;
			centroid = new toxi.Vec2D(x, y);
			radius = centroid.distanceTo(p1);
			circle = new toxi.Circle(centroid, radius);
		}
	}
    return circle;
};




toxi.Circle.prototype.containsPoint = function(p) {
    return this.distanceToSquared(p) <= this.radius.x * this.radius.x;
};

toxi.Circle.prototype.getCircumference = function() {
    return toxi.MathUtils.TWO_PI * this.radius.x;
};

toxi.Circle.prototype.getRadius = function() {
    return this.radius.x;
};

toxi.Circle.prototype.getTangentPoints = function(p) {
    var m = this.interpolateTo(p, 0.5);
    return this.intersectsCircle(new toxi.Circle(m, m.distanceTo(p)));
};


toxi.Circle.prototype.intersectsCircle = function(c) {
    var res,
		delta = c.sub(this),
		d = delta.magnitude(),
		r1 = this.radius.x,
		r2 = c.radius.x;
    if (d <= r1 + r2 && d >= Math.abs(r1 - r2)) {
        var a = (r1 * r1 - r2 * r2 + d * d) / (2.0 * d);
        d = 1 / d;
        var p = this.add(delta.scale(a * d));
        var h = Math.sqrt(r1 * r1 - a * a);
        delta.perpendicular().scaleSelf(h * d);
        var i1 = p.add(delta);
        var i2 = p.sub(delta);
        res = [i1, i2 ];
    }
    return res;
};

toxi.Circle.prototype.setRadius = function(r) {
    this.setRadii(r, r);
    return this;
};

