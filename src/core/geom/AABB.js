/**
 		T O X I C L I B S . JS  - 0.01
		a port of toxiclibs for Java / Processing written by Karsten Schmidt
		
		License				: GNU Lesser General Public version 2.1
		Developer			: Kyle Phillips: http://haptic-data.com
		Java Version		: http://toxiclibs.org
*/


AABB.prototype = new Vec3D();
AABB.prototype.constructor = AABB;
AABB.prototype.parent = Vec3D.prototype;

/** requires Vec3D.interpolateTo
AABB.fromMinMax = function(min,max){
	var a = Vec3D.min(min);
	var b = Vec3D.max(max);
	return new AABB()
}*/
function AABB(a,b)
{
	
	if(a instanceof AABB)
	{
		this.parent.set(a);
	}
	var extent;
	if(a==null && b==null){
		this.parent.set(new Vec3D());
		extent = new Vec3D();
	}
	if(a instanceof Number)
	{
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
		extent = new Vec3D(b,b,b);
	}
	if(b instanceof Number)
	{
		extent = new Vec3D(b,b,b);
	}
	else if(b instanceof Vec3D)
	{
		extent = b;
	}
	this.setExtent(extent);
	this.min;
	this.max;
}

AABB.prototype.containsPoint = function(p) {
        return p.isInAABB(this);
}

AABB.prototype.copy = function() {
        return new AABB(this);
}

/**
 * Returns the current box size as new Vec3D instance (updating this vector
 * will NOT update the box size! Use {@link #setExtent(ReadonlyVec3D)} for
 * those purposes)
 * 
 * @return box size
 */
AABB.prototype.getExtent = function() {
   return this.extent.copy();
}

AABB.prototype.getMax = function() {
   // return this.add(extent);
   return this.max.copy();
}

AABB.prototype.getMin = function() {
   return this.min.copy();
}
/*
AABB.prototype.getNormalForPoint = function(p) {
        p = p.sub(this);
        var pabs = this.extent.sub(p.getAbs());
        var psign = p.getSignum();
        var normal = Vec3D.X_AXIS.scale(psign.x);
        float minDist = pabs.x;
        if (pabs.y < minDist) {
            minDist = pabs.y;
            normal = Vec3D.Y_AXIS.scale(psign.y);
        }
        if (pabs.z < minDist) {
            normal = Vec3D.Z_AXIS.scale(psign.z);
        }
        return normal;
    }*/

    /**
     * Adjusts the box size and position such that it includes the given point.
     * 
     * @param p
     *            point to include
     * @return itself
     */
/*AABB.prototype.includePoint = function(p) {
        this.min.minSelf(p);
        this.max.maxSelf(p);
        this.set(this.min.interpolateTo(this.max, 0.5));
        this.extent.set(this.max.sub(this.min).scaleSelf(0.5);
        return this;
    }*/

/**
* Checks if the box intersects the passed in one.
* 
* @param box
*            box to check
* @return true, if boxes overlap
*/
AABB.prototype.intersectsBox = function(box) {
        var t = box.sub(this);
        return Math.abs(t.x) <= (this.extent.x + box.extent.x)
                && Math.abs(t.y) <= (this.extent.y + box.extent.y)
                && Math.abs(t.z) <= (this.extent.z + box.extent.z);
    }

/**
 * Calculates intersection with the given ray between a certain distance
 * interval.
 * 
 * Ray-box intersection is using IEEE numerical properties to ensure the
 * test is both robust and efficient, as described in:
 * 
 * Amy Williams, Steve Barrus, R. Keith Morley, and Peter Shirley: "An
 * Efficient and Robust Ray-Box Intersection Algorithm" Journal of graphics
 * tools, 10(1):49-54, 2005
 * 
 * @param ray
 *            incident ray
 * @param minDist
 * @param maxDist
 * @return intersection point on the bounding box (only the first is
 *         returned) or null if no intersection
 */
/*
AABB.prototype.intersectsRay = function(ray, minDist, maxDist) {
        varinvDir = ray.getDirection().reciprocal();
        var signDirX = invDir.x < 0;
        var signDirY = invDir.y < 0;
        var signDirZ = invDir.z < 0;
        var bbox = signDirX ? this.max : this.min;
        var tmin = (bbox.x - ray.x) * invDir.x;
        bbox = signDirX ? this.min : this.max;
        var tmax = (bbox.x - ray.x) * invDir.x;
        bbox = signDirY ? this.max : this.min;
        var tymin = (bbox.y - ray.y) * invDir.y;
        bbox = signDirY ? this.min : this.max;
        var tymax = (bbox.y - ray.y) * invDir.y;
        if ((tmin > tymax) || (tymin > tmax)) {
            return null;
        }
        if (tymin > tmin) {
            tmin = tymin;
        }
        if (tymax < tmax) {
            tmax = tymax;
        }
        bbox = signDirZ ? max : min;
        var tzmin = (bbox.z - ray.z) * invDir.z;
        bbox = signDirZ ? min : max;
        var tzmax = (bbox.z - ray.z) * invDir.z;
        if ((tmin > tzmax) || (tzmin > tmax)) {
            return null;
        }
        if (tzmin > tmin) {
            tmin = tzmin;
        }
        if (tzmax < tmax) {
            tmax = tzmax;
        }
        if ((tmin < maxDist) && (tmax > minDist)) {
            return ray.getPointAtDistance(tmin);
        }
        return null;
    }
*/
/*
    public boolean intersectsSphere(Sphere s) {
        return intersectsSphere(s, s.radius);
    }
*/

    /**
     * @param c
     *            sphere centre
     * @param r
     *            sphere radius
     * @return true, if AABB intersects with sphere
     */
