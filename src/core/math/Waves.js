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
toxi.AbstractWave = function(phase,freq,amp,offset){

}



toxi.AbstractWave.prototype = {
	init: function(phase,freq,amp,offset){
	
		if(phase !== undefined || freq !== undefined || amp !== undefined || offset !== undefined)
		{
			this.setPhase(phase);
			this.frequency = freq;
			if(amp === undefined)amp = 1;
			if(offset === undefined)offset = 1;
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
		if(freq === undefined)freq = 0;
		this.phase = (this.phase + freq) % toxi.AbstractWave.TWO_PI;
		if(this.phase < 0){
			this.phase += toxi.AbstractWave.TWO_PI;
		}
		return this.phase;
	},
	
	getClass: function(){
		return "toxi.AbstractWave";
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
        this.stateStack.push(new toxi.WaveState(this.phase, this.frequency, this.amp, this.offset));
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

toxi.AbstractWave.PI = 3.14159265358979323846;
toxi.AbstractWave.TWO_PI = 2 * toxi.AbstractWave.PI;


/**
 * Converts a frequency in Hertz into radians.
 * 
 * @param hz
 *            frequency to convert (in Hz)
 * @param sampleRate
 *            sampling rate in Hz (equals period length @ 1 Hz)
 * @return frequency in radians
 */
toxi.AbstractWave.hertzToRadians = function(hz,sampleRate) {
        return hz / sampleRate * toxi.AbstractWave.TWO_PI;
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
toxi.AbstractWave.radiansToHertz = function(f,sampleRate) {
    return f / toxi.AbstractWave.TWO_PI * sampleRate;
}





toxi.AMFMSineWave = function(a,b,c,d,e){
	if(typeof c == "number")
	{
		this.parent.init.call(this,a,b,1,c);
		this.amod = d;
		this.fmod = e;
	}
	else
	{
		this.parent.init.call(this,a,b);
		this.amod = c;
		this.fmod = d;
	}
}

toxi.AMFMSineWave.prototype = new toxi.AbstractWave();
toxi.AMFMSineWave.constructor = toxi.AMFMSineWave;
toxi.AMFMSineWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.AMFMSineWave.prototype.getClass = function(){
return "AMFMSineWave";
}

toxi.AMFMSineWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.amod.pop();
	this.fmod.pop();
}

toxi.AMFMSineWave.prototype.push = function() {
    this.parent.push.call(this);
    this.amod.push();
    this.fmod.push();
}

/**
 * Resets this wave and its modulating waves as well.
 * 
 * @see toxi.math.waves.AbstractWave#reset()
 */
toxi.AMFMSineWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
	this.amod.reset();
}

/**
 * Progresses the wave and updates the result value. You must NEVER call the
 * update() method on the 2 modulating wave since this is handled
 * automatically by this method.
 * 
 * @see toxi.math.waves.AbstractWave#update()
 */
toxi.AMFMSineWave.prototype.update = function() {
    this.amp = this.amod.update();
    this.value = this.amp * Math.sin(this.phase) + this.offset;
    this.cyclePhase(this.frequency + this.fmod.update());
    return this.value;
}



toxi.ConstantWave = function(value) {
	  this.parent.init.call(this);
	 this.value = value;
}

toxi.ConstantWave.prototype = new toxi.AbstractWave();
toxi.ConstantWave.constructor = toxi.ConstantWave;
toxi.ConstantWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.ConstantWave.prototype.getClass = function(){
	return "ConstantWave";
}

toxi.ConstantWave.prototype.update = function() {
	return this.value;
}






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

toxi.FMHarmonicSquareWave = function(a,b,c,d,e) {
	this.maxHarmonics = 3;
	if(typeof c == "number")
	{
		if(e === undefined)e = new toxi.ConstantWave(0);
    	this.parent.init.call(this,a,b,c,d);
    	this.fmod = e;
	}
	else
	{
		this.parent.init.call(this,a,b);
		this.fmod = c;
	}
}

toxi.FMHarmonicSquareWave.prototype = new toxi.AbstractWave();
toxi.FMHarmonicSquareWave.constructor = toxi.FMHarmonicSquareWave;
toxi.FMHarmonicSquareWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.FMHarmonicSquareWave.prototype.getClass = function(){
	return "FMHarmonicSquareWave";
}

toxi.FMHarmonicSquareWave.prototype.pop = function() {
	this.parent.pop.call(this);
    this.fmod.pop();
}

toxi.FMHarmonicSquareWave.prototype.push = function() {
    this.parent.push.call(this);
    this.fmod.push();
}

toxi.FMHarmonicSquareWave.prototype.reset = function() {
    this.parent.reset.call(this);
    this.fmod.reset();
}

/**
 * Progresses the wave and updates the result value. You must NEVER call the
 * update() method on the modulating wave since this is handled
 * automatically by this method.
 * 
 * @see toxi.math.waves.AbstractWave#update()
 */
toxi.FMHarmonicSquareWave.prototype.update = function() {
    this.value = 0;
    for (var i = 1; i <= this.maxHarmonics; i += 2) {
        this.value += 1.0 / i *  Math.sin(i * this.phase);
    }
    this.value *= this.amp;
    this.value += this.offset;
    this.cyclePhase(this.frequency + this.fmod.update());
    return this.value;
}


toxi.FMSawtoothWave = function(a,b,c,d,e){
	if(typeof c == "number")
	{
		this.parent.init.call(this,a,b,c,d);
		this.fmod = e;
	}
	else
	{
		this.parent.init.call(this,a,b);
		this.fmod = c;
	}
}

toxi.FMSawtoothWave.prototype = new toxi.AbstractWave();
toxi.FMSawtoothWave.constructor = toxi.FMSawtoothWave;
toxi.FMSawtoothWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.FMSawtoothWave.prototype.getClass = function(){
	return "FMSawtoothWave";
}


toxi.FMSawtoothWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
}


toxi.FMSawtoothWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}


