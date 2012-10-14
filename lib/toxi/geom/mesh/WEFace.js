define([
	'../../internals',
	'./Face'
], function( internals, Face ){

	var WEFace, proto;
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

	return WEFace;
});