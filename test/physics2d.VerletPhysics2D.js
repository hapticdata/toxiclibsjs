/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');



var VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
	GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
	Vec2D = toxi.geom.Vec2D;


describe("toxi.physics2d.VerletPhysics2D", function(){
	describe("constructors", function(){
		function testDefaults( p ){
			it('should have default numIterations', function(){
				assert.equal( p.numIterations, 50 );
			});
			it('should have default drag', function(){
				assert.equal( p.drag, 1.0);
			});
			it('should have default timeStep', function(){
				assert.equal( p.timeStep, 1 );
			});
			/*it('should have no behaviors', function(){
				assert.equal( p.behaviors.length, 0 );
			});*/
		}
		function testGravity( p ){
			it("should have gravity and default properties", function(){
				assert.equal( p.behaviors.length, 1 );
			});
		}
		describe("no params", function(){
			var p = new VerletPhysics2D();
			it('should be a valid instance', function(){
				assert.ok( p instanceof VerletPhysics2D );
			});
			testDefaults( p );
		});
		describe("1 param gravity behavior", function(){
			var grav = new GravityBehavior( new Vec2D( 0, 0.1) );
			var p = new VerletPhysics2D( grav );
			testGravity( p );
			testDefaults( p );
		});
		describe("1 param, Vec2D as gravity", function(){
			var p = new VerletPhysics2D( new Vec2D( 0, 0.1 ) );
			testDefaults( p );
			testGravity( p );
		});
		describe("1 param, options object, all properties", function(){
			var p = new VerletPhysics2D({
				gravity: new Vec2D(0.1,-1),
				drag: 0.05,
				timeStep: 2,
				numIterations: 25
			});
			testGravity( p );
			it('should have defined properties', function(){
				assert.equal( p.drag, 1.0 - 0.05 );
				assert.equal( p.timeStep, 2 );
				assert.equal( p.numIterations, 25 );
			});
		});

		describe("1 param, options object w/ drag and timeStep", function(){
			var p = new VerletPhysics2D({
				drag: 0.05,
				timeStep: 2
			});
			it("should have set properties and default others", function(){
				assert.equal( p.behaviors.length, 0 );
				assert.equal( p.drag, 1.0 - 0.05 );
				assert.equal( p.timeStep, 2 );
				assert.equal( p.numIterations, 50 );
			});
		});
	});
});