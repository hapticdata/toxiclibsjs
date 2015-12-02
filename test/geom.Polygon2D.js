var toxi = require('./index'),
    _ = require('underscore'),
	assert = require('assert');

var Vec2D = toxi.geom.Vec2D,
    Rect = toxi.geom.Rect,
    Circle = toxi.geom.Circle,
    Line2D = toxi.geom.Line2D,
	Polygon2D = toxi.geom.Polygon2D;

describe('toxi.geom.Polygon2D', function(){

	describe('constructor', function(){
        describe('with array of points', function(){
            it('should construct a Polygon2D with 20 points', function(){
                var points = _.times( 20, function(){
                    return Vec2D.randomVector();
                });

                var poly = new Polygon2D(points);
                assert.ok( poly instanceof Polygon2D );
                ['getEdges','getRandomPoint','containsPoint'].forEach(function(fn){
                    assert.equal( typeof poly[fn],'function');
                });

                assert.equal( poly.getNumVertices(), 20 );
            });
        });

        describe('should construct with multiple args', function(){
            it('should construct a Polygon2D with 3 points', function(){
                var poly = new Polygon2D( Vec2D.randomVector(), Vec2D.randomVector(), Vec2D.randomVector() );
                assert.equal( poly.getNumVertices(), 3 );
            });
        });

        describe('should construct with no params', function(){
            it('should construct an empty Polygon2D', function(){
                var poly = new Polygon2D();
                assert.equal( poly.getNumVertices(), 0 );
            });
        });
	});

    describe('#containsPoint(p)', function(){
        var poly = new Rect(-1, -1, 2, 2).toPolygon2D();
        it('should contain point', function(){
            assert.ok( poly.containsPoint(new Vec2D(-0.99,-0.99)) );
            assert.ok( poly.containsPoint(new Vec2D()) );
        });
        it('should not contain point', function(){
            //this is the top-left point, which is technically not contained within
            assert.ok( !poly.containsPoint(new Vec2D(-1,-1)) );
            //these are outside
            assert.ok( !poly.containsPoint(new Vec2D(2,2)) );
            assert.ok( !poly.containsPoint(new Vec2D(-2,-2)) );
        });
    });


    describe('#containsPolygon(poly)', function(){
        var poly1 = new Rect(-1, -1, 2, 2).toPolygon2D();
        it('should contain polygon', function(){
            var poly2 = new Rect(0,0,0.5,0.5).toPolygon2D();
            assert.ok( poly1.containsPolygon(poly2) );
        });
        it('should not contain polygon', function(){
            //hangs outside, intersects but not contained
            var poly2 = new Rect(0,0,1.5,1.5).toPolygon2D();
            assert.ok( !poly1.containsPolygon(poly2) );
            poly2 = new Rect(0,0,2,2).toPolygon2D();
            assert.ok( !poly1.containsPolygon(poly2) );
            poly2 = new Rect(-2,-2,2,2).toPolygon2D();
            assert.ok( !poly1.containsPolygon(poly2) );
            poly2 = new Rect(0,0,1,3).toPolygon2D();
            assert.ok( !poly1.containsPolygon(poly2) );
        });
    });

    describe('#getBoundingCircle()', function(){
        it('should return a bounding Circle', function(){
            var poly = new Rect(-1,-1,2,2).toPolygon2D(),
                circ = poly.getBoundingCircle();
            assert.ok( circ instanceof Circle );
            //should contain all points
            poly.vertices.forEach(function(v){
                assert.ok( circ.containsPoint(v) );
            });
        });
    });

    describe('#getBounds()', function(){
        it('should return a bounding rect', function(){
            var rect1 = new Rect(-1,-1,2,2),
                poly= rect1.toPolygon2D(),
                rect2 = poly.getBounds();

            assert.equal( rect1.x, rect2.x );
            assert.equal( rect1.y, rect2.y );
            assert.equal( rect1.width, rect2.width );
            assert.equal( rect1.height, rect2.height );
        });
    });

    describe('#getCentroid()', function(){
        it('should compute the centroid', function(){
            var poly = new Rect(-1,-1,2,2).toPolygon2D();
            //center is 0,0
            assert.ok( new Vec2D().equals(poly.getCentroid()) );
        });
    });

    describe('#getEdges()', function(){
        it('should return an array of Line2D', function(){
            var poly = new Rect(-1,-1,2,2).toPolygon2D();
            var edges = poly.getEdges();
            assert.equal(edges.length, 4);
            assert.ok( edges[0] instanceof Line2D );
        });
    });


    describe('#increaseVertexCount(count)', function(){
        it('should increase the polygon vertex', function(){
            var poly = new Circle( new Vec2D(), 10 ).toPolygon2D(8);
            assert.equal(poly.getNumPoints(), 8 );
            poly.increaseVertexCount(16);
            assert.equal(poly.getNumPoints(), 16);
        });
    });


    describe('#intersectsPolygon(poly)', function(){
        var poly1 = new Rect(-1, -1, 2, 2).toPolygon2D();
        it('should intersect polygon', function(){
            var poly2 = new Rect(0,0,0.5,0.5).toPolygon2D();
            assert.ok( poly1.intersectsPolygon(poly2) );
            //hangs outside, intersects but not contained
            poly2 = new Rect(0,0,1.5,1.5).toPolygon2D();
            assert.ok( poly1.intersectsPolygon(poly2) );
            poly2 = new Rect(0,0,2,2).toPolygon2D();
            assert.ok( poly1.intersectsPolygon(poly2) );
            poly2 = new Rect(-2,-2,2,2).toPolygon2D();
            assert.ok( poly1.intersectsPolygon(poly2) );
            poly2 = new Rect(0,0,1,3).toPolygon2D();
            assert.ok( poly1.intersectsPolygon(poly2) );
        });
        it('should not intersect polygon', function(){
            var poly2 = new Rect(-5,-5,2,2).toPolygon2D();
            assert.ok( !poly1.intersectsPolygon(poly2) );
            poly2 = new Rect(5,5,3,3).toPolygon2D();
            console.log( poly1.vertices);
            assert.ok( !poly1.intersectsPolygon(poly2) );
        });
    });

    describe('isConvex()', function(){
        it('should be a convex shape', function(){
            var poly = new Circle( new Vec2D(), 10 ).toPolygon2D(8);
            assert.ok( poly.isConvex() );
        });
        it('should not be a convex shape', function(){
            var poly = new Polygon2D([
                new Vec2D(-1,-1),
                new Vec2D(-2,-3),
                new Vec2D( -2, 2),
                new Vec2D(1,1),
                new Vec2D(-1,1)
            ]);

            assert.ok( !poly.isConvex() );
        });
    });


    describe('removeDuplicates( tolerance )', function(){
        it('should remove duplicates with tolerance', function(){
            var poly = new Circle( new Vec2D(), 10).toPolygon2D(25);
            var last = _.last(poly.vertices);
            poly.add( last.copy().jitter(0.025) );
            poly.add( last.copy().jitter(0.025) );

            assert.equal( poly.vertices.length, 27 );

            poly.removeDuplicates(0.1);

            assert.equal( poly.vertices.length, 25 );
        });

        it('should remove duplicates without tolerance', function(){
            var poly = new Circle( new Vec2D(), 10).toPolygon2D(25);
            var last = _.last(poly.vertices);
            poly.add( last.copy() );
            poly.add( last.copy() );
            poly.add( last.add(10,5) );

            assert.equal( poly.vertices.length, 28 );

            poly.removeDuplicates();
            //one should stay
            assert.equal( poly.vertices.length, 26 );
        });
    });


});

