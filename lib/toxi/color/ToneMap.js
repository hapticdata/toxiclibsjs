define([
    'toxi/internals/is',
    'toxi/math/ScaleMap',
    './ColorList',
    './ColorGradient'
], function( is, ScaleMap, ColorList, ColorGradient ){

    var ToneMap;
    /**
     * ToneMap
     * @constructor
     * @param {Number} min `min` or `a`
     * @param {Number} max `max` or `b`
     * @param {toxi.color.ColorGradient|ColorList|TColor} g
     * @param {toxi.color.TColor} [colorB]
     * @param {Number} [resolution]
     *
     * @usages
     * new ToneMap( min, max, gradient );
     * or
     * new ToneMap( min, max, colorList );
     * or
     * new ToneMap( a, b, colorA, colorB );
     * or
     * new ToneMap( min, max, colorA, colorB, resolution );
     */
    ToneMap = function( min, max, list, colorB, resolution ){
        var al = arguments.length;
        if( al > 3 ){
            //( a, b, colorA, colorB )
            if( al === 4 ){
                list = new ColorList( list, colorB );
            } else {
                //( min, max, colorA, colorB, resolution )
                var colA = list;
                list = new ColorGradient();
                list.addColorAt(0, colA);
                list.addColorAt(resolution-1, colorB);
                list = list.calcGradient(0, resolution);
            }
        //by now all of the variables are syphoned down to min, max, colorList
        }
        //( min, max, gradient ) or
        //( min, max, colorlist )
        if( is.ColorGradient( list ) ){
            //make it a colorlist
            list = list.calcGradient();
        }
        this.map = new ScaleMap( min, max, 0, list.size()-1 );
        this.colors = list;
    };

    ToneMap.prototype = {
        constructor: ToneMap,
        getARGBToneFor: function( t  ){
            return this.getToneFor(t).toARGB();
        },
        /**
        * get a color from a tonal value
        * @param {Number} t
        * @return {toxi.color.TColor}
        */
        getToneFor: function( t ){
            var idx;
            if( this.colors.size() > 2 ){
                idx = Math.floor( this.map.getClippedValueFor(t) + 0.5 );
            } else {
                idx = t >= this.map.getInputMedian() ? 1 : 0;
            }
            return this.colors.get(idx);
        },
        /**
        * Applies the tonemap to all elements in the given source array of
        * values and places the resulting ARGB color in the corresponding
        * index of the target pixel buffer. If the target buffer is null, a new one
        * will be created automatically.
        *
        * @param {Array<Number>}src source array of values to be tone mapped
        * @param {Array<Number>}pixels target pixel buffer
        * @param {Number} [offset] optionally provide an index-offset to start
        * at in the destination pixels array
        * @return pixel array
        */
        getToneMappedArray: function( src, pixels, offset ){
            if( typeof offset !== 'number'){
                offset = 0;
            } else if ( offset < 0 ){
                throw new Error("offset into target pixel array is negative");
            }
            pixels = pixels || new Array(src.length);
            for(var i=0, l=src.length; i<l; i++){
                pixels[offset++] = this.getToneFor(src[i]).toARGB();
            }
            return pixels;
        },
        /**
         * @param {toxi.math.InterpolateStrategy} func
         */
        setMapFunction: function( func ){
            this.map.setMapFunction( func );
        }
    };

    return ToneMap;

});
