/**
 Toxiclibs.js API exposed in ./lib/toxi/main
 This file encapsulates the use of requirejs loader for Node
 */

var requirejs = require('requirejs');
//find the lib directory
requirejs.config({
	baseUrl: __dirname+ '/lib',
    nodeRequire: require
});
//load our entire API
module.exports = requirejs('toxi/main');
