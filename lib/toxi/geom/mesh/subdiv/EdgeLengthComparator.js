define(function(){
	var EdgeLengthComparator = function(){};
	EdgeLengthComparator.prototype.compare = function( edge1, edge2 ){
		return -parseInt( edge1.getLengthSquared()-edge2.getLengthSquared(), 10);
	};
	return EdgeLengthComparator;
});