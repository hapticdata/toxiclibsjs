define([
    './strategies',
    '../ColorList'
], function( strategies, ColorList ){

    var wrap = strategies.wrap;

    return strategies.create('Compound',
        function( flipped ){
            this._isFlipped = flipped === true;
        }, {
        createListFromColor: function( src ){
            var colors = new ColorList(src),
                direction = this._isFlipped ? -1 : 1,
                c;

            c = src.getRotatedRYB(30 * direction);
            c.setBrightness(wrap(c.brightness(), 0.25, 0.6, 0.25));
            colors.add(c);

            c = src.getRotatedRYB(30 * direction);
            c.setSaturation(wrap(c.saturation(), 0.4, 0.1, 0.4));
            c.setBrightness(wrap(c.brightness(), 0.4, 0.2, 0.4));
            colors.add(c);

            c = src.getRotatedRYB(160 * direction);
            c.setSaturation(wrap(c.saturation(), 0.25, 0.1, 0.25));
            c.setBrightness(Math.max(0.2, c.brightness()));
            colors.add(c);

            c = src.getRotatedRYB(150 * direction);
            c.setSaturation(wrap(c.saturation(), 0.1, 0.8, 0.1));
            c.setBrightness(wrap(c.brightness(), 0.3, 0.6, 0.3));
            colors.add(c);

            /* disabled in java: http://hg.postspectacular.com/toxiclibs/src/4cfadbbea3b0bd02e2081e532f44782c5bfd67d7/src.color/toxi/color/theory/CompoundTheoryStrategy.java?at=default#cl-89
            c = src.getRotatedRYB(150 * direction);
            c.setSaturation(wrap(c.saturation(), 0.1, 0.8, 0.1));
            c.setBrightness(wrap(c.brightness(), 0.4, 0.2, 0.4));
            colors.add(c);*/

            return colors;
        },
        isFlipped: function(){
            return this._isFlipped;
        },
        setFlipped: function( state ){
            this._isFlipped = state;
        },
        toString: function(){
            return 'Compound' + (this.isFlipped() ? "_flipped" : "");
        }
    });

});
