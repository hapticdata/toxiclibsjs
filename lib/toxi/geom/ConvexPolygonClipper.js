define([
    './Line2D',
    './Polygon2D'
], function( Line2D, Polygon2D ){

    var ConvexPolygonClipper = function(polygonBounds){
        this.setBounds(polygonBounds);
    };


    ConvexPolygonClipper.prototype = {
        constructor: ConvexPolygonClipper,

        clipPolygon: function(poly){

            //make a shallow copy to a new array
            var points = poly.vertices.slice(0),
                //hold clipped points
                clipped,
                //the boundary edges of the clipping path
                boundsEdges = this.bounds.getEdges(),
                //the current Line2D of the edge to clip along
                clipEdge,
                i = 0,
                j = 0,
                _tmp,
                //point classification for testing
                sign,
                //vectors
                p,
                q;

            //add the first one as a double-entry
            points.push(points[0]);

            for( i = 0; i < boundsEdges.length; i++ ){
                clipEdge = boundsEdges[i];

                clipped = [];

                sign = clipEdge.classifyPoint(this.boundsCentroid);

                for( j = 0; j < points.length - 1; j++ ){
                    p = points[j];
                    q = points[j+1];

                    if( clipEdge.classifyPoint(p) === sign ){
                        if( clipEdge.classifyPoint(q) === sign ){
                            clipped.push(q.copy());
                        } else {
                            clipped.push(this._getClippedPosOnEdge(clipEdge, p, q));
                        }
                        continue;
                    }
                    if( clipEdge.classifyPoint(q) === sign ){
                        clipped.push(this._getClippedPosOnEdge(clipEdge, p, q));
                        clipped.push(q.copy());
                    }
                }
                //if points have been clipped, make sure the last entry is still the same
                //as the first entry
                if( clipped.length > 0 && clipped[0] !== clipped[clipped.length-1] ){
                    clipped.push(clipped[0]);
                }

                _tmp = points;
                points = clipped;
                clipped = _tmp;
            }

            return new Polygon2D(points).removeDuplicates(0.001);
        },

        getBounds: function(){
            return this.bounds;
        },

        _getClippedPosOnEdge: function(clipEdge, p, q){
            return clipEdge.intersectLine(new Line2D(p, q)).getPos();
        },

        //unused but included to match, source
        _isKnownVertex: function(list, q){
            for(var i=0, l=list.length; i<l; i++){
                if( list[i].equalsWitTolerance(q, 0.001) ){
                    return true;
                }
            }
            return false;
        },

        setBounds: function(bounds){
            this.bounds = bounds;
            this.boundsCentroid = this.bounds.getCentroid();
        }
    };



    return ConvexPolygonClipper;

});

