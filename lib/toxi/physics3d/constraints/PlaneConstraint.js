define(function( require, exports, module){

    /**
     * @param axis
     *            1st axis to lock
     * @param axis2
     *            2d axis to lock
     * @param constraint
     *            point on the desired constraint plane
     */
    var PlaneConstraint = function(axis1, axis2, constraint){
        this.axis1 = axis1;
        this.axis2 = axis2;
        this.constraint = constraint;
    };


    PlaneConstraint.prototype.applyConstraint = function(p){
        p.setComponent(this.axis1, this.constraint.getComponent(this.axis1));
        p.setComponent(this.axis2, this.constraint.getComponent(this.axis2));
    };


    module.exports = PlaneConstraint;
});
