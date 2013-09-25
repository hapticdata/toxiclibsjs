define([
    '../internals/LinkedMap',
    '../internals/each'
], function( LinkedMap, each ){

    var namedHues = new LinkedMap(),
        primaryHues = [],
        Hue;
    /*
    * This class defines color hues and allows them to be access by name. There are
    * also methods to check if a hue is one of the 7 primary hues (rainbow) or to
    * find the closest defined hue for a given color.
    */

    /**
     * construct a new Hue
     * @param {String} name
     * @param {Number} hue (range 0-1)
     * @param {Boolean} [isPrimary] optionally flag as a primary hue
     * @constructor
     */
    Hue = function( name, hue, isPrimary ){
        this._isPrimary = (isPrimary === true );
        this.name = name;
        this.hue = hue;
        namedHues.put( name, this );
        if( this._isPrimary ){
            primaryHues.push( this );
        }
    };


    Hue.prototype = {
        constructor: Hue,
        getHue: function(){ return this.hue; },
        getName: function(){ return this.name; },
        isPrimary: function(){ return this._isPrimary; },
        toString: function(){
            return "Hue: ID:" + this.name + " @ " + parseInt(this.hue*360, 10) + " degrees";
        }
    };

    //add presets object, like what `toxi.color.ColorRange` has,
    //allows for easy look-up
    Hue.PRESETS = {};
    //add the basic hues
    each([
        ['red', true],
        ['orange', true],
        ['yellow', true],
        ['lime'],
        ['green',true],
        ['teal'],
        ['cyan'],
        ['azure'],
        ['blue',true],
        ['indigo'],
        ['purple',true],
        ['pink',true]
    ], function( item, i ){
        var name = item[0],
            nameUC = name.toUpperCase(),
            isPrimary = item[1];
        Hue[nameUC] = new Hue( name, i * 30 / 360.0, isPrimary );
        Hue.PRESETS[nameUC] = Hue[nameUC];
    });

    // Tolerance value for checking if a given hue is primary
    Hue.PRIMARY_VARIANCE = 0.01;

    /**
     * Finds the closest defined & named Hue for the given hue vale.
     * Optionally, the serach can be limited to primary hues only.
     * @param {Number} hue
     * @param {Boolean} [primaryOnly]
     * @returns Hue
     */
    Hue.getClosest = function( hue, primaryOnly ){
        hue %= 1;
        primaryOnly = (primaryOnly === true);
        var dist = Number.MAX_VALUE,
            closest,
            hues = primaryOnly ? primaryHues : namedHues.getArray();
        each(hues, function(h){
            var d = Math.min( Math.abs(h.getHue() - hue), Math.abs(1 + h.getHue() - hue) );
            if( d < dist ) {
                dist = d;
                closest = h;
            }
        });
        return closest;
    };

    Hue.getForName = function( name ){
        return namedHues.get(name);
    };

    Hue.isPrimary = function( hue, variance ){
        variance = typeof variance === 'number' ? variance : Hue.PRIMARY_VARIANCE;
        var isPrimary = false;
        for( var i=0, len = primaryHues.length; i<len; i++ ){
            var h = primaryHues[i];
            if( Math.abs( hue - h.getHue() ) < variance ) {
                isPrimary = true;
                break;
            }
        }
        return isPrimary;
    };

    return Hue;
});
