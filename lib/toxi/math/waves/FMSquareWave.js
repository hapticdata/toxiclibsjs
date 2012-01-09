define(["require", "exports", "module", "../../internals","./AbstractWave","./ConstantWave"], function(require, exports, module) {

var extend = require('../../internals').extend,
	AbstractWave = require('./AbstractWave'),
	ConstantWave = require('./ConstantWave');

/**
 * @module toxi/math/waves/FMSquareWave
 * @augments toxi/math/waves/AbstractWave
 */
var	FMSquareWave = function(a,b,c,d,e)
{
	if(typeof c == "number"){
		if(e === undefined){
			AbstractWave.apply(this,[a,b,c,d, new ConstantWave(0)]);
		} else {
			AbstractWave.apply(this,[a,b,c,d]);
			this.fmod = e;
		}
	} else {
		AbstractWave.apply(this,[a,b]);
		this.fmod = c;
	}
};

extend(FMSquareWave,AbstractWave);

FMSquareWave.prototype.getClass = function(){
	return "FMSquareWave";
};

FMSquareWave.prototype.pop = function(){		
	this.parent.pop.call(this);
	this.fmod.pop();
};

FMSquareWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
};

FMSquareWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
};

FMSquareWave.prototype.update = function(){
	this.value = (this.phase / AbstractWave.TWO_PI < 0.5 ? 1 : -1)*this.amp + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
};

module.exports = FMSquareWave;
});
