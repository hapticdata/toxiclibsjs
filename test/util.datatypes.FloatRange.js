/**global describe, it*/
var toxi = require('../index'),
    assert = require('assert');


var FloatRange = toxi.util.datatypes.FloatRange,
    MathUtils = toxi.math.MathUtils;


describe('toxi.util.datatypes.FloatRange', function(){
    var fr = new FloatRange(1, 10);
    describe.skip('FloatRange.fromSamples( ...samples )',function(){
    });

    describe('construct', function(){
        it('should construct with no params, with range 0-1',function(){
            var fr = new FloatRange();
            assert.ok( fr instanceof FloatRange );
            assert.equal(fr.min, 0);
            assert.equal(fr.max, 1);
            assert.equal( fr.getCurrent(), fr.min);
        });

        it('should construct with custom range', function(){
            var f = new FloatRange(1, 10);
            assert.ok( f instanceof FloatRange );
            assert.equal( f.min, 1 );
            assert.equal( f.max, 10 );
        });
    });

    describe('#adjustCurrentBy( val )', function(){
        it('should adjust the `current` value to whats set', function(){
            var f = new FloatRange(1,10);
            var ad = f.adjustCurrentBy( 5 );
            assert.equal( ad, 6 );
            assert.equal( f.getCurrent(), 6 );
        });
        it('should clip the `current` value to the max',function(){
            var f = new FloatRange(1,10);
            var ad = f.adjustCurrentBy( 20 );
            assert.equal( ad, f.max );
            assert.equal( f.getCurrent(), f.max );
        });
    });

    describe('#copy()', function(){
        it('should return a new object with the same values', function(){
            var f1 = new FloatRange(2, 20),
                f2 = f1.copy();
            assert.ok( f2 instanceof FloatRange );
            assert.equal( f1.min, f2.min );
            assert.equal( f1.max, f2.max );
            assert.notStrictEqual( f1, f2 );
        });
    });

    describe('#getAt( percent )', function(){
        it('should be close but different than getMedian()', function(){
            var f = new FloatRange(1, 105);
            assert.ok( Math.abs(f.getAt(0.5) - f.getMedian()) < 0.1);
        });

        it('should return out of range number for percents beyond 1.0', function(){
            var f = new FloatRange(1, 105);
            assert.ok( f.getAt(2.0) > f.max );
        });
    });

    describe('#getMedian()', function(){
        it('should return the median value', function(){
            var f = new FloatRange(0, 10);
            assert.equal( f.getMedian(), 5 );
        });
    });

    describe('#getRange()', function(){
        it('should return a Number for the range between the max and min values',function(){
            assert.equal( new FloatRange(2, 10).getRange(), 8 );
        });
    });

    describe('#isValueInRange( val )', function(){
        var f = new FloatRange(2, 10);
        it('should return true', function(){
            assert.ok( f.isValueInRange(9) );
            //ceiling
            assert.ok( f.isValueInRange(10) );
            //floor
            assert.ok( f.isValueInRange(2) );
        });
        it('should return false', function(){
            //below range
            assert.ok( !f.isValueInRange(0) );
            //above range
            assert.ok( !f.isValueInRange(11) );
        });
    });

    describe('#pickRandom()', function(){
       it('should pick a value between the min and max randomly',function(){
            var f = new FloatRange(2, 10),
                pr = f.pickRandom();
            assert.ok( pr > 2 && pr < 10 );
            assert.notEqual( f.pickRandom(), pr );
        });
    });

    //skipping #seed() and #setRandom(), not implemented

    describe('#setCurrent( val )', function(){
        var f = new FloatRange(2, 10);
        it('should set the current value and return it', function(){
            var v = f.setCurrent( 8 );
            assert.equal( v, 8 );
            assert.equal( f.getCurrent(), 8 );
        });

        it('should clip the value and return it', function(){
            var v = f.setCurrent( 19 );
            assert.equal( v, f.max );
            assert.equal( v, f.getCurrent() );
        });
    });

    describe('#toArray( step )', function(){
        var f = new FloatRange(2, 10);

        it('should return an array with 8 elements between the min and max', function(){
            var a = f.toArray( f.getRange() / 8);
            assert.ok( Array.isArray( a ) );
            assert.equal( a.length, 8 );
            //ensure every value is greater than the last
            a.forEach(function(v, i){
                if( i > 0 ){
                    assert.ok( v > a[i-1] );
                }
                assert.ok( v >= f.min && v <= f.max );
            });
        });
    });

    describe('#toString()', function(){
        var ts = new FloatRange(2,10).toString();
        assert.equal( ts.indexOf('FloatRange: '), 0);
        assert.ok( ts.indexOf('2') > 0 );
        assert.ok( ts.indexOf('10') > 0 );
    });
});
