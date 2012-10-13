define([
	'toxi/internals',
	'./ErosionFunction'
], function( internals, ErosionFunction ){
	/**
	 * For each neighbour it's computed the difference between the processed cell
	 * and the neighbour:
	 *
	 * <pre>
	 * d[i] = h - h[i];
	 * </pre>
	 *
	 * the maximum positive difference is stored in d_max, and the sum of all the
	 * positive differences that are bigger than T (this numer is n), the talus
	 * angle, is stored in d_tot.
	 *
	 * Now it's possible to update all the n cells (where d[i] is bigger than T)
	 * using this formula:
	 *
	 * <pre>
	 * h[i] = h[i] + c * (d_max - T) * (d[i] / d_tot);
	 * </pre>
	 *
	 * and the main cell with this other formula:
	 *
	 * <pre>
	 * h = h - (d_max - (n * d_max * T / d_tot));
	 * </pre>
	 *
	 * The Talus angle T is a threshold that determines which slopes are affected by
	 * the erosion, instead the c constant determines how much material is eroded.
	 */
	/**
     * @param theta
     *            talus angle
     * @param amount
     *            material transport amount
     */
	var TalusAngleErosion = function( theta, amount ){
		ErosionFunction.call(this);
		this.__theta = theta;
		this.__amount = amount;
	};
	internals.extend(TalusAngleErosion, ErosionFunction);

	TalusAngleErosion.prototype.erodeAt = function( x,y ){
		var idx = y * this.width + x,
			maxD = 0,
			sumD = 0,
			n = 0,
			i =0;
		for(i=0; i<9; i++){
			this._h[i] = this.elevation[idx + this._off[i]];
			this._d[i] = this.elevation[idx] - this._h[i];
			if( this._d[i] > this.__theta ){
				sumD += this._d[i];
				n++;
				if( this._d[i] > maxD ){
					maxD = this._d[i];
				}
			}
		}
		if( sumD > 0 ){
			this.elevation[idx] -= (maxD - (n * maxD * this.__theta / sumD));
			for(i=0; i<9; i++){
				if( this._d[i] > this.__theta ){
					this.elevation[idx + this._off[i]] = this._h[i] + this.__amount * (maxD - this.__theta) * (this._d[i] / sumD);
				}
			}
		}
	};

	TalusAngleErosion.prototype.getAmount = function(){ return this.__amount; };
	TalusAngleErosion.prototype.getTheta = function(){ return this.__theta; };
	TalusAngleErosion.prototype.setAmount = function( amount ){ this.__amount = amount; };
	TalusAngleErosion.prototype.setTheta = function( theta ){ this.__theta = theta; };
	TalusAngleErosion.prototype.toString = function(){
		return 'TalusAngleErosion: theta=' +this.__theta+ ' amount=' +this.__amount;
	};

	return TalusAngleErosion;
});