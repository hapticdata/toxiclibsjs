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
function AbstractWave(phase,freq,amp,offset){

}



AbstractWave.prototype = {
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
	
};

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





function AMFMSineWave(a,b,c,d,e){
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

AMFMSineWave.prototype = new AbstractWave();
AMFMSineWave.constructor = AMFMSineWave;
AMFMSineWave.prototype.parent = AbstractWave.prototype;

AMFMSineWave.prototype.getClass = function(){
return "AMFMSineWave";
}

AMFMSineWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.amod.pop();
	this.fmod.pop();
}

AMFMSineWave.prototype.push = function() {
    this.parent.push.call(this);
    this.amod.push();
    this.fmod.push();
}

/**
 * Resets this wave and its modulating waves as well.
 * 
 * @see toxi.math.waves.AbstractWave#reset()
 */
AMFMSineWave.prototype.reset = function(){
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
AMFMSineWave.prototype.update = function() {
    this.amp = this.amod.update();
    this.value = this.amp * Math.sin(this.phase) + this.offset;
    this.cyclePhase(this.frequency + this.fmod.update());
    return this.value;
}



function ConstantWave(value) {
	  this.parent.init.call(this);
	 this.value = value;
}

ConstantWave.prototype = new AbstractWave();
ConstantWave.constructor = ConstantWave;
ConstantWave.prototype.parent = AbstractWave.prototype;

ConstantWave.prototype.getClass = function(){
	return "ConstantWave";
}

ConstantWave.prototype.update = function() {
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

function FMHarmonicSquareWave(a,b,c,d,e) {
	this.maxHarmonics = 3;
	if(typeof c == "number")
	{
		if(e === undefined)e = new ConstantWave(0);
    	this.parent.init.call(this,a,b,c,d);
    	this.fmod = e;
	}
	else
	{
		this.parent.init.call(this,a,b);
		this.fmod = c;
	}
}

FMHarmonicSquareWave.prototype = new AbstractWave();
FMHarmonicSquareWave.constructor = FMHarmonicSquareWave;
FMHarmonicSquareWave.prototype.parent = AbstractWave.prototype;

FMHarmonicSquareWave.prototype.getClass = function(){
	return "FMHarmonicSquareWave";
}

FMHarmonicSquareWave.prototype.pop = function() {
	this.parent.pop.call(this);
    this.fmod.pop();
}

FMHarmonicSquareWave.prototype.push = function() {
    this.parent.push.call(this);
    this.fmod.push();
}

FMHarmonicSquareWave.prototype.reset = function() {
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
FMHarmonicSquareWave.prototype.update = function() {
    this.value = 0;
    for (var i = 1; i <= this.maxHarmonics; i += 2) {
        this.value += 1.0 / i *  Math.sin(i * this.phase);
    }
    this.value *= this.amp;
    this.value += this.offset;
    this.cyclePhase(this.frequency + this.fmod.update());
    return this.value;
}


function FMSawtoothWave(a,b,c,d,e){
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

FMSawtoothWave.prototype = new AbstractWave();
FMSawtoothWave.constructor = FMSawtoothWave;
FMSawtoothWave.prototype.parent = AbstractWave.prototype;

FMSawtoothWave.prototype.getClass = function(){
	return "FMSawtoothWave";
}


FMSawtoothWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
}


FMSawtoothWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}


FMSawtoothWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}


FMSawtoothWave.prototype.update = function(){
	this.value = ((this.phase / AbstractWave.TWO_PI)*2 - 1) * this.amp + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



function FMSineWave(a,b,c,d,e){
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

FMSineWave.prototype = new AbstractWave();
FMSineWave.constructor = FMSineWave;
FMSineWave.prototype.parent = AbstractWave.prototype;

FMSineWave.prototype.getClass = function(){
	return "FMSineWave";
}

FMSineWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
}

FMSineWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}

FMSineWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}

FMSineWave.prototype.update = function(){
	this.value = (Math.sin(this.phase)*this.amp) + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



function FMSquareWave(a,b,c,d,e)
{
	if(typeof c == "number")
	{
		if(e === undefined)
		{
			this.parent.init.call(this,a,b,c,d, new ConstantWave(0));
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

FMSquareWave.prototype = new AbstractWave();
FMSquareWave.constructor = FMSquareWave;
FMSquareWave.prototype.parent = AbstractWave.prototype;

FMSquareWave.prototype.getClass = function(){
	return "FMSquareWave";
}

FMSquareWave.prototype.pop = function(){
		
	this.parent.pop.call(this);
	this.fmod.pop();
}

FMSquareWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}

FMSquareWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}

FMSquareWave.prototype.update = function(){
	this.value = (this.phase / AbstractWave.TWO_PI < 0.5 ? 1 : -1)*this.amp + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



function FMTriangleWave(a,b,c,d,e){
	if(typeof c == "number"){
		if(e != undefined)
		{
			this.parent.init.call(this,a,b,c,d);
			this.fmod = e;
		}
		else
		{
			this.parent.init.call(this,a,b,c,d, new ConstantWave(0));
		}
	}
	else
	{
		this.parent.init.call(this,a,b,1,0);
	}
}


FMTriangleWave.prototype = new AbstractWave();
FMTriangleWave.constructor = FMTriangleWave;
FMTriangleWave.prototype.parent = AbstractWave.prototype;

FMTriangleWave.prototype.getClass = function(){
	return "FMTriangleWave";
}

FMTriangleWave.prototype.pop = function(){
	this.parent.pop.call(this);
	this.fmod.pop();
}

FMTriangleWave.prototype.push = function(){
	this.parent.push.call(this);
	this.fmod.push();
}

FMTriangleWave.prototype.reset = function(){
	this.parent.reset.call(this);
	this.fmod.reset();
}

FMTriangleWave.prototype.update = function(){
	this.value = 2 * this.amp * (Math.abs(AbstractWave.PI - this.phase) * MathUtils.INV_PI - 0.5) + this.offset;
	this.cyclePhase(this.frequency + this.fmod.update());
	return this.value;
}



//all parameters optional
function SineWave(phase,freq,amp,offset) {
   this.parent.init.call(this,phase,freq,amp,offset);
}

SineWave.prototype = new AbstractWave();
SineWave.constructor = SineWave;
SineWave.prototype.parent = AbstractWave.prototype;

SineWave.prototype.getClass = function(){
	return "SineWave";
}

SineWave.prototype.pop = function(){		
	this.parent.pop.call(this);
}

SineWave.prototype.push = function(){
	this.parent.push.call(this);
}

SineWave.prototype.update = function() {
   this.value = (Math.sin(this.phase) * this.amp) + this.offset;
   this.cyclePhase(this.frequency);
   return this.value;
}
	


function WaveState(phase,frequency,amp,offset){
	this.phase = phase;
	this.frequency = frequency;
	this.amp = amp;
	this.offset = offset;
}