/*
    public boolean intersectsSphere(Vec3D c, float r) {
        float s, d = 0;
        // find the square of the distance
        // from the sphere to the box
        if (c.x < min.x) {
            s = c.x - min.x;
            d = s * s;
        } else if (c.x > max.x) {
            s = c.x - max.x;
            d += s * s;
        }

        if (c.y < min.y) {
            s = c.y - min.y;
            d += s * s;
        } else if (c.y > max.y) {
            s = c.y - max.y;
            d += s * s;
        }

        if (c.z < min.z) {
            s = c.z - min.z;
            d += s * s;
        } else if (c.z > max.z) {
            s = c.z - max.z;
            d += s * s;
        }

        return d <= r * r;
    }
*/
/*
    public boolean intersectsTriangle(Triangle3D tri) {
        // use separating axis theorem to test overlap between triangle and box
        // need to test for overlap in these directions:
        //
        // 1) the {x,y,z}-directions (actually, since we use the AABB of the
        // triangle
        // we do not even need to test these)
        // 2) normal of the triangle
        // 3) crossproduct(edge from tri, {x,y,z}-directin)
        // this gives 3x3=9 more tests
        Vec3D v0, v1, v2;
        Vec3D normal, e0, e1, e2, f;

        // move everything so that the boxcenter is in (0,0,0)
        v0 = tri.a.sub(this);
        v1 = tri.b.sub(this);
        v2 = tri.c.sub(this);

        // compute triangle edges
        e0 = v1.sub(v0);
        e1 = v2.sub(v1);
        e2 = v0.sub(v2);

        // test the 9 tests first (this was faster)
        f = e0.getAbs();
        if (testAxis(e0.z, -e0.y, f.z, f.y, v0.y, v0.z, v2.y, v2.z, extent.y,
                extent.z)) {
            return false;
        }
        if (testAxis(-e0.z, e0.x, f.z, f.x, v0.x, v0.z, v2.x, v2.z, extent.x,
                extent.z)) {
            return false;
        }
        if (testAxis(e0.y, -e0.x, f.y, f.x, v1.x, v1.y, v2.x, v2.y, extent.x,
                extent.y)) {
            return false;
        }

        f = e1.getAbs();
        if (testAxis(e1.z, -e1.y, f.z, f.y, v0.y, v0.z, v2.y, v2.z, extent.y,
                extent.z)) {
            return false;
        }
        if (testAxis(-e1.z, e1.x, f.z, f.x, v0.x, v0.z, v2.x, v2.z, extent.x,
                extent.z)) {
            return false;
        }
        if (testAxis(e1.y, -e1.x, f.y, f.x, v0.x, v0.y, v1.x, v1.y, extent.x,
                extent.y)) {
            return false;
        }

        f = e2.getAbs();
        if (testAxis(e2.z, -e2.y, f.z, f.y, v0.y, v0.z, v1.y, v1.z, extent.y,
                extent.z)) {
            return false;
        }
        if (testAxis(-e2.z, e2.x, f.z, f.x, v0.x, v0.z, v1.x, v1.z, extent.x,
                extent.z)) {
            return false;
        }
        if (testAxis(e2.y, -e2.x, f.y, f.x, v1.x, v1.y, v2.x, v2.y, extent.x,
                extent.y)) {
            return false;
        }

        // first test overlap in the {x,y,z}-directions
        // find min, max of the triangle each direction, and test for overlap in
        // that direction -- this is equivalent to testing a minimal AABB around
        // the triangle against the AABB

        // test in X-direction
        if (MathUtils.min(v0.x, v1.x, v2.x) > extent.x
                || MathUtils.max(v0.x, v1.x, v2.x) < -extent.x) {
            return false;
        }

        // test in Y-direction
        if (MathUtils.min(v0.y, v1.y, v2.y) > extent.y
                || MathUtils.max(v0.y, v1.y, v2.y) < -extent.y) {
            return false;
        }

        // test in Z-direction
        if (MathUtils.min(v0.z, v1.z, v2.z) > extent.z
                || MathUtils.max(v0.z, v1.z, v2.z) < -extent.z) {
            return false;
        }

        // test if the box intersects the plane of the triangle
        // compute plane equation of triangle: normal*x+d=0
        normal = e0.cross(e1);
        float d = -normal.dot(v0);
        if (!planeBoxOverlap(normal, d, extent)) {
            return false;
        }
        return true;
    }
*/

