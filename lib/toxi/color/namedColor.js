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
        var upkey = key.toUpperCase();
        names.push(upkey);
        namedColorMap[upkey] = value;
        namedColorMap[key] = value;
        exports[upkey] = value;
    });


    /**
     * Returns the color for the given name
     * @param {String} name
     * @return color or undefined if name not found
     */
    exports.getForName = function( name ){
        //return the color, and if it was sent like "springGreen", lowercase it to be nice :)
        return namedColorMap[name] || namedColorMap[name.toLowerCase()];
    };

    /**
     * Return the names of all defined colors
     * @return list of names
     */
    exports.getNames = function(){
        return names.slice(0);
    };

});
