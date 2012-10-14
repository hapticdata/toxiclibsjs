define([
	'./EdgeLengthComparator'
], function( EdgeLengthComparator ){
	
	var SubdivisionStrategy, proto;
	SubdivisionStrategy = function(){
		this._order = SubdivisionStrategy.DEFAULT_ORDERING;
	};
	SubdivisionStrategy.DEFAULT_ORDERING = new EdgeLengthComparator();
	proto = SubdivisionStrategy.prototype;

	proto.getEdgeOrdering = function(){
		return this._order.compare;
	};
	proto.setEdgeOrdering = function( order ){
		this._order = order;
	};

	return SubdivisionStrategy;

});