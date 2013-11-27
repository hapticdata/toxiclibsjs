define([
    '../internals/each',
    '../math/mathUtils',
    './ColorRange',
    './namedColor',
    './ColorList'
], function( each, MathUtils, ColorRange, NamedColor, ColorList ){


    var ColorTheme, _ThemePart;


    /**
     * @private
     * internal object for a part of the theme
     * @param {ColorRange} range
     * @param {TColor} color.
     * @param {Number} weight
     */
    _ThemePart = function( range, color, weight ){
        this.range = range;
        this.color = color;
        this.weight = weight;
    };
    _ThemePart.prototype.getColor = function(){
        return this.range.getColor(this.color, ColorRange.DEFAULT_VARIANCE);
    };

    /**
    * A ColorTheme is a weighted collection of {@link ColorRange}s used to define
    * custom palettes with a certain balance between individual colors/shades. New
    * theme parts can be added via textual descriptors referring to one of the
    * preset {@link ColorRange}s and/or {@link NamedColor}s: e.g.
    * "warm springgreen". For each theme part a weight has to be specified. The
    * magnitude of the weight value is irrelevant and is only important in relation
    * to the weights of other theme parts. For example: Theme part A with a weight
    * of 0.5 will only have 1/20 of the weight of theme part B with a weight of 5.0...
    */
    ColorTheme = function( name ){
        this.name = name;
        this.parts = [];
        this._weightedSum = 0;
    };

    ColorTheme.prototype = {
        constructor: ColorTheme,
        /**
         * Add a range to the theme, 2 paramater options:
         * @param {toxi.color.ColorRange|string} range_or_descriptor either a range
         * or a tokenized string
         * @param {toxi.color.TColor|Number} color_or_weight a color if you provided
         * a ColorRange, or a weight if specified a descriptor
         * @param {Number} [weight] a weight if you specified a ColorRange and a TColor
         * for former parameters
         * @return itself
         */
        addRange: function( range_or_descriptor, color_or_weight, weight ){
            var self = this;
            var _range, _col;
            if( arguments.length === 3 ){
                this.parts.push( new _ThemePart(range_or_descriptor, color_or_weight, weight) );
                this._weightedSum += weight;
            } else {
                //tokenize
                each(range_or_descriptor.split(' '), function( item ){
                    if( ColorRange.getPresetForName(item) ){
                        _range = ColorRange.getPresetForName(item);
                    } else if ( NamedColor.getForName(item) ){
                       _col = NamedColor.getForName(item);
                    }
                });
                if( _range ){
                    self.addRange( _range, _col, color_or_weight );
                }
            }
            return this;
        },
        getColor: function(){
            var self = this,
                rnd = Math.random(),
                t,
                currWeight;
            for( var i = 0, l = this.parts.length; i<l; i++){
                t = this.parts[i];
                currWeight = t.weight / this._weightedSum;
                if( currWeight >= rnd ){
                    return t.getColor();
                }
                rnd -= currWeight;
            }
            return null;
        },
        /**
         * Creates a {ColorList} of {TColor} based on the theme's
         * ranges and balance defined by their weights
         * @param {Number} num the number of colors to put in the list
         */
        getColors: function( num ){
           var list = new ColorList();
           for( var i = 0; i < num; i++) {
               list.add( this.getColor() );
            }
           return list;
        },
        /**
         * @return the theme's name
         */
        getName: function(){
            return this.name;
        }
    };

    return ColorTheme;
});
