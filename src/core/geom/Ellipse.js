/**
 * This class defines a 2D ellipse and provides several utility methods for it.
 */

toxi.Ellipse = function(a,b,c,d) {
	this.radius = new toxi.Vec2D();
	if(arguments.length == 0){
		this.parent.init.call(this,0,0);
		this.setRadii(1,1);
	}
	else if(a instanceof toxi.Vec2D)
	{
		this.parent.init.call(this,a.x,a.y);
		if(b instanceof toxi.Vec2D)
		{
			this.setRadii(b.x,b.y);
		}
		else
		{
			this.setRadii(b,b);
		}
	}
	else
	{
		if(d === undefined)
		{
			if(c === undefined)
			{
				this.parent.init.call(this,0,0);
				this.setRadii(a,b);
			}
			else
			{
				this.parent.init.call(this,a,b);
				this.setRadii(c,c);
			}
		}
		else
		{
			this.parent.init.call(this,a,b);
			this.setRadii(c,d);
		}
	}
}

 
toxi.Ellipse.prototype = new toxi.Vec2D();
toxi.Ellipse.prototype.constructor = toxi.Ellipse;
toxi.Ellipse.prototype.parent = toxi.Vec2D.prototype;

toxi.Ellipse.prototype.containsPoint = function(p) {
    var foci = this.getFoci();
    return p.distanceTo(foci[0]) + p.distanceTo(foci[1]) < 2 * MathUtils.max(this.radius.x, this.radius.y);
}

/**
 * Computes the area covered by the ellipse.
 * 
 * @return area
 */
toxi.Ellipse.prototype.getArea = function() {
    return MathUtils.PI * radius.x * radius.y;
}

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
toxi.Ellipse.prototype.getCircumference = function() {
    // wikipedia solution:
    // return (float) (MathUtils.PI * (3 * (radius.x + radius.y) - Math
    // .sqrt((3 * radius.x + radius.y) * (radius.x + 3 * radius.y))));
    return Math.sqrt(0.5 * this.radius.magSquared()) * MathUtils.TWO_PI;
}

/**
 * @return the focus
 */
toxi.Ellipse.prototype.getFoci = function() {
    var foci = [];
    if (this.radius.x > this.radius.y) {
        foci[0] = this.sub(this.focus, 0);
        foci[1] = this.add(this.focus, 0);
    } else {
        foci[0] = this.sub(0, this.focus);
        foci[1] = this.add(0, this.focus);
    }
    return foci;
}

/**
 * @return the 2 radii of the ellipse as a Vec2D
 */
toxi.Ellipse.prototype.getRadii = function() {
    return this.radius.copy();
}


/**
 * Sets the radii of the ellipse to the new values.
 * 
 * @param rx
 * @param ry
 * @return itself
 */
toxi.Ellipse.prototype.setRadii = function(rx,ry) {
	if(rx instanceof toxi.Vec2D)
	{
		ry = rx.y;
		rx = rx.x;
	}
    this.radius.set(rx, ry);
    this.focus = this.radius.magnitude();
    return this;
}

/**
 * Creates a {@link Polygon2D} instance of the ellipse sampling it at the
 * given resolution.
 * 
 * @param res
 *            number of steps
 * @return ellipse as polygon
 */
toxi.Ellipse.prototype.toPolygon2D = function(res) {
    var poly = new toxi.Polygon2D();
    var step = MathUtils.TWO_PI / res;
    for (var i = 0; i < res; i++) {
        poly.add(toxi.Vec2D.fromTheta(i * step).scaleSelf(this.radius).addSelf(this));
    }
    return poly;
}

