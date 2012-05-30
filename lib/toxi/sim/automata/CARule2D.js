define([
	'toxi/math/mathUtils'
	], function( MathUtils ){

	function CARule2D(brules, srules, st, tiled) {
		this.birthRules = [false,false,false,false,false,false,false,false,false];
		this.survivalRules = [false,false,false,false,false,false,false,false,false];
		this.randomBirthChance = 0.15;
		this.randomSurvivalChance = 0.25;

		this.setBirthRules(brules);
		this.setSurvivalRules(srules);
		this.stateCount = MathUtils.max(1, st);
		this.setTiling(tiled);
	}

	CARule2D.prototype = {
		evolve: function(evolvableMatrix) {
			var width = evolvableMatrix.getWidth(),
					height = evolvableMatrix.getHeight(),
					matrix = evolvableMatrix.getMatrix(),
					temp = evolvableMatrix.getSwapBuffer(),
					maxState = this.stateCount - 1,           
					x1, x2, y1, y2,                          // boundaries
					x, y,                                    // iterators
					centre, down, up,                        // neighborhood positions
					currVal, left, newVal, right,            // more neighborhood positions
					sum;                                     // total
			if (this.isTiling){
				x1 = 0;
				x2 = width;
				y1 = 0;
				y2 = height;
			} else {
				x1 = 1;
				x2 = width - 1;
				y1 = 1;
				y2 = height - 1;
			}
			for (y = y1; y < y2; y++) {
				// determine up and down cell indices
				up = (y > 0 ? y - 1 : height - 1) * width;
				down = (y < height - 1 ? y + 1 : 0) * width;
				centre = y * width;
				for (x = x1; x < x2; x++) {
					// determine left and right cell offsets
					left = x > 0 ? x - 1 : width - 1;
					right = x < width - 1 ? x + 1 : 0;
					currVal = matrix[centre + x];
					newVal = currVal;
					sum = 0;
					if (currVal > 1) {
						if (this.isAutoExpire) {
							newVal = (newVal + 1) % this.stateCount;
						} else {
							newVal = MathUtils.min(newVal + 1, maxState);
						}
					} else {
						if (matrix[up + left] === 1) {
							sum++; // top left
						}
						if (matrix[up + x] === 1) {
							sum++; // top
						}
						if (matrix[up + right] === 1) {
							sum++; // top right
						}
						if (matrix[centre + left] === 1) {
							sum++; // left
						}
						if (matrix[centre + right] === 1) {
							sum++; // right
						}
						if (matrix[down + left] === 1) {
							sum++; // bottom left
						}
						if (matrix[down + x] === 1) {
							sum++; // bottom
						}
						if (matrix[down + right] === 1) {
							sum++; // bottom right
						}
						if (currVal !== 0) { // centre
							if (this.survivalRules[sum]) {
								newVal = 1;
							} else {
								if (this.isAutoExpire) {
									newVal = (newVal + 1) % this.stateCount;
								} else {
									newVal = MathUtils.min(newVal + 1, maxState);
								}
							}
						} else {
							if (this.birthRules[sum]) {
								newVal = 1;
							}
						}
					}
					temp[centre + x] = newVal;
				}
			}
		},
		getStateCount: function() {
			return this.stateCount;
		},
		isAutoExpire: function() {
			return this.isAutoExpire;
		},
		isTiling: function() {
			return this.isTiling;
		},
		randomArray: function(chance) {
			var r = [],
					i;
			for (i = 0; i < 9; i++) {
				if (MathUtils.random() < chance) {
					r.push(i)
				}
			}
			return r;
		},
		randomize: function() {
			this.setRuleArray(this.randomArray(this.randomBirthChance), this.birthRules);
			this.setRuleArray(this.randomArray(this.randomSurvivalChance), this.survivalRules);
		},  
		setAutoExpire: function(state) {
			this.isAutoExpire = state;
		},
		setBirthRules: function(birthRuleArray) {
			this.setRuleArray(birthRuleArray, this.birthRules);
		},
		setRandomProbabilities: function(birthChance, survivalChance) {
			this.randomBirthChance = birthChance;
			this.randomSurvivalChance = survivalChance;
		},
		setRuleArray: function(seed, kernal) {
			var i;
			if (seed.length === 0) {
				return;
			};
			for (i = 0; i < seed.length; i++) {
				id = seed[i];
				if (id >= 0 && id < kernal.length) {
					kernal[id] = true;
				} else {
					throw "invalid rule index: " + id + " (needs to be less than 9 for a 3x3 kernel)";
				}
			}
		},
		setStateCount: function(number) {
			this.stateCount = number;
		},
		setSurvivalRules: function(newRules) {
			this.setRuleArray(newRules, this.survivalRules);
		},
		setTiling: function(state) {
			this.isTiling = state;
		}
	};

	return CARule2D;

});