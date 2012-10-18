define([
	"require",
	"exports",
	"module",
	"../Triangle3D",
	"../../internals"
], function(require, exports, module) {
	//these 2 modules get defined
	var Face, WEFace;

	(function(){
		var Triangle3D = require('../Triangle3D');
		Face = function(a,b,c,uvA,uvB,uvC) {
			this.a = a;
			this.b = b;
			this.c = c;
			var aminusc = this.a.sub(this.c);
			var aminusb = this.a.sub(this.b);
			var cross = aminusc.crossSelf(aminusb);
			this.normal = cross.normalize();
			this.a.addFaceNormal(this.normal);
			this.b.addFaceNormal(this.normal);
			this.c.addFaceNormal(this.normal);
			
			if(uvA !== undefined){
				this.uvA = uvA;
				this.uvB = uvB;
				this.uvC = uvC;
			}
		};

		Face.prototype = {
			computeNormal: function() {
				this.normal = this.a.sub(this.c).crossSelf(this.a.sub(this.b)).normalize();
			},

			flipVertexOrder: function() {
				var t = this.a;
				this.a = this.b;
				this.b = t;
				this.normal.invert();
			},
			
			getCentroid: function() {
				return this.a.add(this.b).addSelf(this.c).scale(1.0 / 3);
			},
			
			getClass: function(){
				return "Face";
			},

			getVertices: function(verts) {
				if (verts !== undefined) {
					verts[0] = this.a;
					verts[1] = this.b;
					verts[2] = this.c;
				} else {
					verts = [ this.a, this.b, this.c ];
				}
				return verts;
			},

			toString: function() {
				return this.getClass() + " " + this.a + ", " + this.b + ", " + this.c;
			},

			/**
			 * Creates a generic {@link Triangle3D} instance using this face's vertices.
			 * The new instance is made up of copies of the original vertices and
			 * manipulating them will not impact the originals.
			 *
			 * @return triangle copy of this mesh face
			 */
			toTriangle: function() {
				return new Triangle3D(this.a.copy(), this.b.copy(), this.c.copy());
			}
		};
	}());

	//define WEFace
	(function(){
		var internals = require('../../internals');
		var proto;
		//@param {WEVertex} a
		//@param {WEVertex} b
		//@param {WEVertex} c
		//@param {Vec2D} [uvA]
		//@param {Vec2D} [uvB]
		//@param {Vec2D} [uvC]
		WEFace = function( a, b, c, uvA, uvB, uvC ){
			Face.call(this, a, b, c, uvA, uvB, uvC);
			this.edges = [];
		};
		internals.extend( WEFace, Face );
		proto = WEFace.prototype;
		//@param {WingedEdge} edge
		proto.addEdge = function( edge ){
			this.edges.push( edge );
		};
		proto.getEdges = function(){
			return this.edges;
		};
		//@param {WEVertex[]} [verts]
		proto.getVertices = function( verts ){
			if( verts !== undefined ){
				verts[0] = this.a;
				verts[1] = this.b;
				verts[2] = this.c;
			} else {
				verts = [ this.a, this.b, this.c ];
			}
			return verts;
		};
	}());
	Face.WEFace = WEFace;
	module.exports = Face;
});
