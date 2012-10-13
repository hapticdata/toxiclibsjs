define(['require','exports','module','./vectors'], function( require, exports, module ){
    //Vec2D is located in toxi/geom/vectors to circumvent circular dependencies
    module.exports = require('./vectors').Vec2D;
});