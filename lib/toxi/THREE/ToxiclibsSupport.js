define(["require", "exports", "module", "../internals"], function(require, exports, module) {
/**
 * @author Kyle Phillips  / haptic-data.com<
 * Intended to be a bridge between Toxiclibs.js and Three.js
 * 
 * Three.js does type-checking to ensure that vectors, vertices and faces are of THREE's types
 * this helps to do that conversion process.
 */

var internals = require('../internals');

var	ToxiclibsSupport = function(scene){
	if(THREE === undefined){
		throw new Error("THREE.js has not been loaded");
	}
	this.scene = scene;
	this.objectDictionary = {};
};

	
var f3 = function(geometry,i1,i2,i3){
	//unlike toxiclibs, a face in three.js are indices related to the vertices array
	geometry.faces.push( new THREE.Face3( i1,i2,i3 ) );
};
var v3 = function(geometry,a){
	var threeV = new THREE.Vector3(a.x,a.y,a.z);
	geometry.vertices.push( new THREE.Vertex( threeV ) );
};



ToxiclibsSupport.createLineGeometry = function(line3d){
	var geometry = new THREE.Geometry();
	v3(geometry,line3d.a);
	v3(geometry,line3d.b);
	geometry.computeCentroids();
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	return geometry;
};
ToxiclibsSupport.createMeshGeometry = function(triangleMesh){
	var geometry = new THREE.Geometry();
	
	var addFace = function(f){
		var vectors = [f.a,f.b,f.c],
			startIndex = geometry.vertices.length;
		//make sure this wasnt a vertices from a previous face
		var	i = 0,
			len = 3;
		for(i=0;i<len;i++){
			var toxiV = vectors[i];
			v3(geometry,toxiV);
		}

		f3(geometry,startIndex,startIndex+1,startIndex+2);
	}
	

	for(var j=0,flen=triangleMesh.faces.length;j<flen;j++){
		addFace(triangleMesh.faces[j]);
	}
	
	geometry.computeCentroids();
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	
	return geometry;
};

ToxiclibsSupport.createMesh = function(triangleMesh,material){
	if(material === undefined){
		material = new THREE.MeshBasicMaterial();
	}
	var geometry = ToxiclibsSupport.createMeshGeometry(triangleMesh);
	return new THREE.Mesh(geometry,material);
};

ToxiclibsSupport.createParticle = function(position, materials){
	var particle = new THREE.Particle(materials);
	particle.position.x = position.x;
	particle.position.y = position.y;
	particle.position.z = position.z;
	return particle;
};

ToxiclibsSupport.prototype = {
	addLine: function(line3d, material,holdInDictionary){
		if(material === undefined){
			material = new THREE.LineBasicMaterial();
		}
		if(holdInDictionary === undefined){
			holdInDictionary = true;
		}
		var geom = ToxiclibsSupport.createLineGeometry(line3d);
		var line = new THREE.Line(geom,material);
		if(holdInDictionary){
			this.objectDictionary[line3d] = line;
		}
		this.scene.add(line);
		return line;
	},
	addMesh: function(obj_or_toxiTriangleMesh,threeMaterials,holdInDictionary){
		var toxiTriangleMesh = undefined;
		if(arguments.length == 1){ //it needs to be an param object
			toxiTriangleMesh == obj_or_toxiTriangleMesh.geometry;
			threeMaterials = obj_or_toxiTriangleMesh.materials;
			holdInDictionary = obj_or_holdInDictionary;
		} else {
			toxiTriangleMesh = obj_or_toxiTriangleMesh;
		}
		if(holdInDictionary === undefined){
			holdInDictionary = true;
		}
		var threeMesh = this.createMesh(toxiTriangleMesh,threeMaterials);
		if(holdInDictionary){
			this.objectDictionary[toxiTriangleMesh] = threeMesh;
		}
		this.scene.add(threeMesh);
		return threeMesh;
	},
	addParticles: function(positions, material, holdInDictionary){
		if(material === undefined){
			material = new THREE.ParticleBasicMaterial();
		}
		positions =  internals.tests.isArray( positions ) ? positions : [ positions ];
		var particle = new THREE.Geometry();
		for(var i=0,len = positions.length;i<len;i++){
			v3(particle,positions[i]);
		}
		if(holdInDictionary){
			this.objectDictionary[position] = particle;
		}
		var particleSystem = new THREE.ParticleSystem(particle,material);
		this.scene.add(particleSystem);
		return particle;
	},
	createMeshGeometry: function(triangleMesh){
		return ToxiclibsSupport.createMeshGeometry(triangleMesh);
	},
	createMesh: function(triangleMesh,material){
		return ToxiclibsSupport.createMesh(triangleMesh,material);
	},
	removeObject: function(toxiObject){
		var threeMesh = this.objectDictionary[toxiObject];
		scene.removeObject(threeMesh);
		delete this.objectDictionary[toxiObject];
	}
};

module.exports = ToxiclibsSupport;
});
