define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @module toxi/libUtils
 * contains the helper functions for the library,
 * these are intended as 'protected', you can use them but it isnt
 * intended to be used directly outside of the library.
 */



var ifUndefinedElse = function(_if,_else){
	return (typeof _if !== 'undefined') ? _if : _else;
};

module.exports.extend = function(childClass,superClass){
	childClass.prototype = new superClass();
	childClass.constructor = childClass;
	childClass.prototype.parent = superClass.prototype;
};


 //allow the library to assume Array.isArray has been implemented
var isArray = Array.isArray || function(a){
	return a.toString() == '[object Array]';	
};
module.exports.isArray = isArray;

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

module.exports.tests = {
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
module.exports.each = function(obj, iterator, context) {
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

module.exports.removeItemFrom = function(item,array){
	var index = array.indexOf(item);
	if(index > -1){
		return array.splice(index,1);
	}
	return undefined;
};
//basic mixin function, copy over object properties to provided object
module.exports.mixin = function(destination,source){
	module.exports.each(source,function(val,key){
		destination[key] = val;
	});
};

module.exports.numberCompare = function(f1,f2){
	if(f1 == f2) return 0;
	if(f1 < f2) return -1;
	if(f1 > f2) return 1;	
};

//set up for use with typed-arrays
module.exports.Int32Array = (typeof Int32Array !== 'undefined') ? Int32Array : Array;
module.exports.Float32Array = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

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
	if(module.exports.isArray(collection)){
		return new ArrayIterator(collection);
	}
	return new ObjectIterator(collection);
};

module.exports.Iterator = Iterator;

});
