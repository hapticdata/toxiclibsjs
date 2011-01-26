function Vertex(v,id) {
        this.parent.init.call(this,v);
        this.id = id;
        this.normal = new Vec3D();
}
Vertex.prototype = new Vec3D();
Vertex.constructor = Vertex;
Vertex.prototype.parent = Vec3D.prototype;

Vertex.prototype.addFaceNormal = function(n) {
    this.normal.addSelf(n);
}

Vertex.prototype.clearNormal = function() {
    this.normal.clear();
}

Vertex.prototype.computeNormal = function() {
    this.normal.normalize();
}

Vertex.prototype.toString = function() {
    return this.id + ": p: " + this.parent.toString.call(this) + " n:" + this.normal.toString();
}

