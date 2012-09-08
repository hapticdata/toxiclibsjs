/*global describe, it*/
var toxi = require('../../index');
var assert = require('assert');




//test Sphere's circular dependency issues with mesh classes
describe('toxi/geom/Sphere.js', function(){
	var sphere;
	it('construct a sphere with radius 100', function(){
		sphere = new toxi.geom.Sphere( 100 );
		assert.equal(sphere.radius, 100 );
	});

	it('should create a TriangleMesh', function(){
		var mesh = sphere.toMesh(null, 5 );
		assert.equal(typeof mesh.getFaces, 'function');
	});
});

//test the circular dependency issues for Circle
describe('toxi/geom/Circle', function(){
	var circle;
	it('construct a circle', function(){
		circle = new toxi.geom.Circle( 10, 20, 100 );
		assert.equal(circle.getRadius(), 100);
		assert.equal(circle.x, 10);
		assert.equal(circle.y, 20);
	});
});

//test Vec3D circular dependencies with AABB and Vec2D
describe('toxi/geom/Vec3D', function(){
	var v3;
	it('to2DXY', function(){
		v3 = new toxi.geom.Vec3D(1,2,3);
		var v2 = v3.to2DXY();
		assert.equal(v3.x, v2.x);
		assert.equal(v3.y, v2.y);
	});
	it('to2DXZ', function(){
		var v2 = v3.to2DXZ();
		assert.equal(v3.x, v2.x);
		assert.equal(v3.z, v2.y);
	});
	it('isInAABB', function(){
		var aabb = new toxi.geom.AABB( new toxi.geom.Vec3D(), new toxi.geom.Vec3D(10,10,10) );
		assert.equal( v3.isInAABB(aabb), true);
	});
});