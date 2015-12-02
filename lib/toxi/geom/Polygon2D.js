define([
    'require',
    '../math/mathUtils',
    './Vec2D',
    './Line2D',
    './Circle',
    './Rect',
    './mesh/TriangleMesh',
    '../internals/has',
    '../internals/is'
], function( require, MathUtils, Vec2D, Line2D, Circle, Rect, TriangleMesh, has, is) {

    /**
    * @class
    * @member toxi
    * @param {Array<Vec2D>|Vec2D...} [points] optionally provide points for the polygon
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
            if( is.Array( arg ) ){ // if it was an array of points
                for(i=0,l = arg.length;i<l;i++){
                    this.add(arg[i].copy());
                }
            }
        } //otherwise no args were passed, and thats ok

    };


    Polygon2D.prototype = {
        constructor: Polygon2D,

        add: function(p){
            //accept an array also
            if( is.Array(p) ){
                for( var i=0, l = p.length; i<l; i++ ){
                    if( this.vertices.indexOf(p[i]) < 0 ){
                        this.vertices.push(p[i]);
                    }
                }
                return;
            }
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

        intersectsPolygon: function(poly) {
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

        isClockwise: function(){
            return this.getArea() > 0;
        },

        /**
        * Checks if the polygon is convex.
        * @return true, if convex.
        */
        isConvex: function(){
            var isPositive = false,
                num = this.vertices.length,
                prev,
                next,
                d0,
                d1,
                newIsP;

            for( var i = 0; i < num; i++ ){
                prev = (i===0) ? num -1 : i - 1;
                next = (i===num-1) ? 0 : i + 1;
                d0 = this.vertices[i].sub(this.vertices[prev]);
                d1 = this.vertices[next].sub(this.vertices[i]);
                newIsP = (d0.cross(d1) > 0);
                if( i === 0 ) {
                    isPositive = true;
                } else if( isPositive != newIsP ) {
                    return false;
                }
            }
            return true;
        },

        /**
        * Given the sequentially connected points p1, p2, p3, this function returns
        * a bevel-offset replacement for point p2.
        *
        * Note: If vectors p1->p2 and p2->p3 are exactly 180 degrees opposed, or if
        * either segment is zero then no offset will be applied.
        *
        * @param x1
        * @param y1
        * @param x2
        * @param y2
        * @param x3
        * @param y3
        * @param distance
        * @param out
        *
        * @see http://alienryderflex.com/polygon_inset/
        */
        _offsetCorner: function( x1, y1, x2, y2, x3, y3, distance, out ){
            var c1 = x2,
                d1 = y2,
                c2 = x2,
                d2 = y2;
            var dx1,
                dy1,
                dist1,
                dx2,
                dy2,
                dist2,
                insetX,
                insetY;

            dx1 = x2-x1;
            dy1 = y2-y1;
            dist1 = Math.sqrt(dx1*dx1 + dy1*dy1);
            dx2 = x3-x2;
            dy2 = y3-y2;
            dist2 = Math.sqrt(dx2*dx2 + dy2*dy2);

            if( dist1 < MathUtils.EPS || dist2 < MathUtils.EPS ){
                return;
            }

            dist1 = distance / dist1;
            dist2 = distance / dist2;

            insetX = dy1 * dist1;
            insetY = -dx1 * dist1;
            x1 += insetX;
            c1 += insetX;
            y1 += insetY;
            d1 += insetY;
            insetX = dy2 * dist2;
            insetY = -dx2 * dist2;
            x3 += insetX;
            c2 += insetX;
            y3 += insetY;
            d2 += insetY;

            if( c1 === c2 && d1 === d2 ){
                out.set(c1,d1);
                return;
            }

            var l1 = new Line2D( new Vec2D(x1,y1), new Vec2D(c1,d1) ),
                l2 = new Line2D( new Vec2D(c2,d2), new Vec2D(x3,y3) ),
                isec = l1.intersectLine(l2),
                ipos = isec.getPos();
            if( ipos !== null || ipos !== undefined ){
                out.set(ipos);
            }
        },

        /**
        * Moves each line segment of the polygon in/outward perpendicular by the
        * given distance. New line segments and polygon vertices are created by
        * computing the intersection points of the displaced segments. Choosing an
        * too large displacement amount will result in deformation/undefined
        * behavior with various self intersections. Should that happen, please try
        * to clean up the shape using the {@link #toOutline()} method.
        *
        * @param distance
        *            offset/inset distance (negative for inset)
        * @return itself
        */
        offsetShape: function( distance ){
            var v = this.vertices;
            var num = v.length - 1;
            if( num > 1 ){
                var startX = v[0].x,
                    startY = v[0].y,
                    c = v[num].x,
                    d = v[num].y,
                    e = startX,
                    f = startY,
                    a,
                    b;
                for( var i = 0; i < num; i++ ){
                    a = c;
                    b = d;
                    c = e;
                    d = f;
                    e = v[i + 1].x;
                    f = v[i + 1].y;
                    this._offsetCorner(a, b, c, d, e, f, distance, v[i]);
                }
                this._offsetCorner(c, d, e, f, startX, startY, distance, v[num]);
            }
            return this;
        },

        /**
        * Reduces the number of vertices in the polygon based on the given minimum
        * edge length. Only vertices with at least this distance between them will
        * be kept.
        *
        * @param minEdgeLen
        * @return itself
        */
        reduceVertices: function( minEdgeLen ){
            minEdgeLen *= minEdgeLen;
            var vs = this.vertices,
                reduced = [],
                prev = vs[0],
                num = vs.length - 1,
                vec;
            reduced.push(prev);
            for( var i = 0; i < num; i++ ){
                vec = vs[i];
                if( prev.distanceToSquared(vec) >= minEdgeLen ){
                    reduced.push(vec);
                    prev = vec;
                }
            }
            if( vs[0].distanceToSquared(vs[num]) >= minEdgeLen ){
                reduced.push(vs[num]);
            }
            this.vertices = reduced;
            return this;
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
            return this;
        },

        scale: function( x, y ) {
            if (arguments.length==1) {
                var arg = arguments[0];
                if( has.XY( arg ) ){
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

        scaleSize: function( x, y ){
            var centroid;
            if(arguments.length===1) {
                var arg = arguments[0];
                if( has.XY(arg) ){
                    x = arg.x;
                    y = arg.y;
                } else {
                    //uniform
                    x = arg;
                    y = arg;
                }
            } else if ( arguments.length===2) {
                x = arguments[0];
                y = arguments[1];
            } else {
                throw new Error('Invalid argument(s) passed.');
            }
            centroid = this.getCentroid();
            for( var i = 0, l = this.vertices.length; i<l; i++ ){
                var v = this.vertices[i];
                v.subSelf(centroid).scaleSelf(x,y).addSelf(centroid);
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

        toMesh: function( mesh, centroid2D, extrude ){
            mesh = mesh || new TriangleMesh();
            var num = this.vertices.length;
            centroid2D = centroid2D || this.getCentroid();
            var centroid = centroid2D.to3DXY();
            centroid.z = extrude;
            var bounds = this.getBounds(),
                boundScale = new Vec2D(1/bounds.width, 1/bounds.height),
                uvC = centroid2D.sub(bounds.getTopLeft()).scaleSelf(boundScale),
                a, b, uvA, uvB;

            for( var i=1; i<=num; i++ ){
                a = this.vertices[i % num];
                b = this.vertices[i - 1];
                uvA = a.sub(bounds.getTopLeft()).scaleSelf(boundScale);
                uvB = b.sub(bounds.getTopLeft()).scaleSelf(boundScale);
                mesh.addFace(centroid, a.to3DXY(), b.to3DXY(), uvC, uvA, uvB);
            }
            return mesh;
        },

        toPolygon2D: function(){
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
        },

        translate: function() {
            var x,y;
            if (arguments.length==1 && has.XY( arguments[0] ) ){
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
        var Circle = require('./Circle');
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

    return Polygon2D;
});
