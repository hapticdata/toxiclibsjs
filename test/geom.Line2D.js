var toxi = require('../index'),
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
});

