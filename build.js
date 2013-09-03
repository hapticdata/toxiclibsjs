var _ = require('underscore'),
    toxi = require('./index'),
    requirejs = require('requirejs'),
    defaults,
    wrap;

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

wrap = {
    start: "<%= meta.banner %>\nvar toxi;\n(function(){\n",
    endPre: "\ndefine.unordered = true;\n",
    requires: "toxi = require('toxi');\n",
    endPost: "toxi.VERSION = \"<%= pkg.version %>\";\n})();\n"
};


defaults = {
    baseUrl: "./lib/",
    optimize: 'none',
    //findNestedDependencies: true,
    paths: {
        almond: '../node_modules/almond/almond'
    },
    include: ['../node_modules/almond/almond']
};

var traverse = function(packages){
    //if the top-level object is anywhere in the packges, thats all we need
    if( packages.indexOf('toxi') >= 0 ){
        return 'toxi = require("toxi");';
    }
    if( typeof packages === 'string' ){
        packages = packages.split(' ');
    }
    //create the packages on a mock object so we know what has already been created
    var mock = {};
    //for every package
    var requires = packages.map(function(pkg){
        var namespaces = pkg.split('/');
        if( namespaces[0] === 'toxi' ){
            namespaces.shift();
        }

        var c;
        if( namespaces.length > 1 ){
            var o = _.reduce(namespaces, function( mem, nm, i, list ){
                if( i < list.length-1 ){
                return mem[nm] || (mem[nm] = {});
                }
                return mock;
            }, mock);
        }

        var pkgStr = _.reduce(namespaces, function( mem, nm, i, list ){
            mem += '.'+nm;
            if( i ===  list.length-1 ){
                return mem+ ' = require("'+pkg+'");';
            }
            return mem;
        }, 'toxi');

        return pkgStr;
    });
    var str = '';
    str += "toxi = "+ JSON.stringify(mock) +";\n";
    str += requires.join('\n')+'\n';
    return str;
};


module.exports = function( packages, options ){
    if( typeof packages === 'string' ){
        packages = packages.split(' ');
    }
    //throw an error if one of these doesnt exist
    packages.forEach(requirejs);
    options = _.defaults(options||{}, defaults);
    options.include = options.include.concat(packages);
    _.tap(options, function(o){
        o.wrap = {};
        o.wrap.start = wrap.start;
        o.wrap.end = wrap.endPre;
        o.wrap.end += traverse(packages);
        o.wrap.end += wrap.endPost;
    });
    return {
        options: options
    };
};
