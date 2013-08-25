/*global describe, it*/
var toxi = require('../index'),
    assert = require('assert');


describe('toxi.color.Hue', function(){
    var hueVal = 20 / 360.0,
        hueName = "myHue",
        h = new toxi.color.Hue( hueName, hueVal);

    //add extra hues that it should search through
    new toxi.color.Hue("closest", 65 / 360.0 );
    new toxi.color.Hue("closestPrimary", 64, 360.0, true );
    new toxi.color.Hue("further", 125 / 360.0, false );

    it('should have `static` predefined Hues', function(){
        ['RED','ORANGE','YELLOW','LIME','GREEN','TEAL','CYAN','AZURE',
        'BLUE','INDIGO','PURPLE','PINK'].forEach(function(color){
            assert.ok( toxi.color.Hue[color] instanceof toxi.color.Hue );
        });
    });

    it('should have a `static` PRIMARY_VARIANCE', function(){
        assert.ok( typeof toxi.color.Hue.PRIMARY_VARIANCE, 'number' );
    });

    describe('toxi.color.Hue.getClosest( hue, primaryOnly )', function(){
        //searches out of all Hues included
        it('should return the "closest" hue', function(){
            var c = toxi.color.Hue.getClosest( 66 / 360.0, false );
            assert.ok( c instanceof toxi.color.Hue );
            assert.ok( typeof c.getName, 'function' );
            assert.ok( c.getName(), "closest" );
        });
        //searches out of all primary included
        it('should return the "closestPrimary" hue', function(){
            var c = toxi.color.Hue.getClosest( 66 / 360.0, true );
            assert.ok( c instanceof toxi.color.Hue );
            assert.ok( typeof c.getName, 'function' );
            assert.ok( c.getName(), "closestPrimary" );
        });
    });

    describe('toxi.color.Hue.getForName( name )', function(){
        it('should return correct Hue', function(){
            var c = toxi.color.Hue.getForName('closest');
            assert.ok( c instanceof toxi.color.Hue );
            assert.equal( c.getName(), "closest" );
        });
    });

    describe('toxi.color.Hue.isPrimary( hue, [variance] )', function(){
        it('should return false', function(){
            assert.equal( toxi.color.Hue.isPrimary(hueVal), false );
        });
        it('should return true', function(){
            assert.ok( toxi.color.Hue.isPrimary(30 / 360) );
        });
        it('should return true with variance', function(){
            assert.ok( toxi.color.Hue.isPrimary( 36 / 360, 10/360) );
        });
        it('should return false with variance', function(){
            assert.equal( toxi.color.Hue.isPrimary( 36 / 360, 2/360 ), false );
        });
    });

    describe('construct', function(){
        it('should be a hue object', function(){
            assert.ok( h instanceof toxi.color.Hue );
            assert.equal( h.name, hueName );
            assert.equal( h.hue, hueVal );
            assert.equal( h.isPrimary(), false );
        });
    });


    describe('#getHue()', function(){
        it('should match the hue passed into the constructor', function(){
            assert.equal( typeof h.getHue, 'function' );
            assert.equal( h.getHue(), hueVal );
        });
    });

    describe('#getName()', function(){
        it('should match the name passed into the constructor', function(){
            assert.equal( typeof h.getName, 'function' );
            assert.equal( h.getName(), hueName );
        });
    });

    describe('#isPrimary()', function(){
        it('should not be primary', function(){
            assert.equal( h.isPrimary(), false);
        });
        it('should be primary', function(){
            var h2 = new toxi.color.Hue('myHue2', 30 / 360.0, true );
            assert.ok( h2.isPrimary() );
        });
    });

    describe('#toString()', function(){
        it('should provide Hue information', function(){
            var ts = h.toString();
            assert.ok( ts.indexOf('Hue: ID:') === 0 );
            assert.ok( ts.indexOf(hueName) > 0 );
            assert.ok( ts.indexOf('degrees') > 0 );
        });
    });
});
