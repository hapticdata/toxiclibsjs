define([
    './strategies',
    '../ColorList'
], function( strategies, ColorList ){

    var wrap = strategies.wrap;

    return strategies.create('Monochrome', {
        createListFromColor: function( src ){
            var colors = new ColorList(src),
                c = src.copy();
            c.setBrightness(wrap(c.brightness(), 0.5, 0.2, 0.3));
            c.setSaturation(wrap(c.saturation(), 0.3, 0.1, 0.3));
            colors.add(c);

            c = src.copy();
            c.setBrightness(wrap(c.brightness(), 0.2, 0.2, 0.6));
            colors.add(c);

            c = src.copy();
            c.setBrightness(Math.max(0.2, c.brightness() + (1-c.brightness()) * 0.2));
            c.setSaturation(wrap(c.saturation(), 0.3, 0.1, 0.3));
            colors.add(c);

            c = src.copy();
            c.setBrightness(wrap(c.brightness(), 0.5, 0.2, 0.3));
            colors.add(c);

            return colors;
        }
    });
});
