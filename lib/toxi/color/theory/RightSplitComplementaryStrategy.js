define([
    './strategies',
    '../ColorList',
    './ComplementaryStrategy'
], function( strategies, ColorList, ComplementaryStrategy ){

    var complementary;

    return strategies.create('RightSplitComplementary', {
        createListFromColor: function( src ){
            complementary = complementary || new ComplementaryStrategy();
            var left = src.getComplement().rotateRYB(30).lighten(0.1),
                colors = complementary.createListFromColor(src),
                c;

            for(var i=3; i<6; i++){
                c = colors.get(i);
                c.setHue(left.hue());
            }
            return colors;
        }
    });
});
