/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');

	var Cone = toxi.geom.Cone,
		Vec3D = toxi.geom.Vec3D,
		TriangleMesh = toxi.geom.mesh.TriangleMesh;


	describe('toxi.geom.Cone', function(){

		function testConeConstructor( cone ){
			it('should inherit Vec3D', function(){
				assert.equal( true, toxi.internals.tests.hasXYZ( cone ) );
			});
			it('should have its unique properties', function(){
				assert.equal( true, toxi.internals.tests.hasXYZ( cone.dir ) );
				assert.equal( cone.radiusNorth, 4 );
				assert.equal( cone.radiusSouth, 3 );
				assert.equal( cone.length, 12 );
			});
		}

		describe('Constructor', function(){
			describe('normal, 5 params', function(){
				testConeConstructor(new Cone(new Vec3D(), new Vec3D(), 4, 3, 12) );
			});
			describe('param object', function(){
				testConeConstructor(new Cone({
					position: new Vec3D(),
					direction: new Vec3D(),
					radiusNorth: 4,
					radiusSouth: 3,
					length: 12
				}));
			});
		});
		describe('#toMesh()', function(){
			function testMesh( mesh ) {
				it('should be a valid TriangleMesh', function(){
					assert.equal( true, mesh instanceof TriangleMesh );
					assert.equal( true, Array.isArray( mesh.faces ) );
					assert.equal( true, Array.isArray( mesh.vertices ) );
				});
			}
			var cone = new Cone(new Vec3D(), new Vec3D(), 4, 3, 12);

			describe("1 param, steps", function(){
				testMesh( cone.toMesh(8) );
			});
			describe("2 params, steps & thetaOffset", function(){
				testMesh( cone.toMesh( 8, Math.PI ) );
			});
			describe("5 params, mesh, steps, thetaOffset, topClosed, bottomClosed",function(){
				testMesh( cone.toMesh(new TriangleMesh(), 8, Math.PI, false, false) );
			});
			describe("options object",function(){
				testMesh(cone.toMesh({
					mesh: new TriangleMesh(),
					steps: 8,
					thetaOffset: Math.PI
				}));
			});
			
		});

	});