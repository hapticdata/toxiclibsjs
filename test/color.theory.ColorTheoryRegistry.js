var toxi = require('../index'),
    assert = require('assert');

var ColorTheoryRegistry = toxi.color.theory.ColorTheoryRegistry,
    NamedColor = toxi.color.NamedColor,
    ColorList = toxi.color.ColorList;

describe('toxi.color.theory.ColorTheoryRegistry', function(){
    it('should be an object', function(){
        assert.equal( typeof ColorTheoryRegistry, 'object' );
    });

    describe('.getRegisteredNames()', function(){
        var names = ColorTheoryRegistry.getRegisteredNames();
        it('should have the 10 names for strategies', function(){
            assert.equal( names.length, 10 );
            names.forEach(function(n){
                assert.equal( typeof n, 'string' );
            });
        });
    });

    describe('.getRegisteredStrategies()', function(){
        var strats = ColorTheoryRegistry.getRegisteredStrategies();
        it('should have the 10 strategies', function(){
            assert.equal( strats.length, 10 );
        });
    });

    describe('.getStrategyForName( name )', function(){
        it('should look up a strategy by its name property', function(){
            var st = ColorTheoryRegistry.getStrategyForName( 'tetrad' );
            assert.equal( st.getName(), 'tetrad' );
        });
    });


    describe('.registerImplementation( impl )', function(){
        var Strat = function(){};
        Strat.prototype.createListFromColor = function( src ){ return new ColorList(src); };
        Strat.prototype.getName = function(){ return 'Strat'; };
        var impl = new Strat();
        ColorTheoryRegistry.registerImplementation( impl );
        it('should have been added to the registered strategies', function(){
            assert.equal( ColorTheoryRegistry.getRegisteredStrategies().length, 11 );
        });
        it('should be retrievable from .getStrategyForName( name )', function(){
            assert.equal( ColorTheoryRegistry.getStrategyForName('Strat'), impl );
        });
    });

    ColorTheoryRegistry.getRegisteredStrategies().forEach(function(strategy){
        describe(strategy.getName() +' strategies #createListFromColor', function(){
            it('should return a color list', function(){
                var cl = strategy.createListFromColor( NamedColor.LIME );
                assert.ok( cl instanceof ColorList );
                assert.ok( cl.size() >= 1 );
            });
        });
    });

});


