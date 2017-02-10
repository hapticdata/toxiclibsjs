define(function(require, exports, module){


    /**
     * Constrain to an AABB box
     * @param {AABB} box
     * @param {Number} smooth
     * @constructor
     */
    var SoftBoxConstraint = function(box, smooth){
        this.box = box;
        this.smooth = smooth;
        this.axes = [];
    };


    /**
     * add an Axis to constrain
     * @param {Vec3D.Axis} a
     * @returns {SoftBoxConstraint}
     */
    SoftBoxConstraint.prototype.addAxis = function(a){
        this.axes.push(a);
        return this;
    };

    SoftBoxConstraint.prototype.applyConstraint = function(p){
        var a, val;
        if(p.isInAABB(this.box)){
            for(var i=0; i<this.axes.length; i++){
                a = this.axes[i];
                val = p.getComponent(a);
                p.setComponent(a, val + (this.box.getComponent(a) - val) * this.smooth);
            }
        }
    };

    module.exports = SoftBoxConstraint;

});
