/**
 * An extensible builder class for {@link TriangleMesh}es based on 3D surface
 * functions using spherical coordinates. In order to create mesh, you'll need
 * to supply a {@link SurfaceFunction} implementation to the builder.
 */

toxi.SurfaceMeshBuilder = function(func) {
    this.func = func;
}

toxi.SurfaceMeshBuilder.prototype = {
    createMesh: function(mesh_or_res,_res,size,isClosed) {
    	if(mesh_or_res == null)mesh_or_res = undefined; //this is for in case people use it in toxi's examples for p5
    	var mesh;
    	var res;
    	if(_res === undefined)
    	{
    		res = mesh_or_res;
        	mesh = new toxi.TriangleMesh();
        }
        else {
        	mesh = mesh_or_res;
        	res = _res;
        }
        if(mesh === undefined)
        {
        	mesh = new toxi.TriangleMesh();
        }
        if(size === undefined)
        {
        	size = 1;
        }
        if(isClosed === undefined)
        {
        	isClosed = true;
        }
        var a = new toxi.Vec3D(),
        	b = new toxi.Vec3D(),
        	pa = new toxi.Vec3D(),
        	pb = new toxi.Vec3D(),
        	a0 = new toxi.Vec3D(),
        	b0 = new toxi.Vec3D(),
        	phiRes = this.func.getPhiResolutionLimit(res),       
        	phiRange = this.func.getPhiRange(),
        	thetaRes = this.func.getThetaResolutionLimit(res),
        	thetaRange = this.func.getThetaRange(),
        	pres = 1.0 / (1 == res % 2 ? res - 0 : res);
        for (var p = 0; p < phiRes; p++) {
            var phi = p * phiRange * pres;
            var phiNext = (p + 1) * phiRange * pres;
            for (var t = 0; t <= thetaRes; t++) {
                var theta = t * thetaRange / res;
                var func = this.func;
                a =	func.computeVertexFor(a, phiNext, theta).scaleSelf(size);
                b = func.computeVertexFor(b, phi, theta).scaleSelf(size);
                if (b.distanceTo(a) < 0.0001) {
                    b.set(a);
                }
                if (t > 0) {
                    if (t == thetaRes && isClosed) {
                        a.set(a0);
                        b.set(b0);
                    }
                    mesh.addFace(pa, pb, a);
                    mesh.addFace(pb, b, a);
                } else {
                    a0.set(a);
                    b0.set(b);
                }
                pa.set(a);
                pb.set(b);
            }
        }
        return mesh;
    },
    
    
    /**
     * @return the function
     */
    getFunction: function() {
        return this.func;
    },

    setFunction: function(func) {
        this.func = func;
    }
};