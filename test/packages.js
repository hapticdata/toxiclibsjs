var t = require('../index'),
	assert = require('assert');

//test that all modules are functions
//excludeList is an array of modules to ignore (maybe they should be objects)
var classes = [];
function createFunctionTests( pkg, excludeList ){
	excludeList = excludeList || [];
	describe('package module', function(){
		for( var module in pkg ){
			if(excludeList.indexOf(module) < 0){
				(function( m ){
					it('`'+m+'` should be a function', function(){
						//console.log(classes.length + ' ' +m);
						assert.equal(typeof pkg[m],'function');
						classes.push( m );
					});
				}(module));
			}
		}
	});
}
//test a package
function pkg( id, obj, excludes ){
	describe( id, function(){
		it('should be an object', function(){
			assert.equal(typeof obj, 'object');
		});
		createFunctionTests( obj, excludes );
	});
}

//toxi.color
pkg('color',t.color, ['accessCriteria','AccessCriteria','namedColor','NamedColor','theory']);
pkg('color.theory', t.color.theory, ['colorTheoryRegistry','ColorTheoryRegistry', 'strategies']);
//toxi.geom
pkg('geom',t.geom,['mesh']);
//toxi.geom.mesh
pkg('geom.mesh',t.geom.mesh, ['subdiv']);
//pkg('geom.mesh.subdiv', t.geom.mesh.subdiv);
//toxi.math
pkg('math', t.math, ['mathUtils', 'MathUtils','Interpolation2D','waves','noise']);
pkg('math.waves', t.math.waves);
pkg('math.noise', t.math.noise, ['simplexNoise']);
//t.physics2D
pkg('physics2d', t.physics2d, ['behaviors','constraints']);
pkg('physics2d.behaviors', t.physics2d.behaviors );
pkg('physics2d.constraint', t.physics2d.constraints );
pkg('processing', t.processing);
pkg('THREE', t.THREE);
pkg('util', t.util, ['datatypes']);
pkg('util.datatypes', t.util.datatypes);
