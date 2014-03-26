define([], function() {
    /**
    * @class Implementation of the cosine interpolation function:
    * i = b+(a-b)*(0.5+0.5*cos(f*PI))
    * @member toxi
    */
    var	CosineInterpolation = function(){};

    CosineInterpolation.interpolate = function(a, b, f) {
        return b + (a - b) * (0.5 + 0.5 * Math.cos(f * Math.PI));
    };

    CosineInterpolation.prototype.interpolate = CosineInterpolation.interpolate;

    return CosineInterpolation;
});

