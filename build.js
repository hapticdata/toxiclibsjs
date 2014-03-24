var _ = require('underscore'),
    toxi = require('./index'),
    requirejs = require('requirejs'),
    pkg = require('./package.json'),
    defaults,
    wrap,
    banner,
    buildPackageRequires;


//Build a comment for the beginning of the built file
banner = _.template('/*!\n'+
    '* <%= pkg.name %> - v<%= pkg.version %>\n' +
    '* <%= pkg.homepage %>\n' +
    '* Created by [Kyle Phillips](http://haptic-data.com),\n' +
    '* based on original work by [Karsten Schmidt](http://toxiclibs.org).\n' +
    '* Licensed [<%= pkg.licenses[0].type %>](<%= pkg.licenses[0].url %>) \n*/'
)({ _: _, pkg: pkg });
//configure the r.js build
requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

wrap = {
    start: banner+"\nvar toxi;\n(function(){\n",
    endPre: "\ndefine.unordered = true;\n",
    requires: "toxi = require('toxi');\n",
    endPost: "toxi.VERSION = \"" +pkg.version+ "\";\n})();\n"
};

//The default configuration
defaults = {
    baseUrl: "./lib/",
    optimize: 'none',
    out: './build/toxiclibs-custom.js',
    //findNestedDependencies: true,
    paths: {
        'almond': '../node_modules/almond/almond'
    },
    include: ['almond']
};

/**
 * @private
 * build a string for the end-wrap that requires all of the included modules
 * @param {Array} packages
 * @return {String}
 */
var buildPackageRequires = function(packages){
    var tree = {},
        requires;
    //if the top-level 'toxi' object is anywhere in the packges, thats all we need
    if( packages.indexOf('toxi') >= 0 ){
        return 'toxi = require("toxi");';
    }
    //get nested array of packages split as namespaces and toxi removed
    var namespaces = packages.map(function(pkg){
        var namespaces = pkg.replace('.','/').split('/');
        if( namespaces[0] === 'toxi' ){
            namespaces.shift();
        }
        return namespaces;
    });
    //create the packages on a mock object so we know what has already been created
    namespaces.forEach(function(namespaces){
        //create objects on `tree` for every package a module belongs to
        if( namespaces.length > 1 ){
            _.reduce(namespaces, function( mem, nm, i, list ){
                if( i < list.length-1 ){
                    return mem[nm] || (mem[nm] = {});
                }
                return tree;
            }, tree);
        }
    });
    //process namespaces into array of strings for require()'s
    requires = namespaces.map(function(namespaces){
        return _.reduce(namespaces, function( mem, nm, i, list ){
            mem += '.'+nm;
            if( i ===  list.length-1 ){
                return mem+ ' = require("toxi/'+list.join('/')+'");';
            }
            return mem;
        }, 'toxi');
    });

    return [
        "toxi = "+ JSON.stringify(tree) +";",
        requires.join('\n')
    ].join('\n')+'\n';
};

/**
 * returns a require.js build profile for the optimizer
 * @param {Array|String} packages an array or space-delimited string of the modules to include
 * @param {Object} [options] override any config defaults, such as 'out' or 'optimize'
 * @return {Object} the config object
 */
exports.config = function( packages, options ){
    if( typeof packages === 'string' ){
        packages = packages.split(' ');
    }
    //throw an error if one of these doesnt exist
    packages.forEach(requirejs);
    options = _.defaults(options||{}, defaults);
    _.tap(options, function(o){
        o.include = options.include.concat(packages);
        o.wrap = {};
        o.wrap.start = wrap.start;
        o.wrap.end = wrap.endPre;
        o.wrap.end += buildPackageRequires(packages);
        o.wrap.end += wrap.endPost;
    });
    return options;
};

/**
 * produce an optimized build with require.js
 * @param {Array|String} packages array or string-delimited list of modules to inculde
 * @param {Object} [options] optionally provide config properties such as 'out' or 'optimize'
 * @param {Function} [callBack] the `requirejs.optimize` callback
 * @param {Function} [errBack] the `requirejs.optimize` error callback
 */
exports.optimize = function( packages, options, callBack, errBack ){
    if( typeof packages === 'object' ){
        errBack = callback;
        callBack = options;
        options = packages;
        packages = '';
        if( options.include ){
            packages = options.include;
            delete options.include;
        }
    }
    if( !packages ){
        packages = 'toxi';
    }
    requirejs.optimize( exports.config(packages, options), callBack, errBack );
};
