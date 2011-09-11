/**
	T O X I C L I B S . JS 
	http://haptic-data.com/toxiclibsjs
	a port of toxiclibs for Java / Processing written by Karsten Schmidt
		
	License			: GNU Lesser General Public version 2.1
	Developer		: Kyle Phillips: http://haptic-data.com
	Java Version		: http://toxiclibs.org
*/
var toxi = toxi || {};

toxi.extend = function(childClass,superClass){
	childClass.prototype = new superClass();
	childClass.constructor = childClass;
	childClass.prototype.parent = superClass.prototype;
};
