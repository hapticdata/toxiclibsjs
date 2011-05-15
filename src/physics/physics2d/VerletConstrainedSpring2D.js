toxi.physics2d.VerletConstrainedSpring2D = function(particleA, particleB, len, str, limit){
	toxi.physics2d.VerletSpring2D.call(this,particleA,particleB,len,str);
	this.limit = (limit === undefined) ? Number.MAX_VALUE : limit;
};

toxi.extend(toxi.physics2d.VerletConstrainedSpring2D,toxi.physics2d.VerletSpring2D);


toxi.physics2d.VerletConstrainedSpring2D.update = function(applyConstraints){
	var delta = this.b.sub(this.a);
    // add minute offset to avoid div-by-zero errors
    var dist = delta.magnitude() + toxi.physics2d.VerletSpring2D.EPS;
    var normDistStrength = (dist - this.restLength) / (dist * (this.a.invWeight + this.b.invWeight))* this.strength;
    if (!this.a.isLocked && !this.isALocked) {
        this.a.addSelf(delta.scale(normDistStrength * this.a.invWeight).limit(this.limit));
        if (applyConstraints) {
            this.a.applyConstraints();
        }
    }
    if (!this.b.isLocked && !this.isBLocked) {
        this.b.subSelf(delta.scale(normDistStrength * this.b.invWeight).limit(this.limit));
        if (applyConstraints) {
            this.b.applyConstraints();
        }
    }
};