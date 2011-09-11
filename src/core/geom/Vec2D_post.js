//this file is for the Vec2D methods that require Vec3D,
//so that they can be loaded after the Vec3D definition
toxi.Vec2D.prototype.bisect = function(b) {
    var diff = this.sub(b);
    var sum = this.add(b);
    var dot = diff.dot(sum);
    return new toxi.Vec3D(diff.x, diff.y, -dot / 2);
};

toxi.Vec2D.prototype.to3DXY = function() {
    return new toxi.Vec3D(this.x, this.y, 0);
};

toxi.Vec2D.prototype.to3DXZ = function() {
    return new toxi.Vec3D(this.x, 0, this.y);
};

toxi.Vec2D.prototype.to3DYZ = function() {
    return new toxi.Vec3D(0, this.x, this.y);
};