toxi.FMSawtoothWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}


toxi.FMSawtoothWave.prototype.update = function(){
	this.value = ((this.phase / toxi.AbstractWave.TWO_PI)*2 - 1) * this.amp + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



toxi.FMSineWave = function(a,b,c,d,e){
	if(typeof(c) == "number")
	{
		this.parent.init.call(this,a,b,c,d);
		this.fmod = e;
	}
	else
	{
		this.parent.init.call(this,a,b);
		this.fmod = c;
	}
}

toxi.FMSineWave.prototype = new toxi.AbstractWave();
toxi.FMSineWave.constructor = toxi.FMSineWave;
toxi.FMSineWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.FMSineWave.prototype.getClass = function(){
	return "FMSineWave";
}

toxi.FMSineWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
}

toxi.FMSineWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}

toxi.FMSineWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}

toxi.FMSineWave.prototype.update = function(){
	this.value = (Math.sin(this.phase)*this.amp) + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



toxi.FMSquareWave = function(a,b,c,d,e)
{
	if(typeof c == "number")
	{
		if(e === undefined)
		{
			this.parent.init.call(this,a,b,c,d, new toxi.ConstantWave(0));
		}
		else
		{
			this.parent.init.call(this,a,b,c,d);
			this.fmod = e;
		}
	}
	else
	{
		this.parent.init.call(this,a,b);
		this.fmod = c;
	}
}

toxi.FMSquareWave.prototype = new toxi.AbstractWave();
toxi.FMSquareWave.constructor = toxi.FMSquareWave;
toxi.FMSquareWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.FMSquareWave.prototype.getClass = function(){
	return "FMSquareWave";
}

toxi.FMSquareWave.prototype.pop = function(){
		
	this.parent.pop.call(this);
	this.fmod.pop();
}

toxi.FMSquareWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}

toxi.FMSquareWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}

toxi.FMSquareWave.prototype.update = function(){
	this.value = (this.phase / toxi.AbstractWave.TWO_PI < 0.5 ? 1 : -1)*this.amp + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



toxi.FMTriangleWave = function(a,b,c,d,e){
	if(typeof c == "number"){
		if(e !== undefined)
		{
			this.parent.init.call(this,a,b,c,d);
			this.fmod = e;
		}
		else
		{
			this.parent.init.call(this,a,b,c,d, new toxi.ConstantWave(0));
		}
	}
	else
	{
		this.parent.init.call(this,a,b,1,0);
	}
}


toxi.FMTriangleWave.prototype = new toxi.AbstractWave();
toxi.FMTriangleWave.constructor = toxi.FMTriangleWave;
toxi.FMTriangleWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.FMTriangleWave.prototype.getClass = function(){
	return "FMTriangleWave";
}

toxi.FMTriangleWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
}

toxi.FMTriangleWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}

toxi.FMTriangleWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}

toxi.FMTriangleWave.prototype.update = function(){
	this.value = 2 * this.amp * (Math.abs(toxi.AbstractWave.PI - this.phase) * toxi.MathUtils.INV_PI - 0.5) + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



//all parameters optional
toxi.SineWave = function(phase,freq,amp,offset) {
   this.parent.init.call(this,phase,freq,amp,offset);
}

toxi.SineWave.prototype = new toxi.AbstractWave();
toxi.SineWave.constructor = toxi.SineWave;
toxi.SineWave.prototype.parent = toxi.AbstractWave.prototype;

toxi.SineWave.prototype.getClass = function(){
	return "SineWave";
}

toxi.SineWave.prototype.pop = function(){		
	this.parent.pop.call(this);
}

toxi.SineWave.prototype.push = function(){
	this.parent.push.call(this);
}

toxi.SineWave.prototype.update = function() {
   this.value = (Math.sin(this.phase) * this.amp) + this.offset;
   this.cyclePhase(this.frequency);
   return this.value;
}
	


toxi.WaveState = function(phase,frequency,amp,offset){
	this.phase = phase;
	this.frequency = frequency;
	this.amp = amp;
	this.offset = offset;
}
