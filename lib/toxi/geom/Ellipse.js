define([
    'require',
    'exports',
    'module',
    '../internals/extend',
    '../internals/has',
    '../internals/is',
    '../math/mathUtils',
    './Vec2D',
    './Polygon2D'
], function(require, exports, module) {

var extend = require('../internals/extend'),
    has = require('../internals/has'),
    is = require('../internals/is'),
	mathUtils = require('../math/mathUtils'),
	Vec2D = require('./Vec2D'),
	Polygon2D = require('./Polygon2D');


//declared in this module
var Ellipse, Circle;

/**
 * @class defines a 2D ellipse and provides several utility methods for it.
 * @member toxi
 * @augments Vec2D
 */

Ellipse = function(a,b,c,d) {
	this.radius = new Vec2D();
	if(arguments.length === 0){
		Vec2D.apply(this,[0,0]);
		this.setRadii(1,1);
	} else if( has.XY( a ) ) {
		Vec2D.apply(this,[a.x,a.y]);
		if( has.XY( b ) ){
			this.setRadii(b.x,b.y);
		} else {
			this.setRadii(b,c);
		}
	} else {
		if(d === undefined) {
			if(c === undefined) {
				Vec2D.call(this, 0, 0 );
				this.setRadii(a,b);
			} else {
				Vec2D.call(this, a, b );
				this.setRadii(c,c);
			}
		} else {
			Vec2D.call(this, a,b);
			this.setRadii(c,d);
		}
	}
};

extend(Ellipse,Vec2D);

Ellipse.prototype.containsPoint = function(p) {
    var foci = this.getFoci();
    return p.distanceTo(foci[0]) + p.distanceTo(foci[1]) < 2 * mathUtils.max(this.radius.x, this.radius.y);
};

/**
 * Computes the area covered by the ellipse.
 */
Ellipse.prototype.getArea = function() {
    return mathUtils.PI * this.radius.x * this.radius.y;
};

/**
 * Computes the approximate circumference of the ellipse, using this
 * equation: <code>2 * PI * sqrt(1/2 * (rx*rx+ry*ry))</code>.
 *
 * The precise value is an infinite series elliptical integral, but the
 * approximation comes sufficiently close. See Wikipedia for more details:
 *
 * http://en.wikipedia.org/wiki/Ellipse
 *
 * @return circumference
 */
Ellipse.prototype.getCircumference = function() {
    // wikipedia solution:
    // return (float) (MathUtils.PI * (3 * (radius.x + radius.y) - Math
    // .sqrt((3 * radius.x + radius.y) * (radius.x + 3 * radius.y))));
    return Math.sqrt(0.5 * this.radius.magSquared()) * mathUtils.TWO_PI;
};

/**
 * @return the focus
 */
Ellipse.prototype.getFoci = function() {
    var foci = [];
    if (this.radius.x > this.radius.y) {
        foci[0] = this.sub(this.focus, 0);
        foci[1] = this.add(this.focus, 0);
    } else {
        foci[0] = this.sub(0, this.focus);
        foci[1] = this.add(0, this.focus);
    }
    return foci;
};

/**
 * @return the 2 radii of the ellipse as a Vec2D
 */
Ellipse.prototype.getRadii = function() {
    return this.radius.copy();
};


/**
 * Sets the radii of the ellipse to the new values.
 *
 * @param rx
 * @param ry
 * @return itself
 */
Ellipse.prototype.setRadii = function(rx,ry) {
	if( has.XY( rx ) ){
		ry = rx.y;
		rx = rx.x;
	}
    this.radius.set(rx, ry);
    this.focus = this.radius.magnitude();
    return this;
};

/**
 * Creates a {@link Polygon2D} instance of the ellipse sampling it at the
 * given resolution.
 *
 * @param res
 *            number of steps
 * @return ellipse as polygon
 */
Ellipse.prototype.toPolygon2D = function(res) {
    var Polygon2D = require('./Polygon2D');
    var poly = new Polygon2D();
    var step = mathUtils.TWO_PI / res;
    for (var i = 0; i < res; i++) {
		var v = Vec2D.fromTheta(i * step).scaleSelf(this.radius).addSelf(this);
		poly.add(v);
	}
    return poly;
};


exports = module.exports = Ellipse;

/**
 * Circle
 * @class This class overrides {@link Ellipse} to define a 2D circle and provides
 * several utility methods for it, including factory methods to construct
 * circles from points.
 * @member toxi
 * @augments Ellipse
 */
Circle = function(a,b,c) {
	if(arguments.length == 1){
		if( is.Circle( a ) ){
			Ellipse.apply(this,[a,a.radius.x]);
		} else {
			Ellipse.apply(this,[0,0,a]);
		}
	} else if(arguments.length == 2){
		Ellipse.apply(this,[a,b]);
	} else {
		Ellipse.apply(this,[a,b,c,c]);
	}
};

extend(Circle,Ellipse);





/**
 * Factory method to construct a circle which has the two given points lying
 * on its perimeter. If the points are coincident, the circle will have a
 * radius of zero.
 *
 * @param p1
 * @param p2
 * @return new circle instance
 */
Circle.from2Points = function(p1,p2) {
    var m = p1.interpolateTo(p2, 0.5);
    var distanceTo = m.distanceTo(p1);
    return new Circle(m, distanceTo);
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
Circle.from3Points = function(p1,p2,p3) {
    var circle,
		deltaA = p2.sub(p1),
		deltaB = p3.sub(p2),
		centroid,
		radius;
	if (mathUtils.abs(deltaA.x) <= 0.0000001 && mathUtils.abs(deltaB.y) <= 0.0000001) {
		centroid = new Vec2D(p2.x + p3.x, p1.y + p2.y).scaleSelf(0.5);
		radius = centroid.distanceTo(p1);
		circle = new Circle(centroid, radius);
	} else {
		var aSlope = deltaA.y / deltaA.x;
		var bSlope = deltaB.y / deltaB.x;
		if (mathUtils.abs(aSlope - bSlope) > 0.0000001 && aSlope !== 0) {
			var x = (aSlope * bSlope * (p1.y - p3.y) + bSlope * (p1.x + p2.x) - aSlope * (p2.x + p3.x)) / (2 * (bSlope - aSlope));
			var y = -(x - (p1.x + p2.x) / 2) / aSlope + (p1.y + p2.y) / 2;
			centroid = new Vec2D(x, y);
			radius = centroid.distanceTo(p1);
			circle = new Circle(centroid, radius);
		}
	}
    return circle;
};


Circle.newBoundingCircle = function( vertices ){
	var origin = new Vec2D();
	var maxD = 0;
	var i = 0;
	var l = vertices.length;
	for( ; i<l; i++ ){
		origin.addSelf( vertices[i] );
	}
	origin.scaleSelf( 1 / vertices.length );
	for( i = 0; i<l; i++ ){
		var d = origin.distanceToSquared( vertices[i] );
		if( d > maxD ) {
			maxD = d;
		}
	}
	return new Circle( origin, Math.sqrt( maxD ) );
};




Circle.prototype.containsPoint = function(p) {
    return this.distanceToSquared(p) <= this.radius.x * this.radius.x;
};

Circle.prototype.getCircumference = function() {
    return mathUtils.TWO_PI * this.radius.x;
};

Circle.prototype.getRadius = function() {
    return this.radius.x;
};

Circle.prototype.getTangentPoints = function(p) {
    var m = this.interpolateTo(p, 0.5);
    return this.intersectsCircle(new Circle(m, m.distanceTo(p)));
};


Circle.prototype.intersectsCircle = function(c) {
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

Circle.prototype.setRadius = function(r) {
    this.setRadii(r, r);
    return this;
};


exports.Circle = Circle;

});
