define(function( require, exports ){

    var all = function(subject,properties){
        if(subject === undefined || typeof subject != 'object'){
            return false;
        }
        var i = 0,
            len = properties.length,
            prop;
        for(i = 0; i < len; i++){
            prop = properties[i];
            if(!(prop in subject)){
                return false;
            }
        }
        return true;
    };

    var apply = function( properties ){
        return function( o ){
            return all(o, properties);
        };
    };
    exports.property = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    exports.all = all;
    exports.typedArrays = function(){
        return typeof Int32Array !== 'undefined' && typeof Float32Array !== 'undefined' && typeof Uint8Array !== 'undefined';
    };
    exports.XY = apply(['x','y']);
	exports.XYZ = apply(['x','y','z']);
	exports.XYWidthHeight = apply(['x','y','width','height']);
});
