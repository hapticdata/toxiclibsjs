define([
    './strategies',
    '../ColorList'
], function( strategies, ColorList ){
    /**
    * Implements the <a href=
    * "http://www.tigercolor.com/color-lab/color-theory/color-theory-intro.htm#split-complementary"
    * >split-complementary color scheme</a> to create 2 compatible colors for the
    * given one.
    */
    return strategies.create('SplitComplementary', {
        createListFromColor: function( src ){
            var colors = new ColorList(src);
            colors.add(src.getRotatedRYB(150).lighten(0.1));
            colors.add(src.getRotatedRYB(210).lighten(0.1));
            return colors;
        }
    });
});
