define(function( require ){
    //bind a function to a scope
    var ctor = {};
    return function(func, context) {
        var args, bound;
        var FP = Function.prototype;
        var slice = Array.prototype.slice;
        if (func.bind === FP.bind && FP.bind) return FP.bind.apply(func, slice.call(arguments, 1));
        args = slice.call(arguments, 2);
        return bound = function() {
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor();
            ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) return result;
            return self;
        };
    };
});
