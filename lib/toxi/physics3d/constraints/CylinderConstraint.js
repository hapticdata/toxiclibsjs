define(["require", "exports", "module", '../../geom/Vec3D', '../../geom/AxisAlignedCylinder'], function(require, exports, module) {

    var Vec3D = require('../../geom/Vec3D'),
        AxisAlignedCylinder = require('../../geom/AxisAlignedCylinder');

    var CylinderConstraint = function (cylinder) {
        this._centroid = new Vec3D();
        this.setCylinder( cylinder );
    };

    CylinderConstraint.prototype = {

        apply: function (p) {
            if (this._cylinder.containsPoint(p)) {
                this._centroid.setComponent(this._axis, p.getComponent(this._axis));
                p.set(this._centroid.add(p.sub(this._centroid)
                    .normalizeTo(this._cylinder.getRadius())));
            }
        },

        getCylinder: function() {
            return this._cylinder;
        },

        setCylinder: function (cylinder) {
            this._cylinder = cylinder;
            this._centroid.set(cylinder.getPosition());
            this._axis = cylinder.getMajorAxis();
        }

    };

    module.exports = CylinderConstraint;
});
