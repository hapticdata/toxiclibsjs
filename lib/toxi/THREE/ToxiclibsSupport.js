/*global THREE*/
define([
    "../internals/is"
], function( is ) {
    /**
     * @author Kyle Phillips  / haptic-data.com
     * a bridge between Toxiclibs.js and Three.js
     *
     * Three.js does type-checking to ensure that vectors, vertices and faces are of THREE's types
     * this helps to do that conversion process.
     */
    var	ToxiclibsSupport = function(scene){
        if(THREE === undefined){
            throw new Error("THREE.js has not been loaded");
        }
        this.scene = scene;
        this.objectDictionary = {};
    };

    ToxiclibsSupport.createLineGeometry = function(line3d, geometry){
        return ToxiclibsSupport.createMeshGeometry({ vertices: [line3d.a, line3d.b] }, geometry);
    };
    /**
     * create a THREE.Geometry with matching vertices to your triangleMesh
     * @param {toxi.geom.mesh.TriangleMesh} triangleMesh the toxiclibs.js triangle mesh to convert
     * @param {THREE.Geometry} [geometry] optional geometry to pass in if you would prefer to update
     * a geometry instead of create a new one
     * @returns {THREE.Geometry}
     */

    ToxiclibsSupport.createMeshGeometry = function createMeshGeometry(obj, geometry){
        geometry = geometry || new THREE.Geometry();
        //create a map where the unique id of the Vertex
        //references the index in the array
        var idIndexMap = {};
        var v, i, f, len, vertices;
        //add all vertices
        vertices = is.Array(obj) ? obj : obj.vertices;
        len = vertices.length;
        if( !vertices ){
            throw new Error('no vertices found');
        }
        for( i= 0; i<len; i++ ){
            v = vertices[i];
            geometry.vertices[i] = new THREE.Vector3(v.x, v.y, v.z);
            idIndexMap[v.id] = i;
        }

        if( obj.faces ){
            len = obj.faces.length;
            for( i=0; i<len; i++ ){
                f = obj.faces[i];
                //normal.y *= -1;
                //unlike toxiclibs, a face in three.js are indices related to the vertices array
                geometry.faces[i] = new THREE.Face3(
                    idIndexMap[f.a.id], idIndexMap[f.b.id], idIndexMap[f.c.id],
                    new THREE.Vector3(f.normal.x, f.normal.y, f.normal.z )
                );
            }
        }
        geometry.computeCentroids();
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
        addLine: function(line3d, material){
            if(material === undefined){
                material = new THREE.LineBasicMaterial();
            }
            var geom = ToxiclibsSupport.createLineGeometry(line3d);
            var line = new THREE.Line(geom,material);
            this.scene.add(line);
            return line;
        },
        /**
         * add a toxiclibs.js mesh to the three.js scene
         * @param {Object|toxi.geom.mesh.TriangleMesh} obj_or_mesh either an options object or
         * the toxiclibsjs mesh
         * --
         * @param {toxi.geom.mesh.Trianglemesh} [obj_or_mesh.geometry] the mesh in the options object
         * @param {THREE.Material} [obj_or_mesh.material] the three.js material for the mesh
         * @param {boolean} [obj_or_mesh.holdInDictionary] should ToxiclibsSupport hold a reference?
         * --
         * @param {THREE.Material} [threeMaterials] the three.js material for the mesh
         */
        addMesh: function(obj_or_mesh,threeMaterials){
            var toxiTriangleMesh;
            if(arguments.length == 1){ //it needs to be an param object
                toxiTriangleMesh = obj_or_mesh.geometry;
                threeMaterials = obj_or_mesh.materials;
            } else {
                toxiTriangleMesh = obj_or_mesh;
            }
            var threeMesh = this.createMesh(toxiTriangleMesh,threeMaterials);
            this.scene.add(threeMesh);
            return threeMesh;
        },
        addParticles: function(positions, material){
            if(material === undefined){
                material = new THREE.ParticleBasicMaterial();
            }
            positions =  is.Array( positions ) ? positions : [ positions ];
            var particle = new THREE.Geometry(),
                pos;
            for(var i=0,len = positions.length;i<len;i++){
                pos = positions[i];
                particle.vertices[i] = new THREE.Vector3( pos.x, pos.y, pos.z );
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
        }
    };

    return ToxiclibsSupport;
});
