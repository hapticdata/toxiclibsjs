toxi.Vertex = function(v,id) {
        this.parent.init.call(this,v);
        this.id = id;
        this.normal = new toxi.Vec3D();
}
toxi.Vertex.prototype = new toxi.Vec3D();
toxi.Vertex.constructor = toxi.Vertex;
toxi.Vertex.prototype.parent = toxi.Vec3D.prototype;

toxi.Vertex.prototype.addFaceNormal = function(n) {
    this.normal.addSelf(n);
}

toxi.Vertex.prototype.clearNormal = function() {
    this.normal.clear();
}

toxi.Vertex.prototype.computeNormal = function() {
    this.normal.normalize();
}

toxi.Vertex.prototype.toString = function() {
    return this.id + ": p: " + this.parent.toString.call(this) + " n:" + this.normal.toString();
}

