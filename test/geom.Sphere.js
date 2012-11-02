/*global describe,it*/
var toxi = require('../index'),
	assert = require('assert');


describe('toxi.geom.Sphere', function(){
	describe("no params constructor", function(){
		var sphere = new toxi.geom.Sphere(),
		mesh;
		it('should be a sphere with radius 1', function(){
			assert.equal( toxi.internals.tests.isSphere( sphere ), true);
			assert.equal( sphere.radius, 1 );
		});

		it('should create a mesh', function(){
			mesh = sphere.toMesh({ resolution: 20 });
			assert.ok( mesh instanceof toxi.geom.mesh.TriangleMesh );
			assert.ok( Array.isArray( mesh.vertices ) );
			assert.ok( Array.isArray( mesh.faces ) );
		});
	});
});