define(["require", "exports", "module", "./Vec2D","./Line2D","./Rect","./Circle","./Polygon2D","../math/mathUtils"], function(require, exports, module) {

var Vec2D = require('./Vec2D'),
	Line2D = require('./Line2D'),
	Rect = require('./Rect'),
	Circle = require('./Circle'),
	Polygon2D = require('./Polygon2D'),
	mathUtils = require('../math/mathUtils');

/**
 * @class
 * @member toxi
 * @param {toxi.Vec2D} a
 * @param {toxi.Vec2D} b
 * @param {toxi.Vec2D} c
 */
var	Triangle2D = function(_a,_b,_c){
	if(arguments.length === 3){
		this.a = _a.copy();
		this.b = _b.copy();
		this.c = _c.copy();
	}
};

Triangle2D.createEquilateralFrom = function(a,b){
	var c = a.interpolateTo(b,0.5),
		dir = a.sub(b),
		n = dir.getPerpendicular();
		c.addSelf(n.normalizeTo(dir.magnitude() * mathUtils.SQRT3 / 2));
		return new Triangle2D(a,b,c);
};

Triangle2D.isClockwise = function(a,b,c){
	var determ = (b.x-a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
	return (determ < 0.0);
};


Triangle2D.prototype = {
	adjustTriangleSizeBy: function(offAB,offBC,offCA){
		if(arguments.length == 1){
			offBC = offAB;
			offCA = offAB;
		}
		this.computeCentroid();
		var ab = new Line2D(this.a.copy(),this.b.copy()).offsetAndGrowBy(offAB,100000,this.centroid);
		var bc = new Line2D(this.b.copy(),this.c.copy()).offsetAndGrowBy(offBC,100000,this.centroid);
		var ca = new Line2D(this.c.copy(),this.a.copy()).offsetAndGrowBy(offCA,100000,this.centroid);
		
		this.a = ab.intersectLine(ca).getPos();
		this.b = ab.intersectLine(bc).getPos();
		this.c = bc.intersectLine(ca).getPos();
		this.computeCentroid();
		return this;
	},
	
	computeCentroid: function(){
		this.centroid = this.a.add(this.b).addSelf(this.c).scaleSelf(1/3);
		return this.centroid;
	},
	/**
     * Checks if point vector is inside the triangle created by the points a, b
     * and c. These points will create a plane and the point checked will have
     * to be on this plane in the region between a,b,c.
     * 
     * Note: The triangle must be defined in clockwise order a,b,c
     * 
     * @return true, if point is in triangle.
     */
     containsPoint: function(_p){
		var v1 = _p.sub(this.a).normalize(),
			v2 = _p.sub(this.b).normalize(),
			v3 = _p.sub(this.c).normalize(),
			totalAngles = Math.acos(v1.dot(v2));
			totalAngles += Math.acos(v2.dot(v3));
			totalAngles += Math.acos(v3.dot(v1));
			return (mathUtils.abs(totalAngles- mathUtils.TWO_PI) <= 0.01);
     },
     
     copy: function(){
		return new Triangle2D(this.a.copy(),this.b.copy(),this.c.copy());
     },
     
     flipVertexOrder: function(){
		var t = this.a;
		this.a = this.c;
		this.c = t;
		return this;
     },
     
     getArea: function(){
		return this.b.sub(this.a).cross(this.c.sub(this.a)) * 0.5;
     },
     
     getBounds: function(){
		return new Rect(Vec2D.min(Vec2D.min(a,b),c),Vec2D.max(Vec2D.max(a,b),c));
     },
     
     getCircumCircle: function(){
		var cr = this.a.bisect(this.b).cross(this.b.bisect(this.c)),
			circa = new Vec2D(cr.x/cr.z, cr.y / cr.z),
			sa = this.a.distanceTo(this.b),
			sb = this.b.distanceTo(this.c),
			sc = this.c.distanceTo(this.a);
		var radius = sa * sb * sc / Math.sqrt((sa+sb+sc) * (-sa+sb+sc)*(sa-sb+sc)*(sa+sb-sc));
		return new Circle(circa,radius);
     },
     
     getCircumference: function(){
		return this.a.distanceTo(this.b) + this.b.distanceTo(this.c) + this.c.distanceTo(this.a);
     },
     
     getClosestPointTo: function(_p){
		var edge = new Line2D(this.a,this.b),
			Rab = edge.closestPointTo(_p),
			Rbc = edge.set(this.b,this.c).closestPointTo(_p),
			Rca = edge.set(this.c,this.a).closestPointTo(_p),
			dAB = _p.sub(Rab).magSquared(),
			dBC = _p.sub(Rbc).magSquared(),
			dCA = _p.sub(Rca).magSquared(),
			min = dAB,
			result = Rab;

		if(dBC < min){
			min = dBC;
			result = Rbc;
		}
		if(dCA < min){
			result = Rca;
		}
		return result;
	},
     
	intersectsTriangle: function(tri){
		if(this.containsPoint(tri.a) || this.containsPoint(tri.b) || this.containsPoint(tri.c)){
			return true;
		}
		if(tri.containsPoint(this.a) || tri.containsPoint(this.b) || tri.containsPoint(this.c)){
			return true;
		}
		var ea = [
			new Line2D(this.a,this.b),
			new Line2D(this.b,this.c),
			new Line2D(this.c,this.a)
		];
		var eb = [
			new Line2D(tri.a,tri.b),
			new Line2D(tri.b,tri.c),
			new Line2D(tri.c,tri.a)
		];
		for(var i=0,eaLen = ea.length;i<eaLen;i++){
			var la = ea[i];
			for(var j=0,ebLen = eb.length;j<ebLen;j++){
				var lb = eb[j];
				var type = la.intersectLine(lb).getType();
				if(type != Line2D.LineIntersection.Type.NON_INTERSECTING && type != Line2D.LineIntersection.Type.PARALLEL){
					return true;
				}
			}
		}
		return false;
	},
	
	isClockwise: function(){
		return Triangle2D.isClockwise(this.a,this.b,this.c);
	},
	
	set: function(a2,b2,c2){
		this.a = a2;
		this.b = b2;
		this.c = c2;
	},
	
	toPolygon2D: function(){
		var poly = new Polygon2D();
		poly.add(this.a.copy());
		poly.add(this.b.copy());
		poly.add(this.c.copy());
		return poly;
	},
	
	toString: function(){
		return "Triangle2D: "+this.a+ ","+this.b+","+this.c;
	}

};

module.exports = Triangle2D;
});
