define([
	'../../../internals',
	'./DisplacementSubdivision'
], function( internals, DisplacementSubdivision ){

	var NormalDisplacementSubdivision = function( amp ){
		DisplacementSubdivision.call( this, amp );
	};
	internals.extend( NormalDisplacementSubdivision, DisplacementSubdivision );
	NormalDisplacementSubdivision.prototype.computeSplitPoints = function( edge ){
		var mid = edge.getMidPoint(),
			n = edge.faces[0].normal;

		if( edge.faces.length > 1 ){
			n.addSelf( edge.faces[1].normal );
		}
		n.normalizeTo( this.amp * edge.getLength() );
		return [ mid.addSelf(n) ];
	};
	return NormalDisplacementSubdivision;
});