var toxi = require('../index'),
    assert = require('assert');



describe('toxi.geom.Circle', function(){
    describe('Constructor', function(){
        describe('no params', function(){
            var circle = new toxi.geom.Circle();
            it('should create a default circle instance', function(){
                assert.equal(circle.x, 0);
                assert.equal(circle.y, 0);
                assert.equal(typeof circle.getRadius, 'function');
            });
        });
    });
});
