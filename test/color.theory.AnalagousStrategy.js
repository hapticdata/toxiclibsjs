var toxi = require('../index'),
    assert = require('assert');

var ColorList = toxi.color.ColorList,
    NamedColor = toxi.color.NamedColor,
    AnalagousStrategy = toxi.color.theory.AnalagousStrategy,
    MathUtils = toxi.math.MathUtils;

describe('toxi.color.theory.AnalagousStrategy', function(){
    describe('constructor', function(){
        it('should construct with defaults', function(){
            var strat = new AnalagousStrategy();
            assert.ok( strat instanceof AnalagousStrategy );
            assert.equal( strat.getName(), 'analagous' );
            assert.equal( typeof strat.createListFromColor, 'function');
            assert.equal( strat.theta, MathUtils.radians(10) );
            assert.equal( strat.contrast, 0.25 );
        });

        it('should construct with ( theta, contrast )', function(){
            var strat = new AnalagousStrategy( 30, 0.1 );
            assert.ok( strat instanceof AnalagousStrategy );
            assert.equal( strat.getName(), 'analagous' );
            assert.equal( typeof strat.createListFromColor, 'function');
            assert.equal( strat.theta, MathUtils.radians(30) );
            assert.equal( strat.contrast, 0.1 );
        });
    });

    describe('#createListFromColor( sourceColor )', function(){
        var color = NamedColor.LIME,
            list = new AnalagousStrategy( 10, 0.2 ).createListFromColor( color );
        it('should have a list of 4 colors', function(){
            assert.ok( list instanceof ColorList );
            assert.equal( list.size(), 5 );
        });

        it('should error when it doesnt receive a tcolor', function(){
            assert.throws(new AnalagousStrategy().createListFromColor, Error);
        });
    });
});
