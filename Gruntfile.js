/*global module:false, __dirname:false, require:false, process:false*/

var build = require('./build');

module.exports = function (grunt){

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*!\n'+
				'* <%= pkg.name %> - v<%= pkg.version %>\n' +
				'* Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* <%= pkg.homepage %>\n' +
				'* (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> \n*/'
		},
		requirejs: {
            all: build('toxi', {
                out: './build/toxiclibs.js'
            }),
            'all-min': build('toxi', {
                optimize: 'uglify2',
                preserveLicenseComments: false,
                out: './build/toxiclibs.min.js'
            }),
            'color-min': build('toxi/color', {
                optimize: 'uglify2',
                preserveLicenseComments: false,
                out: './build/toxiclibs-color.min.js'
            }),
            core: build([
                'toxi/geom',
                'toxi/math',
                'toxi/util'
            ],{
                optimize: 'uglify2',
                preserveLicenseComments: false,
                out: './build/toxiclibs-core.min.js'
            })
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('build', function(){
        console.log( grunt.option('include') );
    });
    grunt.registerTask('default', 'build');

};
