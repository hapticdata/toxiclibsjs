define(["require", "exports", "module", "../Triangle3D"], function(require, exports, module) {

var Triangle3D = require('../Triangle3D');

/** 
 * @class
 * @member toxi
 */
var Face = function(a,b,c,uvA,uvB,uvC) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normal = this.a.sub(this.c).crossSelf(this.a.sub(this.b)).normalize();
    this.a.addFaceNormal(this.normal);
    this.b.addFaceNormal(this.normal);
    this.c.addFaceNormal(this.normal);
    
    if(uvA !== undefined){
		this.uvA = uvA;
		this.uvB = uvB;
		this.uvC = uvC;
    }
};

Face.prototype = {
	computeNormal: function() {
        this.normal = this.a.sub(this.c).crossSelf(this.a.sub(this.b)).normalize();
    },

	flipVertexOrder: function() {
        var t = this.a;
        this.a = this.b;
        this.b = t;
        this.normal.invert();
    },
	
	getCentroid: function() {
        return this.a.add(this.b).addSelf(this.c).scale(1.0 / 3);
    },
    
    getClass: function(){
		return "Face";
	},

    getVertices: function(verts) {
        if (verts !== undefined) {
            verts[0] = this.a;
            verts[1] = this.b;
            verts[2] = this.c;
        } else {
            verts = [ this.a, this.b, this.c ];
        }
        return verts;
    },

    toString: function() {
        return this.getClass() + " " + this.a + ", " + this.b + ", " + this.c;
    },

    /**
     * Creates a generic {@link Triangle3D} instance using this face's vertices.
     * The new instance is made up of copies of the original vertices and
     * manipulating them will not impact the originals.
     * 
     * @return triangle copy of this mesh face
     */
    toTriangle: function() {
        return new Triangle3D(this.a.copy(), this.b.copy(), this.c.copy());
    }
};

module.exports = Face;
});
