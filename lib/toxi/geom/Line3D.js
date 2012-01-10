define(["require", "exports", "module", "../math/mathUtils"], function(require, exports, module) {

var mathUtils = require('../math/mathUtils');

/**
 @class
 @member toxi
 */
var Line3D = function(vec_a, vec_b) {
    this.a = vec_a;
    this.b = vec_b;
};

Line3D.prototype = {
	
	closestLineTo: function(l) {

       var p43 = l.a.sub(l.b);
       if (p43.isZeroVector()) {
           return new Line3D.LineIntersection(Line3D.LineIntersection.Type.NON_INTERSECTING);
       }

       var p21 = this.b.sub(this.a);
       if (p21.isZeroVector()) {
           return new Line3D.LineIntersection(Line3D.LineIntersection.Type.NON_INTERSECTING);
       }
       var p13 = this.a.sub(l.a);

       var d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z;
       var d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z;
       var d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z;
       var d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z;
       var d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z;

       var denom = d2121 * d4343 - d4321 * d4321;
       if (Math.abs(denom) < mathUtils.EPS) {
           return new Line3D.LineIntersection(Line3D.LineIntersection.Type.NON_INTERSECTING);
       }
       var numer = d1343 * d4321 - d1321 * d4343;
       var mua = numer / denom;
       var mub = (d1343 + d4321 * mua) / d4343;

       var pa = this.a.add(p21.scaleSelf(mua));
       var pb = l.a.add(p43.scaleSelf(mub));
       return new Line3D.LineIntersection(Line3D.LineIntersection.Type.INTERSECTING, new Line3D(pa, pb), mua,mub);
	},

   /**
    * Computes the closest point on this line to the given one.
    * 
    * @param p
    *            point to check against
    * @return closest point on the line
    */
	closestPointTo: function(p) {
       var v = this.b.sub(this.a);
       var t = p.sub(this.a).dot(v) / v.magSquared();
       // Check to see if t is beyond the extents of the line segment
       if (t < 0.0) {
           return this.a.copy();
       } else if (t > 1.0) {
           return this.b.copy();
       }
       // Return the point between 'a' and 'b'
       return this.a.add(v.scaleSelf(t));
	},

	copy: function() {
       return new Line3D(this.a.copy(), this.b.copy());
	},

	equals: function(obj) {
       if (this == obj) {
           return true;
       }
       if ((typeof(obj) != Line3D)) {
           return false;
       }
       return (this.a.equals(obj.a) || this.a.equals(l.b)) && (this.b.equals(l.b) || this.b.equals(l.a));
	},

   getDirection: function() {
       return this.b.sub(this.a).normalize();
   },

   getLength: function() {
       return this.a.distanceTo(this.b);
   },

   getLengthSquared: function() {
       return this.a.distanceToSquared(this.b);
   },

   getMidPoint: function() {
       return this.a.add(this.b).scaleSelf(0.5);
   },

   getNormal: function() {
       return this.b.cross(this.a);
   },

   hasEndPoint: function(p) {
       return this.a.equals(p) || this.b.equals(p);
   },


	offsetAndGrowBy: function(offset,scale,ref) {
		var m = this.getMidPoint(),
			d = this.getDirection(),
			n = this.a.cross(d).normalize();
       if (ref !== undefined && m.sub(ref).dot(n) < 0) {
           n.invert();
       }
       n.normalizeTo(offset);
       this.a.addSelf(n);
       this.b.addSelf(n);
       d.scaleSelf(scale);
       this.a.subSelf(d);
       this.b.addSelf(d);
       return this;
   },

   set: function(vec_a, vec_b) {
       this.a = vec_a;
       this.b = vec_b;
       return this;
   },


   splitIntoSegments: function(segments,stepLength, addFirst) {
       return Line3D.splitIntoSegments(this.a, this.b, stepLength, segments, addFirst);
   },


  toString: function() {
       return this.a.toString() + " -> " + this.b.toString();
   }
};

/**
    * Splits the line between A and B into segments of the given length,
    * starting at point A. The tweened points are added to the given result
    * list. The last point added is B itself and hence it is likely that the
    * last segment has a shorter length than the step length requested. The
    * first point (A) can be omitted and not be added to the list if so
    * desired.
    * 
    * @param a
    *            start point
    * @param b
    *            end point (always added to results)
    * @param stepLength
    *            desired distance between points
    * @param segments
    *            existing array list for results (or a new list, if null)
    * @param addFirst
    *            false, if A is NOT to be added to results
    * @return list of result vectors
    */
Line3D.splitIntoSegments = function(vec_a, vec_b, stepLength, segments, addFirst) {
    if (segments === undefined) {
        segments = [];
    }
    if (addFirst) {
        segments.push(vec_a.copy());
    }
    var dist = vec_a.distanceTo(vec_b);
    if (dist > stepLength) {
        var pos = vec_a.copy();
        var step = vec_b.sub(vec_a).limit(stepLength);
        while (dist > stepLength) {
            pos.addSelf(step);
            segments.push(pos.copy());
            dist -= stepLength;
        }
    }
    segments.push(vec_b.copy());
    return segments;
};


Line3D.LineIntersection = function(type,line,mua,mub){
	this.type = type;
	if(mua === undefined){ mua = 0; }
	if(mub === undefined){ mub = 0; }
	this.line = line;
	this.coeff = [mua,mub];
};

Line3D.LineIntersection.prototype = {
	
	getCoefficient: function(){
		return this.coeff;
	},
	
	getLength: function(){
		if(this.line === undefined){ return undefined; }
		return this.line.getLength();
	},
	
	getLine: function(){
		if(this.line === undefined){ return undefined; }
		return this.line.copy();
	},
	
	getType: function(){
		return this.type;
	},
	
	isIntersectionInside: function(){
		return this.type == Line3D.LineIntersection.Type.INTERSECTING && this.coeff[0] >= 0 && this.coeff[0] <= 1 && this.coeff[1] >=0 && this.coeff[1] <= 1;
	},
	
	toString: function(){
		return "type: "+this.type+ " line: "+this.line;
	}
};
	
Line3D.LineIntersection.Type = {
	NON_INTERSECTING: 0,
	INTERSECTING: 1
};

module.exports = Line3D;

});
