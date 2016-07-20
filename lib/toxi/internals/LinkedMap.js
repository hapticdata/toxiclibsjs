define(['./each'],function(each){
    // {Function} keyGeneratorFunction - key to use to return the identifier
    var LinkedMap = function( keyGeneratorFunction ){
        this.__list = [];
        this.__map = {};
        if( typeof keyGeneratorFunction === 'function' ){
            this.generateKey = keyGeneratorFunction;
        }
    };



    LinkedMap.prototype = {
        each: function( fn ){
            each(this.__map, fn);
        },
        get: function( id_or_val ){
            var result = this.__map[id_or_val];

            if( result === undefined ){
                id_or_val = this.generateKey( id_or_val );
                result = this.__map[id_or_val];
            }
            return result;
        },
        generateKey: function( key ){ return key.toString(); },
        getArray: function(){
            return this.__list;
        },
        has: function( id_or_val ){
            var self = this;
            var _has = function( id ){
                return ( self.__map[ id ] !== undefined );
            };
            if( _has( id_or_val ) ){
                return true;
            }

            if(this.__map[id]){
                return true;
            }

            return this.__map[this.generateKey( id_or_val )];
        },
        put: function( id, val ){
            id = this.generateKey( id );
            this.__map[id] = val;
            this.__list.push( val );
        },
        remove: function( val ){
            val = this.get( val );
            var id = this.generateKey(val);
            delete this.__map[id];
            return this.__list.splice( this.__list.indexOf(val), 1)[0];
        },
        size: function(){
            return this.__list.length;
        },
        values: function(){
            return this.__list.slice(0);
        }
    };

    return LinkedMap;
});
