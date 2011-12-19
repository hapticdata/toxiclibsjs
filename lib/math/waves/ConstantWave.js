var extend = require('../../libUtils').extend,
	AbstractWave = require('./AbstractWave');
/**
 * @class
 * member toxi
 * @augments AbstractWave
 */
var	ConstantWave = function(value) {
	 AbstractWave.apply(this);
	 this.value = value;
};

extend(ConstantWave,AbstractWave);

ConstantWave.prototype.getClass = function(){
	return "ConstantWave";
};

ConstantWave.prototype.update = function() {
	return this.value;
};

module.exports = ConstantWave;