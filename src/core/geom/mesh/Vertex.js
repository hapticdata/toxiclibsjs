toxi.Vertex = function(v,id) {
        toxi.Vec3D.apply(this,[v]);
        this.id = id;
        this.normal = new toxi.Vec3D();
};
toxi.extend(toxi.Vertex,toxi.Vec3D);

toxi.Vertex.prototype.addFaceNormal = function(n) {
    this.normal.addSelf(n);
};

toxi.Vertex.prototype.clearNormal = function() {
    this.normal.clear();
};

toxi.Vertex.prototype.computeNormal = function() {
    this.normal.normalize();
};

toxi.Vertex.prototype.toString = function() {
    return this.id + ": p: " + this.parent.toString.call(this) + " n:" + this.normal.toString();
};

