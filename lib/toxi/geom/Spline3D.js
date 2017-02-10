define([
    './Vec3D',
    '../internals/is',
    './BernsteinPolynomial',
    './LineStrip3D'
],function(Vec3D, is, BernsteinPolynomial, LineStrip3D ){

    /**
     * @class
     * @member toxi
     * @param {Vec3D[]} points array of Vec3D's
     * @param {BernsteinPolynomial} [bernsteinPoly]
     */
    var	Spline3D = function(points, bernsteinPoly, tightness){
        if( arguments.length === 1 && !is.Array( points ) && is.Object(points) ){
            //if its an options object
            bernsteinPoly = bernsteinPoly || points.bernsteinPoly;
            tightness = tightness || points.tightness;
            points = points.points;
        }
        var i = 0, l;
        this.pointList = [];
        if( typeof tightness !== 'number' ){
            tightness = Spline3D.DEFAULT_TIGHTNESS;
        }
        this.setTightness(tightness);
        //this may be undefined
        this.bernstein = bernsteinPoly;
        if( points !== undefined ){
            for(i = 0, l = points.length; i<l; i++){
                this.add( points[i].copy() );
            }
        }
        this.coeffA = [];
        this.delta = [];
        this.bi = [];
        for (i = 0; i < this.numP; i++) {
            this.coeffA[i] = new Vec3D();
            this.delta[i] = new Vec3D();
            this.bi[i] = 0;
        }
        this.bi = [];
    };


    Spline3D.prototype = {
        add: function(p){
            this.pointList.push(p.copy());
            this.numP = this.pointList.length;
            return this;
        },


        computeVertices: function(res){
            this.updateCoefficients();
            if( res < 1 ){
                res = 1;
            }
            res++;
            if (this.bernstein === undefined || this.bernstein.resolution != res) {
                this.bernstein = new BernsteinPolynomial(res);
            }
            var bst = this.bernstein;
            this.vertices = [];
            this.findCPoints();
            var deltaP = new Vec3D();
            var deltaQ = new Vec3D();
            res--;
            for (var i = 0; i < this.numP - 1; i++) {
                var p = this.points[i];
                var q = this.points[i + 1];
                deltaP.set(this.delta[i]).addSelf(p);
                deltaQ.set(q).subSelf(this.delta[i + 1]);
                for (var k = 0; k < res; k++) {
                    var x = p.x * bst.b0[k] + deltaP.x * bst.b1[k] +
                        deltaQ.x * bst.b2[k] +
                        q.x * bst.b3[k];
                    var y = p.y * bst.b0[k] + deltaP.y * bst.b1[k] +
                        deltaQ.y * bst.b2[k] +
                        q.y * bst.b3[k];
                    var z = p.z * bst.b0[k] + deltaP.z * bst.b1[k] +
                        deltaQ.z * bst.b2[k] + q.z * bst.b3[k];
                    this.vertices.push(new Vec3D(x, y, z));
                }
            }
            this.vertices.push(this.points[this.points.length-1].copy());
            return this.vertices;
        },

        findCPoints: function(){
            this.bi[1] = -0.25;
            var i, p0, p2, d0;
            p0 = this.pointList[0];
            p2 = this.pointList[2];
            d0 = this.delta[0];
            this.coeffA[1].set(
                (p2.x - p0.x - d0.x) * this.tightness, //x
                (p2.y - p0.y - d0.y) * this.tightness, //y
                (p2.z - p0.z - d0.z) * this.tightness //z
            );
            for (i = 2; i < this.numP - 1; i++) {
                this.bi[i] = -1 / (this.invTightness + this.bi[i - 1]);
                this.coeffA[i].set(
                    -(this.points[i + 1].x - this.points[i - 1].x - this.coeffA[i - 1].x) * this.bi[i],
                    -(this.points[i + 1].y - this.points[i - 1].y - this.coeffA[i - 1].y) * this.bi[i],
                    -(this.points[i + 1].z - this.points[i - 1].z - this.coeffA[i - 1].z) * this.bi[i]
                );
            }
            for (i = this.numP - 2; i > 0; i--) {
                this.delta[i].set(
                    this.coeffA[i].x + this.delta[i + 1].x * this.bi[i],
                    this.coeffA[i].y + this.delta[i + 1].y * this.bi[i],
                    this.coeffA[i].z + this.delta[i + 1].z * this.bi[i]
                );
            }
        },

        getDecimatedVertices: function(step,doAddFinalVertex){
            if(doAddFinalVertex === undefined)doAddFinalVertex = true;
            if(this.vertices === undefined || this.vertices.length < 2){
                this.computeVertices(Spline3D.DEFAULT_RES);
            }
            var arcLen = this.getEstimatedArcLength();
            var uniform = [];
            var delta = step / arcLen;
            var currIdx = 0;
            for(var t =0; t<1.0; t+= delta){
                var currT = t * arcLen;
                while(currT >= this.arcLenIndex[currIdx]){
                    currIdx++;
                }
                var p = this.vertices[currIdx - 1];
                var q = this.vertices[currIdx];
                var frac = ((currT - this.arcLenIndex[currIdx - 1]) / (this.arcLenIndex[currIdx] - this.arcLenIndex[currIdx - 1]));

                var i = p.interpolateTo(q,frac);
                uniform.push(i);
            }
            if(doAddFinalVertex){
                uniform.push(this.vertices[this.vertices.length-1]);
            }
            return uniform;
        },


        getEstimatedArcLength: function(){
            var len;
            var arcLen = 0;

            if(this.arcLenIndex === undefined || (this.arcLenIndex !== undefined && this.arcLenIndex.length != this.vertices.length)){
                this.arcLenIndex = [0];
                len = this.vertices.length;
            }
            else {
                len = this.arcLenIndex.length;
            }

            for(var i=1;i<len;i++){
                var p = this.vertices[i-1];
                var q = this.vertices[i];
                arcLen += p.distanceTo(q);
                this.arcLenIndex[i] = arcLen;
            }

            return arcLen;
        },


        getNumPoints: function(){
            return this.numP;
        },

        getPointList: function(){
            return this.pointList;
        },

        getTightness: function(){
            return this.tightness;
        },

        setPointList: function(plist){
            this.pointList =plist.slice(0);
            return this;
        },

        setTightness: function(tight){
            this.tightness = tight;
            this.invTightness = 1 / this.tightness;
            return this;
        },

        /**
         * <p>
         * Computes all curve vertices based on the resolution/number of
         * subdivisions requested. The higher, the more vertices are computed:
         * </p>
         * <p>
         * <strong>(number of control points - 1) * resolution + 1</strong>
         * </p>
         * <p>
         * Since version 0014 the automatic placement of the curve handles can also
         * be manipulated via the {@linkplain #setTightness(float)} method.
         * </p>
         *
         * @param res
         *            the number of vertices to be computed per segment between
         *            original control points (incl. control point always at the
         *            start of each segment)
         * @return LineStrip3D, list of Vec3D vertices along the curve
         */
        toLineStrip3D: function(res){

            this.updateCoefficients();
            if(!res || res < 1 ){
                res = 1;
            }

            res++;

            if(!this.bernstein || this.bernstein.resolution !== res){
                this.bernstein = new BernsteinPolynomial(res);
            }

            var strip = new LineStrip3D();
            this.findCPoints();

            var deltaP = new Vec3D();
            var deltaQ = new Vec3D();
            res--;

            var p, q, k, x, y, z;

            for(var i=0, numP = this.getNumPoints(); i< numP -1; i++){
                p = this.points[i];
                q = this.points[i+1];

                deltaP.set(this.delta[i]).addSelf(p);
                deltaQ.set(q).subSelf(this.delta[i+1]);

                for(k=0; k < res; k++){

                    x = p.x * this.bernstein.b0[k] + deltaP.x * this.bernstein.b1[k]
                        + deltaQ.x * this.bernstein.b2[k] + q.x * this.bernstein.b3[k];

                    y = p.y * this.bernstein.b0[k] + deltaP.y * this.bernstein.b1[k]
                        + deltaQ.y * this.bernstein.b2[k] + q.y * this.bernstein.b3[k];

                    z = p.z * this.bernstein.b0[k] + deltaP.z * this.bernstein.b1[k]
                        + deltaQ.z * this.bernstein.b2[k] + q.z * this.bernstein.b3[k];

                    strip.add(new Vec3D(x, y, z));
                }
            }
            strip.add(this.points[this.points.length-1].copy());
            return strip;
        },

        updateCoefficients: function(){
            this.numP = this.pointList.length;
            if(this.points === undefined || (this.points !== undefined && this.points.length != this.numP)) {
                this.coeffA = [];
                this.delta = [];
                this.bi = [];
                for(var i=0;i<this.numP; i++){
                    this.coeffA[i] = new Vec3D();
                    this.delta[i] = new Vec3D();
                }
                this.setTightness(this.tightness);
            }
            this.points = this.pointList.slice(0);
        }

    };

    Spline3D.DEFAULT_TIGHTNESS = 0.25;
    Spline3D.DEFAULT_RES = 16;

    return Spline3D;
});
