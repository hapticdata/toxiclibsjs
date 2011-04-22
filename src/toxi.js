var toxi = toxi || {};

toxi.extend = function(childClass,superClass){
	childClass.prototype = new superClass();
	childClass.prototype.constructor = childClass;
	childClass.prototype.parent = superClass.prototype;
}