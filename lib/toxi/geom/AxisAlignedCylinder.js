define(["require", "exports", "module", "./Cone"], function(require, exports, module) {

var Cone = require('./Cone');

/** 
 @member toxi
 @constructor
 @description An Abstract (don't use this directly) Axis-aligned Cylinder class
 */
var	AxisAlignedCylinder = function(pos,radius,length) {
	this.pos = (pos===undefined)? undefined: pos.copy();
	this.setRadius(radius);
	this.setLength(length);
};

AxisAlignedCylinder.prototype = {
	/**
	Checks if the given point is inside the cylinder. 
	@param p
	@return true, if inside
	*/
	containsPoint: function(p){
		throw Error("AxisAlignedCylinder.containsPoint(): not implmented");
	},

	/**
	@return the length
	*/
	getLength: function() {
		return this.length;
	},

	/**
	@return the cylinder's orientation axis
	*/
	getMajorAxis: function(){
		throw Error("AxisAlignedCylinder.getMajorAxis(): not implemented");
	},

	/**
	Returns the cylinder's position (centroid).
	@return the pos
	*/
	getPosition: function() {
		return this.pos.copy();
	},

	/**
	@return the cylinder radius
	*/
	getRadius: function() {
		return this.radius;
	},

	/**
	@param length the length to set
	*/
	setLength: function(length) {
		this.length = length;
	},

	/**
	@param pos the pos to set
	*/
	setPosition: function(pos) {
		this.pos.set(pos);
	},

   setRadius: function(radius) {
		this.radius = radius;
		this.radiusSquared = radius * radius;
	},

	/**
	Builds a TriangleMesh representation of the cylinder at a default
	resolution 30 degrees. 
	@return mesh instance
	*/
	toMesh: function(a,b,c) {
		var opts = {
			mesh: undefined,
			steps: 12,
			thetaOffset: 0
		};
		if(arguments.length == 1 && typeof arguments[0] == 'object'){ //options object
			for(var prop in arguments[0]){
				opts[prop] = arguments[0][prop];
			}
		} else if(arguments.length == 2){
			opts.steps = arguments[0];
			opts.thetaOffset = arguments[1];
		}
		var cone = new Cone(this.pos,this.getMajorAxis().getVector(), this.radius, this.radius, this.length);
		return cone.toMesh(opts.mesh,opts.steps,opts.thetaOffset,true,true);
	}
};

module.exports = AxisAlignedCylinder;
});
