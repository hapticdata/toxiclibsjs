define(['./has','exports'],function( has, exports ){

    var apply = function(properties){
        return function( o ){
            return has.all(o, properties);
        };
    };

    exports.Array = Array.isArray || function(a){
        return a.toString() == '[object Array]';
    };
    exports.Object = function(a){
        return typeof a === 'object';
    };
    exports.undef = function(a){
        return a === void 0;
    };
    //determines if a value is undefined or null
    exports.existy = function(a){
        return a != null;
    };
    exports.String = function(a){
        return typeof a === 'string';
    };
    exports.Number = function(a){
        return typeof a === 'number';
    };
    exports.Function = function(a){
        return typeof a === 'function';
    };
	exports.AABB = apply(['setExtent','getNormalForPoint']);
    exports.ColorGradient = apply(['gradient','interpolator','maxDither','addColorAt','calcGradient']);
    exports.ColorList = apply(['add','addAll','adjustBrightness','adjustSaturation']);
    exports.ColorRange = apply(['add', 'addAlphaRange','addBrightnessRange','addHueRange']);
    exports.Circle = apply(['getCircumference','getRadius','intersectsCircle']);
    exports.FloatRange = apply(['min','max','adjustCurrentBy','getMedian']);
    exports.Hue = apply(['getHue','isPrimary']);
	exports.Line2D = apply(['closestPointTo','intersectLine','getLength']);
	exports.Matrix4x4 = apply(['identity', 'invert', 'setFrustrum']);
	exports.Rect = apply(['x','y','width','height','getArea','getCentroid','getDimensions']);
	exports.Sphere = apply(['x','y','z','radius','toMesh']);
    exports.ScaleMap = apply(['mapFunction','setInputRange','setOutputRange','getMappedValueFor']);
	exports.TColor = apply(['rgb','cmyk','hsv']);
	exports.ParticleBehavior = apply(['applyBehavior','configure']);
	exports.VerletParticle2D = apply(['x','y','weight']);
});
