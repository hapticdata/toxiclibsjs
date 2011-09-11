toxi.AABB = function(a,b){
	var vec,
		extent;
	if(a === undefined){
		toxi.Vec3D.apply(this);
		this.setExtent(new toxi.Vec3D());
	} else if(typeof(a) == "number") {
		toxi.Vec3D.apply(this,[new toxi.Vec3D()]);
		this.setExtent(a);
	} else if(a instanceof toxi.Vec3D) {
		toxi.Vec3D.apply(this,[a]);
		if(b === undefined && a instanceof toxi.AABB) {
			this.setExtent(a.getExtent());
		} else {
			if(typeof b == "number"){
				this.setExtent(new toxi.Vec3D(b,b,b));
			}else { //should be an AABB
				this.setExtent(b);
			}
		}
	}
	
	
};

toxi.extend(toxi.AABB,toxi.Vec3D);

toxi.AABB.fromMinMax = function(min,max){
	var a = toxi.Vec3D.min(min);
	var b = toxi.Vec3D.max(max);
	return new toxi.AABB(a.interpolateTo(b,0.5),b.sub(a).scaleSelf(0.5));
};

toxi.AABB.prototype.containsPoint = function(p) {
    return p.isInAABB(this);
};
	
toxi.AABB.prototype.copy = function() {
    return new toxi.AABB(this);
};
	
	/**
	 * Returns the current box size as new Vec3D instance (updating this vector
	 * will NOT update the box size! Use {@link #setExtent(ReadonlyVec3D)} for
	 * those purposes)
	 * 
	 * @return box size
	 */
toxi.AABB.prototype.getExtent = function() {
   return this.extent.copy();
};
	
toxi.AABB.prototype.getMax = function() {
   // return this.add(extent);
   return this.max.copy();
};

toxi.AABB.prototype.getMin = function() {
   return this.min.copy();
};

toxi.AABB.prototype.getNormalForPoint = function(p) {
    p = p.sub(this);
    var pabs = this.extent.sub(p.getAbs());
    var psign = p.getSignum();
    var normal = toxi.Vec3D.X_AXIS.scale(psign.x);
    var minDist = pabs.x;
    if (pabs.y < minDist) {
        minDist = pabs.y;
        normal = toxi.Vec3D.Y_AXIS.scale(psign.y);
    }
    if (pabs.z < minDist) {
        normal = toxi.Vec3D.Z_AXIS.scale(psign.z);
    }
    return normal;
};

    /**
     * Adjusts the box size and position such that it includes the given point.
     * 
     * @param p
     *            point to include
     * @return itself
     */
toxi.AABB.prototype.includePoint = function(p) {
    this.min.minSelf(p);
    this.max.maxSelf(p);
    this.set(this.min.interpolateTo(this.max, 0.5));
    this.extent.set(this.max.sub(this.min).scaleSelf(0.5));
    return this;
};

/**
* Checks if the box intersects the passed in one.
* 
* @param box
*            box to check
* @return true, if boxes overlap
*/
toxi.AABB.prototype.intersectsBox = function(box) {
    var t = box.sub(this);
    return Math.abs(t.x) <= (this.extent.x + box.extent.x) && Math.abs(t.y) <= (this.extent.y + box.extent.y) && Math.abs(t.z) <= (this.extent.z + box.extent.z);
};

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

toxi.AABB.prototype.intersectsRay = function(ray, minDist, maxDist) {
    var invDir = ray.getDirection().reciprocal();
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
    return undefined;
};

/**
 * @param c
 *            sphere centre
 * @param r
 *            sphere radius
 * @return true, if AABB intersects with sphere
 */

toxi.AABB.prototype.intersectsSphere = function(c, r) {
	if(arguments.length == 1){ //must've been a sphere
		r = c.radius;
	}
    var s, 
		d = 0;
    // find the square of the distance
    // from the sphere to the box
    if (c.x < this.min.x) {
        s = c.x - this.min.x;
        d = s * s;
    } else if (c.x > this.max.x) {
        s = c.x - this.max.x;
        d += s * s;
    }

    if (c.y < this.min.y) {
        s = c.y - this.min.y;
        d += s * s;
    } else if (c.y > this.max.y) {
        s = c.y - this.max.y;
        d += s * s;
    }

    if (c.z < this.min.z) {
        s = c.z - this.min.z;
        d += s * s;
    } else if (c.z > this.max.z) {
        s = c.z - this.max.z;
        d += s * s;
    }

    return d <= r * r;
};

