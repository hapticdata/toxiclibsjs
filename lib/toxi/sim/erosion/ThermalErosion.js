define([
	'toxi/internals',
	'./ErosionFunction'
], function( internals, ErosionFunction ){
	var ThermalErosion = function(){
		ErosionFunction.call(this);
	};
	internals.extend( ThermalErosion, ErosionFunction );
	ThermalErosion.prototype.erodeAt = function( x, y ){
		var idx = y * this.width + x,
			minD = Number.MAX_VALUE,
			sumD = 0,
			n = 0,
			i = 0,
			hOut;
		for(i=0; i<9; i++){
			this._h[i] = this.elevation[idx + this._off[i]];
			this._d[i] = this.elevation[idx] - this._h[i];
			if( this._d[i] > 0 ){
				if( this._d[i] < minD ){
					minD = this._d[i];
				}
				sumD += this._d[i];
				n++;
			}
		}
		hOut = n * minD / (n + 1.0);
		this.elevation[idx] -= hOut;
		for(i=0; i<9; i++){
			if( this._d[i] > 0 ){
				this.elevation[idx + this._off[i]] = this._h[i] + hOut * ( this._d[i] / sumD );
			}
		}
	};

	ThermalErosion.prototype.toString = function(){ return 'ThermalErosion'; };
    return ThermalErosion;
});