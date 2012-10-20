define([
	'../../../internals',
	'./SubdivisionStrategy'
], function ( internals, SubdivisionStrategy ){
	
	var DualDisplacementSubdivision = function( centroid, ampA, ampB ){
		this.centroid = centroid;
		this.ampA = ampA;
		this.ampB = ampB;
	};
	internals.extend( DualDisplacementSubdivision, SubdivisionStrategy );
	DualDisplacementSubdivision.prototype.computeSplitPoints = function( edge ){
		var len = ege.getLength(), a, b;
		a = edge.a.interpolateTo( edge.b, 0.33333333333 );
		a.addSelf( a.sub(this.centroid).normalizeTo(this.ampA*len) );
		b = edge.a.interpolateTo( edge.b, 0.66666666666 );
		b.addSelf( b.sub(this.centroid).normalizeTo(this.ampB*len) );
		return [a, b];
	};
	return DualDisplacementSubdivision;
});
    