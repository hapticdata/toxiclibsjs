define([
	'../../../internals',
	'./SubdivisionStrategy'
], function ( internals, SubdivisionStrategy ){
	
	var TriSubdivision = function(){
		SubdivisionStrategy.call(this);
	};
	internals.extend( TriSubdivision, SubdivisionStrategy );
	TriSubdivision.prototype.computeSplitPoints = function( edge ){
		return [
			edge.a.interpolateTo(edge.b, 0.25),
			edge.a.interpolateTo(edge.b, 0.5),
			edge.a.interpolateTo(edge.b, 0.75)
		];
	};
	return TriSubdivision;
});
    