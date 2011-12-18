/**
	T O X I C L I B S . JS 
	http://haptic-data.com/toxiclibsjs
	a port of toxiclibs for Java / Processing written by Karsten Schmidt
		
	License			: GNU Lesser General Public version 2.1
	Developer		: Kyle Phillips: http://haptic-data.com
	Java Version		: http://toxiclibs.org
*/
/** 
 * @namespace
 * @module toxi
 */
var toxi = toxi || {};


//anything that is manipulating global is inside this function
(function(){
	//allow the library to assume Array.isArray has been implemented
	Array.isArray = Array.isArray || function(a){
		return a.toString() == '[object Array]';	
	};
	//anything messing with global at top:
	if(typeof window !== "undefined"){ //otherwise its not being used in a browser-context

		if( !window.Int32Array){
			window.Int32Array = Array;
			window.Float32Array = Array;
		}		
	}

	//if this is being used with node/CommonJS
	if(typeof module !== "undefined" && typeof module.exports !== "undefined"){
		module.exports = toxi;
	}

})();

toxi.extend = function(childClass,superClass){
	childClass.prototype = new superClass();
	childClass.constructor = childClass;
	childClass.prototype.parent = superClass.prototype;
};

