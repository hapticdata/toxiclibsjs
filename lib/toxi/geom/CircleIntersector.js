define(["require", "exports", "module"], function(require, exports, module) {
/**
 @class CircleIntersector
 @member toxi
 */
var CircleIntersector = function(circle) {
    this.circle = circle;
    this.isec = undefined;
};

CircleIntersector.prototype = {

    getIntersectionData: function() {
        return this.isec;
    },

    intersectsRay: function(ray) {
        this.isec.clear();
        var q = circle.sub(ray),
        distSquared = q.magSquared(),
        v = q.dot(ray.getDirection()),
        r = circle.getRadius(),
        d = r * r - (distSquared - v * v);
        if (d >= 0.0) {
            this.isec.isIntersection = true;
            this.isec.dist = v -Math.sqrt(d);
            this.isec.pos = ray.getPointAtDistance(isec.dist);
            this.isec.normal = this.isec.pos.sub(this.circle).normalize();
        }
        return this.isec.isIntersection;
    }
};

module.exports = CircleIntersector;
});
