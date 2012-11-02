/*global describe,it*/
var toxi = require('../index'),
	assert = require('assert');

describe('TriangleMesh', function(){

	describe('from Sphere', function(){
		var sphere = new toxi.geom.Sphere(1);
		var instance = sphere.toMesh();
		testComputingGeometry( instance );
	});

	function testComputingGeometry( instance ){
		describe("#getBoundingBox()", function(){
			var aabb = instance.getBoundingBox();
			it('should return an AABB', function(){
				assert.equal( aabb instanceof toxi.geom.AABB, true );
			});
		});

		describe('#getBoundingSphere()', function(){
			var sphere = instance.getBoundingSphere();
			it('should return a Sphere', function(){
				assert.equal( sphere instanceof toxi.geom.Sphere, true );
			});
		});
	}
	function testPositionAndExtent( instance, pos, extentNumber ){
		it(['should have a centroid of ',pos.x, pos.y, pos.z].join(','), function(){
			var c = instance.computeCentroid();
			assert.equal(c.x, pos.x);
			assert.equal(c.y, pos.y);
			assert.equal(c.z, pos.z);
		});
		it(['vertices should all be either -',extentNumber,' and ',extentNumber].join(','), function(){
			var passed = true;
			instance.vertices.forEach(function( v ){
				['x','y','z'].forEach(function( axis ){
					if( v[axis] !== (-extentNumber+pos[axis]) && v[axis] !== (extentNumber+pos[axis])){
						//console.log('v['+axis+'] = '+ v[axis]);
						passed = false;
					}
				});
			});
			assert.equal(passed, true);
		});
	}

	describe('from AABB', function(){
		var aabb = new toxi.geom.AABB( new toxi.geom.Vec3D(), new toxi.geom.Vec3D(1,1,1) );
		var instance = aabb.toMesh();
		describe('default',function(){
			it('should be a TriangleMesh', function(){
				assert.equal(instance instanceof toxi.geom.mesh.TriangleMesh, true);
				assert.equal(typeof instance.computeCentroid, 'function');
			});
			it('should have 8 points', function(){
				assert.equal(instance.getNumVertices(), 8);
			});
			it('should have 12 faces', function(){
				assert.equal(instance.getNumFaces(), 12);
			});
			testPositionAndExtent( instance, {x: 0, y: 0, z: 0}, 1);
			testComputingGeometry( instance );
		});

		describe('#transform()', function(){
			var instance2 = instance.copy();
			var matrix = new toxi.geom.Matrix4x4();
			matrix.translateSelf( 1, 1, 1);
			matrix.scaleSelf( 2, 2, 2 );
			instance2.transform( matrix );

			testPositionAndExtent( instance2, {x: 1, y: 1, z: 1}, 2);
			testComputingGeometry( instance );
		});

		describe('#toWEMesh()', function(){
			var wemesh = instance.toWEMesh();
			it('should be a WETriangleMesh instance', function(){
				assert.equal( wemesh instanceof toxi.geom.mesh.WETriangleMesh, true );
			});
		});
	});
});