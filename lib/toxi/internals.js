define(function(require, exports) {
/**
 * @namespace contains helper functions used internally
 * THESE MODULES ARE NOT ALLOWED TO HAVE DEPENDENCIES OUTSIDE
 * THE `internals` PACKAGE
 */

//do type-tests to detect properties on objects
exports.is = require('./internals/is');
//test if objects have properties
exports.has = require('./internals/has');
//extend the prototype of a class
exports.extend = require('./internals/extend');
exports.each = require('./internals/each');
exports.bind = require('./internals/bind');
exports.keys = require('./internals/keys');
exports.values = require('./internals/values');
exports.filter = require('./internals/filter');
//receives an object of properties to set on source object
exports.mixin = require('./internals/mixin');
//imitates java-style Iterator
exports.Iterator = require('./internals/Iterator');
//used for keeping HashMap-like collections
exports.LinkedMap = require('./internals/LinkedMap');
//simport sort comparator for numbers
exports.numberComparator = require('./internals/numberComparator');
exports.removeItemFrom = require('./internals/removeItemFrom');

});
