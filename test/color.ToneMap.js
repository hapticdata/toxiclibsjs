var toxi = require('../index'),
    assert = require('assert');


var ToneMap = toxi.color.ToneMap,
    TColor = toxi.color.TColor,
    ColorList = toxi.color.ColorList,
    ColorGradient = toxi.color.ColorGradient,
    isColorList = toxi.internals.is.ColorList,
    isColorGradient = toxi.internals.is.ColorGradient,
    isTColor = toxi.internals.is.TColor,
    isScaleMap = toxi.internals.is.ScaleMap;


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

    describe('#getToneMappedArray( src, pixels, offset )', function(){
        var ensureValidReturn = function( pixels ){
            pixels.forEach(function(p){
                assert.equal( typeof p, 'number' );
            });
            //convert to TColors
            pixels = pixels.map(toxi.color.TColor.newARGB);
            pixels.forEach(function(p){
                assert.ok( p instanceof toxi.color.TColor );
                ['red','green','blue','hue','saturation','brightness'].forEach(function(method){
                    assert.ok( p[method]() <= 1.0 );
                    assert.ok( p[method]() >= 0.0 );
                });
            });
        };

        var src = [];
        for( var i=0; i<10; i++){
            src.push( Math.random() );
        }
        describe('accept a source array', function(){
            it('should return an Array of ARGB values', function(){
                var pixels = tm.getToneMappedArray( src );
                assert.ok( pixels instanceof Array );
                assert.equal( pixels.length, src.length );
                ensureValidReturn( pixels );
            });
        });
        describe('accept a source array and a destination array', function(){
            it('should return and ARGB values', function(){
                var pixels = [];
                var pixels2 = tm.getToneMappedArray( src, pixels );
                assert.equal( src.length, pixels.length );
                //should be the same object
                assert.deepEqual( pixels, pixels2 );
                ensureValidReturn( pixels2 );
            });
        });
        describe('accepts a source array, destination array, and an offset', function(){
            if('should reutrn an Array of ARGB values starting at the provided offset', function(){
                var pixels = [], offset = 6;
                for( var i=0; i<offset; i++){
                    pixels.push( toxi.color.TColor.newRandom().toARGB() );
                }
                var pixels2 = tm.getToneMappedArray( src, pixels, offset );
                assert.equal( src.length+offset, pixels2.length );
                assert.deepEqual( pixels, pixels2 );
                ensureValidReturn( pixels2 );
            });
        });
    });
});
