define([
    '../internals',
    '../math/mathUtils',
    './ColorRange'
], function( internals, MathUtils, ColorRange ){


    var ColorTheme, _ThemePart;


    /**
     * @private
     * internal object for a part of the theme
     * @param {ColorRange} range
     * @param {TColor} color
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


    ColorTheme = function( name ){
        this.name = name;
        this.parts = [];
        this._weightedSum = 0;
    };

    ColorTheme.prototype = {
        constructor: ColorTheme,
        addRange: function( range_or_descriptor, color_or_weight, weight ){

        }
    };

    return ColorTheme;






});
