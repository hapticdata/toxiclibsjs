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

    exports.property = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    exports.all = all;
    exports.typedArrays = function(){
        return typeof Int32Array !== 'undefined' && typeof Float32Array !== 'undefined' && typeof Uint8Array !== 'undefined';
    };
    exports.XY = function( a ){ return a && typeof a.x === 'number' && typeof a.y === 'number'; };
	exports.XYZ = function( a ){ return a && typeof a.x === 'number' && typeof a.y === 'number' && typeof a.z === 'number'; };
	exports.XYWidthHeight = function( a ){
        return a && typeof a.x === 'number' && typeof a.y === 'number' && typeof a.width === 'number' && typeof a.height === 'number';
    };
});
