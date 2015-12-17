var fs = require('fs'),
    _ = require('underscore'),
    browserify = require('browserify'),
    uglifyJS = require('uglify-js'),
    converter = require('./convert-to-commonjs');


//Build a comment for the beginning of the built file
var banner = _.template('/*!\n'+
    '* <%= pkg.name %> - v<%= pkg.version %>\n' +
    '* <%= pkg.homepage %>\n' +
    '* Created by [Kyle Phillips](http://haptic-data.com),\n' +
    '* based on original work by [Karsten Schmidt](http://toxiclibs.org).\n' +
    '* Licensed [<%= pkg.licenses[0].type %>](<%= pkg.licenses[0].url %>) \n*/\n'
)({ _: _, pkg: require('../package.json') });

/**
 * build a string (to write to disk) that will serve as a custom entry point for the bundle
 * @param {Array} packages
 * @return {String}
 */
exports.parseCustomEntry = function(packages){
    var tree = {},
        requires;
    //if the top-level 'toxi' object is anywhere in the packges, thats all we need
    if( packages.indexOf('toxi') >= 0 ){
        return 'module.exports = require("./index");';
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
                return mem+ ' = require("./'+list.join('/')+'");';
            }
            return mem;
        }, 'exports');
    });

    return [
        "module.exports = exports = "+ JSON.stringify(tree) +";",
        requires.join('\n')
    ].join('\n')+'\n';
};


/**
 * create a bundled build
 * @param {Array} [packages] optional array of the only modules you want to include, i.e. ['toxi/geom/Vec2D']
 * @param {Object} [options] optional object of build parameters
 * @param {String} [options.out] a path to write the build contents to
 * @param {Boolean} [options.minify] should the contents be minified
 * @param {Function} [callback(error, string)] callback to receive final buffer
 */
exports.bundle = function bundle(packages, options, callback){
    if(!Array.isArray(packages)){
        if(typeof packages === 'object'){
            callback = options;
            options = packages;
            packages = null;
        }
        if(typeof packages === 'function'){
            options = {};
            callback = packages;
            packages = null;
        }
    } else if(typeof options === 'function'){
        callback = options;
        options = {};
    }

    callback = callback || function(){};


    converter.convert(function(){
        generateBundle(packages, options, callback);
    });
};

function generateBundle(packages, options, callback){
    var entry = './commonjs/custom-entry.js';

    fs.writeFileSync(entry, exports.parseCustomEntry(packages || ['toxi']));

    var b = browserify({
        standalone: 'toxi'
    });

    b.add(entry);

    var bundle = b.bundle(function(err, buff){
        //delete the custom-entry immediately upon bundle completion
        fs.unlinkSync(entry);

        var code = String(buff);
        if(options.minify){

            var minified = uglifyJS.minify(code, {fromString: true});

            if(options.out){
                fs.writeFileSync(options.out, minified.code);
                callback(null);
                return;
            }
            callback(null, minified.code);
            return;
        }

        code = banner + code;

        if(options.out){
            fs.writeFileSync(options.out, code);
            callback(null);
            return;
        }

        callback(null, code);
    });

    bundle.on('error', function(error){
        //delete the entry
        fs.unlinkSync(entry);
        callback(error);
    });
}
