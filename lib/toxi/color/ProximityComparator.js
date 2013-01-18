define(function( require ){
	var ProximityComparator = function( col, proxy ){
		this.col = col;
		this.proxy = proxy;
	};
	ProximityComparator.prototype.compare = function( a, b ){
		var da = this.proxy.distanceBetween( this.col, a );
		var db = this.proxy.distanceBetween( this.col, b );
		return da < db ? -1 : da > db ? 1 : 0;
	};
	return ProximityComparator;
});