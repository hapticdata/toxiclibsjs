define(['./is'], function( is ){
    //create a constructor function to generate a normal Array
    //when a typed array isnt available
    var polyfillConstructor = function( els ){
        if ( is.Array(els) ){
            return els;
        }
        return new Array(els);
    };

    return function( type ){
        //this is the global object
        if( typeof this[type] !== 'undefined' ){
            return this[type];
        }
        return polyfillConstructor;
    };
});
