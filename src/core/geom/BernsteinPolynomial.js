/**
 * Helper class for the spline3d classes in this package. Used to compute
 * subdivision points of the curve.
 */
/**
 * @param res
 *            number of subdivision steps between each control point of the
 *            spline3d
 */
toxi.BernsteinPolynomial = function(res) {
        this.resolution = res;
		var b0 = new Array(res),
			b1 = new Array(res),
			b2 = new Array(res),
			b3 = new Array(res);
		var t = 0;
		var dt = 1.0 / (res - 1);
		for (var i = 0; i < res; i++) {
			var t1 = 1 - t;
			var t12 = t1 * t1;
			var t2 = t * t;
			b0[i] = t1 * t12;
			b1[i] = 3 * t * t12;
			b2[i] = 3 * t2 * t1;
			b3[i] = t * t2;
			t += dt;
		}
		this.b0 = b0;
		this.b1 = b1;
		this.b2 = b2;
		this.b3 = b3;
};
