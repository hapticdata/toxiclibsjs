define(["require", "exports", "module", "../../internals","./AbstractWave"], function(require, exports, module) {

var extend = require('../../internals').extend,
	AbstractWave = require('./AbstractWave');

/**
 * @module toxi/math/waves/FMSineWave
 * @augments toxi/math/waves/AbstractWave
 */
var	FMSineWave = function(a,b,c,d,e){
	if(typeof(c) == "number"){
		AbstractWave.apply(this,[a,b,c,d]);
		this.fmod = e;
	}else{
		AbstractWave.apply(this,[a,b]);
		this.fmod = c;
	}
};

extend(FMSineWave,AbstractWave);

FMSineWave.prototype.getClass = function(){
	return "FMSineWave";
};

FMSineWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
};

FMSineWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
};

FMSineWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
};

FMSineWave.prototype.update = function(){
	this.value = (Math.sin(this.phase)*this.amp) + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
};

module.exports = FMSineWave;
});