AABB.prototype.planeBoxOverlap = function(normal, d, maxbox) {
        var vmin = new Vec3D();
        var vmax = new Vec3D();

        if (normal.x > 0.0) {
            vmin.x = -maxbox.x;
            vmax.x = maxbox.x;
        } else {
            vmin.x = maxbox.x;
            vmax.x = -maxbox.x;
        }

        if (normal.y > 0.0) {
            vmin.y = -maxbox.y;
            vmax.y = maxbox.y;
        } else {
            vmin.y = maxbox.y;
            vmax.y = -maxbox.y;
        }

        if (normal.z > 0.0) {
            vmin.z = -maxbox.z;
            vmax.z = maxbox.z;
        } else {
            vmin.z = maxbox.z;
            vmax.z = -maxbox.z;
        }
        if (normal.dot(vmin) + d > 0.0) {
            return false;
        }
        if (normal.dot(vmax) + d >= 0.0) {
            return true;
        }
        return false;
    }

/**
 * Updates the position of the box in space and calls
 * {@link #updateBounds()} immediately
 * 
 * @see toxi.geom.Vec3D#set(float, float, float)
 */

 AABB.prototype.set = function(a,b,c) {
		if(typeof(a)==AABB)
		{
        	this.extent.set(box.extent);
        	return this.parent.set(box);
		}
		if(typeof(a)==Vec3D)
		{
			b = a.y;
			c = a.z;
			a = a.a;
		}
		this.x = a;
		this.y = b;
		this.z = c;
		this.updateBounds();
		return this;
 }


AABB.prototype.setExtent = function(extent) {
        this.extent = extent.copy();
        return this.updateBounds();
    }

AABB.prototype.testAxis = function(a, b, fa, fb, va, vb, wa, wb, ea, eb) {
    var p0 = a * va + b * vb;
    var p2 = a * wa + b * wb;
    var min;
	var max;
    if (p0 < p2) {
        min = p0;
        max = p2;
    } else {
        min = p2;
        max = p0;
    }
    var rad = fa * ea + fb * eb;
    return (min > rad || max < -rad);
}

 /*   public Mesh3D toMesh() {
        return toMesh(null);
    }
public Mesh3D toMesh(Mesh3D mesh) {
        if (mesh == null) {
            mesh = new TriangleMesh("aabb", 8, 12);
        }
        Vec3D a = new Vec3D(min.x, max.y, max.z);
        Vec3D b = new Vec3D(max.x, max.y, max.z);
        Vec3D c = new Vec3D(max.x, min.y, max.z);
        Vec3D d = new Vec3D(min.x, min.y, max.z);
        Vec3D e = new Vec3D(min.x, max.y, min.z);
        Vec3D f = new Vec3D(max.x, max.y, min.z);
        Vec3D g = new Vec3D(max.x, min.y, min.z);
        Vec3D h = new Vec3D(min.x, min.y, min.z);
        // front
        mesh.addFace(a, b, d, null, null, null, null);
        mesh.addFace(b, c, d, null, null, null, null);
        // back
        mesh.addFace(f, e, g, null, null, null, null);
        mesh.addFace(e, h, g, null, null, null, null);
        // top
        mesh.addFace(e, f, a, null, null, null, null);
        mesh.addFace(f, b, a, null, null, null, null);
        // bottom
        mesh.addFace(g, h, d, null, null, null, null);
        mesh.addFace(g, d, c, null, null, null, null);
        // left
        mesh.addFace(e, a, h, null, null, null, null);
        mesh.addFace(a, d, h, null, null, null, null);
        // right
        mesh.addFace(b, f, g, null, null, null, null);
        mesh.addFace(b, g, c, null, null, null, null);
        return mesh;
    }
*/
    /*
     * (non-Javadoc)
     * 
     * @see toxi.geom.Vec3D#toString()
     */
AABB.prototype.toString = function() {
   return "<aabb> pos: "+this.parent.toString()+" ext: "+this.extent.toString();
}

    /**
     * Updates the min/max corner points of the box. MUST be called after moving
     * the box in space by manipulating the public x,y,z coordinates directly.
     * 
     * @return itself
     */
AABB.prototype.updateBounds =function() {
  // this is check is necessary for the constructor
  if (this.extent != null) {
      this.min = this.sub(this.extent);
      this.max = this.add(this.extent);
  }
  return this;
}