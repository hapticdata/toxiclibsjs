/**
 		T O X I C L I B S . JS  - 0.01
		a port of toxiclibs for Java / Processing written by Karsten Schmidt
		
		License				: GNU Lesser General Public version 2.1
		Developer			: Kyle Phillips: http://haptic-data.com
		Java Version		: http://toxiclibs.org
*/


/**
 * Abstract wave oscillator type which needs to be subclassed to implement
 * different waveforms. Please note that the frequency unit is radians, but
 * conversion methods to & from Hertz ({@link #hertzToRadians(float, float)})
 * are included in this base class.
 */
var AbstractWave = Class.extend({
	init: function(phase,freq,amp,offset){
		if(phase != undefined || freq != undefined || amp != undefined || offset != undefined)
		{
			this.setPhase(phase);
			this.frequency = freq;
			if(amp == undefined)amp = 1;
			if(offset == undefined)offset = 1;
			this.amp = amp;
			this.offset = offset;
		}
	},

	/**
     * Ensures phase remains in the 0...TWO_PI interval.
     * @param freq
     *            normalized progress frequency
     * @return current phase
     */
	cyclePhase: function(freq){
		if(freq == undefined)freq = 0;
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
        if (this.stateStack == null || (this.stateStack != null && this.stateStack.length <= 0)) {
            //throw new Error("no wave states on stack");
			console.log(this.toString());
			console.log("no wave states on stack");
        }
		else{
        	var s = this.stateStack.pop();
        	this.phase = s.phase;
        	this.frequency = s.frequency;
        	this.amp = s.amp;
        	this.offset = s.offset;
		}
    },

	push: function() {
        if (this.stateStack == null) {
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
	
});

AbstractWave.PI = 3.14159265358979323846;
AbstractWave.TWO_PI = 2 * AbstractWave.PI;


/**
 * Converts a frequency in Hertz into radians.
 * 
 * @param hz
 *            frequency to convert (in Hz)
 * @param sampleRate
 *            sampling rate in Hz (equals period length @ 1 Hz)
 * @return frequency in radians
 */
AbstractWave.hertzToRadians = function(hz,sampleRate) {
        return hz / sampleRate * AbstractWave.TWO_PI;
}

/**
 * Converts a frequency from radians to Hertz.
 * 
 * @param f
 *            frequency in radians
 * @param sampleRate
 *            sampling rate in Hz (equals period length @ 1 Hz)
 * @return freq in Hz
 */
AbstractWave.radiansToHertz = function(f,sampleRate) {
    return f / AbstractWave.TWO_PI * sampleRate;
}





var AMFMSineWave = AbstractWave.extend({
	init: function(a,b,c,d,e){
		if(typeof(c) == "number")
		{
			this._super(a,b,1,c);
			this.amod = d;
			this.fmod = e;
		}
		else
		{
			this._super(a,b);
			this.amod = c;
			this.fmod = d;
		}
	},

	getClass: function(){
	return "AMFMSineWave";
	},

	pop: function(){
		this._super();
		this.amod.pop();
		this.fmod.pop();
	},

	push: function() {
	    this._super();
	    this.amod.push();
	    this.fmod.push();
	},

	/**
	 * Resets this wave and its modulating waves as well.
	 * 
	 * @see toxi.math.waves.AbstractWave#reset()
	 */
	reset: function(){
    	this._super();
    	this.fmod.reset();
    	this.amod.reset();
	},

	/**
	 * Progresses the wave and updates the result value. You must NEVER call the
	 * update() method on the 2 modulating wave since this is handled
	 * automatically by this method.
	 * 
	 * @see toxi.math.waves.AbstractWave#update()
	 */
	update: function() {
	    this.amp = this.amod.update();
	    this.value = this.amp * Math.sin(this.phase) + this.offset;
	    this.cyclePhase(this.frequency + this.fmod.update());
	    return this.value;
	}
});




var ConstantWave = AbstractWave.extend({
	init: function(value) {
  	  this._super();
   	 this.value = value;
	},
	getClass: function(){
		return "ConstantWave";
	},

	update: function() {
    	return this.value;
	}
});




/**
 * <p>
 * Frequency modulated <strong>bandwidth-limited</strong> square wave using a
 * fourier series of harmonics. Also uses a secondary wave to modulate the
 * frequency of the main wave.
 * </p>
 * 
 * <p>
 * <strong>Note:</strong> You must NEVER call the update() method on the
 * modulating wave.
 * </p>
 */

var FMHarmonicSquareWave = AbstractWave.extend({
	init: function(a,b,c,d,e) {
		this.maxHarmonics = 3;
		if(typeof(c) == "number")
		{
			if(e == undefined)e = new ConstantWave(0);
	    	this._super(a,b,c,d);
	    	this.fmod = e;
		}
		else
		{
			this._super(a,b);
			this.fmod = c;
		}
	},

	getClass: function(){
		return "FMHarmonicSquareWave";
	},

	pop: function() {
		this._super();
        this.fmod.pop();
	},

	push: function() {
        this._super();
        this.fmod.push();
	},

	reset: function() {
        this._super();
        this.fmod.reset();
	},

    /**
     * Progresses the wave and updates the result value. You must NEVER call the
     * update() method on the modulating wave since this is handled
     * automatically by this method.
     * 
     * @see toxi.math.waves.AbstractWave#update()
     */
	update: function() {
	    this.value = 0;
	    for (var i = 1; i <= this.maxHarmonics; i += 2) {
	        this.value += 1.0 / i *  Math.sin(i * this.phase);
	    }
	    this.value *= this.amp;
	    this.value += this.offset;
	    this.cyclePhase(this.frequency + this.fmod.update());
	    return this.value;
	}
});


var FMSawtoothWave = AbstractWave.extend({
	init: function(a,b,c,d,e){
		if(typeof(c) == "number")
		{
			this._super(a,b,c,d);
			this.fmod = e;
		}
		else
		{
			this._super(a,b);
			this.fmod = c;
		}
	},

	getClass: function(){
		return "FMSawtoothWave";
	},
	
	pop: function(){
		this._super();
		this.fmod.pop();
	},
	
	push: function(){
		this._super();
		this.fmod.push();
	},
	
	reset: function(){
		this._super();
		this.fmod.reset();
	},

	update: function(){
		this.value = ((this.phase / AbstractWave.TWO_PI)*2 - 1) * this.amp + this.offset;
		this.cyclePhase(this.frequency + this.fmod.update());
		return this.value;
	}
});


var FMSineWave = AbstractWave.extend({
	init: function(a,b,c,d,e){
		if(typeof(c) == "number")
		{
			this._super(a,b,c,d);
			this.fmod = e;
		}
		else
		{
			this._super(a,b);
			this.fmod = c;
		}
	},

	getClass: function(){
		return "FMSineWave";
	},

	pop: function(){
		this._super();
		this.fmod.pop();
	},

	push: function(){
		this._super();
		this.fmod.push();
	},

	reset: function(){
		this._super();
		this.fmod.reset();
	},

	update: function(){
		this.value = (Math.sin(this.phase)*this.amp) + this.offset;
		this.cyclePhase(this.frequency + this.fmod.update());
		return this.value;
	}
});


var FMSquareWave = AbstractWave.extend({
	init: function(a,b,c,d,e)
	{
		if(typeof(c) == "number")
		{
			if(e == undefined)
			{
				this._super(a,b,c,d, new ConstantWave(0));
			}
			else
			{
				this._super(a,b,c,d);
				this.fmod = e;
			}
		}
		else
		{
			this._super(a,b);
			this.fmod = c;
		}
	},

	getClass: function(){
		return "FMSquareWave";
	},
	
	pop: function(){
			
		this._super();
		this.fmod.pop();
	},
	
	push: function(){
		this._super();
		this.fmod.push();
	},
	
	reset: function(){
		this._super();
		this.fmod.reset();
	},
	
	update: function(){
		this.value = (this.phase / AbstractWave.TWO_PI < 0.5 ? 1 : -1)*this.amp + this.offset;
		this.cyclePhase(this.frequency + this.fmod.update());
		return this.value;
	}
});


var FMTriangleWave = AbstractWave.extend({
	init: function(a,b,c,d,e){
		if(typeof(c) == "number"){
			if(e != undefined)
			{
				this._super(a,b,c,d);
				this.fmod = e;
			}
			else
			{
				this._super(a,b,c,d, new ConstantWave(0));
			}
		}
		else
		{
			this._super(a,b,1,0);
		}
	},

	getClass: function(){
		return "FMTriangleWave";
	},
	
	pop: function(){
			
		this._super();
		this.fmod.pop();
	},
	
	push: function(){
		this._super();
		this.fmod.push();
	},
	
	reset: function(){
		this._super();
		this.fmod.reset();
	},
	
	update: function(){
		this.value = 2 * this.amp * (Math.abs(AbstractWave.PI - this.phase) * MathUtils.INV_PI - 0.5) + this.offset;
		this.cyclePhase(this.frequency + this.fmod.update());
		return this.value;
	}
});



//all parameters optional
var SineWave = AbstractWave.extend({
	init: function(phase,freq,amp,offset) {
	   this._super(phase,freq,amp,offset);
	},

	getClass: function(){
		return "SineWave";
	},

	pop: function(){
			
		this._super();
	},
	push: function(){
		this._super();
	},
	
	update: function() {
	   this.value = (Math.sin(this.phase) * this.amp) + this.offset;
	   this.cyclePhase(this.frequency);
	   return this.value;
	}
});

function WaveState(phase,frequency,amp,offset){
	this.phase = phase;
	this.frequency = frequency;
	this.amp = amp;
	this.offset = offset;
}
