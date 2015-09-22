/**
 Toxiclibs.js API exposed in ./lib/toxi/main
 This file encapsulates the use of requirejs loader for Node
 */

var requirejs = require('requirejs'),
    path = require('path');
//find the lib directory
requirejs.config({
	baseUrl: path.resolve(__dirname + '/../lib'),
    nodeRequire: require
});
//load our entire API
module.exports = requirejs('toxi/index');
