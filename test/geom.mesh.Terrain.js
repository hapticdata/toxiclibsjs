/*global describe,it*/
var toxi = require('../index'),
	assert = require('assert');


var Terrain = toxi.geom.mesh.Terrain;

describe("toxi.geom.mesh.Terrain", function(){

	var width = 10,
		depth = 15,
		scale = 2,
		indexX = 2,
		indexZ = 2,
		setHeight = 3,
		terrain = new Terrain( width, depth, scale );


	var i =0;
	for(var x=0; x<10; x++){
		for(var y=0; y<15; y++){
			terrain.setHeightAtCell(x,y, i);
			i++;
		}
	}

	describe("Constructor", function(){
		it("should be valid instance", function(){
			assert.ok( terrain instanceof Terrain );
			assert.equal( typeof terrain.setHeightAtCell, 'function');
		});
	});

	describe("prototype functions", function(){

		describe("#getDepth()", function(){
			it("should match set depth", function(){
				assert.equal(terrain.getDepth(),depth );
			});
		});

		describe("#setHeightAtCell() & getHeightAtCell()", function(){
			it("should set new height, and retrieve it by indexX, indexZ", function(){
				terrain.setHeightAtCell(indexX, indexZ, setHeight);
				assert.equal(terrain.getHeightAtCell( indexX, indexZ ),setHeight);
			});
		});

		describe("#getElevation()", function(){
			it("should be valid array", function(){
				assert.ok(Array.isArray( terrain.getElevation() ) );
				assert.equal( terrain.getElevation().length, width * depth );
			});
		});

		describe("#getHeightAtPoint()", function(){
			var heightAtPoint = terrain.getHeightAtPoint(indexX * scale, indexZ * scale);
			it("should match java output", function(){
				//value from test-run in java version
				assert.equal( heightAtPoint, 114.5 );
			});
		});

		describe("#getScale()", function(){
			it("should get scale", function(){
				var scl = terrain.getScale();
				assert.equal( scl.x, scale );
				assert.equal( scl.y, scale );
			});
		});

		describe("#getVertexAtCell()", function(){
			it("should return correct vertex", function(){
				var vertex = terrain.getVertexAtCell( indexX, indexZ);
				assert.equal( vertex.y, setHeight );
			});
		});

		describe("#getWidth()", function(){
			it("should return the set width", function(){
				assert.equal(terrain.getWidth(), width);
			});
		});

		describe("#intersectAtPoint( x, y )", function(){
			var isectData3D = terrain.intersectAtPoint( indexX * scale, indexZ * scale );
			it("should intersect", function(){
				assert.ok( isectData3D.isIntersection, isectData3D.toString() );
			});
		});

		describe("#setScale()", function(){
			it("should set new scale", function(){
				var t = new Terrain( width, depth, 1 );
				t.setScale( new toxi.geom.Vec2D( 3, 4 ) );
				var scl = t.getScale();
				assert.equal( scl.x, 3 );
				assert.equal( scl.y, 4 );
			});
		});

		describe("#toMesh()", function(){
			var mesh= terrain.toMesh();
			it("should be valid mesh", function(){
				assert.ok( mesh instanceof toxi.geom.mesh.TriangleMesh );
				assert.ok( Array.isArray(mesh.faces) );
				assert.ok( Array.isArray(mesh.vertices) );
				assert.equal( typeof mesh.toWEMesh, 'function' );
			});
		});
	});

});