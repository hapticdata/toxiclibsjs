/*global describe, it*/
var toxi = require('../index'),
    assert = require('assert');

describe('ColorList', function(){
    var cl = new toxi.color.ColorList();

    it('should be a ColorList instance', function(){
        assert.ok( cl instanceof toxi.color.ColorList );
        assert.equal( cl.add, toxi.color.ColorList.prototype.add );
        assert.equal( typeof cl.addAll, 'function');
    });

    describe('#add()', function(){
        it('should add 3 colors', function(){
            cl
                .add( toxi.color.TColor.newRGB( 1, 0, 0 ) )
                .add( toxi.color.TColor.newRGB( 0, 1, 0 ) )
                .add( toxi.color.TColor.newRGB( 0, 0, 1 ) );
            assert.equal( cl.colors.length, 3 );
        });
    });

    describe('#addAll()', function(){
        it('should add another 3 colors', function(){
           cl.addAll([
               toxi.color.TColor.newRGB( 1, 1, 0 ),
               toxi.color.TColor.newRGB( 0, 1, 1 ),
               toxi.color.TColor.newRGB( 1, 0, 1 )
           ]);
           assert.equal( cl.colors.length, 6 );
        });
    });

    //This matches java, but it seems like the subCriteria should be reversed?
    describe('#clusterSort()', function(){
       it('should organize by red, then green', function(){
           cl.clusterSort( toxi.color.AccessCriteria.RED, toxi.color.AccessCriteria.GREEN, 3, false );
           var last = cl.colors[0].red();
           cl.each(function( c ){
              assert.ok( c.red() <= last );
              last = c.red();
           });
       });
    });

    describe('#getDarkest()', function(){
       it('should return the darkest color', function(){
           var darkest = cl.getDarkest();

           cl.each(function( c ){
               if(c.brightness() < darkest.brightness() ){
                   assert.ok( false );
               }
           });
           assert.ok( true );
       });
    });

    describe('#size()', function(){
        it('should be 6', function(){
            assert.equal( cl.size(), 6 );
        });
    });

    describe('#sortByDistance()', function(){
        it('should sort by distance on HSV', function(){
           cl.sortByDistance( new toxi.color.HSVDistanceProxy(), false );
           assert.ok( cl.colors[0].hsv[0] > 0.6 && cl.colors[0].hsv[0] < 0.7 );
           assert.equal( cl.colors[cl.colors.length-1].hsv[0], 0.5);
        });
    });

    describe('.createUsingStrategy( )', function(){
        it('should throw an error', function(){
            assert.throws( toxi.color.ColorList.createUsingStrategy, Error );
        });
    });
});
