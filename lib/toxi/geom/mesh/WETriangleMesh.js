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
	'./WEVertex',
	'./WEFace',
	'./WingedEdge',
	'./subdiv/MidpointSubdivision'
], function( require, exports, module ){
	//dependenecies
	var internals = require('../../internals');
	var Line3D = require('../Line3D');
	var Vec3D = require('../Vec3D');
	var TriangleMesh = require('./TriangleMesh');
	var WEVertex = require('./WEVertex');
	var WEFace = require('./WEFace');
	var WingedEdge = require('./WingedEdge');
	var MidpointSubdivision = require('./subdiv/MidpointSubdivision');
	
	//locals
	var WETriangleMesh, proto;
	//used for tracking edges in the internals.LinkedMap
	function edgeKeyGenerator( edge ){
		return Line3D.prototype.toString.call( edge );
	}
	//constructor
	WETriangleMesh = function( name ){
		name = name || "untitled";
		TriangleMesh.call(this, name);
	};
	//passing these on to match java api
	WETriangleMesh.DEFAULT_NUM_FACES = TriangleMesh.DEFAULT_NUM_FACES;
	WETriangleMesh.DEFAULT_NUM_VERTICES = TriangleMesh.DEFAULT_NUM_VERTICES;
	
	internals.extend( WETriangleMesh, TriangleMesh );
	proto = WETriangleMesh.prototype;

	proto.addFace = function( a, b, c, norm, uvA, uvB, uvC ){
		if( arguments.length === 6 ){
			//6-arg a,b,c,uvA,uvB,uvC pass everything up one
			uvC = uvB;
			uvB = uvA;
			uvA = norm;
			norm = undefined;
		}

		var va = this.__checkVertex(a),
			vb = this.__checkVertex(b),
			vc = this.__checkVertex(c),
			nc, t, f;

		if( va.id === vb.id || va.id === vc.id || vb.id === vc.id ){
			console.log('Ignoring invalid face: ' + a + ',' + b + ',' + c);
		} else {
			if( norm !== undefined && norm !== null ){
				nc = va.sub(vc).crossSelf(va.sub(vb));
				if( norm.dot(nc) < 0 ){
					t = va;
					va = vb;
					vb = t;
				}
			}
			f = new WEFace(va, vb, vc, uvA, uvB, uvC);
			this.faces.push(f);
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
		this.edgeMap = new internals.LinkedMap( edgeKeyGenerator );
		this.edges = this.edgeMap.getArray();
		return this;
	};

	proto.copy = function(){
		var m = new WETriangleMesh( this.name+"-copy" );
		var i, l, f;
		l = this.faces.length;
		for(i=0; i<l; i++){
			f = this.faces[i];
			m.addFace( f.a, f.b, f.c, f.normal, f.uvA, f.uvB, f.uvC );
		}
		return m;
	};

	proto._createVertex = function( vec3D, id ){
		var vertex = new WEVertex( vec3D, id );
		return vertex;
	};
	//TODO: numEdges currently not hooked up
	proto.getNumEdges = function(){
		return this.edgeMap.size();
	};

	proto.init = function( name ){
		TriangleMesh.prototype.init.call(this, name);
		//this.edgeMap.put(va.toString()+vb.toString(), {WingedEdge} );
		this.edgeMap = new internals.LinkedMap();
		this.edges = this.edgeMap.getArray();
		this.__edgeCheck = new Line3D( new Vec3D(), new Vec3D() );
		this.__uniqueEdgeID = 0;
	};

	proto.rebuildIndex = function(){
		//if vertices have moved / transformed a new vertexMap and edgeMap must be made
		//in order to have updated string keys of new positions
		//newVertexDictionary[{String}] = {Vertex}
		var newVertexMap = new internals.LinkedMap( TriangleMesh.__vertexKeyGenerator );
		var newEdgeMap = new internals.LinkedMap( edgeKeyGenerator );

		this.vertexMap.each(function( vertex ){
			newVertexMap.put( vertex, vertex );
		});
		this.edgeMap.each(function( edge ){
			newEdgeMap.put( edge, edge );
		});

		this.vertexMap = newVertexMap;
		this.vertices = newVertexMap.getArray();
		this.edgeMap = newEdgeMap;
		this.edges = newEdgeMap.getArray();
	};

	proto.removeEdge = function( edge ){
		edge.remove();
		var v = edge.a;
		if( v.edges.length === 0 ){
			this.vertexMap.remove( v );
		}
		v = edge.b;
		if( v.edges.length === 0 ){
			this.vertexMap.remove( v );
		}
		internals.each(edge.faces, function( face ){
			this.removeFace( face );
		});
		var removed = this.edgeMap.remove( this.__edgeCheck.set( edge.a, edge.b ) );
		if( removed !== edge ){
			throw Error("Can't remove edge");
		}
	};

	proto.removeFace = function( face ){
		var i = this.faces.indexOf( face );
		if( i > -1 ){
			this.faces.splice( i, 1 );
		}
		internals.each( face.edges, function( edge ){
			edge.faces.remove( face );
			if( edge.faces.length === 0 ){
				this.removeEdge( edge );
			}
		});
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

	//@param {Vec3D | WingedEdge} a or edge
	//@param {Vec3D | SubdivisionStrategy} b or strategy if edge supplied
	//@param {SubdivisionStrategy} [subDiv] or undefined
	proto.splitEdge = function( a, b, subDiv ){
		var edge, mid;
		if( arguments.length === 3 ){
			edge = this.edgeMap.get( this.__edgeCheck.set(a, b) );
		} else if( arguments.length == 2 ){
			edge = a;
			subDiv = b;
		}
		mid = subDiv.computeSplitPoints( edge );
		this.splitFace( edge.faces[0], edge, mid);
		if( edge.faces.length > 1 ){
			this.splitFace( edge.faces[1], edge, mid);
		}
		this.removeEdge( edge );
	};
	//@param {WEFace} face,
	//@param {WingedEdge} edge,
	//@param {Vec3D[]} midPoints
	proto.splitFace = function( face, edge, midPoints ){
		var p, i, ec, prev, num, mid;
		for(i=0; i<3; i++){
			ec = face.edges[i];
			if( !ec.equals(edge) ){
				if( ec.a.equals(edge.a) || ec.a.equals(edge.b) ){
					p = ec.b;
				} else {
					p = ec.a;
				}
				break;
			}
		}
		num = midPoints.length;
		for(i=0; i<num; i++){
			mid = midPoints[i];
			if( i === 0 ){
				this.addFace( p, edge.a, mid, face.normal );
			} else {
				this.adFace( p, prev, mid, face.normal );
			}
			if( i === num-1 ){
				this.addFace( p, mid, edge.b, face.normal );
			}
			prev = mid;
		}
	};

	//@param {SubdivisionStrategy | Number} subDiv or minLength
	//@param {Number} [minLength] if also supplying subDiv
	proto.subdivide = function( subDiv, minLength ){
		if( arguments.length === 1 ){
			minLength = subDiv;
			subDiv = new MidpointSubdivision();
		}
		this.subdividEdges( this.edges.slice(0), subDiv, minLength);
	};

	proto.subdivideEdges = function( origEdges, subDiv, minLength ){
		origEdges.sort( subDiv.getEdgeOrdering() );
		minLength *= minLength;
		var i=0, l = origEdges.length;
		for(i=0; i<l; i++){
			var e = origEdges[i];
			if( this.edges.indexOf( e ) > -1 ) {
				if( e.getLengthSquared() >= minLength ) {
					this.splitEdge( e, subDiv );
				}
			}
		}
	};

	proto.subdivideFaceEdges = function( faces, subDiv, minLength ){
		var fedges = [], i,j, f, e, fl, el;
		fl = this.faces.length;
		for(i=0; i<fl; i++){
			f = this.faces[i];
			el = f.edges.length;
			for(j=0; j<el; j++){
				e = f.edges[j];
				if( fedges.indexOf(e) < 0 ){
					fedges.push( e );
				}
			}
		}
		this.subdividEdges( fedges, subDiv, minLength );
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
		this.__edgeCheck.set( va, vb );
		var e = this.edgeMap.get( this.__edgeCheck );
		if( e !== undefined ){
			e.addFace( face );
		} else {
			e = new WingedEdge( va, vb, face, this.__uniqueEdgeID++ );
			this.edgeMap.put( e, e );
			va.addEdge( e );
			vb.addEdge( e );
		}
		face.addEdge( e );
	};
	module.exports = WETriangleMesh;
});