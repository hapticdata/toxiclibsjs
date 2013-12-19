define([
	'../../internals',
	'../Line3D'
], function( internals, Line3D ){

	var WingedEdge, proto;
	//@param {WEVertex} va
	//@param {WEVertex} vb
	//@param {WEFace} face
	//@param {Number} id
	WingedEdge = function( va, vb, face, id ){
		Line3D.call(this, va, vb);
		this.id = id;
		this.faces = [];
		this.addFace( face );
	};
	internals.extend( WingedEdge, Line3D );
	proto = WingedEdge.prototype;
	//@param {WEFace} face
	//@return {WingedEdge} this
	proto.addFace = function( face ){
		this.faces.push( face );
		return this;
	};
	//@return {WEFace[]} faces
	proto.getFaces = function() {
		return this.faces;
	};
	//@param {WEVertex} wevert
	//@return {WingedEdge}
	proto.getOtherEndFor = function( wevert ){
		if( this.a === wevert ){
			return this.b;
		}
		if( this.b === wevert ){
			return this.a;
		}
	};

	proto.remove = function(){
		var self = this;
		var rm = function( edges ){
			edges.splice( edges.indexOf( self ), 1 );
		};
		for( var i=0, l = this.faces.length; i<l; i++){
			rm( this.faces[i].edges );
		}
		rm( this.a.edges );
		rm( this.b.edges );
	};

	proto.toString = function(){
		return "id: " + this.id + " " + Line3D.prototype.toString.call(this) + " f: " + this.faces.length;
	};

	return WingedEdge;

});