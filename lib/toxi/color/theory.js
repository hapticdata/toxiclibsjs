define(function( require, exports ){
    exports.AnalagousStrategy = require('./theory/AnalagousStrategy');
    exports.colorTheoryRegistry = require('./theory/colorTheoryRegistry');
    //keep it uppercase also
    exports.ColorTheoryRegistry = exports.colorTheoryRegistry;
    exports.ComplementartyStrategy = require('./theory/ComplementaryStrategy');
    exports.CompoundTheoryStrategy = require('./theory/CompoundTheoryStrategy');
    exports.LeftSplitComplementaryStrategy = require('./theory/LeftSplitComplementaryStrategy');
    exports.MonochromeTheoryStrategy = require('./theory/MonochromeTheoryStrategy');
    exports.RightSplitComplementaryStrategy = require('./theory/RightSplitComplementaryStrategy');
    exports.SingleComplementStrategy = require('./theory/SingleComplementStrategy');
    exports.SplitComplementaryStrategy = require('./theory/SplitComplementaryStrategy');
    exports.TetradTheoryStrategy = require('./theory/TetradTheoryStrategy');
    exports.TriadTheoryStrategy = require('./theory/TriadTheoryStrategy');
    //for creating custom strategies
    exports.strategies = require('./theory/strategies');
});
