var toxi = require('../index'),
	assert = require('assert');


var AABB = toxi.geom.AABB,
	Vec3D = toxi.geom.Vec3D,
	TriangleMesh = toxi.geom.mesh.TriangleMesh;

describe("toxi.geom.ABB", function(){

	var expectedOriginal = [
		{x:-200.0, y:-200.0, z:-200.0},
		{x:-200.0, y:-200.0, z:200.0},
		{x:-200.0, y:200.0, z:200.0},
		{x:-200.0, y:200.0, z:-200.0},
		{x:200.0, y:-200.0, z:200.0},
		{x:200.0, y:200.0, z:200.0},
		{x:200.0, y:-200.0, z:-200.0},
		{x:200.0, y:200.0, z:-200.0}
	];
	var mesh = new AABB(new Vec3D(0, 0, 0), 200).toMesh();

	it("should match java coordinates", function(){
		mesh.vertices.forEach(function( v, i ){
			var e = expectedOriginal[i];
			assert.equal( v.x, e.x );
			assert.equal( v.y, e.y );
			assert.equal( v.z, e.z );
		});
	});

});