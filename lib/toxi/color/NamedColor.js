define([
    './TColor',
    '../internals',
    'exports'
], function( TColor, internals, exports ){
    var each = internals.each,
        names = [],
        //kept private, used for `getForName`
        namedColorMap = {};

    //attach every one of the X11 colors to NamedColor
    //make all names uppercase
    each(TColor.X11, function( value, key ){
        key = key.toUpperCase();
        names.push(key);
        namedColorMap[key] = value;
        exports[key] = value;
    });


    /**
     * Returns the color for the given name
     * @param {String} name
     * @return color or undefined if name not found
     */
    exports.getForName = function( name ){
        return namedColorMap[name];
    };

    /**
     * Return the names of all defined colors
     * @return list of names
     */
    exports.getNames = function(){
        return names.slice(0);
    };

});
