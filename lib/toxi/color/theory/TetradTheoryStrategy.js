define([
    './strategies',
    '../ColorList'
], function( strategies, ColorList ){

    var getName = function(){ return 'tetrad'; },
        adjust = function( c ){
            return c[ c.brightness() < 0.5 ? 'lighten' : 'darken'](0.2);
        };
    /**
    * Implements the <a href=
    * "http://www.tigercolor.com/color-lab/color-theory/color-theory-intro.htm#rectangle"
    * >tetradic color scheme</a> to create 4 compatible colors for the given one.
    */
    return strategies.create('TetradTheory',
        /**
        * Constructs a new instance with the given color offset angle
        * @param {Number} hue rotation angle in degrees
        */
        function( theta ){
            this.theta = typeof theta === 'number' ? theta : 90;
        }, {
        createListFromColor: function( src ){
            var colors = new ColorList(src);
            colors.add( adjust(src.getRotatedRYB(this.theta)) );
            colors.add( adjust(src.getRotatedRYB(this.theta*2)) );
            colors.add( src.getRotatedRYB(this.theta*3).lighten(0.1));
            return colors;
        },
        getName: getName,
        toString: getName
    });
});
