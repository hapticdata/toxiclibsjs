define(["require", "exports", "module", "../../internals","./AbstractWave"], function(require, exports, module) {
var extend = require('../../internals').extend,
	AbstractWave = require('./AbstractWave');
/**
 * @module toxi/math/waves/ConstantWave
 * @augments toxi/math/waves/AbstractWave
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
});
