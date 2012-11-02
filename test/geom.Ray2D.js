/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');

var Vec2D = toxi.geom.Vec2D,
	Ray2D = toxi.geom.Ray2D;
	
describe('toxi.geom.Ray2D', function(){

	//run an instance of Ray2D through these tests
	function testRay2D( ray, direction ){
		it('should be an instance of Ray2D, inheriting Vec2D', function(){
			assert.equal( true, ray instanceof Ray2D );
			assert.equal( true, ray instanceof Vec2D );
		});
		it('should be at {x: 100, y: 200}', function(){
			assert.equal( ray.x, 100 );
			assert.equal( ray.y, 200 );
		});
		it('should create a unique, normalized direction', function(){
			assert.notEqual( direction, ray.getDirection() );
			assert.notStrictEqual( direction.getNormalized(), ray.getDirection() );
		});
	}

	describe('constructor', function(){
		var direction = new Vec2D(1,0.5);
		describe('3 params: x,y, dirVec2D', function(){
			var ray = new Ray2D(100,200, direction );
			testRay2D( ray, direction );
		});
		describe('2 params: posVec2D, dirVec2D', function(){
			//this also proves new Vec2D( 100, 200)
			var ray = new Ray2D({x: 100, y: 200}, direction );
			testRay2D( ray, direction );
		});
	});
});