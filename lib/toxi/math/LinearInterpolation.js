define([], function(){
    /**
    * @class Implementation of the linear interpolation function
    *
    * i = a + ( b - a ) * f
    * @member toxi
    */
    var	LinearInterpolation = function(){};
    var interpolate = function(a, b, f) {
        return a + (b - a) * f;
    };

    LinearInterpolation.interpolate = interpolate;
    LinearInterpolation.prototype.interpolate = interpolate;
    //

    return LinearInterpolation;
});

