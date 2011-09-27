	(function(){
		// NOTE: Currently the random seed is javascript's default, which 
		// means it is always based off the current time. This is a difference
		// from Toxiclibs for java, where you can set your own seed

		// ////////////////////////////////////////////////////////////
		// PERLIN NOISE taken from the
		// [toxi 040903]
		// octaves and amplitude amount per octave are now user controlled
		// via the noiseDetail() function.
		// [toxi 030902]
		// cleaned up code and now using bagel's cosine table to speed up
		// [toxi 030901]
		// implementation by the german demo group farbrausch
		// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip
		var PERLIN_YWRAPB = 4,
			PERLIN_YWRAP = 1 << PERLIN_YWRAPB,
			PERLIN_ZWRAPB = 8,
			PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB,
			PERLIN_SIZE = 4095,
			PERLIN_MIN_AMPLITUDE = 0.001,
			_noise_fsc = function(self, i){
				var index = ((i + 0.5) * self._perlin_PI) % self._perlin_TWOPI;
				return 0.5 * (1.0 - self._perlin_cosTable[index]);
			};

			toxi.PerlinNoise = function(){
				this._perlin_octaves = 4; // default to medium smooth
				this._perlin_amp_falloff = 0.5; // 50% reduction/octave
				this.noiseSeed();
			};

			toxi.PerlinNoise.prototype = {
				noise: function(x,y,z){
					var i = 0,
						x = x || 0,
						y = y || 0,
						z = z || 0;

					if(!this._perlin){
						this._perlin = [];
						var length = PERLIN_SIZE - 1;
						for(i = 0;i < PERLIN_SIZE + 1; i++){
							this._perlin[i] = Math.random();
						}
					}

					this._perlin_cosTable = toxi.SinCosLUT.getDefaultInstance().getSinLUT();
					this._perlin_TWOPI = this._perlin_PI = toxi.SinCosLUT.getDefaultInstance().getPeriod();
					this._perlin_PI >>= 1;

					if (x < 0) {
						x = -x;
					}
					if (y < 0) {
						y = -y;
					}
					if (z < 0) {
						z = -z;
					}
					
					var xi = x, 
						yi = y,
						zi = z,
						xf = (x - xi),
						yf = (y - yi),
						zf = (z - zi),
						rxf, 
						ryf,
						r = 0,
						ampl = 0.5,
						n1, 
						n2, 
						n3,
						of;
					for(i = 0; i < this._perlin_octaves; i++){
						of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);
						rxf = _noise_fsc(this,xf);
						ryf = _noise_fsc(this,yf);

						n1 = this._perlin[of & PERLIN_SIZE];
						n1 += rxf * (this._perlin[(of + 1) & PERLIN_SIZE] - n1);
						n2 = this._perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
						n2 += rxf * (this._perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
						n1 += ryf * (n2 - n1);

						of += PERLIN_ZWRAP;
						n2 = this._perlin[of & PERLIN_SIZE];
						n2 += rxf * (this._perlin[(of + 1) & PERLIN_SIZE] - n2);
						n3 = this._perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
						n3 += rxf * (this._perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
						n2 += ryf * (n3 - n2);

						n1 += _noise_fsc(this,zf) * (n2 - n1);
						
						r += n1 * ampl;
						ampl *= this._perlin_amp_falloff;

						// break if amp has no more impact
						if (ampl < PERLIN_MIN_AMPLITUDE) {
							break;
						}

						xi <<= 1;
						xf *= 2;
						yi <<= 1;
						yf *= 2;
						zi <<= 1;
						zf *= 2;

						if (xf >= 1.0) {
							xi++;
							xf--;
						}
						if (yf >= 1.0) {
							yi++;
							yf--;
						}
						if (zf >= 1.0) {
							zi++;
							zf--;
						}
					}
					return r;
				},
				noiseDetail: function(lod, falloff){
					if(lod > 0){
						this._perlin_octaves = lod;
					}
					if(falloff && falloff > 0){
						this._perlin_amp_falloff = falloff;
					}
				},
				noiseSeed: function(what){
					//seed here
				}
			};
	})();