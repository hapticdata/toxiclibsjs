define(function( require ){
    return Object.keys || function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (exports.has(obj, key)) keys.push(key);
        return keys;
    };
});
