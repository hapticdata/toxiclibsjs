define(function( require, exports ){
	function makeProxy( type ){
		var name = type + 'DistanceProxy';
		exports[name] = function(){};
		exports[name].prototype.distanceBetween = function( a, b ){
			//a.distanceToHSV( b );
			return a['distanceTo'+type]( b );
		};
	}
	makeProxy('HSV');
	makeProxy('RGB');
	makeProxy('CMYK');
});