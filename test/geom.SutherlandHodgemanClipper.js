var toxi = require('../index'),
	assert = require('assert');



describe('SutherlandHodgemanClipper', function(){
	var bounds = new toxi.geom.Rect(0, 0, 100, 100 );
	var clipper = new toxi.geom.SutherlandHodgemanClipper( bounds );

	it('should be a valid instance', function(){
		assert.ok( clipper instanceof toxi.geom.SutherlandHodgemanClipper );
		assert.equal( typeof clipper.clipPolygon, 'function' );
	});

	describe('#clipPolygon', function(){
		describe('non-clipped shape', function(){
			var expectedVertices = [{x:0.0, y:0.0}, {x:10.0, y:0.0}, {x:4.9999995, y:8.6602545}, {x:0.0, y:8.6602545}];
			var poly = toxi.geom.Circle.from2Points(
				new toxi.geom.Vec2D( -10, 0 ),
				new toxi.geom.Vec2D( 10, 0 )
			).toPolygon2D( 6 );
			var clippedPoly = clipper.clipPolygon( poly );
			it('should return a polygon2d', function(){
				assert.ok( clippedPoly instanceof toxi.geom.Polygon2D );
			});
			it('should match java results', function(){
				clippedPoly.vertices.forEach(function( v, i ){
					assert.ok( v.equalsWithTolerance( expectedVertices[i], 0.1 ) );
				});
			});
		});

		describe('clipped shape', function(){
			var expectedVertices = [{x:0.0, y:0.0}, {x:90.0, y:0.0}, {x:32.26497, y:100.0}, {x:0.0, y:100.0}];

			var poly = toxi.geom.Circle.from2Points(
				new toxi.geom.Vec2D( -200, 0 ),
				new toxi.geom.Vec2D( 90, 0 )
			).toPolygon2D( 6 );
			var clippedPoly = clipper.clipPolygon( poly );
			it('should return a polygon2d', function(){
				assert.ok( clippedPoly instanceof toxi.geom.Polygon2D );
			});
			it('should match java results', function(){
				clippedPoly.vertices.forEach(function( v, i ){
					assert.ok( v.equalsWithTolerance( expectedVertices[i], 0.1 ) );
				});
			});

		});
	});
});