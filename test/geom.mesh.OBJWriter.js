/*global describe,it*/
var toxi = require('../index'),
	assert = require('assert');

function outputOBJ( mesh, name ){
	name = name || mesh.name;
	var objWriter = new toxi.geom.mesh.OBJWriter(name +"-"+ new Date().getTime());
	mesh.saveAsOBJ( objWriter );
	var objBody = objWriter.getOutput();
	it('should output an OBJ', function(){
		assert.equal( objBody.length > 1, true );
		/*require('fs').writeFile('./'+name+'.obj', objBody, function( err ){
			if( err ) throw err;
		});*/
	});
}

describe('toxi.geom.mesh.OBJWriter', function(){
	describe('AABB', function(){
		var aabb = new toxi.geom.AABB( new toxi.geom.Vec3D(), new toxi.geom.Vec3D(1,2,1) );
		var mesh = aabb.toMesh();
		mesh.setName('aabb');
		outputOBJ( mesh );
	});
	describe('Sphere',function(){
		var sphere = new toxi.geom.Sphere();
		var mesh = sphere.toMesh({
			resolution: 35
		});
		mesh.setName('sphere');
		outputOBJ( mesh );
	});
	describe('SphericalHarmonics', function(){
		for(var j=0; j<10; j++){
			var m = [];
			for(var i=0; i<8; i++) {
				m.push( parseInt(Math.random()*9, 10) );
			}
			var res = 75;
			var sh = new toxi.geom.mesh.SphericalHarmonics(m);
			var builder = new toxi.geom.mesh.SurfaceMeshBuilder( sh );
			var mesh = builder.createMesh(new toxi.geom.mesh.TriangleMesh(),res,1,true);
			mesh.setName('sphericalHarmonics-'+m.toString());
			mesh.computeVertexNormals();
			outputOBJ( mesh );
		}
	});

	describe('SuperEllipsoid', function(){
		var modX = new toxi.math.waves.SineWave(0, Math.PI/5, 2.5, 2.5);
		var modY = new toxi.math.waves.SineWave(Math.PI,Math.PI/5, 2.5, 2.5);
		for(var i=0; i<10; i++){
			var x = modX.update();
			var y = modY.update();
			var functor= new toxi.geom.mesh.SuperEllipsoid( x, y );
			var b = new toxi.geom.mesh.SurfaceMeshBuilder(functor);
			var mesh = b.createMesh(new toxi.geom.mesh.TriangleMesh("se"+x+','+y),20, 80);
			mesh.computeVertexNormals();
			outputOBJ( mesh );
		}
	});
});