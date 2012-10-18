define([
	"require",
	"exports",
	"module",
	"../../internals",
	"../Vec3D"
], function(require, exports, module) {

	//WEVertex becomes a property on Vertex
	var Vertex, WEVertex;

	(function(){
		var extend = require('../../internals').extend,
			Vec3D = require('../Vec3D'),
			proto;

		Vertex = function(v,id) {
			Vec3D.call(this,v);
			this.id = id;
			this.normal = new Vec3D();
		};
		extend(Vertex,Vec3D);
		proto = Vertex.prototype;
		proto.addFaceNormal = function(n) {
			this.normal.addSelf(n);
		};

		proto.clearNormal = function() {
			this.normal.clear();
		};

		proto.computeNormal = function() {
			this.normal.normalize();
		};

		proto.toString = function() {
			return this.id + ": p: " + this.parent.toString.call(this) + " n:" + this.normal.toString();
		};
	}());

	(function(){
		var extend = require('../../internals').extend, proto;

		WEVertex = function( vec3d, id ){
			Vertex.call(this, vec3d, id);
			this.edges = [];
		};
		extend( WEVertex, Vertex );
		proto = WEVertex.prototype;
		//@param {WingedEdge} edge to add
		proto.addEdge = function( edge ){
			this.edges.push( edge );
		};
		//@param {Vec3D} dir
		//@param {Number} tolerance
		//@return {WingedEdge} closest
		proto.getNeighborInDirection = function( dir, tolerance ){
			var closest, delta = 1 - tolerance;
			var neighbors = this.getNeighbors();
			var d;
			for(var i=0, l=neighbors.length; i<l; i++){
				d = neighbors[i].sub( this ).normalize().dot( dir );
				if( d > delta ){
					closest = neighbors[i];
					delta = d;
				}
			}
			return closest;
		};
		//@return {WingedEdge[]} neighbors
		proto.getNeighbors = function(){
			var neighbors = [];
			for(var i=0, l=this.edges.length; i<l; i++){
				neighbors.push( this.edges[i].getOtherEndFor(this) );
			}
			return neighbors;
		};

		proto.removeEdge = function( e ){
			this.edges.splice( this.edges.indexOf( e ), 1 );
		};

		proto.toString = function(){
			return this.id + " {" + this.x + "," + this.y + "," + this.z + "}";
		};

		return WEVertex;
	}());
	Vertex.WEVertex = WEVertex;
	module.exports = Vertex;
});
