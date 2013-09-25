define(function( require, exports, module ){
	/**
	* A version of the Sutherland-Hodgeman algorithm to clip 2D polygons optimized
	* for rectangular clipping regions.
	* More information: http://en.wikipedia.org/wiki/Sutherland-Hodgman_algorithm
	*/
	var Polygon2D = require('./Polygon2D'),
		Vec2D = require('./vectors').Vec2D;

	//function for finding clipped position on each edge
	//faster than a switch
	var clippedPos = {
		0: function( b, p1, p2 ){
			var x = p1.x + ( (b.y-p1.y) * (p2.x-p1.x) ) / ( p2.y-p1.y );
			return new Vec2D( x, b.y );
		},
		1: function( b, p1, p2 ){
			var bx = b.x + b.width;
			var y = p1.y + ( (bx-p1.x) * (p2.y-p1.y) ) / (p2.x-p1.x);
			return new Vec2D( bx, y );
		},
		2: function( b, p1, p2 ){
			var by = b.y + b.height;
			var x = p1.x + ( (by-p1.y) * (p2.x-p1.x) ) / ( p2.y-p1.y );
			return new Vec2D( x, by );
		},
		3: function( b, p1, p2 ){
			var y = p1.y + ( (b.x-p1.x) * (p2.y-p1.y) ) / ( p2.x-p1.x );
			return new Vec2D( b.x, y );
		}
	};

	/**
	 * method for getting the position on the edge
	 * @private
	 * @param {Rect} bounds
	 * @param {Number} edgeID
	 * @param {Vec2D} p1
	 * @param {Vec2D} p2
	 * @returns Vec2D
	 */
	var getClippedPosOnEdge = function( bounds, edgeID, p1, p2 ){
		return clippedPos[edgeID]( bounds, p1, p2 );
	};


	//tests for each edgeID whether the point is within the edge
	var insideEdgeConditions = {
		0: function( bounds, p ){
			return p.y >= bounds.y;
		},
		1: function( bounds, p ){
			return p.x < bounds.x + bounds.width;
		},
		2: function( bounds, p ){
			return p.y < bounds.y + bounds.height;
		},
		3: function( bounds, p ){
			return p.x >= bounds.x;
		}
	};

	/**
	 * @private
	 * @param {Rect} bounds
	 * @param {Vec2D} p
	 * @param {Number} edgeID
	 * @return {Boolean}
	 */
	var isInsideEdge = function( bounds, p, edgeID ){
		return insideEdgeConditions[edgeID]( bounds, p );
	};


	/**
	 * SutherlandHodgemanClipper constructor
	 * @param {Rect} bounds
	 */
	var SutherlandHodgemanClipper = function( bounds ){
		this.bounds = bounds;
	};

	SutherlandHodgemanClipper.prototype = {
		constructor: SutherlandHodgemanClipper,
		clipPolygon: function( poly ){
			var points = poly.vertices.slice(0), //copy of poly's points
				clipped, //will contain the clipped points
				edgeID = 0, //numeric id for each edge
				i = 0,
				num = points.length-1,
				p, //current point in loop
				q; //next point in loop

			//duplicate the first point ref
			points.push( points[0] );
			for( ; edgeID < 4; edgeID++ ){
				i = 0; //make sure the inner-loop starts over
                num = points.length - 1;
				clipped = []; //new clipped coords for this iteration
				for( ; i<num; i++ ){
					p = points[i];
					q = points[i+1];
					if( isInsideEdge( this.bounds, p, edgeID ) ){
						if( isInsideEdge( this.bounds, q, edgeID ) ){
							clipped.push( q.copy() );
						} else {
							clipped.push( getClippedPosOnEdge(this.bounds, edgeID, p, q) );
						}
						continue;
					}
					if( isInsideEdge( this.bounds, q, edgeID) ){
						clipped.push( getClippedPosOnEdge(this.bounds, edgeID, p, q) );
						clipped.push( q.copy() );
					}
				}
				if( clipped.length > 0 && clipped[0] !== clipped[clipped.length-1] ){
					clipped.push( clipped[0] );
				}
				points = clipped;
			}
			return new Polygon2D( points ).removeDuplicates( 0.001 );
		},
		getBounds: function(){
			return this.bounds;
		},
		//protected + unused in java
		isKnownVertex: function( list, q ){
			for( var i=0, l=list.length; i<l; i++){
				if( list[i].equalsWithTolerance(q, 0.0001) ){
					return true;
				}
			}
			return false;
		},
		setBounds: function( bounds ){
			this.bounds = bounds;
		}
	};

	module.exports = SutherlandHodgemanClipper;
});