/*global describe, it*/
var toxi = require('./index'),
	assert = require('assert');


describe('toxi.geom.Ellipse', function(){
	describe('Constructor', function(){
		describe('no params', function(){
			var ellipse = new toxi.geom.Ellipse();
			it('should be an ellipse', function(){
				assert.equal( ellipse.x, 0 );
				assert.equal( ellipse.y, 0 );
				assert.equal( typeof ellipse.getRadii, 'function' );
			});
		});
	});
    describe('#containsPoint', function(){
        describe('tall ellipse', function(){
             var ellipse = new toxi.geom.Ellipse(100, 100, 20, 50);
            it('should return true for the center', function(){
                var p = new toxi.geom.Vec2D(100, 100);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return true for an internal point', function(){
                var p = new toxi.geom.Vec2D(110, 110);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return true for a point inside the top edge', function(){
                var p = new toxi.geom.Vec2D(100, 149.9);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return true for a point inside the right edge', function(){
                var p = new toxi.geom.Vec2D(119.9, 100);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return false for a point outside the ellipse', function(){
                var p = new toxi.geom.Vec2D(119, 149);
                assert.equal(ellipse.containsPoint(p), false);
            });
            it('should return false for a point outside the containing rectangle of the ellipse', function(){
                var p = new toxi.geom.Vec2D(125, 155);
                assert.equal(ellipse.containsPoint(p), false);
            });
        });
        describe('wide ellipse', function(){
             var ellipse = new toxi.geom.Ellipse(100, 100, 50, 20);
            it('should return true for the center', function(){
                var p = new toxi.geom.Vec2D(100, 100);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return true for an internal point', function(){
                var p = new toxi.geom.Vec2D(110, 110);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return true for a point inside the top edge', function(){
                var p = new toxi.geom.Vec2D(100, 119.9);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return true for a point inside the right edge', function(){
                var p = new toxi.geom.Vec2D(149.9, 100);
                assert.equal(ellipse.containsPoint(p), true);
            });
            it('should return false for a point outside the ellipse', function(){
                var p = new toxi.geom.Vec2D(149, 119);
                assert.equal(ellipse.containsPoint(p), false);
            });
            it('should return false for a point outside the containing rectangle of the ellipse', function(){
                var p = new toxi.geom.Vec2D(155, 125);
                assert.equal(ellipse.containsPoint(p), false);
            });
        });
    });
});
