define([
    './strategies',
    '../ColorList'
], function( strategies, ColorList ){

    var adjust = function( c, thresh ){
        var b = c.brightness();
        if( b > thresh ){
            c.setBrightness( 0.1 + b * 0.25 );
        } else {
            c.setBrightness(1.0 - b * 0.25 );
        }
        return c;
    };

    return strategies.create('Complementary',{
        createListFromColor: function( src ){
            var colors = new ColorList(src),
                c;

            // A contrasting color: much darker or lighter than the original
            colors.add( adjust(src.copy(),0.4) );

            // A soft supporting color: lighter and less saturated
            c = src.copy();
            c.lighten(0.3);
            c.setSaturation(0.1 + c.saturation() * 0.3);
            colors.add(c);

            // A contrasting complement: very dark or very light
            colors.add( adjust(src.getComplement(),0.3) );

            // The complment and a light supporting variant
            colors.add( src.getComplement() );

            c = src.getComplement();
            c.lighten(0.3);
            c.setSaturation(0.1 + c.saturation() * 0.25);
            colors.add(c);

            return colors;
        }
    });
});
