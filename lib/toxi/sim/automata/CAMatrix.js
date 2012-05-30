define([
	'toxi/math/mathUtils'
], function( MathUtils ){
	function CAMatrix() {
		var i = 0;
		
		this.width = arguments[0];
		this.height = (arguments.length === 1) ? 1 : arguments[1];
		this.matrix = [];
		for (i = 0; i < (this.width * this.height); i++) {
			this.matrix.push(0)
		}
		this.swap = this.matrix.slice(0);
		
		this.rule = null;
		this.generation = 0;
	}

	CAMatrix.prototype = {
		addNoise: function() {
			if (this.rule === null) {
				throw "CA Rule not yet initialized";
			}
			var probability = arguments[0],
					minState = (arguments.length === 1) ? 0 : arguments[1],
					maxState = (arguments.length === 1) ? this.rule.getStateCount() : arguments[2],
					x, y, idx;
			
			minState = MathUtils.clip(minState, 0, this.rule.getStateCount());
			maxState = MathUtils.clip(maxState, 0, this.rule.getStateCount());
			
			for (x = 0; x < this.width; x++) {
				for (y = 0; y < this.height; y++) {
					if (MathUtils.random() > probability) {
						idx = y * this.width + x;
						this.swap[idx] = this.matrix[idx] = Math.round(MathUtils.random(minState, maxState));
					}
				}
			}
			return this;
		},
		drawBoxAt: function(x, y, w, state) {
			var idx, i, j;

			for (i = y - w / 2; i < y + w; i++) {
				for (j = x - w; j < x + w; j++) {
					if(j >= 0 && j < this.height && i >= 0 && i < this.width){
						idx = j + i * this.width;
						this.swap[idx] = this.matrix[idx] = state;
					}
				}
			}
			return this
		},
		getGeneration: function() {
			return this.generation;
		},
		getHeight: function() {
			return this.height;
		},
		getIndexFor: function(x, y) {
			return x + y * this.width;
		},
		getMatrix: function() {
			return this.matrix;
		},
		getRule: function() {
			return this.rule;
		},
		getSwapBuffer: function() {
			return this.swap;
		},
		getWidth: function() {
			return this.width;
		},
		reset: function() {
			var i;
			for (i = 0; i < this.matrix.length; i++) {
				this.matrix[i] = 0;
				this.swap[i] = 0;
			}
			return this;
		},
		seedImage: function(pixels, imgWidth, imgHeight) {
			var xo = MathUtils.clip((this.width - imgWidth) / 2, 0, width - 1),
					yo = MathUtils.clip((this.height - imgHeight) / 2, 0, height - 2),
					idx, x, y;
			imgWidth = MathUtils.min(imgWidth, this.width);
			imgHeight = MathUtils.min(imgHeight, this.height);
			for (y = 0; y < imgHeight; y++) {
				var i = y * imgWidth;
				for (x = 0; x < imgWidth; x++) {
					if (0 < (pixels[i + x] & 0xff)) {
						idx = (yo + y) * width + xo + x;
						this.matrix[idx] = 1;
					}
				}
			}
			return this;
		},
		setRule: function(rule){
			this.rule = rule;
			return this;
		},
		setStateAt: function(x, y, state) {
			var idx = x + y * this.width;

			if (idx >= 0 && idx < this.matrix.length){
				this.swap[idx] = state;
				this.matrix[idx] = state;
			} else {
					throw "given coordinates: " + x + ";" + y + " are out of bounds";
			}
			return this;
		},
		update: function() {
			if(this.rule !== null) { 
				this.rule.evolve(this);
				this.matrix = this.swap.slice(0); //copy swap to matrix
				this.generation++;
			}
		}
	};
	return CAMatrix;
});
