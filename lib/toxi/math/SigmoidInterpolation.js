define([], function() {
    /**
    * @class Initializes the s-curve with default sharpness = 2
    * @member toxi
    */
    var	SigmoidInterpolation = function(s) {
        if(s === undefined){
            s = 2.0;
        }
        this.setSharpness(s);
    };

    var interpolate = function( a, b, f, sharpness ){
        f = (f * 2 - 1) * sharpness;
        f = (1.0 / (1.0 + Math.exp(-f)));
        return a + (b - a) * f;
    };

    SigmoidInterpolation.prototype = {
        getSharpness: function() {
            return this.sharpness;
        },

        interpolate: function(a, b, f) {
            return interpolate( a, b, f, this.sharpPremult );
        },

        setSharpness: function(s) {
            this.sharpness = s;
            this.sharpPremult = 5 * s;
        }
    };

    SigmoidInterpolation.interpolate = interpolate;

    return SigmoidInterpolation;
});

