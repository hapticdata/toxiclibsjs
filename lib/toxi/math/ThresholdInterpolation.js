define([], function() {
    /**
    * @class Defines a single step/threshold function which returns the min value for all
    * factors &lt; threshold and the max value for all others.
    * @member toxi
    */
    var	ThresholdInterpolation = function(threshold) {
        this.threshold = threshold;
    };

    var interpolate = function(a, b, f, threshold) {
        return f < threshold ? a : b;
    };

    ThresholdInterpolation.prototype = {
        interpolate: function(a, b, f) {
            return f < this.threshold ? a : b;
        }
    };

    ThresholdInterpolation.interpolate = interpolate;

    return ThresholdInterpolation;
});

