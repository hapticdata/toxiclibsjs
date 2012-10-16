define(["require", "exports"], function(require, exports) {
/**
 * @module toxi/libUtils
 * contains the helper functions for the library,
 * these are intended as 'protected', you can use them but it isnt
 * intended to be used directly outside of the library.
 */



var ifUndefinedElse = function(_if,_else){
	return (typeof _if !== 'undefined') ? _if : _else;
};

exports.extend = function(childClass,superClass){
	if(typeof childClass !== 'function'){
		throw Error("childClass was not function, possible circular: ", childClass);
	} else if( typeof superClass !== 'function'){
		throw Error("superClass was not function, possible circular: ", superClass);
	}
	childClass.prototype = Object.create( superClass.prototype );//new superClass();
	childClass.constructor = childClass;
	childClass.prototype.parent = superClass.prototype;
};


 //allow the library to assume Array.isArray has been implemented
var isArray = Array.isArray || function(a){
	return a.toString() == '[object Array]';
};
exports.isArray = isArray;

var hasProperties = function(subject,properties){
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

exports.hasProperties = hasProperties;
exports.tests = {
	hasXY: function( o ){
		return hasProperties(o, ['x','y']);
	},
	hasXYZ: function( o ){
		return hasProperties(o, ['x','y','z']);
	},
	hasXYWidthHeight: function( o ){
		return hasProperties( o, ['x','y','width','height']);
	},
	isArray: isArray,
	isAABB: function ( o ){
		return hasProperties(o, ['setExtent','getNormalForPoint']);
	},
	isCircle: function( o ){
		return hasProperties( o, ['getCircumference','getRadius','intersectsCircle']);
	},
	isLine2D: function( o ){
		return hasProperties(o, ['closestPointTo','intersectLine','getLength']);
	},
	isMatrix4x4: function( o ){
		return hasProperties( o, ['identity', 'invert', 'setFrustrum']);
	},
	isRect: function( o ){
		return hasProperties(o, ['x','y','width','height','getArea','getCentroid','getDimensions']);
	},
	isSphere: function( o ){
		return hasProperties(o, ['x','y','z','radius','toMesh']);
	},
	isTColor: function( o ){
		return hasProperties(o, ['rgb','cmyk','hsv']);
	},
	isParticleBehavior: function( o ){
		return hasProperties(o, ['applyBehavior','configure']);
	},
	isVerletParticle2D: function( o ){
		return hasProperties(o, ['x','y','weight']);
	}
};

//basic forEach, use native implementation is available
//from Underscore.js
var breaker = {};
exports.each = function(obj, iterator, context) {
    if (obj == null) return;
	if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
		obj.forEach(iterator, context);
	} else if (obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
		}
	} else {
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) {
				if (iterator.call(context, obj[key], key, obj) === breaker) return;
			}
		}
	}
};

exports.removeItemFrom = function(item,array){
	var index = array.indexOf(item);
	if(index > -1){
		return array.splice(index,1);
	}
	return undefined;
};
//basic mixin function, copy over object properties to provided object
exports.mixin = function(destination,source){
	exports.each(source,function(val,key){
		destination[key] = val;
	});
};

exports.numberCompare = function(f1,f2){
	if(f1 == f2) return 0;
	if(f1 < f2) return -1;
	if(f1 > f2) return 1;
};

//set up for use with typed-arrays
exports.Int32Array = (typeof Int32Array !== 'undefined') ? Int32Array : Array;
exports.Float32Array = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
	//imitate the basic functionality of a Java Iterator
	(function(){
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
			if(exports.isArray(collection)){
				return new ArrayIterator(collection);
			}
			return new ObjectIterator(collection);
		};

		exports.Iterator = Iterator;
	}());

	(function(){
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
				exports.each(this.__map, fn);
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
			}
		};

		exports.LinkedMap = LinkedMap;
	}());

});
