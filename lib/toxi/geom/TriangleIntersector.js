define([
	"../math/mathUtils",
	"./Triangle3D",
	"./Vec3D",
	"./IsectData3D"
], function(mathUtils, Triangle3D, Vec3D, IsectData3D) {

	/**
	 * @param {Triangle3D} [t]
	 */
	var TriangleIntersector = function(t){
		this.triangle = t || new Triangle3D();
		this.isectData = new IsectData3D();
	};

	TriangleIntersector.prototype = {
		getIntersectionData: function(){
			return this.isectData;
		},
		getTriangle: function(){
			return this.triangle;
		},
		/**
		 * @param {Ray3D} ray
		 * @returns {Boolean}
		 */
		intersectsRay: function(ray){
			this.isectData.isIntersection = false;
			var n = this.triangle.computeNormal(),
				dotprod = n.dot(ray.dir);
			if(dotprod < 0){
				var rt = ray.sub(this.triangle.a),
					t = -(n.x * rt.x + n.y * rt.y + n.z * rt.z) / (n.x * ray.dir.x + n.y * ray.dir.y + n.z * ray.dir.z);
				if(t >= mathUtils.EPS){
					var pos = ray.getPointAtDistance(t);
					//check if pos is inside triangle
					if(this.triangle.containsPoint(pos)){
						this.isectData.isIntersection = true;
						this.isectData.pos = pos;
						this.isectData.normal = n;
						this.isectData.dist = t;
						this.isectData.dir = this.isectData.pos.sub(ray).normalize();
					}
				}
			}
			return this.isectData.isIntersection;
		},
		/**
		 * @param {Triangle3D} tri
		 * @returns {TriangleIntersector}
		 */
		setTriangle: function(tri){
			this.triangle = tri;
			return this;
		}
	};

	return TriangleIntersector;
});
