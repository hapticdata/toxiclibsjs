var toxi = require('../index'),
    assert = require('assert');

var c = toxi.color;

describe('toxi.color.ColorTheme', function(){
    var name = 'test-theme',
        theme = new c.ColorTheme(name);
    describe('constructor', function(){
        it('should be a valid ColorTheme object', function(){
            [ theme instanceof c.ColorTheme, theme.name ].forEach(assert.ok);
            ['addRange','getColor','getColors','getName'].forEach(function(method){
                assert.equal( theme[method], c.ColorTheme.prototype[method] );
                assert.equal( typeof theme[method], 'function');
            });
        });
    });

    describe('addRange( range, color, weight )', function(){
        it('should add a range of colors to the theme', function(){
            var nParts = theme.parts.length,
                range = new c.ColorRange( c.Hue.LIME ),
                t = theme.addRange( range, c.NamedColor.CHARTREUSE, 0.5 );
            assert.deepEqual( t, theme );
            assert.equal( theme.parts.length, nParts+1 );
        });
    });

    describe('addRange( descriptor, weight )', function(){
        it('should add a range of colors to the theme', function(){
            var nParts = theme.parts.length,
                t = theme.addRange('warm springgreen', 0.25);
            assert.deepEqual( t, theme );
            assert.equal( theme.parts.length, nParts+1);
            var lastPart = theme.parts[theme.parts.length-1];
            assert.ok( lastPart.color instanceof c.TColor );
            assert.deepEqual( lastPart.color, c.NamedColor.SPRINGGREEN );
            assert.ok( lastPart.range instanceof c.ColorRange );
            assert.deepEqual( lastPart.range, c.ColorRange.getPresetForName('warm') );
        });
    });

    var testColors = function( colors ){
        colors.forEach(function(clr, i, colors){
            assert.ok( clr instanceof c.TColor );
            assert.notEqual( clr, colors[(i+1)%colors.length]);
        });
    };
    describe('getColor()', function(){
        it('should return a unique color within the theme', function(){
            testColors([theme.getColor(), theme.getColor(), theme.getColor()]);
        });
    });
    describe('getColors( num )', function(){
        it('should return `num` unique colors within the theme', function(){
            testColors( theme.getColors(8).colors );
        });
    });

    describe('getName()', function(){
        it('should return theme name', function(){
            assert.equal(name, theme.getName());
        });
    });
});


