define(["require", "exports", "module", "../../internals"], function(require, exports, module) {

var internals = require('../../internals');

/**
 * ArraySet
 * toxi/core/utils/datatypes/ArraySet
 * implements relevant portions of the java version as well as those from java's AbstractSet
 */

/**
 * @class
 * @member toxi
 */
var ArraySet = function(collection){
 	Array.apply(this);
 	if(arguments.length >= 1){
 		for(var i=0,len = collection.length;i<len;i++){
 			var item = collection[i];
 			if(this.indexOf(item) < 0){
 				this.push(item);
 			}
 		}
 	}
 };

 internals.extend(ArraySet,Array);


 internals.mixin(ArraySet.prototype,{
 	add: function(item){
 		if(this.contains(item)){
 			return false;
 		}
 		this.push(item);
 		return true;
 	},
 	addAll: function(collection){
 		var self = this;
 		for(var i=0,len = collection.length;i<len;i++){
 			this.push(collection[i]);
 		}

 	},
 	clear: function(){
 		this.retainAll([]);	
 	},
 	clone: function(){
 		return new ArraySet(this);
 	},
 	contains: function(item){
 		return this.indexOf(item) >= 0;
 	},
 	containsAll: function(collection){
 		for(var i=0,len=collection.length;i<len;i++){
 			var val = collection[i];
 			if(!this.contains(val)){
 				return false;
 			}
 		}
 		return true;
 	},
 	containsAny: function(collection){
 		for(var i=0,len = collection.length;i<len;i++){
 			if(this.contains(collection[i])){
 				return true;
 			}
 		}
 		return false;
 	},
 	equals: function(object){
 		return this === object;	
 	},
 	get: function(index){
 		return this[index];
 	},
 	iterator: function(){
 		return new internals.Iterator(this);
 	},
 	isEmpty: function(){
 		return this.length < 1;	
 	},
 	remove: function(o){
 		var i = this.indexOf(o);
 		if(i >= 0){
	 		this.splice(i,1);
	 		return true;
		}
		return false;
 	},
 	removeAll: function(){
 		this.retainAll([]);
 	},
 	retainAll: function(collection){
 		var self = this,
 			changed = false;

 		for(var i=0;i<this.length;i++){
 			var val = this[i];
 			if(collection.indexOf(val) < 0){
 				this.splice(i,1);
 				changed = true;
 				i--;
 			}
 		}
 		return changed;
 	},
 	size: function(){
 		return this.length;
 	},
 	toArray: function(arr){
 		arr = arr || [];
 		for(var i=0;i<this.length;i++){
 			if(this.hasOwnProperty())
 			arr[i] = this[i];
 		}
 		return arr;
 	}
});

module.exports = ArraySet;
});
