define(['./is'],function( is ){
	//imitate the basic functionality of a Java Iterator
    var ArrayIterator = function(collection){
        this.__it = collection.slice(0);
    };
    ArrayIterator.prototype = {
        hasNext: function(){
            return this.__it.length > 0;
        },
        next: function(){
            return this.__it.shift();
        }
    };
    var ObjectIterator = function(object){
        this.__obj = {};
        this.__keys = [];
        for(var prop in object){
            this.__obj[prop] = object[prop];
            this.__keys.push(prop);
        }
        this.__it = new ArrayIterator(this.__keys);
    };
    ObjectIterator.prototype = {
        hasNext: function(){
            return this.__it.hasNext();
        },
        next: function(){
            var key = this.__it.next();
            return this.__obj[key];
        }
    };

    var Iterator = function(collection){
        if(is.array(collection)){
            return new ArrayIterator(collection);
        }
        return new ObjectIterator(collection);
    };

    return Iterator;
});
