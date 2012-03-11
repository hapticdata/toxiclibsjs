define(["require", "exports", "module", "../../internals"], function(require, exports, module) {

var Int32Array = require('../../internals').Int32Array;


/**
 * Simplex Noise in 2D, 3D and 4D. Based on the example code of this paper:
 * http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
 * 
 * @author Stefan Gustavson, Linkping University, Sweden (stegu at itn dot liu dot se) 
 * Slight optimizations & restructuring by
 * @author Karsten Schmidt (info at toxi dot co dot uk)
 * javascript by
 * @author Kyle Phillips (kyle at haptic-data dot com)
*/
var numFrame = 0;

var _SQRT3 = Math.sqrt(3.0),
	_SQRT5 = Math.sqrt(5.0);

/**
 * Skewing and unskewing factors for 2D, 3D and 4D, some of them
 * pre-multiplied.
 */
var	_F2 = 0.5 * (_SQRT3 - 1.0),
	_G2 = (3.0 - _SQRT3) / 6.0,
	_G22 = _G2 * 2.0 - 1,

	_F3 = 1.0 / 3.0,
	_G3 = 1.0 / 6.0,

	_F4 = (_SQRT5 - 1.0) / 4.0,
	_G4 = (5.0 - _SQRT5) / 20.0,
	_G42 = _G4 * 2.0,
	_G43 = _G4 * 3.0,
	_G44 = _G4 * 4.0 - 1.0;


	/**
	 * Gradient vectors for 3D (pointing to mid points of all edges of a unit
	 * cube)
	 */
var	_grad3 = [
		new Int32Array([1, 1, 0 ]), 
		new Int32Array([ -1, 1, 0 ]),
		new Int32Array([ 1, -1, 0 ]), 
		new Int32Array([ -1, -1, 0 ]), 
		new Int32Array([ 1, 0, 1 ]), 
		new Int32Array([ -1, 0, 1 ]),
		new Int32Array([ 1, 0, -1 ]), 
		new Int32Array([ -1, 0, -1 ]), 
		new Int32Array([0, 1, 1 ]), 
		new Int32Array([0, -1, 1 ]),
		new Int32Array([ 0, 1, -1 ]), 
		new Int32Array([ 0, -1, -1 ])
	];

	/**
	 * Gradient vectors for 4D (pointing to mid points of all edges of a unit 4D
	 * hypercube)
	 */
var	_grad4 = [
		new Int32Array([ 0, 1, 1, 1 ]), 
		new Int32Array([ 0, 1, 1, -1 ]),
		new Int32Array([ 0, 1, -1, 1 ]), 
		new Int32Array([ 0, 1, -1, -1 ]), 
		new Int32Array([ 0, -1, 1, 1 ]),
		new Int32Array([ 0, -1, 1, -1 ]), 
		new Int32Array([ 0, -1, -1, 1 ]), 
		new Int32Array([ 0, -1, -1, -1 ]),
		new Int32Array([ 1, 0, 1, 1 ]), 
		new Int32Array([ 1, 0, 1, -1 ]), 
		new Int32Array([ 1, 0, -1, 1 ]), 
		new Int32Array([ 1, 0, -1, -1 ]),
		new Int32Array([ -1, 0, 1, 1 ]), 
		new Int32Array([ -1, 0, 1, -1 ]), 
		new Int32Array([ -1, 0, -1, 1 ]),
		new Int32Array([ -1, 0, -1, -1 ]), 
		new Int32Array([ 1, 1, 0, 1 ]), 
		new Int32Array([ 1, 1, 0, -1 ]),
		new Int32Array([ 1, -1, 0, 1 ]), 
		new Int32Array([ 1, -1, 0, -1 ]), 
		new Int32Array([ -1, 1, 0, 1 ]),
		new Int32Array([ -1, 1, 0, -1 ]), 
		new Int32Array([ -1, -1, 0, 1 ]), 
		new Int32Array([ -1, -1, 0, -1 ]),
		new Int32Array([ 1, 1, 1, 0 ]), 
		new Int32Array([ 1, 1, -1, 0 ]), 
		new Int32Array([ 1, -1, 1, 0 ]), 
		new Int32Array([ 1, -1, -1, 0 ]),
		new Int32Array([ -1, 1, 1, 0 ]), 
		new Int32Array([ -1, 1, -1, 0 ]), 
		new Int32Array([ -1, -1, 1, 0 ]),
		new Int32Array([ -1, -1, -1, 0 ]) 
	];

	/**
	 * Permutation table
	 */
var	_p = new Int32Array([
		151, 160, 137, 91, 90, 15, 131, 13, 201,
		95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37,
		240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62,
		94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56,
		87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139,
		48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
		230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
		63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200,
		196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3,
		64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255,
		82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
		223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153,
		101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79,
		113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242,
		193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249,
		14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204,
		176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222,
		114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180 
	]);

	/**
	 * To remove the need for index wrapping, double the permutation table
	 * length
	 */
var	_perm = (function(){
		var _per = new Int32Array(0x200);
		for (var i = 0; i < 0x200; i++) {
			_per[i] = _p[i & 0xff];
		}
		return _per;
	})();


	/**
	 * A lookup table to traverse the simplex around a given point in 4D.
	 * Details can be found where this table is used, in the 4D noise method.
	 */
var	_simplex = [ 
		new Int32Array([ 0, 1, 2, 3 ]), new Int32Array([ 0, 1, 3, 2 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 2, 3, 1 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 1, 2, 3, 0 ]), new Int32Array([ 0, 2, 1, 3 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 3, 1, 2 ]), new Int32Array([ 0, 3, 2, 1 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 1, 3, 2, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 1, 2, 0, 3 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 1, 3, 0, 2 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 2, 3, 0, 1 ]), new Int32Array([ 2, 3, 1, 0 ]), new Int32Array([ 1, 0, 2, 3 ]), new Int32Array([ 1, 0, 3, 2 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 2, 0, 3, 1 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 2, 1, 3, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 2, 0, 1, 3 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 3, 0, 1, 2 ]), new Int32Array([ 3, 0, 2, 1 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 3, 1, 2, 0 ]), new Int32Array([ 2, 1, 0, 3 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 0, 0, 0, 0 ]), new Int32Array([ 3, 1, 0, 2 ]), new Int32Array([ 0, 0, 0, 0 ]),
		new Int32Array([ 3, 2, 0, 1 ]), new Int32Array([ 3, 2, 1, 0 ]) 
	];

	/**
	* Computes dot product in 2D.
	* @param g 2-vector (grid offset)
	* @param {Number} x
	* @param {Number} y
	* @param {Number} z
	* @param {Number} w
	* @return {Number} dot product
	* @api private
	*/
var	_dot = function(g, x, y, z, w) {
		var n = g[0] * x + g[1] * y;
		if(z){
			n += g[2] * z;
			if(w){
				n += g[3] * w;
			}
		}
		return n;
	};

	/**
	*This method is a *lot* faster than using (int)Math.floor(x).
	* 
	* @param {Number} x value to be floored
	* @return {Number}
	* @api private
	*/
var	_fastfloor = function(x) {
		return (x >= 0) ? Math.floor(x) : Math.floor(x - 1);
	};


	/**
	 * @module toxi/math/noise/simplexNoise
 	 * @api public
	 */
var	SimplexNoise = { //SimplexNoise only consists of static methods
	/**
	* Computes 4D Simplex Noise.
	* 
	* @param {Number} [x] coordinate
	* @param {Number} [y]  coordinate
	* @param {Number} [z] coordinate
	* @param {Number} [w] coordinate
	* @return {Number} noise value in range -1 ... +1
	*/
	noise: function(x, y, z, w) {
		//Noise contributions from five corners, we may use as few as 3 of them (depending on arguments)
		var numArgs = arguments.length,
			n0 = 0,
			n1 = 0,
			n2 = 0,
			n3 = 0,
			n4 = 0;
			//skew the input space to determin which simplex cell we're in
		var	s = (function(){
				switch(numArgs){
					case 2:
					return (x + y) * _F2; //Hairy factor for 2d
					case 3:
					return (x + y + z) * _F3; //Very nice and simple skew factor for 3d
					case 4:
					return (x + y + z + w) * _F4; //factor for 4d skewing
					default:
					throw new Error("Wrong arguments supplied to SimplexNoise.noise()");
				}
			})(),
			i = _fastfloor(x + s),
			j = _fastfloor(y + s),
			k = (z !== undefined) ? _fastfloor(z + s) : undefined,
			l = (w !== undefined) ? _fastfloor(w + s) : undefined;
			//unskew
		var	t = (function(){
				switch(numArgs){
					case 2:
					return (i + j) * _G2;
					case 3:
					return (i + j + k) * _G3;
					case 4: 
					return (i + j + k + l) * _G4;
				}
			})(),
			x0 = x - (i - t), //the x,y,z,w distance from the cell origin
			y0 = y - (j - t),
			z0 = (z !== undefined) ? z - (k - t) : undefined,
			w0 = (w !== undefined) ? w - (l - t) : undefined;

			//Determine which simplex we are in
			if(numArgs == 2){
				//for the 2d case, the simplex shape is an equilateral triangle.	
				return (function(){
					var i1, j1, //offsets for scond (middle) corner of simplex (i,j)
						x1, y1,
						x2, y2,
						ii,
						jj,
						t0,
						gi0,
						gi1,
						gi2,
						t2;
					if(x0 > y0){ // lower triangle, XY order
						i1 = 1;
						j1 = 0;
					} else { //upper triangle, YX order
						i1 = 0;
						j1 = 1;
					}

					// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
					// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
					// c = (3-sqrt(3))/6
					x1 = x0 - i1 + _G2; // Offsets for middle corner in (x,y) unskewed
					y1 = y0 - j1 + _G2;
					x2 = x0 + _G22; // Offsets for last corner in (x,y) unskewed
					y2 = y0 + _G22;
					// Work out the hashed gradient indices of the three simplex corners
					ii = i & 0xff;
					jj = j & 0xff;
					// Calculate the contribution from the three corners
					t0 = 0.5 - x0 * x0 - y0 * y0;

					if (t0 > 0) {
						t0 *= t0;
						gi0 = _perm[ii + _perm[jj]] % 12;
						n0 = t0 * t0 * _dot(_grad3[gi0], x0, y0); // (x,y) of grad3 used for
						// 2D gradient
					}
					t1 = 0.5 - x1 * x1 - y1 * y1;
					if (t1 > 0) {
						t1 *= t1;
						gi1 = _perm[ii + i1 + _perm[jj + j1]] % 12;
						n1 = t1 * t1 * _dot(_grad3[gi1], x1, y1);
					}
					t2 = 0.5 - x2 * x2 - y2 * y2;
					if (t2 > 0) {
						t2 *= t2;
						gi2 = _perm[ii + 1 + _perm[jj + 1]] % 12;
						n2 = t2 * t2 * _dot(_grad3[gi2], x2, y2);
					}
					// Add contributions from each corner to get the final noise value.
					// The result is scaled to return values in the interval [-1,1].
					return 70.0 * (n0 + n1 + n2);
				})();
			} else if(numArgs == 3){
				//for the 3d case, the simplex shape is a slightly irregular tetrahedron
				return (function(){
					var i1, j1, k1, // Offsets for second corner of simplex in (i,j,k)
						// coords
						i2, j2, k2, // Offsets for third corner of simplex in (i,j,k) coords
						x1,y1,z1,
						x2,y2,z2,
						x3,y3,z3,
						ii,jj,kk,
						t0,
						gi0,
						t1,
						gi1,
						t2,
						gi2,
						t3,
						gi3;
					if (x0 >= y0) {
						if (y0 >= z0) {
							i1 = 1;
							j1 = 0;
							k1 = 0;
							i2 = 1;
							j2 = 1;
							k2 = 0;
						} // X Y Z order
						else if (x0 >= z0) {
							i1 = 1;
							j1 = 0;
							k1 = 0;
							i2 = 1;
							j2 = 0;
							k2 = 1;
						} // X Z Y order
						else {
							i1 = 0;
							j1 = 0;
							k1 = 1;
							i2 = 1;
							j2 = 0;
							k2 = 1;
						} // Z X Y order
					} else { // x0<y0
						if (y0 < z0) {
							i1 = 0;
							j1 = 0;
							k1 = 1;
							i2 = 0;
							j2 = 1;
							k2 = 1;
						} // Z Y X order
						else if (x0 < z0) {
							i1 = 0;
							j1 = 1;
							k1 = 0;
							i2 = 0;
							j2 = 1;
							k2 = 1;
						} // Y Z X order
						else {
							i1 = 0;
							j1 = 1;
							k1 = 0;
							i2 = 1;
							j2 = 1;
							k2 = 0;
						} // Y X Z order
					}
					// A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
					// a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z),
					// and
					// a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z),
					// where
					// c = 1/6.
					x1 = x0 - i1 + _G3; // Offsets for second corner in (x,y,z) coords
					y1 = y0 - j1 + _G3;
					z1 = z0 - k1 + _G3;

					x2 = x0 - i2 + _F3; // Offsets for third corner in (x,y,z)
					y2 = y0 - j2 + _F3;
					z2 = z0 - k2 + _F3;

					x3 = x0 - 0.5; // Offsets for last corner in (x,y,z)
					y3 = y0 - 0.5;
					z3 = z0 - 0.5;
					// Work out the hashed gradient indices of the four simplex corners
					ii = i & 0xff;
					jj = j & 0xff;
					kk = k & 0xff;

					// Calculate the contribution from the four corners
					t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
					if (t0 > 0) {
						t0 *= t0;
						gi0 = _perm[ii + _perm[jj + _perm[kk]]] % 12;
						n0 = t0 * t0 * _dot(_grad3[gi0], x0, y0, z0);
					}
					t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
					if (t1 > 0) {
						t1 *= t1;
						gi1 = _perm[ii + i1 + _perm[jj + j1 + _perm[kk + k1]]] % 12;
						n1 = t1 * t1 * _dot(_grad3[gi1], x1, y1, z1);
					}
					t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
					if (t2 > 0) {
						t2 *= t2;
						gi2 = _perm[ii + i2 + _perm[jj + j2 + _perm[kk + k2]]] % 12;
						n2 = t2 * t2 * _dot(_grad3[gi2], x2, y2, z2);
					}
					t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
					if (t3 > 0) {
						t3 *= t3;
						gi3 = _perm[ii + 1 + _perm[jj + 1 + _perm[kk + 1]]] % 12;
						n3 = t3 * t3 * _dot(_grad3[gi3], x3, y3, z3);
					}
					// Add contributions from each corner to get the final noise value.
					// The result is scaled to stay just inside [-1,1]
					return 32.0 * (n0 + n1 + n2 + n3);
				})();
			} else {
				// For the 4D case, the simplex is a 4D shape I won't even try to
				// describe.
				// To find out which of the 24 possible simplices we're in, we need to
				// determine the magnitude ordering of x0, y0, z0 and w0.
				// The method below is a good way of finding the ordering of x,y,z,w and
				// then find the correct traversal order for the simplex were in.
				// First, six pair-wise comparisons are performed between each possible
				// pair of the four coordinates, and the results are used to add up
				// binary bits for an integer index.
				return (function(){
					var i1,j1,k1,l1, // The integer offsets for the second simplex corner
						i2,j2,k2,l2, // The integer offsets for the third simplex corner
						i3,j3,k3,l3, // The integer offsets for the fourth simplex corner
						// simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some
						// order. Many values of c will never occur, since e.g. x>y>z>w makes
						// x<z, y<w and x<w impossible. Only the 24 indices which have non-zero
						// entries make any sense. We use a thresholding to set the coordinates
						// in turn from the largest magnitude. The number 3 in the "simplex"
						// array is at the position of the largest coordinate.
						sc = _simplex[
							(function(){
								var c = 0;
								if (x0 > y0) {
									c = 0x20;
								}
								if (x0 > z0) {
									c |= 0x10;
								}
								if (y0 > z0) {
									c |= 0x08;
								}
								if (x0 > w0) {
									c |= 0x04;
								}
								if (y0 > w0) {
									c |= 0x02;
								}
								if (z0 > w0) {
									c |= 0x01;
								}
								return c;
							})()
						],
						x1, y1, z1, w1,
						x2, y2, z2, w2,
						x3, y3, z3, w3,
						x4, y4, z4, w4,
						ii, jj, kk, ll,
						t0,
						gi0,
						t1,
						gi1,
						t2,
						gi2,
						t3,
						gi3,
						t4,
						gi4;

						
						i1 = sc[0] >= 3 ? 1 : 0;
						j1 = sc[1] >= 3 ? 1 : 0;
						k1 = sc[2] >= 3 ? 1 : 0;
						l1 = sc[3] >= 3 ? 1 : 0;
						// The number 2 in the "simplex" array is at the second largest
						// coordinate.
						i2 = sc[0] >= 2 ? 1 : 0;
						j2 = sc[1] >= 2 ? 1 : 0;
						k2 = sc[2] >= 2 ? 1 : 0;
						l2 = sc[3] >= 2 ? 1 : 0;
						// The number 1 in the "simplex" array is at the second smallest
						// coordinate.
						i3 = sc[0] >= 1 ? 1 : 0;
						j3 = sc[1] >= 1 ? 1 : 0;
						k3 = sc[2] >= 1 ? 1 : 0;
						l3 = sc[3] >= 1 ? 1 : 0;

						// The fifth corner has all coordinate offsets = 1, so no need to look
						// that up.
						x1 = x0 - i1 + _G4; // Offsets for second corner in (x,y,z,w)
						y1 = y0 - j1 + _G4;
						z1 = z0 - k1 + _G4;
						w1 = w0 - l1 + _G4;

						x2 = x0 - i2 + _G42; // Offsets for third corner in (x,y,z,w)
						y2 = y0 - j2 + _G42;
						z2 = z0 - k2 + _G42;
						w2 = w0 - l2 + _G42;

						x3 = x0 - i3 + _G43; // Offsets for fourth corner in (x,y,z,w)
						y3 = y0 - j3 + _G43;
						z3 = z0 - k3 + _G43;
						w3 = w0 - l3 + _G43;

						x4 = x0 + _G44; // Offsets for last corner in (x,y,z,w)
						y4 = y0 + _G44;
						z4 = z0 + _G44;
						w4 = w0 + _G44;

						// Work out the hashed gradient indices of the five simplex corners
						ii = i & 0xff;
						jj = j & 0xff;
						kk = k & 0xff;
						ll = l & 0xff;

						// Calculate the contribution from the five corners
						t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
						if (t0 > 0) {
							t0 *= t0;
							gi0 = _perm[ii + _perm[jj + _perm[kk + _perm[ll]]]] % 32;
							n0 = t0 * t0 * _dot(_grad4[gi0], x0, y0, z0, w0);
						}
						t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
						if (t1 > 0) {
							t1 *= t1;
							gi1 = _perm[ii + i1 + _perm[jj + j1 + _perm[kk + k1 + _perm[ll + l1]]]] % 32;
							n1 = t1 * t1 * _dot(_grad4[gi1], x1, y1, z1, w1);
						}
						t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
						if (t2 > 0) {
							t2 *= t2;
							gi2 = _perm[ii + i2 + _perm[jj + j2 + _perm[kk + k2 + _perm[ll + l2]]]] % 32;
							n2 = t2 * t2 * _dot(_grad4[gi2], x2, y2, z2, w2);
						}
						t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
						if (t3 > 0) {
							t3 *= t3;
							gi3 = _perm[ii + i3 + _perm[jj + j3 + _perm[kk + k3 + _perm[ll + l3]]]] % 32;
							n3 = t3 * t3 * _dot(_grad4[gi3], x3, y3, z3, w3);
						}
						t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
						if (t4 > 0) {
							t4 *= t4;
							gi4 = _perm[ii + 1 + _perm[jj + 1 + _perm[kk + 1 + _perm[ll + 1]]]] % 32;
							n4 = t4 * t4 * _dot(_grad4[gi4], x4, y4, z4, w4);
						}

						// Sum up and scale the result to cover the range [-1,1]
						return 27.0 * (n0 + n1 + n2 + n3 + n4);
				})();
				
			}

	}
};

module.exports = SimplexNoise;


});
