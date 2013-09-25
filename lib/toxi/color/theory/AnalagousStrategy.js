define([
    './strategies',
    '../../geom/vectors',
    '../../math/mathUtils',
    '../../internals',
    '../ColorList'
],function( strategies, vectors, MathUtils, internals, ColorList ){
    var each = internals.each,
        Vec2D = vectors.Vec2D;

    //@private
    var _tones = [
        new Vec2D(1,2.2),
        new Vec2D(2,1),
        new Vec2D(-1,-0.5),
        new Vec2D(-2,1)
    ];

    return strategies.create('Analagous',
        /**
        * Creates a new instance
        * @param {Number} [theta] optionally provide an angle in degrees, defaults to 10
        * @param {Number} [contrast] optionally provide a contrast, defaults to 0.25
        */
        function( theta, contrast ){
            this.contrast = typeof contrast === 'number' ? contrast : 0.25;
            this.theta = MathUtils.radians( typeof theta === 'number' ? theta : 10 );
        }, {
        createListFromColor: function( src ){
            var self = this;
            this.contrast = MathUtils.clipNormalized( this.contrast );
            var colors = new ColorList( src );
            each(_tones, function(currTone){
                var c = src.getRotatedRYB(self.theta * currTone.x),
                    t = 0.44 - currTone.y * 0.1;
                if(src.brightness() - self.contras * currTone.y < t){
                    c.setBrightness(t);
                } else {
                    c.setBrightness(src.brightness() - self.contrast * currTone.y);
                }
                c.desaturate(0.05);
                colors.add( c );
            });
            return colors;
        },
        toString: function(){
            return 'analagous contrast: ' + this.contrast + ' theta: ' + MathUtils.degrees(this.theta);
        }
    });
});
