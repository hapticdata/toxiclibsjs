define(["require", "exports", "module", "./WaveState"], function(require, exports, module) {

var WaveState = require('./WaveState');
var defaultNumberTo = function( i, num ){
    return typeof i === 'number' ? i : num;
};


/**
 * @module toxi/math/waves/AbstractWave
 * @description Abstract wave oscillator type which needs to be subclassed to implement
 * different waveforms. Please note that the frequency unit is radians, but
 * conversion methods to & from Hertz ({@link #hertzToRadians(float, float)})
 * are included in this base class.
 */
var AbstractWave = function( phase, freq, amp, offset ){
    if( arguments.length === 1 && typeof arguments[0] === 'object' ){
        //options object
        offset = phase.offset;
        amp = phase.amp;
        freq = phase.freq;
        phase = phase.phase;
    }
    this.setPhase( defaultNumberTo(phase, 0) );
    this.frequency = defaultNumberTo( freq, 0 );
    this.amp = defaultNumberTo( amp, 1.0 );
    this.offset = defaultNumberTo( offset, 0 );
};



AbstractWave.prototype = {
	/**
     * Ensures phase remains in the 0...TWO_PI interval.
     * @param {Number} freq
     *            normalized progress frequency
     * @return {Number} current phase
     */
	cyclePhase: function(freq){
		if(freq === undefined)freq = 0;
		this.phase = (this.phase + freq) % AbstractWave.TWO_PI;
		if(this.phase < 0){
			this.phase += AbstractWave.TWO_PI;
		}
		return this.phase;
	},

	getClass: function(){
		return "AbstractWave";
	},

	pop: function() {
        if (this.stateStack === undefined || (this.stateStack !== undefined && this.stateStack.length <= 0)) {
            //throw new Error("no wave states on stack");
			console.log(this.toString());
			console.log("no wave states on stack");
            return;
        }
        var s = this.stateStack.pop();
        this.phase = s.phase;
        this.frequency = s.frequency;
        this.amp = s.amp;
        this.offset = s.offset;
    },

	push: function() {
        if (this.stateStack === undefined) {
            this.stateStack = [];
        }
        this.stateStack.push(new WaveState(this.phase, this.frequency, this.amp, this.offset));
    },

	reset: function() {
        this.phase = this.origPhase;
    },

	setPhase: function(phase) {
        this.phase = phase;
        this.cyclePhase();
        this.origPhase = phase;
    },

	toString: function(){
		return this.getClass()+" phase:" + this.phase+ " frequency: "+this.frequency+" amp: "+this.amp+ " offset: "+this.offset;
	},

	update:function(){
		console.log(this.getClass()+ " this should be overridden");
	}

};

AbstractWave.PI = 3.14159265358979323846;
AbstractWave.TWO_PI = 2 * AbstractWave.PI;


/**
 * Converts a frequency in Hertz into radians.
 *
 * @param hz frequency to convert (in Hz)
 * @param sampleRate sampling rate in Hz (equals period length @ 1 Hz)
 * @return frequency in radians
 */
AbstractWave.hertzToRadians = function(hz,sampleRate) {
        return hz / sampleRate * AbstractWave.TWO_PI;
};

/**
 * Converts a frequency from radians to Hertz.
 *
 * @param f frequency in radians
 * @param sampleRate  sampling rate in Hz (equals period length @ 1 Hz)
 * @return freq in Hz
 */
AbstractWave.radiansToHertz = function(f,sampleRate) {
    return f / AbstractWave.TWO_PI * sampleRate;
};

module.exports = AbstractWave;

});
