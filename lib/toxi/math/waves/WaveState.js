define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @module toxi/math/waves/WaveState
 */
var	WaveState = function(phase,frequency,amp,offset){
	this.phase = phase;
	this.frequency = frequency;
	this.amp = amp;
	this.offset = offset;
};

module.exports = WaveState;
});
