/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');

var Vec3D = toxi.geom.Vec3D;

describe("toxi.geom.Vec3D", function(){
	describe("constructor", function(){
		describe("no params", function(){
			var v = new Vec3D();
			it('should equal zero vector', function(){
				assert.ok( v.isZeroVector() );
				assert.ok( v instanceof Vec3D );
			});
		});
		describe("x,y,z params", function(){
			it("should be valid vector", function(){
				var vec = new Vec3D(0.1,0.2, 0.3);
				assert.equal(vec.x,0.1);
				assert.equal(vec.y, 0.2);
				assert.equal(vec.z, 0.3);
			});
		});
		describe("prototype functions", function(){
			var v = new Vec3D(0.1,0.2,0.3);

			describe("#rotateAroundAxis()", function(){
				var vec = v.copy().rotateAroundAxis(Vec3D.Y_AXIS,Math.PI);
				it("should match java output", function(){
					assert.ok( vec.equalsWithTolerance({x:-0.10000003, y:0.2, z:-0.3}, 0.0001) );
				});
			});
			describe("#getRotatedAroundAxis()", function(){
				var v2 = v.copy();
				var vec = v2.getRotatedAroundAxis(Vec3D.Y_AXIS,Math.PI);
				it("should match java output", function(){
					assert.ok( vec.equalsWithTolerance({x:-0.10000003, y:0.2, z:-0.3}, 0.0001) );
					assert.notStrictEqual( v2, vec );
				});
			});
		});
	});
});