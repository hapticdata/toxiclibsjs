var toxi = require('./index'),
	assert = require('assert');

var Line2D = toxi.geom.Line2D,
	Vec2D = toxi.geom.Vec2D,
	Ray2D = toxi.geom.Ray2D;


describe('toxi.geom.Line2D', function(){
	describe('#toRay2D', function(){
		it('should create a ray2d', function(){
			var line = new Line2D( new Vec2D(0,0), new Vec2D(1,1) );
			var ray = line.toRay2D();
			assert.equal( typeof ray.getDirection, 'function' );
			assert.ok( ray.dir instanceof Vec2D );
			assert.ok( ray instanceof Ray2D );
		});
	});


	describe('#intersectLine', function(){
		it('should return Line2D.LineIntersection.Type.COINCIDENT_NO_INTERSECT', function(){
			var line1 = new toxi.geom.Line2D(
				new toxi.geom.Vec2D({x: 280, y: 319}),
				new toxi.geom.Vec2D({x: 280, y: 332})
			);

			var line2 = new toxi.geom.Line2D(
				new toxi.geom.Vec2D({x: 280, y: 75}),
				new toxi.geom.Vec2D({x: 280, y: 325})
			);

			var intersection = line1.intersectLine(line2);

			assert.equal(intersection.type, Line2D.LineIntersection.Type.COINCIDENT_NO_INTERSECT);
		});
	});
});

