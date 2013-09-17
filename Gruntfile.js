var bConfig = require('./build').config;

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
            'physics2d': bConfig([
                'toxi/geom/Vec2D',
                'toxi/physics2d',
                'toxi/color/TColor'],{
                out: './build/toxiclibs-physic2d.js'
            }),
            all: bConfig('toxi', {
                out: './build/toxiclibs.js'
            }),
            'all-min': bConfig('toxi', {
                optimize: 'uglify2',
                preserveLicenseComments: false,
                out: './build/toxiclibs.min.js'
            }),
            'color-min': bConfig('toxi/color', {
                optimize: 'none',
                preserveLicenseComments: false,
                out: './build/toxiclibs-color.min.js'
            }),
            core: bConfig([
                'toxi/geom',
                'toxi/math',
                'toxi/util'
            ],{
                optimize: 'uglify2',
                preserveLicenseComments: false,
                out: './build/toxiclibs-core.min.js'
            })
		},
        build: {
            custom: {}
        }
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerMultiTask('build', 'build a compressed bundle',function(){
        console.log( grunt.option('include') );
        grunt.log.writeln(this.target + ': ' + this.data);
    });
    grunt.registerTask('default', 'build');

};
