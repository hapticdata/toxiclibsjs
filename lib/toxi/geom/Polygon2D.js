define(["require", "exports", "module", "./Vec2D","./Line2D","./Circle","./Rect","../internals"], function(require, exports, module) {

var	internals = require('../internals'),
	MathUtils = require('../math/mathUtils'),
	Vec2D = require('./Vec2D'),
	Circle = require('./Circle'),
    Rect = require('./Rect'),
	Line2D = require('./Line2D');



/**
 * @class
 * @member toxi
 */
var Polygon2D = function(){
	this.vertices = [];
	var i,l;
	if(arguments.length > 1){ //comma-separated Vec2D's were passed in
		for(i=0, l = arguments.length;i<l;i++){
			this.add(arguments[i].copy());
		}
	} else if(arguments.length == 1){
		var arg = arguments[0];
		if( internals.is.Array( arg ) ){ // if it was an array of points
			for(i=0,l = arg.length;i<l;i++){
				this.add(arg[i].copy());
			}
		}
	} //otherwise no args were passed, and thats ok

};


Polygon2D.prototype = {
	constructor: Polygon2D,
	add: function(p){
		if(this.vertices.indexOf(p) < 0){
			this.vertices.push(p);
		}
	},
	/**
	 * centers the polygon so that its new centroid is at the given point
	 * @param {Vec2D} [origin]
	 * @return itself
	 */
	center: function( origin ){
		var centroid = this.getCentroid();
		var delta = origin !== undefined ? origin.sub( centroid ) : centroid.invert();
		for( var i=0, l = this.vertices.length; i<l; i++){
			this.vertices[i].addSelf( delta );
		}
		return this;
	},
	containsPoint: function(p){
		var num = this.vertices.length,
			i = 0,
			j = num-1,
			oddNodes = false,
			px = p.x,
			py = p.y;
		for(i=0;i<num;i++){
			var vi = this.vertices[i],
				vj = this.vertices[j];
			if (vi.y < py && vj.y >= py || vj.y < py && vi.y >= py) {
				if (vi.x + (py - vi.y) / (vj.y - vi.y) * (vj.x - vi.x) < px) {
					oddNodes = !oddNodes;
				}
			}
			j = i;
		}
		return oddNodes;
	},

	containsPolygon: function(poly) {
		for (var i=0,num=poly.vertices.length; i<num; i++) {
			if (!this.containsPoint(poly.vertices[i])) {
				return false;
			}
		}
		return true;
	},

	copy: function(){
		return new Polygon2D( this.vertices );
	},

	flipVertexOrder: function(){
		this.vertices.reverse();
		return this;
	},
	/**
	 * Returns the vertex at the given index. This function follows Python
	 * convention, in that if the index is negative, it is considered relative
	 * to the list end. Therefore the vertex at index -1 is the last vertex in
	 * the list.
	 * @param {Number} i index
	 * @return vertex
	 */
	get: function( i ){
		if( i < 0 ){
			i += this.vertices.length;
		}
		return this.vertices[i];
	},

	/**
	 * Computes the length of this polygon's apothem. This will only be valid if
	 * the polygon is regular. More info: http://en.wikipedia.org/wiki/Apothem
	 * @return apothem length
	 */
	getApothem: function() {
		return this.vertices[0]
			.interpolateTo(this.vertices[1], 0.5)
			.distanceTo( this.getCentroid() );
	},

	getArea: function(){
		var area = 0,
			numPoints = this.vertices.length;
		for(var i=0;i<numPoints;i++){
			var a = this.vertices[i],
				b = this.vertices[(i+1) % numPoints];
			area += a.x * b.y;
			area -= a.y * b.x;
		}
		area *= 0.5;
		return area;
	},

	getBoundingCircle: function() {
        var Circle = require('./Circle');
		return Circle.newBoundingCircle( this.vertices );
	},

    getBounds: function(){
        var Rect = require('./Rect');
        return Rect.getBoundingRect(this.vertices);
    },

	getCentroid: function(){
		var res = new Vec2D(),
			numPoints = this.vertices.length;
		for(var i=0;i<numPoints;i++){
			var a = this.vertices[i],
				b = this.vertices[(i+1) %numPoints],
				factor = a.x * b.y - b.x * a.y;
			res.x += (a.x + b.x) * factor;
			res.y += (a.y + b.y) * factor;
		}
		return res.scale(1 / (this.getArea() * 6));
	},

	getCircumference: function(){
		var circ = 0;
		for(var i=0,num=this.vertices.length;i<num;i++){
			circ += this.vertices[i].distanceTo(this.vertices[(i+1)%num]);
		}
		return circ;
	},

	getClosestPointTo: function( p ){
		var minD = Number.MAX_VALUE;
		var q, c, d;
		var edges = this.getEdges();
		for( var i=0, len = edges.length; i<len; i++ ){
			c = edges[i].closestPointTo( p );
			d = c.distanceToSquared( p );
			if( d < minD ){
				q = c;
				minD = d;
			}
		}
		return q;
	},

	getClosestVertexTo: function( p ){
		var minD = Number.MAX_VALUE;
		var q, d, i = 0, len = this.vertices.length;
		for( ; i<len; i++){
			d = this.vertices[i].distanceToSquared( p );
			if( d < minD ){
				q = this.vertices[i];
				minD = d;
			}
		}
		return q;
	},

	getEdges: function() {
		var num = this.vertices.length,
			edges = [];
		for (var i = 0; i < num; i++) {
			edges[i] = new Line2D(this.vertices[i], this.vertices[(i + 1) % num]);
		}
		return edges;
	},

	//@deprecated
	getNumPoints: function(){
		return this.getNumVertices();
	},

	getNumVertices: function(){
		return this.vertices.length;
	},

	getRandomPoint: function(){
		var edges = this.getEdges();
		var numEdges = edges.length;
		var ea = edges[MathUtils.random(numEdges)],
			eb;
		while( eb === undefined || eb.equals( ea ) ){
			eb = edges[ MathUtils.random(numEdges) ];
		}
		//pick a random point on edge A
		var p = ea.a.interpolateTo( ea.b, Math.random() );
		//then randomly interpolate to another point on b
		return p.interpolateToSelf(
			eb.a.interpolateTo( eb.b, Math.random() ),
			Math.random()
		);
	},
	/**
	 * Repeatedly inserts vertices as mid points of the longest edges until the
	 * new vertex count is reached.
	 * @param {Number} count new vertex count
	 * @return itself
	 */
	increaseVertexCount: function( count ){
		var num = this.vertices.length,
			longestID = 0,
			maxD = 0,
			i = 0,
			d,
			m;

		while( num < count ){
			//find longest edge
			longestID = 0;
			maxD = 0;
			for( i=0; i<num; i++ ){
				d = this.vertices[i].distanceToSquared( this.vertices[ (i+1) % num ] );
				if( d > maxD ){
					longestID = i;
					maxD = d;
				}
			}
			//insert mid point of longest segment
			m = this.vertices[longestID]
				.add(this.vertices[(longestID + 1) % num])
				.scaleSelf(0.5);
			//push this into the array inbetween the 2 points
			this.vertices.splice( longestID+1, 0, m );
			num++;
		}
		return this;
	},

	intersectsPolygon: function( poly ){
		var Type = Line2D.LineIntersection.Type;
		var edges = this.getEdges(), polyEdges = poly.getEdges();
		var i = 0, el = edges.length;
		var j = 0, pl = polyEdges.length;
		var ea, eb, isec;
		for( ; i<el; i++ ){
			ea = edges[i];
			for( j=0; j<pl; j++ ){
				eb = polyEdges[j];
				isec = ea.intersectLine(eb).getType();
				if( isec === Type.INTERSECTING || isec == Type.COINCIDENT ){
					return true;
				}
			}
		}
		return false;
	},

	isClockwise: function(){
		var isClockwise = function( a, b, c ){
			var determ = (b.x-a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
			return (determ < 0.0);
		};
		if(this.vertices.length > 2){
			return isClockwise(this.vertices[0],this.vertices[1],this.vertices[2]);
		}
		return false;
	},

	intersectsPoly: function(poly) {
		if (!this.containsPolygon(poly)) {
			var edges=this.getEdges();
			var pedges=poly.getEdges();
			for(var i=0, n=edges.length; i < n; i++) {
				for(var j=0, m = pedges.length, e = edges[i]; j < m; j++) {
					if (e.intersectLine(pedges[j]).getType() == Line2D.LineIntersection.Type.INTERSECTING) {
						return true;
					}
				}
			}
			return false;
		} else {
			return true;
		}
	},
	/**
     * Removes duplicate vertices from the polygon. Only successive points are
     * recognized as duplicates.
     * @param {Number} tolerance snap distance for finding duplicates
     * @return itself
     */
	removeDuplicates: function( tolerance ){
		//if tolerance is 0, it will be faster to just use 'equals' method
		var equals = tolerance ? 'equalsWithTolerance' : 'equals';
		var p, prev, i = 0, num = this.vertices.length;
		var last;
		for( ; i<num; i++ ){
			p = this.vertices[i];
			//if its the 'equals' method tolerance will just be ingored
			if( p[equals]( prev, tolerance ) ){
				//remove from array, step back counter
				this.vertices.splice( i, 1 );
				i--;
				num--;
			} else {
				prev = p;
			}
		}
		num = this.vertices.length;
		if( num >  0 ){
			last = this.vertices[num-1];
			if( last[equals]( this.vertices[0], tolerance ) ){
				this.vertices.splice( num-1, 1 );
			}
		}
		return this;
	},
	rotate: function(theta) {
		for (var i=0, num=this.vertices.length; i < num; i++) {
			this.vertices[i].rotate(theta);
		}
	},

	scale: function() {
		var x,y;
		if (arguments.length==1) {
			var arg = arguments[0];
			if( internals.has.XY( arg ) ){
				x=arg.x;
				y=arg.y;
			} else {
				// uniform scale
				x=arg;
				y=arg;
			}
		} else if (arguments.length==2) {
			x=arguments[0];
			y=arguments[1];
		} else {
			throw "Invalid argument(s) passed.";
		}
		for (var i=0, num=this.vertices.length; i < num; i++) {
			this.vertices[i].scaleSelf(x, y);
		}
		return this;
	},

	translate: function() {
		var x,y;
		if (arguments.length==1 && internals.has.XY( arguments[0] ) ){
			x=arguments[0].x;
			y=arguments[0].y;
		} else if (arguments.length==2) {
			x=arguments[0];
			y=arguments[1];
		} else {
			throw "Invalid argument(s) passed.";
		}
		for (var i=0, num=this.vertices.length; i < num; i++) {
			this.vertices[i].addSelf(x, y);
		}
		return this;
	},

	smooth: function(amount, baseWeight){
		var centroid = this.getCentroid();
		var num = this.vertices.length;
		var filtered = [];
		for(var i=0,j=num-1,k=1;i<num;i++){
			var a = this.vertices[i];
			var dir = this.vertices[j].sub(a).addSelf(this.vertices[k].sub(a))
				.addSelf(a.sub(centroid).scaleSelf(baseWeight));
			filtered.push(a.add(dir.scaleSelf(amount)));
			j++;
			if(j == num){
				j=0;
			}
			k++;
			if(k == num){
				k=0;
			}
		}
		this.vertices = filtered;
		return this;
	},

	toString: function(){
		var s = "";
		for(var i=0;i<this.vertices.length;i++){
			s += this.vertices[i];
			if(i<this.vertices.length-1){
				s+= ", ";
			}
		}
		return s;
	}

};

/**
 * Constructs a new regular polygon from the given base line/edge.
 * @param {Vec2D} baseA left point of the base edge
 * @param {Vec2D} baseB right point of the base edge
 * @param {Number} res number of polygon vertices
 * @return polygon
 */
Polygon2D.fromBaseEdge = function( baseA, baseB, res ){
	var theta = -( MathUtils.PI - (MathUtils.PI*(res-2) / res) ),
		dir = baseB.sub( baseA ),
		prev = baseB,
		poly = new Polygon2D( baseA, baseB ),
		p;
	for( var i=0; i< res-1; i++){
		p = prev.add( dir.getRotated(theta*i) );
		poly.add( p );
		prev = p;
	}
	return poly;
};

/**
 * Constructs a regular polygon from the given edge length and number of
 * vertices. This automatically computes the radius of the circle the
 * polygon is inscribed in.
 * More information: http://en.wikipedia.org/wiki/Regular_polygon#Radius
 *
 * @param {Number} len desired edge length
 * @param {Number} res number of vertices
 * @return polygon
 */
Polygon2D.fromEdgeLength = function( len, res ){
	return new Circle( Polygon2D.getRadiusForEdgeLength(len,res) ).toPolygon2D( res );
};

/**
 * Computes the radius of the circle the regular polygon with the desired
 * edge length is inscribed in
 * @param {Number} len edge length
 * @param {Number} res number of polygon vertices
 * @return radius
 */

Polygon2D.getRadiusForEdgeLength = function( len, res ){
	return len / ( 2 * MathUtils.sin(MathUtils.PI/res) );
};

module.exports = Polygon2D;
});
