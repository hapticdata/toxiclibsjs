define(["require", "exports", "module", "../../geom/Vec3D", '../../geom/Ray3D', '../../geom/AABB'], function(require, exports, module) {

    var AABB = require('../../geom/AABB'),
        Vec3D = require('../../geom/Vec3D'),
        Ray3D = require('../../geom/Ray3D');

    var BoxConstraint = function (boxOrMinVec, maxVec) {
        if (typeof maxVec === "undefined") {
            this._box = box.copy();
        } else {
            this._box = AABB.fromMinMax(min, max);
        }
        this._intersectRay = new Ray3D(box, new Vec3D());
        this.__restitution = 1;
    };

    BoxConstraint.prototype = {

        applyConstraint: function (p) {
            if (p.isInAABB(this._box)) {
                var dir = p.getVelocity();
                var prev = p.getPreviousPosition();
                if (prev.isInAABB(this._box)) {
                    dir.invert();
                }
                this._intersectRay.set(prev);
                this._intersectRay.setDirection(dir);
                var isec = this._box.intersectsRay(this._intersectRay, 0, Number.MAX_VALUE);
                if (isec !== null && typeof isec !== "undefined") {
                    isec.addSelf(this._box.getNormalForPoint(isec).scaleSelf(0.01));
                    p.setPreviousPosition(isec);
                    p.set(isec.sub(dir.scaleSelf(this.__restitution)));
                }
            }
        },

        getBox: function () {
            return this._box.copy();
        },

        getRestitution: function () {
            return this.__restitution;
        },

        setBox: function (box) {
            this._box = box.copy();
            this._intersectRay.set(this._box);
        },

        setRestitution: function (restitution) {
            this.__restitution = restitution;
        }

    };

    module.exports = BoxConstraint;
});
