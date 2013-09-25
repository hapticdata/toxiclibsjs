define(['./each'],function(each){
    // {Function} keyGeneratorFunction - key to use to return the identifier
    var LinkedMap = function( keyGeneratorFunction ){
        this.__list = [];
        this.__map = {};
        this.__inverseMap = {};
        if( typeof keyGeneratorFunction === 'function' ){
            this.generateKey = keyGeneratorFunction;
        }
    };

    LinkedMap.prototype = {
        each: function( fn ){
            each(this.__map, fn);
        },
        get: function( id_or_val ){
            var self = this;
            var checkBoth = function(){
                if( self.__inverseMap[id_or_val] !== undefined ){
                    return id_or_val;
                }
                return self.__map[id_or_val];
            };

            var result = checkBoth();

            if( result === undefined ){
                id_or_val = this.generateKey( id_or_val );
                result = checkBoth();
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
                return ( self.__map[ id ] !== undefined || self.__inverseMap[ id ] !== undefined );
            };
            if( _has( id_or_val ) ){
                return true;
            }
            return _has( this.generateKey( id_or_val ) );
        },
        put: function( id, val ){
            id = this.generateKey( id );
            this.__map[id] = val;
            this.__inverseMap[val] = id;
            this.__list.push( val );
        },
        remove: function( val ){
            val = this.get( val );
            var id = this.__inverseMap[val];
            delete this.__inverseMap[val];
            delete this.__map[id];
            return this.__list.splice( this.__list.indexOf(val), 1)[0];
        },
        size: function(){
            return this.__list.length;
        },
        values: function(){
            return this.getArray().slice(0);
        }
    };

    return LinkedMap;
});
