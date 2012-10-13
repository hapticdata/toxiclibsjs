/*jslint unused: true, undef: true*/
/*global define, console*/
define([
	'require',
	'exports',
	'module',
	'../../internals',
	'../Line3D',
	'../Quaternion',
	'../Vec3D',
	'../Vec2D',
	'./TriangleMesh',
	'./subdiv/MidpointSubdivision',
	'./subdiv/SubdivisionStrategy'
], function( require, exports, module ){
	var internals = require('../../internals');
	var Line3D = require('../Line3D');
	var Vec3D = require('../Vec3D');
	var TriangleMesh = require('./TriangleMesh');

	var WETriangleMesh = function( name ){
		name = name || "untitled";
		TriangleMesh.call(this, name);
	};
	WETriangleMesh.DEFAULT_NUM_FACES = TriangleMesh.DEFAULT_NUM_FACES;
	WETriangleMesh.DEFAULT_NUM_VERTICES = TriangleMesh.DEFAULT_NUM_VERTICES;
	internals.extend( WETriangleMesh, TriangleMesh );

	var proto = WETriangleMesh.prototype;

	proto.addFace = function( a, b, c, norm, uvA, uvB, uvC ){
		if( arguments.length === 6 ){
			//6-arg a,b,c,uvA,uvB,uvC pass everything up one
			uvC = uvB;
			uvB = uvA;
			uvA = norm;
			norm = undefined;
		}
		//TODO: NEEDS WEVertex, WEFace, _checkVertex
		var va = this.__checkVertex(a),
			vb = this.__checkVertex(b),
			vc = this.__checkVertex(c),
			nc, t, f;

		if( va.id === vb.id || va.id === vc.id || vb.id === vc.id ){
			console.log('Ignoring invalid face: ' + a + ',' + b + ',' + c);
		} else {
			if( n !== undefined && n !== null ){
				nc = va.sub(vc).crossSelf(va.sub(vb));
				if( n.dot(nc) < 0 ){
					t = va;
					va = vb;
					vb = t;
				}
			}
			f = new WEFace(va, vb, vc, uvA, uvB, uvC);
			this.faces.push(f);
			this.numFaces++;
			this.updateEdge( va,vb,f );
			this.updateEdge( vb,vc,f );
			this.updateEdge( vc,va,f );
		}
		return this;
	};

	proto.center = function( origin, callback ){
		TriangleMesh.prototype.center.call(this, origin, callback);
		this.rebuildIndex();
	};

	proto.clear = function(){
		TriangleMesh.prototype.clear.call(this);
		this.__edgesDictionary = {};
		this.edges = [];
		return this;
	};

	proto.copy = function(){
		var m = new WETriangleMesh( this.name+"-copy", this.numVertices, this.numFaces );
		for(var i=0, l = this.faces.length; i<l; i++){
			m.addFace( f.a, f.b, f.c, f.normal, f.uvA, f.uvB, f.uvC );
		}
		return m;
	};

	proto._createVertex = function( vec3D, id ){
		var vertex = new WEVertex( vec3D, id );
		this.__vectorMap[ vec3D ] = vertex;
		return vertex;
	};
	//TODO: numEdges currently not hooked up
	proto.getNumEdges = function(){
		return this.numEdges;
	};

	proto.init = function( name ){
		TriangleMesh.prototype.init.call(this, name);
		//this.__edgesDictionary[ va.toString()+vb.toString() ] = {WingedEdge}
		this.__edgesDictionary = {};
		this.edges = [];
		this.__edgeCheck = new Line3D( new Vec3D(), new Vec3D() );
		this.__uniqueEdgeID = 0;
	};

	proto.rebuildIndex = function(){
		//if vertices have moved / transformed a new __vertexDictionary must be made
		//in order to have updated string keys of new positions
		//newVertexDictionary[{String}] = {Vertex}
		var newVertexDictionary = {};
		var newEdgesDictionary = {};
		var prop = '';
		for( prop in this.__vertexDictionary ){
			var v = this__vertexDictionary[prop];
			newVertexDictionary[v.toString()] = v;
		}
		this.__vertexDictionary = newVertexDictionary;

		for( prop in this.__edgesDictonary ){
			var line3D = this.__edgesDictionary[prop];
			newEdgesDictionary[ line3D.toString() ] = line3D;
		}
		this.__edgesDictonary = newEdgesDictionary;

	};

	//FIXME (FIXME in original java source)
	//TODO UNIT TEST .splice
	proto.removeUnusedVertices = function(){
		internals.each( this.vertices, function( vertex, i ){
			var isUsed = false;
			internals.each( this.faces, function( f ){
				if( f.a == vertex || f.b == vertex || f.c == vertex ){
					isUsed = true;
					return;
				}
			});
			if( !isUsed ){
				this.vertices.splice( i, 1 );
			}
		});
	};

	/**
	* @param {Vertex[] | Vertex{}} selection, array or object of Vertex's to remove
	*/
	proto.removeVertices = function( selection ){
		internals.each( selection, function( vertex ){
			//WingedEdgeVertex
			internals.each( vertex.edges, function( edge ){
				internals.each( edge.faces, function( face ){
					this.removeFace( face );
				});
			});
		});
	};

	proto.toString = function(){
		return "WETriangleMesh: " + this.name + " vertices: " + this.getNumVertices() + " faces: " + this.getNumFaces() + " edges:" + this.getNumEdges();
	};

	/**
	* Applies the given matrix transform to all mesh vertices. If the
	* updateNormals flag is true, all face normals are updated automatically,
	* however vertex normals still need a manual update.
	* @param {toxi.geom.Matrix4x4} matrix
	* @param {Boolean} [updateNormals]
	*/
	proto.transform = function( matrix, updateNormals ){
		if( updateNormals === undefined || updateNormals === null ){
			updateNormals = true;
		}
		for(var i=0, l = this.vertices.length; i<l; i++){
			matrix.applyToSelf( this.vertices[i] );
		}
		this.rebuildIndex();
		if( updateNormals ){
			this.computeFaceNormals();
		}
		return this;
	};

	proto.updateEdge = function( va, vb, face ){
		//dictionary key is va.toString() + vb.toString() 
		//because Line3D toString would be different than WingedEdge toString()
		this.edgeCheck.set( va, vb );
		var e = this.__edgesDictionary[ va.toString() + vb.toString() ];
		if( e !== undefined ){
			e.addFace( face );
		} else {
			e = new WingedEdge( va, vb, face, this.__uniqueEdgeID++ );
			this.__edgesDictionary[ va.toString() + vb.toString() ] = e;
			this.edges.push( e );
			va.addEdge( e );
			vb.addEdge( e );
		}
		face.addEdge( e );
	};


	module.exports = WETriangleMesh;
});