/**
 * Implements a simple row-major 4x4 matrix class, all matrix operations are
 * applied to new instances. Use {@link #transpose()} to convert from
 * column-major formats...
 */

function Matrix4x4(v11,v12,v13,v14,v21,v22,v23,v24,v31,v32,v33,v34,v41,v42,v43,v44){
	this.temp = [];
	if(v11 === undefined) //if no variables were supplied
	{
		this.matrix = [];
		this.matrix[0] = [1,0,0,0];
        this.matrix[1] = [0,1,0,0];
        this.matrix[2] = [0,0,1,0];
        this.matrix[3] = [0,0,0,1];
     }
     else if(typeof(v11) == "number"){ //if the variables were numbers
		var m1 = [v11,v12,v13,v14];
		var m2 = [v21,v22,v23,v24];
		var m3 = [v31,v32,v33,v34];
		var m4 = [v41,v42,v43,v44];
		this.matrix = [m1,m2,m3,m4];
	}
	else if(v11 instanceof Array) //if it was sent in as one array
	{
		var array = v11;
		if (array.length != 9 && array.length != 16) {
            throw new Error("Matrix4x4: Array length must == 9 or 16");
        }
        if (array.length == 16) {
        	this.matrix = [];
        	this.matrix[0] = array.slice(0,4);
        	this.matrix[1] = array.slice(4,8);
        	this.matrix[2] = array.slice(8,12);
        	this.matrix[3] = array.slice(12);
         } else {
         	this.matrix[0] = array.slice(0,3);
         	this.matrix[0][3] =NaN;
         	this.matrix[1] = array.slice(3,6);
         	this.matrix[1][3] = NaN;
         	this.matrix[2] = array.slice(6,9);
         	this.matrix[2][3] = NaN;
         	this.matrix[3] = [NaN,NaN,NaN,NaN];
        }

	}
	else {
	//else it should've been a Matrix4x4 that was passed in
	
		var m = v11;
		if(m.length == 16)
		{
			for(var i=0;i<4;i++)
			{
				this.matrix[i] = [m.matrix[i][0], m.matrix[i][1],m.matrix[i][2],m.matrix[i][3]];
			}
		}
		else {
		//should be a length of 9
			for(var i=0;i<3;i++)
			{
				this.matrix[i] = [m.matrix[i][0], m.matrix[i][1],m.matrix[i][2],NaN];
			}
			this.matrix[3] = [NaN,NaN,NaN,NaN];
		}
	
	}

}

