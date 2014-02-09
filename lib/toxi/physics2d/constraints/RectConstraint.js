define(["require", "exports", "module", "../../geom/Vec2D","../../internals/has","../../geom/Ray2D","../../geom/Rect"], function(require, exports, module) {

    var Vec2D = require('../../geom/Vec2D'),
        has = require('../../internals/has'),
        Ray2D = require('../../geom/Ray2D'),
        Rect = require('../../geom/Rect');

    var	RectConstraint = function(a,b){
        if(arguments.length == 1){
            if(typeof a.copy === 'function' ){
                //if passed in as a toxi.geom.Rect
                this.rect = a.copy();
            } else if( has.XYWidthHeight(a) ){
                //if passed in as { x: y: width: height: }
                this.rect = new Rect(a);
            }
        } else if(arguments.length > 1){
            this.rect = new Rect(a,b);
        }
        if( !this.rect ){
            throw new Error('Received Incorrect arguments');
        }
        this.intersectRay = new Ray2D(this.rect.getCentroid(), new Vec2D());
    };

    RectConstraint.prototype = {
        applyConstraint: function(p){
            if(this.rect.containsPoint(p)){
                p.set(this.rect.intersectsRay(this.intersectRay.setDirection(this.intersectRay.sub(p)),0,Number.MAX_VALUE));
            }
        },

        getBox: function(){
            return this.rect.copy();
        },

        setBox: function(rect){
            this.rect = rect.copy();
            this.intersectRay.set(this.rect.getCentroid());
        }
    };

    module.exports = RectConstraint;
});
