define(["require", "exports", "module","../../geom/Vec2D"], function(require, exports, module) {

    var Vec2D = require('../../geom/Vec2D');

    //either Vec2D + angle
    /**
     * @param {Vec2D | Number} vector | angle
     * @param {Number} [theta]
     */
    var	AngularConstraint = function(theta_p,theta){
        if(arguments.length > 1){
            this.theta = theta;
            this.rootPos = new Vec2D(theta_p);
        } else {
            this.rootPos = new Vec2D();
            this.theta = theta_p;
        }
        //due to lack-of int/float types, no support of theta in degrees
    };


    AngularConstraint.prototype.applyConstraint = function(p){
        var delta = p.sub(this.rootPos);
        var heading = Math.floor(delta.heading() / this.theta) * this.theta;
        p.set(this.rootPos.add(Vec2D.fromTheta(heading).scaleSelf(delta.magnitude())));
    };

    module.exports = AngularConstraint;
});
