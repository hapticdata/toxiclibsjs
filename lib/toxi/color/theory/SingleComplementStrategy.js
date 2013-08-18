define([
    './strategies',
    '../ColorList'
], function( strategies, ColorList ){
    /**
    * Implements the <a href=
    * "http://www.tigercolor.com/color-lab/color-theory/color-theory-intro.htm#complementary"
    * >single complementary color scheme</a> to create a compatible color for the
    * given one.
    */

    var getName = function(){ return "complement"; };

    return strategies.create('SingleComplement', {
        createListFromColor: function( src ){
            var list = new ColorList(src);
            list.add(src.getComplement());
            return list;
        },
        getName: getName,
        toString: getName
    });
});

