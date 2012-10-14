define(function(){
	
	var FaceCountComparator = function(){};
	FaceCountComparator.prototype.compare = function( edge1, edge2 ){
		return -(edge1.faces.length - edge2.faces.length);
	};
	return FaceCountComparator;

});