var toxi = require('../index'),
    assert = require('assert');

describe('toxi.color.createListUsingStrategy( strategy, color )', function(){

    it('should throw an error', function(){
        var list = toxi.color.createListUsingStrategy('splitComplementary', toxi.color.TColor.newRandom());
        assert.ok( list instanceof toxi.color.ColorList );
        assert.ok( list.size() > 1 );
    });
    it('should create a color list using a strategy provided as an instance', function(){
        var list = toxi.color.createListUsingStrategy( new toxi.color.theory.TetradTheoryStrategy(), toxi.color.TColor.newRandom() );
        assert.ok( list instanceof toxi.color.ColorList );
        assert.ok( list.size() > 1 );
    });
});