toxi.AABB.prototype.intersectsTriangle = function(tri) {
	// use separating axis theorem to test overlap between triangle and box
	// need to test for overlap in these directions:
	//
	// 1) the {x,y,z}-directions (actually, since we use the AABB of the
	// triangle
	// we do not even need to test these)
	// 2) normal of the triangle
	// 3) crossproduct(edge from tri, {x,y,z}-directin)
	// this gives 3x3=9 more tests
	var v0, 
		v1, 
		v2,
		normal, 
		e0, 
		e1, 
		e2, 
		f;

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
	if (this.testAxis(e0.z, -e0.y, f.z, f.y, v0.y, v0.z, v2.y, v2.z, this.extent.y, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(-e0.z, e0.x, f.z, f.x, v0.x, v0.z, v2.x, v2.z, this.extent.x, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(e0.y, -e0.x, f.y, f.x, v1.x, v1.y, v2.x, v2.y, this.extent.x, this.extent.y)) {
	    return false;
	}

	f = e1.getAbs();
	if (this.testAxis(e1.z, -e1.y, f.z, f.y, v0.y, v0.z, v2.y, v2.z, this.extent.y, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(-e1.z, e1.x, f.z, f.x, v0.x, v0.z, v2.x, v2.z, this.extent.x, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(e1.y, -e1.x, f.y, f.x, v0.x, v0.y, v1.x, v1.y, this.extent.x, this.extent.y)) {
	    return false;
	}

	f = e2.getAbs();
	if (this.testAxis(e2.z, -e2.y, f.z, f.y, v0.y, v0.z, v1.y, v1.z, this.extent.y, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(-e2.z, e2.x, f.z, f.x, v0.x, v0.z, v1.x, v1.z, this.extent.x, this.extent.z)) {
	    return false;
	}
	if (this.testAxis(e2.y, -e2.x, f.y, f.x, v1.x, v1.y, v2.x, v2.y, this.extent.x, this.extent.y)) {
	    return false;
	}

	// first test overlap in the {x,y,z}-directions
	// find min, max of the triangle each direction, and test for overlap in
	// that direction -- this is equivalent to testing a minimal AABB around
	// the triangle against the AABB

	// test in X-direction
	if (toxi.MathUtils.min(v0.x, v1.x, v2.x) > this.extent.x || toxi.MathUtils.max(v0.x, v1.x, v2.x) < -this.extent.x) {
	    return false;
	}

	// test in Y-direction
	if (toxi.MathUtils.min(v0.y, v1.y, v2.y) > this.extent.y || toxi.MathUtils.max(v0.y, v1.y, v2.y) < -this.extent.y) {
	    return false;
	}

	// test in Z-direction
	if (toxi.MathUtils.min(v0.z, v1.z, v2.z) > this.extent.z || toxi.MathUtils.max(v0.z, v1.z, v2.z) < -this.extent.z) {
	    return false;
	}

	// test if the box intersects the plane of the triangle
	// compute plane equation of triangle: normal*x+d=0
	normal = e0.cross(e1);
	var d = -normal.dot(v0);
	if (!this.planeBoxOverlap(normal, d, extent)) {
	    return false;
	}
	return true;
};

toxi.AABB.prototype.planeBoxOverlap = function(normal, d, maxbox) {
    var vmin = new toxi.Vec3D();
    var vmax = new toxi.Vec3D();

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
};
		
/**
 * Updates the position of the box in space and calls
 * {@link #updateBounds()} immediately
 * 
 * @see toxi.geom.Vec3D#set(float, float, float)
 */

toxi.AABB.prototype.set = function(a,b,c) {
		if(a  instanceof toxi.AABB) {
			this.extent.set(a.extent);
			return toxi.Vec3D.set.apply(this,[a]);
		}
		if(a instanceof toxi.Vec3D){
			b = a.y;
			c = a.z;
			a = a.a;
		}
		this.x = a;
		this.y = b;
		this.z = c;
		this.updateBounds();
		return this;
 };


toxi.AABB.prototype.setExtent = function(extent) {
        this.extent = extent.copy();
        return this.updateBounds();
};

toxi.AABB.prototype.testAxis = function(a, b, fa, fb, va, vb, wa, wb, ea, eb) {
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
};

toxi.AABB.prototype.toMesh = function(mesh){
	if(mesh === undefined){
		mesh = new toxi.TriangleMesh("aabb",8,12);	
	}
	var a = new toxi.Vec3D(this.min.x,this.max.y,this.max.z),
		b = new toxi.Vec3D(this.max.x,this.max.y,this.max.z),
		c = new toxi.Vec3D(this.max.x,this.min.y, this.max.z),
		d = new toxi.Vec3D(this.min.x, this.min.y, this.max.z),
		e = new toxi.Vec3D(this.min.x, this.max.y, this.min.z),
		f = new toxi.Vec3D(this.max.x, this.max.y, this.min.z),
		g = new toxi.Vec3D(this.max.x, this.min.y, this.min.z),
		h = new toxi.Vec3D(this.min.x, this.min.y, this.min.z);
		
	// front
	mesh.addFace(a, b, d, undefined, undefined, undefined, undefined);
	mesh.addFace(b, c, d, undefined, undefined, undefined, undefined);
	// back
	mesh.addFace(f, e, g, undefined, undefined, undefined, undefined);
	mesh.addFace(e, h, g, undefined, undefined, undefined, undefined);
	// top
	mesh.addFace(e, f, a, undefined, undefined, undefined, undefined);
	mesh.addFace(f, b, a, undefined, undefined, undefined, undefined);
	// bottom
	mesh.addFace(g, h, d, undefined, undefined, undefined, undefined);
	mesh.addFace(g, d, c, undefined, undefined, undefined, undefined);
	// left
	mesh.addFace(e, a, h, undefined, undefined, undefined, undefined);
	mesh.addFace(a, d, h, undefined, undefined, undefined, undefined);
	// right
	mesh.addFace(b, f, g, undefined, undefined, undefined, undefined);
	mesh.addFace(b, g, c, undefined, undefined, undefined, undefined);
	return mesh;

};


toxi.AABB.prototype.toString = function() {
   return "<aabb> pos: "+this.parent.toString()+" ext: "+this.extent.toString();
};

/**
* Updates the min/max corner points of the box. MUST be called after moving
* the box in space by manipulating the public x,y,z coordinates directly.
* 
* @return itself
*/
toxi.AABB.prototype.updateBounds = function() {
  // this is check is necessary for the constructor
  if (this.extent !== undefined) {
      this.min = this.sub(this.extent);
      this.max = this.add(this.extent);
  }
  return this;
};

