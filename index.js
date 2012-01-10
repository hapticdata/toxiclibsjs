/**
 Toxiclibs.js API exposed in ./lib/toxi/main
 This file uses requirejs loader for Node
 to avoid user having to change their load methods
 */

//use requirejs instead
var requirejs = require('requirejs');
//create an empty object, fill it in async
var toxi = {};
//find the lib directory
requirejs.config({
	baseUrl: __dirname+ '/lib'
});
//load our entire API
requirejs(['toxi/main'],function(api){
	//populate 'toxi' with the contents
	api.internals.mixin(toxi,api);
});

module.exports = toxi;

