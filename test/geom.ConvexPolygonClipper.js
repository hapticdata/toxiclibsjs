var toxi = require('./index'),
    assert = require('assert'),
    ConvexPolygonClipper = toxi.geom.ConvexPolygonClipper,
    Circle = toxi.geom.Circle,
    Polygon2D = toxi.geom.Polygon2D,
    Line2D = toxi.geom.Line2D,
    Vec2D = toxi.geom.Vec2D;


var makeClipper = function(sides){
    sides = sides || 6;
    var poly = new Circle(new Vec2D(), 5).toPolygon2D(sides);
    return new ConvexPolygonClipper(poly);
};


describe('toxi.geom.ConvexPolygonClipper', function(){


    describe('Constructor', function(){

        var bounds = new Circle(new Vec2D(), 8).toPolygon2D(6);
        var clipper = new ConvexPolygonClipper(bounds);

        var poly = new Circle(new Vec2D(3, 2), 12).toPolygon2D(8);

        var clipped = clipper.clipPolygon(poly);

        it('should be a polygon2d', function(){
            assert.ok( clipped instanceof Polygon2D );
        });

        it('should have a set bounds', function(){
            var clipper = makeClipper(6);
            assert.ok( Array.isArray(clipper.bounds.vertices) );
            assert.equal( clipper.bounds.vertices.length, 6 );
        });

        it('should have defined public methods', function(){
            var clipper = makeClipper();
            [
                'clipPolygon',
                'getBounds',
                'setBounds'
            ].forEach(function(fn){
                assert.ok( typeof clipper[fn] === 'function' );
            });
        });
    });


    describe('#clipPolygon( polygon )', function(){

        describe('Polygon intersects Clippers bounds', function(){
            it('should clip 2 to the intersection of 2 overlapping polygons', function(){
                var poly1, poly2, clipper, poly3;

                /*
                these particular shapes intersect along 5 edges of poly2
                the resulting poly is 4 original vertices from poly1 and 5 from poly2
                */
                poly1 = new Circle(new Vec2D(), 48).toPolygon2D(6);
                poly2 = new Circle(new Vec2D(10, 4), 48).toPolygon2D(8);

                clipper = new ConvexPolygonClipper(poly1);
                poly3 = clipper.clipPolygon(poly2);

                assert.equal(poly1.vertices.length, 6);
                assert.equal(poly2.vertices.length, 8);
                assert.equal(poly3.vertices.length, 9);


                /*
                higher vertex count, poly2 is small and catches
                a small part of the right side of poly1.
                */

                poly1 = new Circle(new Vec2D(), 160).toPolygon2D(32);
                poly2 = new Circle(new Vec2D(160, 4), 24).toPolygon2D(24);

                clipper = new ConvexPolygonClipper(poly1);
                poly3 = clipper.clipPolygon(poly2);

                assert.equal(poly1.vertices.length, 32);
                assert.equal(poly2.vertices.length, 24);
                assert.equal(poly3.vertices.length, 14);
            });
        });

        describe('Polygons do not intersect', function(){
            it('should return a Polygon2D with no vertices', function(){
                var poly1 = new Circle(new Vec2D(), 16).toPolygon2D(32);
                var poly2 = new Circle(new Vec2D(160, 4), 24).toPolygon2D(24);

                var clipper = new ConvexPolygonClipper(poly1);
                var poly3 = clipper.clipPolygon(poly2);

                assert.equal(poly3.vertices.length, 0);
            });
        });

        describe('Polygon contains all of Clipper bounds', function(){

            var poly1 = new Circle(Vec2D.ZERO, 16).toPolygon2D(3);
            var poly2 = new Circle(Vec2D.ZERO, 24).toPolygon2D(24);

            var clipper = new ConvexPolygonClipper(poly1);
            var poly3 = clipper.clipPolygon(poly2);


            it('should return a Polygon2D with the same points as the clippers bounds', function(){
                assert.equal(poly3.vertices.length, poly1.vertices.length);
            });

            it('should be unique vertices within the clipper bounds, equal with tolerance', function(){

                poly1.vertices.forEach(function(v,i){
                    assert.ok( v.equalsWithTolerance(poly3.vertices[i], 0.001) );
                });
            });

        });


    });


    describe('#getBounds()', function(){
        it('should return the provided polygon2d as the bounds', function(){
            var poly = new Circle(new Vec2D(), 10).toPolygon2D(8);
            var clipper = new ConvexPolygonClipper(poly);

            assert.equal( clipper.getBounds(), poly );
        });
    });

    describe('#setBounds( bounds )', function(){
        it('should set the boundary to a new polygon2d', function(){

            var clipper = makeClipper(6);
            assert.equal( clipper.getBounds().vertices.length, 6 );

            clipper.setBounds( new Circle(new Vec2D(), 10).toPolygon2D(12) );
            assert.equal( clipper.getBounds().vertices.length, 12 );
        });
    });

});

