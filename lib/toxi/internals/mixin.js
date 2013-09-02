define(['./each'],function( each ){
    //basic mixin function, copy over object properties to provided object
    return function(destination,source){
        each(source,function(val,key){
            destination[key] = val;
        });
        return destination;
    };
});
