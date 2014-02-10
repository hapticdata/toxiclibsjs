var toxi = require('../index'),
    assert = require('assert');

var RectConstraint = toxi.physics2d.constraints.RectConstraint,
    VerletParticle2D = toxi.physics2d.VerletParticle2D,
    Rect = toxi.geom.Rect,
    Vec2D = toxi.geom.Vec2D;

describe('toxi.physics2d.constraints.RectConstraint', function(){
    describe('constructor', function(){
        var testObject = function( rc ){
           assert.ok( typeof rc === 'object' );
           assert.ok( typeof rc.applyConstraint === 'function' );
           assert.ok( typeof rc.getBox === 'function' );
            var box = rc.getBox();
            assert.ok( box instanceof Rect );
            assert.equal( box.x, 10 );
            assert.equal( box.y, 10 );
            assert.equal( box.width, 100 );
            assert.equal( box.height, 200 );
        };
        it('should construct with a Rect', function(){
            testObject( new RectConstraint( new Rect(10, 10, 100, 200) ));
        });
        it('should construct with an object literal', function(){
            testObject( new RectConstraint({ x: 10, y: 10, width: 100, height: 200 }) );
        });
        it('should construct with topLeft Vec2D and bottomRight Vec2D', function(){
            testObject( new RectConstraint( new Vec2D(10,10), new Vec2D(110,210) ) );
        });
    });
    describe('RectConstraint#applyConstraint( particle )', function(){
        it('should push an existing particle out of its rect', function(){
            var rect = new Rect( 10, 10, 100, 100 ),
                constraint = new RectConstraint( rect),
                particle = new VerletParticle2D( 75, 25 ),
                origParticle = particle.copy(),
                box = constraint.getBox();

            assert.ok( rect.containsPoint( particle ) );
            //should be a copy of the rect
            assert.notEqual( rect, box );
            assert.deepEqual( rect, box );
            //constraint should push particle to its border
            constraint.applyConstraint( particle );
            assert.notEqual( origParticle.x, particle.x );
            assert.notEqual( origParticle.y, particle.y );
            assert.equal( particle.y, 10 );
        });
    });
});
