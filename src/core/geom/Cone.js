/* A geometric definition of a cone (and cylinder as a special case) with
 * support for mesh creation/representation. The class is currently still
 * incomplete in that it doesn't provide any other features than the
 * construction of a cone shaped mesh.
 */

    /**
     * Constructs a new cone instance.
     * 
     * @param pos
     *            centre position
     * @param dir
     *            direction
     * @param rNorth
     *            radius on the side in the forward direction
     * @param rSouth
     *            radius on the side in the opposite direction
     * @param len
     *            length of the cone
     */
toxi.Cone = function(pos,dir,rNorth, rSouth,len) {
    this.parent.init.call(this,pos);
    this.dir = dir.getNormalized();
    this.radiusNorth = rNxiorth;
    this.radiusSouth = rSouth;
    this.length = len;
}

toxi.Cone.prototype = new toxi.Vec3D();
toxi.Cone.constructor = toxi.Cone;
toxi.Cone.prototype.parent = toxi.Vec3D.prototype;

toxi.Cone.prototype.toMesh = function(a,b,c,topClosed,bottomClosed) {
	if(topClosed === undefined)topClosed = true;
	if(bottomClosed === undefined)bottomClosed = true;
	if(b === undefined)
	{
		var mesh = null;
		var steps = a;
		var thetaOffset = 0;
	}
	else if( c === undefined)
	{
		var mesh = null;
		var steps = a;
		var thetaOffset = b;
	}
	else
	{
		var mesh = a;
		var steps = b;
		var thetaOffset = c;
	}
	
	var c = this.add(0.01, 0.01, 0.01),
    	n = c.cross(this.dir.getNormalized()).normalize(),
    	halfAxis = this.dir.scale(this.length * 0.5),
    	p = sub(halfAxis),
    	q = add(halfAxis),
    	south = new Array(steps),
    	north = new Array(steps);
    	phi = MathUtils.TWO_PI / steps;
    for (var i = 0; i < steps; i++) {
        var theta = i * phi + thetaOffset;
        nr = n.getRotatedAroundAxis(this.dir, theta);
        south[i] = nr.scale(this.radiusSouth).addSelf(p);
        north[i] = nr.scale(this.radiusNorth).addSelf(q);
    }
    var numV = steps * 2 + 2;
    var numF = steps * 2 + (topClosed ? steps : 0) + (bottomClosed ? steps : 0);
    if (mesh == null) {
        mesh = new toxi.TriangleMesh("cone", numV, numF);
    }
    for (var i = 0, j = 1; i < steps; i++, j++) {
        if (j == steps) {
            j = 0;
        }
        mesh.addFace(south[i], north[i], south[j], null, null, null, null);
        mesh.addFace(south[j], north[i], north[j], null, null, null, null);
        if (bottomClosed) {
            mesh.addFace(p, south[i], south[j], null, null, null, null);
        }
        if (topClosed) {
            mesh.addFace(north[i], q, north[j], null, null, null, null);
        }
    }
    return mesh;
}
