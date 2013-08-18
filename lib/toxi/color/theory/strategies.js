define([
    '../../internals',
    'exports'
], function( internals, exports ){

    var has = internals.has;

    exports.create = function( name, constructor, extend ){
        if( arguments.length === 2 ){
            extend = constructor;
            constructor = function(){};
        }
        var _NAME = name.charAt(0).toLowerCase() + name.slice(1,name.length);
        constructor.prototype.constructor = constructor;
        constructor.prototype.getName = function(){ return _NAME; };
        constructor.prototype.toString = constructor.prototype.getName;
        for( var prop in extend ){
            constructor.prototype[prop] = extend[prop];
        }
        return constructor;
    };

    exports.wrap = function( x, min, threshold, plus ){
        if( x - min < threshold ){
            return x + plus;
        }
        return x - min;
    };

});
