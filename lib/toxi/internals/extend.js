define(function( require ){
    return function(childClass,superClass){
        if(typeof childClass !== 'function'){
            throw Error("childClass was not function, possible circular: ", childClass);
        } else if( typeof superClass !== 'function'){
            throw Error("superClass was not function, possible circular: ", superClass);
        }
        childClass.prototype = Object.create( superClass.prototype );//new superClass();
        childClass.constructor = childClass;
        childClass.prototype.parent = superClass.prototype;
    };
});
