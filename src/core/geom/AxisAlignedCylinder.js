function AxisAlignedCylinder(pos,radius,length) {
	this.init(pos,radius,length);
}

AxisAlignedCylinder.prototype = {
	
	init: function(pos,radius,length){
		this.pos = pos.copy();
		this.setRadius(radius);
		this.setLength(length);
	},
    /**
     * Checks if the given point is inside the cylinder.
     * 
     * @param p
     * @return true, if inside
     */
    containsPoint: function(p){
    	throw Error("AxisAlignedCylinder.containsPoint(): not implmented");
    },

    /**
     * @return the length
     */
    getLength: function() {
        return this.length;
    },

    /**
     * @return the cylinder's orientation axis
     */
    getMajorAxis: function(){
    	throw Error("AxisAlignedCylinder.getMajorAxis(): not implemented");
    },

    /**
     * Returns the cylinder's position (centroid).
     * 
     * @return the pos
     */
    getPosition: function() {
        return this.pos.copy();
    },

    /**
     * @return the cylinder radius
     */
    getRadius: function() {
        return this.radius;
    },

    /**
     * @param length
     *            the length to set
     */
    setLength: function(length) {
        this.length = length;
    },

    /**
     * @param pos
     *            the pos to set
     */
    setPosition: function(pos) {
        this.pos.set(pos);
    },

   setRadius: function(radius) {
        this.radius = radius;
        this.radiusSquared = radius * radius;
    },

    /**
     * Builds a TriangleMesh representation of the cylinder at a default
     * resolution 30 degrees.
     * 
     * @return mesh instance
     */
    toMesh: function(a,b,c) {
    	if(a === undefined)
    	{
    		return new Cone(this.pos,this.getMajorAxis().getVector(),this.radius,this.radius,this.length).toMesh(null,12,0,true,true);
    	}
    	else if(a instanceof Mesh3D)
    	{
    		return new Cone(this.pos,this.getMajorAxis().getVector(),this.radius,this.radius,this.length).toMesh(a,b,c,true,true);
    	}
		return new Cone(this.pos,this.getMajorAxis().getVector(),this.radius,this.radius,this.length).toMesh(null,a,b,true,true);    	
    }

};