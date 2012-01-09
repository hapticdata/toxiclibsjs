define(["require", "exports", "module", "./mathUtils","./LinearInterpolation"], function(require, exports, module) {

var mathUtils = require('./mathUtils'),
    LinearInterpolation = require('./LinearInterpolation');


var _Range = function(min,max){
	this.min = min;
	this.max = max;
};
_Range.prototype.toString = function(){
	return "{ min: "+this.min+ ", max: "+this.max+"}";
};


/**
 * @class This class maps values from one interval into another. By default the mapping
 * is using linear projection, but can be changed by using alternative
 * {@link math.InterpolateStrategy} implementations to achieve a
 * non-regular mapping.
 *
 * @member toxi
 *
 * @description Creates a new instance to map values between the 2 number ranges
 * specified. By default linear projection is used.
 * @param {Number} minIn
 * @param {Number} maxIn
 * @param {Number} minOut
 * @param {Number} maxOut
 */ 
var ScaleMap = function(minIn, maxIn, minOut, maxOut) {
	if(arguments.length == 1 && arguments[0].input !== undefined && arguments[0].output !== undefined){ //opts object
		var arg = arguments[0];
		minOut = arg.output.min;
		maxOut = arg.output.max;
        maxIn = arg.input.max;
        minIn = arg.input.min;
	}
	this.mapFunction = new LinearInterpolation();
	this.setInputRange(minIn, maxIn);
	this.setOutputRange(minOut, maxOut);
};


ScaleMap.prototype = {
	
    /**
     * Computes mapped value in the target interval and ensures the input value
     * is clipped to source interval.
     * 
     * @param val
     * @return mapped value
     */
   getClippedValueFor: function(val) {
        var t = mathUtils.clipNormalized( ((val - this._in.min) / this._interval));
        return this.mapFunction.interpolate(0, this.mapRange, t) + this._out.min;
    },

    /**
     * @return the middle value of the input range.
     */
    getInputMedian: function() {
        return (this._in.min + this._in.max) * 0.5;
    },

    /**
     * @return the in
     */
    getInputRange: function() {
        return this._in;
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
        var t = ((val - this._in.min) / this._interval);
        return this.mapFunction.interpolate(0,  this.mapRange, t) + this._out.min;
    },

    /**
     * @return the middle value of the output range
     */
    getOutputMedian:function() {
        return (this._out.min + this._out.max) * 0.5;
    },

    /**
     * @return the output range
     */
    getOutputRange: function() {
        return this._out;
    },

    /**
     * Sets new minimum & maximum values for the input range
     * 
     * @param min
     * @param max
     */
    setInputRange: function(min,max) {
        this._in = new _Range(min,max);
        this._interval = max - min;
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
        this._out = new _Range(min, max);
        this.mapRange = max - min;
    },
    
    toString: function(){
		return "ScaleMap, inputRange: "+this._in.toString() + " outputRange: "+this._out.toString();
    }
};

module.exports = ScaleMap;
});
