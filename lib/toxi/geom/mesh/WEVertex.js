define([
	'../../internals',
	'./Vertex'
], function( internals, Vertex ){
	var WEVertex, proto;

	WEVertex = function( vec3d, id ){
		Vertex.call(this, vec3d, id);
		this.edges = [];
	};
	internals.extend( WEVertex, Vertex );
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
				closest = n;
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
});