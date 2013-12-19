define([
    './strategies',
    '../ColorList'
], function( strategies, ColorList ){

    var getName = function(){ return 'triad'; };
    /**
    * Implements the <a href=
    * "http://www.tigercolor.com/color-lab/color-theory/color-theory-intro.htm#triadic"
    * >triadic color scheme</a> to create 3 compatible colors for the given one.
    */
    return strategies.create('TriadTheory', {
        createListFromColor: function( src ){
            var colors = new ColorList(src);
            colors.add( src.getRotatedRYB(120).lighten(0.1) );
            colors.add( src.getRotatedRYB(-120).lighten(0.1) );
            return colors;
        },
        getName: getName,
        toString: toString
    });
});
