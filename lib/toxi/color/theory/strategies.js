define([
    '../../internals/has',
    '../../internals/is',
    'exports'
], function( has, is, exports ){

    var has = has.all,
        isTColor = is.TColor;

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
        //wrap this function in an error-condition
        (function(createList){
            constructor.prototype.createListFromColor = function( src ){
                if( !isTColor(src) ){
                    throw new Error('src color was not a valid TColor');
                }
                return createList.call(this, src);
            };
        })(constructor.prototype.createListFromColor);

        return constructor;
    };

    exports.wrap = function( x, min, threshold, plus ){
        if( x - min < threshold ){
            return x + plus;
        }
        return x - min;
    };

});
