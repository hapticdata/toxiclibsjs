define(["require", "exports", "module", "../../internals","../mathUtils","./AbstractWave","./ConstantWave"], function(require, exports, module) {

var extend = require('../../internals').extend,
	mathUtils = require('../mathUtils'),
	AbstractWave = require('./AbstractWave'),
	ConstantWave = require('./ConstantWave');

/**
 * @module toxi/math/waves/FMTriangleWave
 * @augments toxi/math/waves/AbstractWave
 */
var	FMTriangleWave = function(a,b,c,d,e){
	if(typeof c == "number"){
		if(e !== undefined){
			AbstractWave.apply(this,[a,b,c,d]);
			this.fmod = e;
		} else {
			AbstractWave.apply(this,[a,b,c,d, new ConstantWave(0)]);
		}
	} else {
		AbstractWave.apply(this,[a,b,1,0]);
	}
};

extend(FMTriangleWave,AbstractWave);

FMTriangleWave.prototype.getClass = function(){
	return "FMTriangleWave";
};

FMTriangleWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
};

FMTriangleWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
};

FMTriangleWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
};

FMTriangleWave.prototype.update = function(){
	this.value = 2 * this.amp * (Math.abs(AbstractWave.PI - this.phase) * mathUtils.INV_PI - 0.5) + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
};

module.exports = FMTriangleWave;
});