Matrix4x4.prototype = {
	
	add: function(rhs) {
        var result = new Matrix4x4(this);
        return result.addSelf(rhs);
    },

    addSelf: function(m) {
        for (var i = 0; i < 4; i++) {
            var mi = this.matrix[i];
            var rhsm = m.matrix[i];
            mi[0] += rhsm[0];
            mi[1] += rhsm[1];
            mi[2] += rhsm[2];
            mi[3] += rhsm[3];
        }
        return this;
    },

    /**
     * Creates a copy of the given vector, transformed by this matrix.
     * 
     * @param v
     * @return transformed vector
     */
    applyTo: function(v) {
        return this.applyToSelf(new Vec3D(v));
    },

    applyToSelf: function(v) {
        for (var i = 0; i < 4; i++) {
            var m = this.matrix[i];
            this.temp[i] = v.x * m[0] + v.y * m[1] + v.z * m[2] + m[3];
        }
        v.set(this.temp[0], this.temp[1], this.temp[2]).scaleSelf((1.0 / this.temp[3]));
        return v;
    },

    copy: function() {
        return new Matrix4x4(this);
    },

    getInverted: function() {
        return new Matrix4x4(this).invert();
    },

    getRotatedAroundAxis: function(axis,theta) {
        return new Matrix4x4(this).rotateAroundAxis(axis, theta);
    },

    getRotatedX: function(theta) {
        return new Matrix4x4(this).rotateX(theta);
    },

    getRotatedY: function(theta) {
        return new Matrix4x4(this).rotateY(theta);
    },

    getRotatedZ: function(theta) {
        return new Matrix4x4(this).rotateZ(theta);
    },

    getTransposed: function() {
        return new Matrix4x4(this).transpose();
    },

    identity: function() {
        var m = this.matrix[0];
        m[1] = m[2] = m[3] = 0;
        m = this.matrix[1];
        m[0] = m[2] = m[3] = 0;
        m = this.matrix[2];
        m[0] = m[1] = m[3] = 0;
        m = this.matrix[3];
        m[0] = m[1] = m[2] = 0;
        this.matrix[0][0] = 1;
        this.matrix[1][1] = 1;
        this.matrix[2][2] = 1;
        this.matrix[3][3] = 1;
        return this;
    },

    /**
     * Matrix Inversion using Cramer's Method Computes Adjoint matrix divided by
     * determinant Code modified from
     * http://www.intel.com/design/pentiumiii/sml/24504301.pdf
     * 
     * @return itself
     */
  	invert: function() {
        var tmp = []; //12
        var src = []; //16
        var dst = []; //16
        var mat = this.toArray(null);

        for (var i = 0; i < 4; i++) {
            var i4 = i << 2;
            src[i] = mat[i4];
            src[i + 4] = mat[i4 + 1];
            src[i + 8] = mat[i4 + 2];
            src[i + 12] = mat[i4 + 3];
        }

        // calculate pairs for first 8 elements (cofactors)
        tmp[0] = src[10] * src[15];
        tmp[1] = src[11] * src[14];
        tmp[2] = src[9] * src[15];
        tmp[3] = src[11] * src[13];
        tmp[4] = src[9] * src[14];
        tmp[5] = src[10] * src[13];
        tmp[6] = src[8] * src[15];
        tmp[7] = src[11] * src[12];
        tmp[8] = src[8] * src[14];
        tmp[9] = src[10] * src[12];
        tmp[10] = src[8] * src[13];
        tmp[11] = src[9] * src[12];

        // calculate first 8 elements (cofactors)
        var src0 = src[0];
        var src1 = src[1];
        var src2 = src[2];
        var src3 = src[3];
        var src4 = src[4];
        var src5 = src[5];
        var src6 = src[6];
        var src7 = src[7];
        dst[0] = tmp[0] * src5 + tmp[3] * src6 + tmp[4] * src7;
        dst[0] -= tmp[1] * src5 + tmp[2] * src6 + tmp[5] * src7;
        dst[1] = tmp[1] * src4 + tmp[6] * src6 + tmp[9] * src7;
        dst[1] -= tmp[0] * src4 + tmp[7] * src6 + tmp[8] * src7;
        dst[2] = tmp[2] * src4 + tmp[7] * src5 + tmp[10] * src7;
        dst[2] -= tmp[3] * src4 + tmp[6] * src5 + tmp[11] * src7;
        dst[3] = tmp[5] * src4 + tmp[8] * src5 + tmp[11] * src6;
        dst[3] -= tmp[4] * src4 + tmp[9] * src5 + tmp[10] * src6;
        dst[4] = tmp[1] * src1 + tmp[2] * src2 + tmp[5] * src3;
        dst[4] -= tmp[0] * src1 + tmp[3] * src2 + tmp[4] * src3;
        dst[5] = tmp[0] * src0 + tmp[7] * src2 + tmp[8] * src3;
        dst[5] -= tmp[1] * src0 + tmp[6] * src2 + tmp[9] * src3;
        dst[6] = tmp[3] * src0 + tmp[6] * src1 + tmp[11] * src3;
        dst[6] -= tmp[2] * src0 + tmp[7] * src1 + tmp[10] * src3;
        dst[7] = tmp[4] * src0 + tmp[9] * src1 + tmp[10] * src2;
        dst[7] -= tmp[5] * src0 + tmp[8] * src1 + tmp[11] * src2;

        // calculate pairs for second 8 elements (cofactors)
        tmp[0] = src2 * src7;
        tmp[1] = src3 * src6;
        tmp[2] = src1 * src7;
        tmp[3] = src3 * src5;
        tmp[4] = src1 * src6;
        tmp[5] = src2 * src5;
        tmp[6] = src0 * src7;
        tmp[7] = src3 * src4;
        tmp[8] = src0 * src6;
        tmp[9] = src2 * src4;
        tmp[10] = src0 * src5;
        tmp[11] = src1 * src4;

        // calculate second 8 elements (cofactors)
        src0 = src[8];
        src1 = src[9];
        src2 = src[10];
        src3 = src[11];
        src4 = src[12];
        src5 = src[13];
        src6 = src[14];
        src7 = src[15];
        dst[8] = tmp[0] * src5 + tmp[3] * src6 + tmp[4] * src7;
        dst[8] -= tmp[1] * src5 + tmp[2] * src6 + tmp[5] * src7;
        dst[9] = tmp[1] * src4 + tmp[6] * src6 + tmp[9] * src7;
        dst[9] -= tmp[0] * src4 + tmp[7] * src6 + tmp[8] * src7;
        dst[10] = tmp[2] * src4 + tmp[7] * src5 + tmp[10] * src7;
        dst[10] -= tmp[3] * src4 + tmp[6] * src5 + tmp[11] * src7;
        dst[11] = tmp[5] * src4 + tmp[8] * src5 + tmp[11] * src6;
        dst[11] -= tmp[4] * src4 + tmp[9] * src5 + tmp[10] * src6;
        dst[12] = tmp[2] * src2 + tmp[5] * src3 + tmp[1] * src1;
        dst[12] -= tmp[4] * src3 + tmp[0] * src1 + tmp[3] * src2;
        dst[13] = tmp[8] * src3 + tmp[0] * src0 + tmp[7] * src2;
        dst[13] -= tmp[6] * src2 + tmp[9] * src3 + tmp[1] * src0;
        dst[14] = tmp[6] * src1 + tmp[11] * src3 + tmp[3] * src0;
        dst[14] -= tmp[10] * src3 + tmp[2] * src0 + tmp[7] * src1;
        dst[15] = tmp[10] * src2 + tmp[4] * src0 + tmp[9] * src1;
        dst[15] -= tmp[8] * src1 + tmp[11] * src2 + tmp[5] * src0;

        var det =
                1.0 / (src[0] * dst[0] + src[1] * dst[1] + src[2] * dst[2] + src[3]
                        * dst[3]);

        for (var i = 0, k = 0; i < 4; i++) {
            var m = this.matrix[i];
            for (var j = 0; j < 4; j++) {
                m[j] = dst[k++] * det;
            }
        }
        return this;
    },

    multiply: function(a) {
    	if(typeof(a) == "number"){
	        return new Matrix4x4(this).multiply(a);
	    }
	    //otherwise it should be a Matrix4x4
	    return new Matrix4x4(this).multiplySelf(a);
    },

    multiplySelf: function(a) {
    	if(typeof(a) == "number")
    	{
	        for (var i = 0; i < 4; i++) {
	            var m = matrix[i];
	            m[0] *= a;
	            m[1] *= a;
	            m[2] *= a;
	            m[3] *= a;
	        }
	        return this;
	     }
	     //otherwise it should be a matrix4x4
	    var mm0 = a.matrix[0];
        var mm1 = a.matrix[1];
        var mm2 = a.matrix[2];
        var mm3 = a.matrix[3];
        for (var i = 0; i < 4; i++) {
            var m = this.matrix[i];
            for (var j = 0; j < 4; j++) {
                this.temp[j] =
                        m[0] * mm0[j] + m[1] * mm1[j] + m[2] * mm2[j] + m[3]
                                * mm3[j];
            }
            m[0] = temp[0];
            m[1] = temp[1];
            m[2] = temp[2];
            m[3] = temp[3];
        }
        return this;
    },
    

    /**
     * Applies rotation about arbitrary axis to matrix
     * 
     * @param axis
     * @param theta
     * @return rotation applied to this matrix
     */
    rotateAroundAxis: function(axis, theta) {
        var x, y, z, s, c, t, tx, ty;
        x = axis.x();
        y = axis.y();
        z = axis.z();
        s = Math.sin(theta);
        c = Math.cos(theta);
        t = 1 - c;
        tx = t * x;
        ty = t * y;
        Matrix4x4.TEMP.set(tx * x + c, tx * y + s * z, tx * z - s * y, 0, tx * y - s * z,
                ty * y + c, ty * z + s * x, 0, tx * z + s * y, ty * z - s * x,
                t * z * z + c, 0, 0, 0, 0, 1);
        return this.multiplySelf(Matrix4x4.TEMP);
    },

    /**
     * Applies rotation about X to this matrix.
     * 
     * @param theta
     *            rotation angle in radians
     * @return itself
     */
    rotateX: function(theta) {
        Matrix4x4.TEMP.identity();
        Matrix4x4.TEMP.matrix[1][1] = Matrix4x4.TEMP.matrix[2][2] = Math.cos(theta);
        Matrix4x4.TEMP.matrix[2][1] = Math.sin(theta);
        Matrix4x4.TEMP.matrix[1][2] = -Matrix4x4.TEMP.matrix[2][1];
        return this.multiplySelf(Matrix4x4.TEMP);
    },

    /**
     * Applies rotation about Y to this matrix.
     * 
     * @param theta
     *            rotation angle in radians
     * @return itself
     */
    rotateY: function(theta) {
        Matrix4x4.TEMP.identity();
        Matrix4x4.TEMP.matrix[0][0] = Matrix4x4.TEMP.matrix[2][2] = Math.cos(theta);
        Matrix4x4.TEMP.matrix[0][2] = Math.sin(theta);
        Matrix4x4.TEMP.matrix[2][0] = -Matrix4x4.TEMP.matrix[0][2];
        return this.multiplySelf(Matrix4x4.TEMP);
    },

    // Apply Rotation about Z to Matrix
    rotateZ: function(theta) {
        Matrix4x4.TEMP.identity();
        Matrix4x4.TEMP.matrix[0][0] = Matrix4x4.TEMP.matrix[1][1] = Math.cos(theta);
        Matrix4x4.TEMP.matrix[1][0] = Math.sin(theta);
        Matrix4x4.TEMP.matrix[0][1] = -Matrix4x4.TEMP.matrix[1][0];
        return this.multiplySelf(Matrix4x4.TEMP);
    },

    scale: function(a,b,c) {
    
    	return new Matrix4x4(this).scaleSelf(a,b,c);
    },

    scaleSelf: function(a,b,c) {
    	if(a instanceof Vec3D)
    	{
    		b = a.y;
    		c = a.z;
    		a = a.x;
    	}
		else if(b === undefined || c === undefined)
		{
			b = a;
			c = a;
		}
    	
        Matrix4x4.TEMP.identity();
        Matrix4x4.TEMP.matrix[0][0] = a;
        Matrix4x4.TEMP.matrix[1][1] = b;
        Matrix4x4.TEMP.matrix[2][2] = c
        return this.multiplySelf(Matrix4x4.TEMP);
    },

  	set: function(a,b,c, d, e,f,g, h, i, j, k, l, m, n, o, p) {
  	if(typeof(a) == "number")
  	{
        var mat = this.matrix[0];
        mat[0] = a;
        mat[1] = b;
        mat[2] = c;
        mat[3] = d;
        mat = this.matrix[1];
        mat[0] = e;
        mat[1] = f;
        mat[2] = g;
        mat[3] = h;
        mat = this.matrix[2];
        mat[0] = i;
        mat[1] = j;
        mat[2] = k;
        mat[3] = l;
        mat = this.matrix[3];
        mat[0] = m;
        mat[1] = n;
        mat[2] = o;
        mat[3] = p;
     }
     else
     {
     	//it must be a matrix4x4
     	for (var i = 0; i < 4; i++) {
            var m = this.matrix[i];
            var n = mat.matrix[i];
            m[0] = n[0];
            m[1] = n[1];
            m[2] = n[2];
            m[3] = n[3];
        }
     }
        return this;
    },

   
    sub: function(m) {
        return new Matrix4x4(this).subSelf(m);
    },

    subSelf: function(mat) {
        for (var i = 0; i < 4; i++) {
            var m = this.matrix[i];
            var n = mat.matrix[i];
            m[0] -= n[0];
            m[1] -= n[1];
            m[2] -= n[2];
            m[3] -= n[3];
        }
        return this;
    },

    /**
     * Copies all matrix elements into an linear array.
     * 
     * @param result
     *            array (or null to create a new one)
     * @return matrix as 16 element array
     */
    toArray: function(result) {
        if (result == null) {
            result = [];
        }
        for (var i = 0, k = 0; i < 4; i++) {
            var m = this.matrix[i];
            for (var j = 0; j < 4; j++) {
                result[k++] = m[j];
            }
        }
        return result;
    },

    toFloatArray:function(result) {
        return toArray(result);
    },

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    toString: function() {
        return "| " + this.matrix[0][0] + " " + this.matrix[0][1] + " " + this.matrix[0][2]
                + " " + this.matrix[0][3] + " |\n" + "| " + this.matrix[1][0] + " "
                + this.matrix[1][1] + " " + this.matrix[1][2] + " " + this.matrix[1][3]
                + " |\n" + "| " + this.matrix[2][0] + " " + this.matrix[2][1] + " "
                + this.matrix[2][2] + " " + this.matrix[2][3] + " |\n" + "| "
                + this.matrix[3][0] + " " + this.matrix[3][1] + " " + this.matrix[3][2] + " "
                + this.matrix[3][3] + " |";
    },

    toTransposedFloatArray: function(result) {
        if (result == null) {
            result = [];
        }
        for (var i = 0, k = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                result[k++] = this.matrix[j][i];
            }
        }
        return result;
    },

    translate: function(dx,dy,dz) {
        return new Matrix4x4(this).translateSelf(dx, dy, dz);
    },

    translateSelf: function( dx, dy, dz) {
    	if(dx instanceof Vec3D){
    		dy = dx.y;
    		dz = dx.z;
    		dx = dx.x;
    	}
        Matrix4x4.TEMP.identity();
        Matrix4x4.TEMP.matrix[0][3] = dx;
        Matrix4x4.TEMP.matrix[1][3] = dy;
        Matrix4x4.TEMP.matrix[2][3] = dz;
        return this.multiplySelf(Matrix4x4.TEMP);
    },

    /**
     * Converts the matrix (in-place) between column-major to row-major order
     * (and vice versa).
     * 
     * @return itself
     */
    transpose: function() {
        return this.set(this.matrix[0][0], this.matrix[1][0], this.matrix[2][0], this.matrix[3][0],
                this.matrix[0][1], this.matrix[1][1], this.matrix[2][1], this.matrix[3][1],
                this.matrix[0][2], this.matrix[1][2], this.matrix[2][2], this.matrix[3][2],
                this.matrix[0][3], this.matrix[1][3], this.matrix[2][3], this.matrix[3][3]);
    }
};

Matrix4x4.TEMP = new Matrix4x4();
