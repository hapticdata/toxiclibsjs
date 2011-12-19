var extend = require('../../libUtils').extend,
	AbstractWave = require('./AbstractWave');


/**
 * @class
 * member toxi
 * @augments AbstractWave
 */
var	FMSawtoothWave = function(a,b,c,d,e){
	if(typeof c == "number") {
		AbstractWave.apply(this,[a,b,c,d]);
		this.fmod = e;
	} else {
		AbstractWave.apply(this,[a,b]);
		this.fmod = c;
	}
};

extend(FMSawtoothWave,AbstractWave);

FMSawtoothWave.prototype.getClass = function(){
	return "FMSawtoothWave";
};


FMSawtoothWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
};


FMSawtoothWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
};


FMSawtoothWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
};


FMSawtoothWave.prototype.update = function(){
	this.value = ((this.phase / AbstractWave.TWO_PI)*2 - 1) * this.amp + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
};

module.exports = FMSawtoothWave;