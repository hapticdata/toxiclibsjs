/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');


describe('toxi.geom.Ellipse', function(){
	describe('Constructor', function(){
		describe('no params', function(){
			var ellipse = new toxi.geom.Ellipse();
			it('should be an ellipse', function(){
				assert.equal( ellipse.x, 0 );
				assert.equal( ellipse.y, 0 );
				assert.equal( typeof ellipse.getRadii, 'function' );
			});
		});
	});
});