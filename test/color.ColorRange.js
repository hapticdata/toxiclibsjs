/*global describe,it*/
var toxi = require('../index'),
    assert = require('assert');

//should result in extra constraints on all but hue
describe('toxi.color.ColorRange', function(){

    var ColorRange = toxi.color.ColorRange,
        ColorList = toxi.color.ColorList,
        Hue = toxi.color.Hue,
        TColor = toxi.color.TColor,
        FloatRange = toxi.util.datatypes.FloatRange;

    it('should have a DEFAULT_VARIANCE property', function(){
        assert.equal( ColorRange.DEFAULT_VARIANCE, 0.035);
    });

    describe('pre-defined colors',function(){
        var colors = ['LIGHT','DARK','BRIGHT','WEAK','NEUTRAL','FRESH','SOFT','HARD',
       'WARM','COOL','INTENSE'];

        it('should be in ColorRange object',function(){
            colors.forEach(function(name){
                assert.ok( ColorRange[name] instanceof ColorRange );
            });
        });

        it('should be in PRESETS object',function(){
            colors.forEach(function(name){
                assert.ok(ColorRange.PRESETS[name]);
            });
        });
    });

    describe('ColorRange.getPresetForName(name)',function(){
        it('should return the preset color',function(){
            assert.equal( ColorRange.getPresetForName('dark'), ColorRange.DARK );
        });
    });


    describe('construct',function(){
        var testForSingleHueConstraint = function( range, hue ){
            return function(){
                assert.equal( range.hueConstraint.length, 1 );
                assert.equal( range.hueConstraint[0].min, hue );
                assert.equal( range.hueConstraint[0].max, hue );
            };
        };
        it('should construct without parameters',function(){
            assert.ok( new ColorRange() instanceof ColorRange);
        });
        describe('with a ColorList',function(){
            var cl = new ColorList([
                TColor.newRGBA(1,0,0,1),
                TColor.newRGBA(0,1,0,1),
                TColor.newRGBA(0,0,1,1)
            ]);
            var cr = new ColorRange(cl);
            it('should be a ColorRange',function(){
                assert.ok( cr instanceof ColorRange );
            });
            it('should be constrained by the hues of all TColors',function(){
                assert.equal(cr.hueConstraint.length, 3 );
                assert.equal(cr.saturationConstraint.length, 4);
            });

        });
        describe('with a TColor', function(){
            var c = TColor.newRGBA(1,0,0,1);
            var cr = new ColorRange(c);
            it('should construct with a TColor', function(){
                assert.ok( cr instanceof ColorRange );
            });
            it('should constrain the hue', testForSingleHueConstraint(cr,c.hue()));
        });
        describe('with a Hue', function(){
            var hue = new Hue('myHue', 30/360);
            var cr = new ColorRange(hue);
            it('should construct with a Hue', function(){
                assert.ok( cr instanceof ColorRange );
            });
            it('should constrain the hue', testForSingleHueConstraint(cr, hue.getHue()));
        });

        describe('with hue, saturation, brightness constraints and a name',function(){
            var briC = new FloatRange( 0, 0.125), //brightness
                satC = new FloatRange( 0, 0.25), //saturation
                hueC = new FloatRange( 0, 0.5 ), //hue
                cr = new ColorRange( hueC, satC, briC, "myCustomRange" );
            it('should have the name "myCustomRange"',function(){
                assert.equal( cr.getName(), "myCustomRange" );
            });
            it('should contain the provided constraints',function(){
                assert.deepEqual( cr.hueConstraint[0], hueC );
                assert.deepEqual( cr.saturationConstraint[0], satC );
                assert.deepEqual( cr.brightnessConstraint[0], briC );
            });
        });

        describe('with all constraints and a name', function(){
            var briC = new FloatRange(0,0.125),
                satC = new FloatRange(0,0.25),
                hueC = new FloatRange(0,0.5),
                alphC = new FloatRange(0, 0.7),
                black = new FloatRange(0,0.8),
                white = new FloatRange(0.25,0.75),
                cr = new ColorRange( hueC, satC, briC, alphC, black, white, "myCompleteRange");

            it('should have the name "myCompleteRange"',function(){
                assert.equal( cr.getName(), "myCompleteRange");
            });
            it('should contain all constraints',function(){
                assert.deepEqual( cr.hueConstraint[0], hueC );
                assert.deepEqual( cr.saturationConstraint[0], satC );
                assert.deepEqual( cr.brightnessConstraint[0], briC );
                assert.deepEqual( cr.alphaConstraint[0], alphC );
            });
            it('should use received black FloatRange',function(){
                assert.deepEqual( cr.black, black );
            });
            it('should use received white FloatRange',function(){
                assert.deepEqual( cr.white, white );
            });
        });
    });

    describe('#add',function(){
        it('should receive ColorRange and merge into constraints',function(){
            var cr = new ColorRange(TColor.newRGBA(1,0,0,1));
            cr.add( new ColorRange(
                new ColorList([
                    TColor.newRGBA(0,1,0,1),
                    TColor.newRGBA(0,0,1,1)
                ])
            ));
            assert.equal(cr.hueConstraint.length, 3);
            assert.equal( cr.saturationConstraint.length, 4);
            assert.equal( cr.brightnessConstraint.length, 4);
            assert.equal( cr.alphaConstraint.length, 4);
        });

        it('should receive a TColor and merge into constraints',function(){
            var cr = new ColorRange(TColor.newRGBA(1,0,0,1));
            cr.add( TColor.newRGBA(0,0,1,1) );
            assert.equal( cr.hueConstraint.length, 2);
            assert.equal( cr.saturationConstraint.length, 2);
            assert.equal( cr.brightnessConstraint.length, 2);
            assert.equal( cr.alphaConstraint.length, 2 );
        });
    });

    describe('#addAlphaRange( range )', function(){
        it('should result in added range', function(){
            var cr = new ColorRange(TColor.newRGBA(1,0,0,1));
            assert.equal( cr.alphaConstraint.length, 1 );
            cr.addAlphaRange( new FloatRange(0,0.75) );
            assert.equal( cr.alphaConstraint.length, 2);
        });
    });
    describe('#addBrightnessRange( range )', function(){
        it('should result in added range', function(){
            var cr = new ColorRange(TColor.newRGBA(1,0,0,1));
            assert.equal( cr.brightnessConstraint.length, 1 );
            cr.addBrightnessRange( new FloatRange(0,0.75) );
            assert.equal( cr.brightnessConstraint.length, 2);
        });
    });

    describe('#addHue( hue )', function(){
        it('should add a hueConstraint', function(){
            var cr = new ColorRange( TColor.newRGBA( 1, 0, 0, 1) );
            assert.equal( cr.hueConstraint.length, 1);
            cr.addHue( new Hue("myHue", 30/360) );
            assert.equal( cr.hueConstraint.length, 2 );
        });
    });

    describe('#addHueRange( range )', function(){
        it('should result in added range', function(){
            var cr = new ColorRange(TColor.newRGBA(1,0,0,1));
            assert.equal( cr.hueConstraint.length, 1 );
            cr.addHueRange( new FloatRange(0,0.75) );
            assert.equal( cr.hueConstraint.length, 2);
        });
    });

    describe('#addSaturationRange( range )', function(){
        it('should result in added range', function(){
            var cr = new ColorRange(TColor.newRGBA(1,0,0,1));
            assert.equal( cr.saturationConstraint.length, 1 );
            cr.addSaturationRange( new FloatRange(0,0.75) );
            assert.equal( cr.saturationConstraint.length, 2);
        });
    });

    describe('#contains( tcolor )', function(){
        var cr = new ColorRange( new FloatRange(0.8,1), new FloatRange(0,1), "myCustomRange");
        it('should be true', function(){
            assert.ok( cr.contains( TColor.newHSVA(0.9,0.5,0.5,1)) );
        });
        it('should be false', function(){
            assert.ok( !cr.contains( TColor.newHSVA(0.5,0.5,0.5,1) ) );
        });
    });

    describe('#copy( [c], [variance] )', function(){
        var range,
            c = {
                h: new FloatRange(0.8,1),
                s: new FloatRange(0,0.5),
                v: new FloatRange(0.2,0.3),
                name: 'custom'
            };
        range = new ColorRange( c.h, c.s, c.v, c.name );
        it('should make a shallow copy, with no params', function(){
            var copy = range.copy();
            assert.notStrictEqual( range, copy );
            assert.deepEqual( range, copy );
            assert.equal( range.getName(), copy.getName() );
            assert.notStrictEqual( range.hueConstraint, copy.hueConstraint );
            assert.deepEqual( range.hueConstraint, copy.hueConstraint );
            assert.deepEqual( range.hueConstraint[0], copy.hueConstraint[0] );
            assert.notStrictEqual( range.saturationConstraint, copy.saturationConstraint );
            assert.deepEqual( range.saturationConstraint, copy.saturationConstraint );
            assert.notStrictEqual( range.black, copy.black );
            assert.deepEqual( range.black, copy.black );
        });

        it('should make a shallow copy, and override the Hue and Alpha constraints', function(){
            var copy = range.copy( TColor.newHSVA(0.1, 0.9, 0.8, 0.5), 0.05 );
            assert.notStrictEqual( range, copy );
            assert.equal( range.getName(), copy.getName() );
            assert.notStrictEqual( range.saturationConstraint, copy.saturationConstraint );
            assert.deepEqual( range.saturationConstraint, copy.saturationConstraint );
            assert.notStrictEqual( range.brightnessConstraint, copy.brightnessConstraint );
            assert.deepEqual( range.brightnessConstraint, copy.brightnessConstraint );
            assert.notStrictEqual( range.hueConstraint, copy.hueConstraint );
            assert.notDeepEqual( range.hueConstraint, copy.hueConstraint );
            assert.notStrictEqual( range.alphaConstraint, copy.alphaConstraint );
            assert.notDeepEqual( range.alphaConstraint, copy.alphaConstraint );
        });
    });

    describe('#getColor( [hue or tcolor], [variance])', function(){
        var r = new ColorRange(
            new FloatRange( 0.2, 0.9 ),
            new FloatRange(0.7, 0.9),
            new FloatRange(0,1.0), //full range, allow for white and black
            "customShades"
        );

        it('should return two random colors within the range',function(){
            var rand1 = r.getColor(),
                rand2 = r.getColor();
            assert.notEqual(rand1, rand2);
            assert.ok( r.contains( rand1 ) );
            assert.ok( r.contains( rand2 ) );
        });
        it('should return two random colors with the same hue',function(){
            var h = Hue.GREEN,
                rand1 = r.getColor(h),
                rand2 = r.getColor(h);
            assert.notEqual( rand1, rand2 );
            assert.ok( r.contains( rand1 ) );
            assert.ok( r.contains( rand2 ) );
            assert.equal( rand1.hue(), rand2.hue() );
        });

        it('should return two random colors that vary the hue within the variance', function(){
            var c = TColor.newHSVA(0.7, 0.3, 0.5, 1.0),
                variance = 0.1,
                rand1 = r.getColor(c, variance),
                rand2 = r.getColor(c, variance);
            assert.notEqual( rand1, rand2 );
            assert.ok( r.contains( rand1 ) );
            assert.ok( r.contains(rand2) );
            assert.ok( Math.abs(rand1.hue() - c.hue()) <= variance );
            assert.ok( Math.abs(rand2.hue() - c.hue()) <= variance );
        });
        it('should return two random colors, based on black',function(){
            var variance = 0.1,
                rand1 = r.getColor(TColor.BLACK, variance),
                rand2 = r.getColor(TColor.BLACK, variance);
            assert.notEqual( rand1, rand2 );
            assert.equal( rand1.saturation(), 0 );
            assert.equal( rand2.saturation(), 0 );
        });
    });

    describe('#getColors()', function(){
        var r = new ColorRange(
                new FloatRange(0.5,0.8),
                new FloatRange(0.8,1.0),
                new FloatRange(0.7,0.9)
            ),
            num = 20;
        it('should return '+num+' colors within range',function(){
            var cl = r.getColors(num);
            assert.ok( cl instanceof ColorList );
            assert.equal( cl.colors.length, num );
            cl.each(function(c){
                assert.ok( r.contains(c) );
            });
        });
        it('should return '+num+' colors with hue variance',function(){
            var c = TColor.newRandom(),
                cl = r.getColors( c, num, 0.1 );
            assert.ok( cl instanceof ColorList );
            assert.equal( cl.colors.length, num );
            cl.each(function(color){
                var abs =  Math.abs( c.hue() - color.hue() );
                assert.ok( abs <= 0.1 || abs > 0.9 );
            });
        });
    });


    describe('#getGrayscale(brightness, variance)',function(){
        var r = new ColorRange(
            new FloatRange(0.5,0.8),
            new FloatRange(0.7,1.0),
            new FloatRange(0.7,0.9)
        );
        it('should return a grayscale value within range',function(){
            var g = r.getGrayscale(0.9, 0.1);
            assert.ok( g.isGrey() );
            assert.equal( g.saturation(), 0 );
        });
    });

    describe('#getName()', function(){
        var r = new ColorRange(
            new FloatRange(0.5,0.8),
            new FloatRange(0.7,1.0),
            new FloatRange(0.1,0.2),
            "myCustom"
        );
        it('should have the name provided',function(){
            assert.equal( r.getName(), "myCustom" );
        });
    });

    describe('#getSum( colorrange )',function(){
        var r1 = new ColorRange(
            new FloatRange(0.5,0.8),
            new FloatRange(0.7,1.0),
            new FloatRange(0.1,0.2),
            "myCustom"
        );
        var r2 = new ColorRange(
            new FloatRange(0.6,0.9),
            new FloatRange(0.7,0.95),
            new FloatRange(0.05,0.2),
            "myCustom2"
        );
        it('should add the 2nd range to the first',function(){
            var r3 = r1.getSum(r2);
            assert.ok( r3 instanceof ColorRange );
            assert.equal( r1.hueConstraint[0], r3.hueConstraint[0] );
            assert.equal( r2.hueConstraint[0], r3.hueConstraint[1] );
        });
    });

    describe('protected #isValueInConstraint( val, rangeSet )',function(){
        var r = new ColorRange(
            new FloatRange(0.5,0.8),
            new FloatRange(0.7,1.0),
            new FloatRange(0.1,0.2),
            "myCustom"
        );
        it('should be within constraint',function(){
            assert.ok( r.isValueInConstraint( 0.55, r.hueConstraint ) );
        });
        it('should not be within constraint',function(){
            assert.ok( !r.isValueInConstraint( 0.3, r.saturationConstraint ) );
        });
    });
});
