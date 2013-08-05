var toxi = require('../index'),
    assert = require('assert');


var ToneMap = toxi.color.ToneMap,
    TColor = toxi.color.TColor,
    ColorList = toxi.color.ColorList,
    ColorGradient = toxi.color.ColorGradient,
    isColorList = toxi.internals.tests.isColorList,
    isColorGradient = toxi.internals.tests.isColorGradient,
    isTColor = toxi.internals.tests.isTColor,
    isScaleMap = toxi.internals.tests.isScaleMap;


describe('toxi.color.ToneMap', function(){
    describe('constructors', function(){
        var test = function( tm ){
            assert.ok( isColorList(tm.colors) );
            assert.equal( typeof tm.map.getInputMedian, 'function' );
            assert.ok( isScaleMap( tm.map ) );
        };

        it('should construct with `(min, max, colorGradien)`', function(){
            var cg = new ColorGradient();
            cg.addColorAt( 0, TColor.newRGB(0,0,0) );
            cg.addColorAt( 1, TColor.newRGB(1,1,1) );
            var tm = new ToneMap( 0.1, 0.9, cg );
            test(tm);
            assert.equal( tm.map.getInputRange().min, 0.1 );
            assert.equal( tm.map.getInputRange().max, 0.9 );
        });

        it('should construct with `(min, max, colorList)`', function(){
            var cl = new ColorList();
            cl.add( TColor.newRandom() );
            cl.add( TColor.newRandom() );
            var tm = new ToneMap( 0.1, 0.8, cl );
            test( tm );
        });

        it('should construct with `(a, b, colorA, colorB)`', function(){
            test( new ToneMap( 0.1, 0.8, TColor.newRandom(), TColor.newRandom()));
        });

        it('should construct with `(a,b, colorA, colorB, resolution)`', function(){
            var resolution = 8,
                tm =  new ToneMap( 0.1, 0.8, TColor.newRandom(), TColor.newRandom(), resolution);
            test( tm );
            assert.equal( tm.colors.size(), resolution );
        });
    });

    //setup instance
    var tm = new ToneMap( 0.1, 0.8, TColor.newRandom(), TColor.newRandom(), 8 );


    describe('#getARGBToneFor( t )', function(){
        it('should return int color value for tone at float `t`', function(){
            var argb = tm.getARGBToneFor( 0.5 );
            assert.equal( typeof argb, 'number' );
        });
    });

    describe('#getToneFor( t )', function(){
        it('should return a TColor for tone at `t`', function(){
            var tc = tm.getToneFor( 0.5 );
            assert.ok( isTColor(tc) );
        });
    });

    describe('#setMapFunction( interpStrat )',function(){
        it('should set map function', function(){
            var sig = new toxi.math.SigmoidInterpolation();
            tm.setMapFunction( sig );
            assert.deepEqual( tm.map.mapFunction, sig );
        });
    });
});
