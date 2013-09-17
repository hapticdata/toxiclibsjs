define(function( require, exports ){

    var internals = require('../../internals'),
        each = internals.each,
        keys = internals.keys,
        values = internals.values,
        implementations = {};

    var strats = {
        SINGLE_COMPLEMENT: require('./SingleComplementStrategy'),
        COMPLEMENTARY: require('./ComplementaryStrategy'),
        SPLIT_COMPLEMENTARY: require('./SplitComplementaryStrategy'),
        LEFT_SPLIT_COMPLEMENTARY: require('./LeftSplitComplementaryStrategy'),
        RIGHT_SPLIT_COMPLEMENTARY: require('./RightSplitComplementaryStrategy'),
        ANALAGOUS: require('./AnalagousStrategy'),
        MONOCHROME: require('./MonochromeTheoryStrategy'),
        TRIAD: require('./TriadTheoryStrategy'),
        TETRAD: require('./TetradTheoryStrategy'),
        COMPOUND: require('./CompoundTheoryStrategy')
    };

    exports.getRegisteredNames = function(){
        return keys(implementations);
    };

    exports.getRegisteredStrategies = function(){
        return values(implementations);
    };

    exports.getStrategyForName = function( id ){
        return implementations[id];
    };

    exports.registerImplementation = function( impl ){
        implementations[ impl.getName() ] = impl;
    };

    each(strats, function( Constructor, type ){
        exports[type] = new (strats[type])();
        exports.registerImplementation( exports[type] );
    });
});


