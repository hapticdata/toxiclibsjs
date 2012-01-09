define(["require", "exports", "module", "../../internals","./AbstractWave"], function(require, exports, module) {

var extend = require('../../internals').extend,
	AbstractWave = require('./AbstractWave');

/**
 * @module toxi/math/waves/AMFMSineWave
 * @augments toxi/math/waves/AbstractWave
 */
var	AMFMSineWave = function(a,b,c,d,e){
	if(typeof c == "number"){
		AbstractWave.apply(this,[a,b,1,c]);
		this.amod = d;
		this.fmod = e;
	} else{
		AbstractWave.apply(this,[a,b]);
		this.amod = c;
		this.fmod = d;
	}
};

extend(AMFMSineWave,AbstractWave);

AMFMSineWave.prototype.getClass = function(){
	return "AMFMSineWave";
};

AMFMSineWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.amod.pop();
	this.fmod.pop();
};

AMFMSineWave.prototype.push = function() {
    this.parent.push.call(this);
    this.amod.push();
    this.fmod.push();
};

/**
 * Resets this wave and its modulating waves as well.
 * 
 * @see toxi.math.waves.AbstractWave#reset()
 */
AMFMSineWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
	this.amod.reset();
};

/**
 * @class Progresses the wave and updates the result value. You must NEVER call the
 * update() method on the 2 modulating wave since this is handled
 * automatically by this method.
  * @augments AbstractWave
 * @member toxi
 * @see toxi.math.waves.AbstractWave#update()
 */
AMFMSineWave.prototype.update = function() {
    this.amp = this.amod.update();
    this.value = this.amp * Math.sin(this.phase) + this.offset;
    this.cyclePhase(this.frequency + this.fmod.update());
    return this.value;
};

module.exports = AMFMSineWave;

});
