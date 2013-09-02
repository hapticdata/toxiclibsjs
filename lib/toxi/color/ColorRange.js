define([
    './TColor',
    './ColorList',
    '../util/datatypes/FloatRange',
    '../internals/is',
    '../internals/each',
    '../math/mathUtils'
],function( TColor, ColorList, FloatRange, is, each, MathUtils ){

    var ColorRange,
        UNTITLED_ID = 1,
        addRange,
        addAll,
        pickRandom;


    //@private
    //add all elements to the given array, without creating a new array (like concat)
    addAll = function( arr, elementsArr ){
        arr.push.apply(arr, elementsArr);
    };

    //@private
    //the addAlphaRange, addHueRange… methods are identical, so with js,
    //we can generate them without
    addRange = function(attr){
        return function( min, max ){
            this[attr.toLowerCase()+'Constraint'].push( is.FloatRange(min) ? min : new FloatRange(min,max) );
            return this;
        };
    };

    //@private
    //pickRandom element from array
    pickRandom = function( arr ){
        return arr[Math.floor(Math.random()*arr.length)];
    };

    /**
    * A ColorRange is a set of constraints to specify possible ranges for hue,
    * saturation, brightness and alpha independently and use these as creation
    * rules for new {@link TColor}s or {@link ColorList}s. The class comes with 11
    * preset ranges reflecting common demands and color characters. You can also
    * construct new ranges and manually add additional constraints. Unless the
    * constraints in a range are very narrow the class will always create random
    * variations within the constraints. Please see the examples for further
    * details.
    *
    * {@link ColorRange}s are a key ingredient for defining {@link ColorTheme}s but
    * can also be used individually.
    */


    /**
    * construct a new ColorRange,
    * this constructor takes a wide variety of param signatures,
    * 1.
        * @param {toxi.color.ColorList} list
    * 2.
        * @param {toxi.util.datatypes.FloatRange} [hue]
        * @param {toxi.util.datatypes.FloatRange} [sat]
        * @param {toxi.util.datatypes.FloatRange} [bri]
        * @param {toxi.util.datatypes.FloatRange} [alpha]
        * @param {toxi.util.datatypes.FloatRange} [black]
        * @param {toxi.util.datatypes.FloatRange} [white]
        * @param {String} [name]
    * 3.
        * @param {toxi.util.datatypes.FloatRange} [hue]
        * @param {toxi.util.datatypes.FloatRange} [sat]
        * @param {toxi.util.datatypes.FloatRange} [bri]
        * @param {toxi.util.datatypes.FloatRange} [alpha]
        * @param {String} [name]
    * 4.
        * @param {toxi.util.datatypes.FloatRange} [hue]
        * @param {toxi.util.datatypes.FloatRange} [sat]
        * @param {toxi.util.datatypes.FloatRange} [bri]
        * @param {String} [name]
    * 5.name
        * @param {toxi.color.Hue} hue
    * 6.
        * @param {toxi.color.TColor} c
    */
    ColorRange = function( hue, sat, bri, alpha, black, white, name ){
        var self = this, list; //if ColorList is supplied
        if( arguments.length === 0 ){
            return this;
        }
        //ColorRange( ColorList list)
        if( is.ColorList(hue) ){
            list = hue;
            hue = list.get(0);
        }
        //ColorRange( Hue hue )
        if( is.Hue(hue) ){
            hue = new FloatRange( hue.getHue(), hue.getHue() );
        }
        //ColorRange( TColor c )
        if( is.TColor(hue) ){
            //transform `hue` from a TColor to FloatRange for hue
            hue = new FloatRange( hue.hue(), hue.hue() );
        }
        this.hueConstraint = [is.FloatRange(hue) ? hue : new FloatRange(0,1)];
        this.saturationConstraint = [is.FloatRange(sat) ? sat : new FloatRange(0,1)];
        this.brightnessConstraint = [is.FloatRange(bri) ? bri : new FloatRange(0,1)];
        this.alphaConstraint = [is.FloatRange(alpha) ? alpha : new FloatRange(1,1)];
        //not arrays for black & white
        this.black = is.FloatRange(black) ? black : new FloatRange(0,1);
        this.white = is.FloatRange(white) ? white : new FloatRange(0,1);
        //now that the constraints have all been created
        if( list ){
            this.hueConstraint = []; //clear the hues
            list.each(function(c){ self.add(c); });
        }
        //search arguments for a string that would be the name
        var i=arguments.length-1;
        for(; i>=0; i--){
            if( typeof arguments[i] === 'string' ){
                this.name = arguments[i];
                break;
            }
        }
        if( !this.name ){
            this.name = "untitled"+(UNTITLED_ID++);
        }
    };


    ColorRange.prototype = {
        constructor: ColorRange,
        /**
         * Adds the HSV color components as constraints
         * @param {toxi.color.ColorRange | toxi.color.TColor} rc
         * @return itself
         */
        add: function( rc ){
            if( is.ColorRange(rc) ){
                addAll(this.hueConstraint, rc.hueConstraint);
                addAll(this.saturationConstraint, rc.saturationConstraint);
                addAll(this.brightnessConstraint, rc.brightnessConstraint);
                addAll(this.alphaConstraint, rc.alphaConstraint);
                this.black.min = Math.min( this.black.min, rc.black.min );
                this.black.max = Math.max( this.black.max, rc.black.max );
                this.white.min = Math.min( this.white.min, rc.white.min );
                this.white.max = Math.max( this.white.max, rc.white.max );
            } else {
                this.hueConstraint.push( new FloatRange(rc.hue(),rc.hue()) );
                this.saturationConstraint.push( new FloatRange(rc.saturation(),rc.saturation()) );
                this.brightnessConstraint.push( new FloatRange(rc.brightness(),rc.brightness()) );
                this.alphaConstraint.push( new FloatRange(rc.alpha(),rc.alpha()) );
            }
            return this;
        },
        /**
         * Adds the range between min-max as possible alpha values for this range
         * @param {toxi.util.datatypes.FloatRange | Number} min
         * @param {Number} [max]
         * @return itself
         */
        addAlphaRange: addRange('alpha'),
        addBrightnessRange: addRange('brightness'),
        addHue: function( hue ){
            this.hueConstraint.push( new FloatRange( hue.getHue(), hue.getHue() ) );
            return this;
        },
        addHueRange: addRange('hue'),
        addSaturationRange: addRange('saturation'),
        /**
         * checks if all HSVA components of the given color are within
         * the constraints define for this range
         * @param {toxi.color.TColor} c
         * @return true if is contained
         */
        contains: function( c ){
            var isInRange = this.isValueInConstraint(c.hue(), this.hueConstraint);
            isInRange &= this.isValueInConstraint(c.saturation(), this.saturationConstraint);
            isInRange &= this.isValueInConstraint(c.brightness(), this.brightnessConstraint);
            isInRange &= this.isValueInConstraint(c.alpha(), this.alphaConstraint);
            return isInRange || false; //if its 0, return false
        },
        /**
         * creates a copy of the range but overrides the hue
         * and alpha constraints taken from the given color (if specified)
         * @param {toxi.color.TColor} [c]
         * @param {Number} [variance]
         * @return copy
         */
        copy: function( c, variance ){
            variance = typeof variance === 'number' ? variance : 0;
            var range = new ColorRange();
            range.name = this.name;
            if( c ){
                var hue = c.hue() + variance * MathUtils.normalizedRandom();
                range.hueConstraint = [ new FloatRange(hue,hue) ];
                range.alphaConstraint = [ new FloatRange(c.alpha(),c.alpha()) ];
            } else {
                range.hueConstraint = [].concat(this.hueConstraint);
                range.alphaConstraint = [].concat(this.alphaConstraint);
            }
            range.saturationConstraint = [].concat(this.saturationConstraint);
            range.brightnessConstraint = [].concat(this.brightnessConstraint);
            range.black = this.black.copy();
            range.white = this.white.copy();
            return range;
        },
        /**
         * creates a new shade of the given parameter based on the other constraints
         * of the range. This function has many param options:
         * 1. no params
         * 2.
            * @param {toxi.color.Hue} hue
         * 3.
            * @param {toxi.color.TColor} c
            * @param {Number} variance
        */
        getColor: function( hue_c, variance ){
            if( is.Hue(hue_c) ){
                return TColor.newHSVA(
                    hue_c.getHue(),
                    pickRandom(this.saturationConstraint).pickRandom(),
                    pickRandom(this.brightnessConstraint).pickRandom(),
                    pickRandom(this.alphaConstraint).pickRandom()
                );
            }
            //must be a TColor
            var c = hue_c, h, s, b, a;
            if( c ){
                if( c.isBlack() ){
                    return TColor.newHSVA(c.hue(), 0, this.black.pickRandom(), c.alpha() );
                } else if( c.isWhite() ){
                    return TColor.newHSVA(c.hue(), 0, this.white.pickRandom(), c.alpha() );
                }
                if( c.isGrey() ){
                    return TColor.newHSVA(
                        c.hue(),
                        0,
                        MathUtils.flipCoin() ? this.black.pickRandom() : this.white.pickRandom(),
                        c.alpha()
                    );
                }
                h = c.hue() + variance * MathUtils.normalizedRandom();
                a = c.alpha();
            } else {
                h = pickRandom(this.hueConstraint).pickRandom();
                a = pickRandom(this.alphaConstraint).pickRandom();
            }
            s = pickRandom(this.saturationConstraint).pickRandom();
            b = pickRandom(this.brightnessConstraint).pickRandom();
            return TColor.newHSVA(h,s,b,a);
        },
        /**
        * creates a new `toxi.color.ColorList` of colors based
        * on constraints of this range
        * 1.
            * @param {Number} num integer of how many colors to get
        * 2.
            * @param {toxi.color.TColor} c
            * @param {Number} num
            * @param {Number} variance
        * @return {toxi.color.ColorList} list
        */
        getColors: function( c, num, variance ){
            if( arguments.length < 3 ){
                variance = ColorRange.DEFAULT_VARIANCE;
            }
            if( arguments.length === 1 ){
                num = c;
                c = undefined;
            }
            var list = new ColorList();
            for( var i=0; i<num; i++){
                list.add(this.getColor(c, variance));
            }
            return list;
        },
        /**
         * creates a new shade of gray
         * @param {Number} brightness
         * @param {Number} variance
         */
        getGrayscale: function( brightness, variance ){
            return this.getColor( TColor.newGray(brightness), variance);
        },
        getName: function(){
            return this.name;
        },
        /**
         * creates a copy of the current range and adds the given one to it
         * @param {toxi.color.ColorRange} range
         * @return the summed copy
         */
        getSum: function( range ){
            return this.copy().add(range);
        },
        isValueInConstraint: function( val, rangeSet ){
            var isValid = false;
            each(rangeSet, function(r){
                isValid |= r.isValueInRange(val);
            });
            return isValid;
        }
    };


    //default hue variance for #getColor
    ColorRange.DEFAULT_VARIANCE = 0.035;

    //build static pre-defined ColorRange's
    (function(FR, un){
        ColorRange.PRESETS = {};
        each({
            'light': [ un, new FR(0.3,0.7),new FR(0.9,1.0), un, new FR(0.15,0.3),un],
            'dark': [un, new FR(0.7,1.0), new FR(0.15,0.4),un,un, new FR(0.5,0.75)],
            'bright': [un, new FR(0.8,1.0), new FR(0.8,1.0)],
            'weak': [un, new FR(0.15,0.3), new FR(0.7,1.0), un, new FR(0.2,0.2),un],
            'neutral': [un, new FR(0.25,0.35), new FR(0.3,0.7),un,new FR(0.15,0.15), new FR(0.9,1.0)],
            'fresh': [un, new FR(0.4,0.8), new FR(0.8,1.0), un, new FR(0.05,0.3), new FR(0.8,1.0)],
            'soft': [un, new FR(0.2,0.3),new FR(0.6,0.9), un, new FR(0.05,0.15), new FR(0.6,0.9)],
            'hard': [un, new FR(0.9,1.0), new FR(0.4,1.0)],
            'warm': [un, new FR(0.6,0.9), new FR(0.4,0.9), un, new FR(0.2,0.2), new FR(0.8,1.0)],
            'cool': [un, new FR(0.05, 0.2), new FR(0.9, 1.0), un, un, new FR(0.95,1.0)],
            'intense': [un, new FR(0.9,1.0), new FR(0.2,0.35)]
        }, function( args, name ){
            args.push(name);
            var nameUC = name.toUpperCase();
            //construct a new ColorRange without params (only do this internally)
            ColorRange[nameUC] = new ColorRange();
            //apply the arguments to the constructor
            ColorRange.apply(ColorRange[nameUC], args);
            //reference the same object from the PRESETS object
            ColorRange.PRESETS[nameUC] = ColorRange[nameUC];
        });
        ColorRange.INTENSE.addBrightnessRange( new FR(0.8,1.0) );
    }(FloatRange, undefined));


    ColorRange.getPresetForName = function( name ){
        return ColorRange.PRESETS[name.toUpperCase()];
    };

    return ColorRange;
});
