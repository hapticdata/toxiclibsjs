define([
	'../../../internals',
	'./SubdivisionStrategy'
], function( internals, SubdivisionStrategy ){

	var MidpointSubdivison = function(){
		SubdivisionStrategy.call(this);
	};
	internals.extend( MidpointSubdivison, SubdivisionStrategy );
	MidpointSubdivison.prototype.computeSplitPoints = function( edge ){
		var mid = [];
		mid.push( edge.getMidPoint() );
		return mid;
	};

	return MidpointSubdivison;
});