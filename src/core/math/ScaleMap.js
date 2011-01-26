function Range(min,max)
{
	this.min = min;
	this.max = max;
}


/**
 * This class maps values from one interval into another. By default the mapping
 * is using linear projection, but can be changed by using alternative
 * {@link toxi.math.InterpolateStrategy} implementations to achieve a
 * non-regular mapping.
 */
 
 /**
 * Creates a new instance to map values between the 2 number ranges
 * specified. By default linear projection is used.
 * 
 * @param minIn
 * @param maxIn
 * @param minOut
 * @param maxOut
 */
funciton ScaleMap(minIn, maxIn, minOut, maxOut) {
	this.mapFunction = new LinearInterpolation();
	this.setInputRange(minIn, maxIn);
	this.setOutputRange(minOut, maxOut);
}


ScaleMap.prototype = {
	
    /**
     * Computes mapped value in the target interval and ensures the input value
     * is clipped to source interval.
     * 
     * @param val
     * @return mapped value
     */
   getClippedValueFor: function(val) {
        var t = MathUtils.clipNormalized( ((val - this.in.min) / this.interval));
        return this.mapFunction.interpolate(0, this.mapRange, t) + this.out.min;
    },

    /**
     * @return the middle value of the input range.
     */
    getInputMedian: function() {
        return (this.in.min + this.in.max) * 0.5;
    },

    /**
     * @return the in
     */
    getInputRange: function() {
        return this.in;
    },

    /**
     * @return the mapped middle value of the output range. Depending on the
     *         mapping function used, this value might be different to the one
     *         returned by {@link #getOutputMedian()}.
     */
    getMappedMedian: function() {
        return this.getMappedValueFor(0.5);
    },

    /**
     * Computes mapped value in the target interval. Does check if input value
     * is outside the input range.
     * 
     * @param val
     * @return mapped value
     */
    getMappedValueFor: function(val) {
        var t = ((val - this.in.min) / this.interval);
        return this.mapFunction.interpolate(0,  this.mapRange, t) + this.out.min;
    },

    /**
     * @return the middle value of the output range
     */
    getOutputMedian:function() {
        return (this.out.min + this.out.max) * 0.5;
    },

    /**
     * @return the output range
     */
    getOutputRange:function() {
        return this.out;
    }

    /**
     * Sets new minimum & maximum values for the input range
     * 
     * @param min
     * @param max
     */
    setInputRange:function(min,max) {
        this.in =new Range(min,max);
        this.interval = max - min;
    },

    /**
     * Overrides the mapping function used for the scale conversion.
     * 
     * @param func
     *            interpolate strategy implementation
     */
    setMapFunction: function(func) {
        this.mapFunction = func;
    },

    /**
     * Sets new minimum & maximum values for the output/target range
     * 
     * @param min
     *            new min output value
     * @param max
     *            new max output value
     */
    setOutputRange: function(min, max) {
        this.out = new Range(min, max);
        this.mapRange = max - min;
    }
};