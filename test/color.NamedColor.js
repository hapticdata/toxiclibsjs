var toxi = require('../index'),
    assert = require('assert');


var NamedColor = toxi.color.NamedColor;

describe('toxi.color.NamedColor', function(){
    var names = [
        "ALICEBLUE",
        "ANTIQUEWHITE",
        "AQUA",
        "AQUAMARINE",
        "AZURE",
        "BARK",
        "BEIGE",
        "BISQUE",
        "BLACK",
        "BLANCHEDALMOND",
        "BLUE",
        "BLUEVIOLET",
        "BROWN",
        "BURLYWOOD",
        "CADETBLUE",
        "CHARTREUSE",
        "CHOCOLATE",
        "CORAL",
        "CORNFLOWERBLUE",
        "CORNSILK",
        "CRIMSON",
        "CYAN",
        "DARKBLUE",
        "DARKCYAN",
        "DARKGOLDENROD",
        "DARKGRAY",
        "DARKGREEN",
        "DARKKHAKI",
        "DARKMAGENTA",
        "DARKOLIVEGREEN",
        "DARKORANGE",
        "DARKORCHID",
        "DARKRED",
        "DARKSALMON",
        "DARKSEAGREEN",
        "DARKSLATEBLUE",
        "DARKSLATEGRAY",
        "DARKTURQUOISE",
        "DARKVIOLET",
        "DEEPPINK",
        "DEEPSKYBLUE",
        "DIMGRAY",
        "DIMGREY",
        "DODGERBLUE",
        "FIREBRICK",
        "FLORALWHITE",
        "FORESTGREEN",
        "FUCHSIA",
        "GAINSBORO",
        "GHOSTWHITE",
        "GOLD",
        "GOLDENROD",
        "GRAY",
        "GREEN",
        "GREENYELLOW",
        "GREY",
        "HONEYDEW",
        "HOTPINK",
        "INDIANRED",
        "INDIGO",
        "IVORY",
        "KHAKI",
        "LAVENDER",
        "LAVENDERBLUSH",
        "LAWNGREEN",
        "LEMONCHIFFON",
        "LIGHTBLUE",
        "LIGHTCORAL",
        "LIGHTCYAN",
        "LIGHTGOLDENRODYELLOW",
        "LIGHTGREEN",
        "LIGHTGREY",
        "LIGHTPINK",
        "LIGHTSALMON",
        "LIGHTSEAGREEN",
        "LIGHTSKYBLUE",
        "LIGHTSLATEGRAY",
        "LIGHTSTEELBLUE",
        "LIGHTYELLOW",
        "LIME",
        "LIMEGREEN",
        "LINEN",
        "MAROON",
        "MEDIUMAQUAMARINE",
        "MEDIUMBLUE",
        "MEDIUMORCHID",
        "MEDIUMPURPLE",
        "MEDIUMSEAGREEN",
        "MEDIUMSLATEBLUE",
        "MEDIUMSPRINGGREEN",
        "MEDIUMTURQUOISE",
        "MEDIUMVIOLETRED",
        "MIDNIGHTBLUE",
        "MINTCREAM",
        "MISTYROSE",
        "MOCCASIN",
        "NAVAJOWHITE",
        "NAVY",
        "OLDLACE",
        "OLIVE",
        "OLIVEDRAB",
        "ORANGE",
        "ORANGERED",
        "ORCHID",
        "PALEGOLDENROD",
        "PALEGREEN",
        "PALETURQUOISE",
        "PALEVIOLETRED",
        "PAPAYAWHIP",
        "PEACHPUFF",
        "PERU",
        "PINK",
        "PLUM",
        "POWDERBLUE",
        "PURPLE",
        "RED",
        "ROSYBROWN",
        "ROYALBLUE",
        "SADDLEBROWN",
        "SALMON",
        "SANDYBROWN",
        "SEAGREEN",
        "SEASHELL",
        "SIENNA",
        "SILVER",
        "SKYBLUE",
        "SLATEBLUE",
        "SLATEGRAY",
        "SNOW",
        "SPRINGGREEN",
        "STEELBLUE",
        "TAN",
        "TEAL",
        "THISTLE",
        "TOMATO",
        "TRANSPARENT",
        "TURQUOISE",
        "VIOLET",
        "WHEAT",
        "WHITE",
        "WHITESMOKE",
        "YELLOW",
        "YELLOWGREEN"
    ];

    it('should have all of the X11 named colors', function(){
        names.forEach(function(name){
            var clr = NamedColor[name];
            if( !clr ){
                console.log( 'NamedColor didn\'t have: ' +name );
            }
            assert.ok( clr );
        });
    });

    describe('#getForName( name )', function(){
        it('should return the color by name', function(){
            names.forEach(function(name){
                assert.ok( NamedColor.getForName(name) );
            });
        });
    });


    describe('#getNames', function(){
        it('should have the same length as our test colors', function(){
            assert( NamedColor.getNames().length, names.length );
        });

        it('should return a copy of the original', function(){
            var copy1 = NamedColor.getNames(),
                copy2 = NamedColor.getNames();

            assert.equal( copy1.length, copy2.length );
            copy1.pop();
            assert.notEqual( copy1.length, copy2.length );
        });

    });

});
