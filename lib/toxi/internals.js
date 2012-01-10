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

module.exports.hasProperties = function(subject,properties){
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
 //allow the library to assume Array.isArray has been implemented
module.exports.isArray = Array.isArray || function(a){
	return a.toString() == '[object Array]';	
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
