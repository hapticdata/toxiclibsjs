define([
	'toxi/math/mathUtils'
], function( MathUtils ){
	
	function CAWolfram1D( MathUtils ) {
		this.kernelWidth = arguments[0];
		this.tiling = (arguments.length < 3) ? arguments[1] : arguments[2];
		this.stateCount = (arguments.length < 3) ? 2 : arguments[1];
		this.isAutoExpire = false;
		this.maxBitValue = Math.pow(4, this.kernelWidth);
		this.numBits = this.maxBitValue * 2;
		this.rules = null;
	}
	 
	CAWolfram1D.prototype = {
		evolve: function (evolvableMatrix) {
			var cells, nextgen,     // evolvableMatrix components
					maxstate, sum,     
					i, idx, j, k;       // iterators
			
			cells = evolvableMatrix.getMatrix();
			nextgen = evolvableMatrix.getSwapBuffer();
			
			maxState = this.stateCount - 1;
			for(i = 0; i < cells.length; i++) {
				sum = 0;
				for(j = -this.kernelWidth, k = this.maxBitValue; j <= this.kernelWidth; j++) {
					idx = i + j;
					if (this.tiling) {
						idx %= cells.length;
						if (idx < 0) {
							idx += cells.length;
						}
						sum += cells[idx] > 0 ? k : 0;
					} else {
						if (idx >= 0 && idx < cells.length) {
					
						}
					}
					k >>>= 1;
				}
				if (this.isAutoExpire) {
					nextgen[i] = this.rules[sum] ? (cells[i] + 1) % this.stateCount : 0;
				} else {
					nextgen[i] = this.rules[sum] ? MathUtils.min(cells[i] + 1, maxState) : 0;
				}
			}
		},
		getNumRuleBits: function() {
			return this.numBits;
		},
		getRuleArray: function() {
			return this.rules;
		},
		getRuleAsBigInt: function() {
			var r=0,
					i;
			for (i = this.numBits - 1; i >= 0; i--) {
				r <<= 1;
				if (this.rules[i]) {
					r = r | (1 << 0);
				}
			}
			return r;
		},
		getStateCount: function() {
			return this.stateCount;
		},
		isAutoExpire: function() {
			return this.isAutoExpire;
		},
		isTiling: function() {
			return this.tiling;
		},
		randomize: function() {
			var newRule = Math.round(Math.random() * 4294967295);
			this.setRuleID(newRule);
		},
		setAutoExpire: function(autoExpire) {
			this.isAutoExpire = autoExpire;
		},
		setRuleArray: function(ruleArray) {
			if (ruleArray.length !== this.numBits) {
				throw "rule array length needs to be equal to " + this.numBits + " for the given kernel size";
			}
			this.rules = ruleArray;
		return this;
		},
		setRuleID: function(id) {
			var i;
			this.rules = [];
			for (i = 0; i < this.numBits; i++) {
				this.rules.push((id & 1) === 1);
				id >>>= 1;
			}
			return this;
		},
		setStateCount: function(num) {
			this.stateCount = num;
		},
		setTiling: function(state) {
			this.tiling = state;
		}
	};
	return CAWolfram1D;
});
 