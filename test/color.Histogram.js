/*global describe, it*/
var toxi = require('../index'),
    assert = require('assert');

describe('Histogram', function(){
    var cl = new toxi.color.ColorList();
    var colors = [];
    for( var i=0; i<15; i++){
        colors.push( toxi.color.TColor.newHSV( (1.0/15)*i, 1.0, 1.0 ) );
    }
    //add 200 copies of those 15, compute should reduce them
    for(i=0;i<200;i++){
       cl.add( colors[i%colors.length].copy() );
    }

    var histogram = new toxi.color.Histogram( cl );
    it('should be a histogram object', function(){

        assert.ok( histogram instanceof toxi.color.Histogram );
        assert.equal( histogram.compute, toxi.color.Histogram.prototype.compute );
    });

    describe('#compute( 0.1, false )', function(){
        var entries = histogram.compute( 0.1, false );
       it('should return unique entries', function(){
           //there should only be the original colors
           assert.equal( entries.length, colors.length );
           //make sure all of the originals are still in there
           assert.ok( checkOriginals() );
           function checkOriginals(){
               function match( c ){
                   for( var j=0; j<entries.length; j++){
                       var e = entries[j];
                       if (e.getColor().equals( c ) ){
                           return true;
                       }
                   }
                   return false;
               }

               for( var i=0; i<colors.length; i++){
                   if( !match(colors[i]) ){
                       return false;
                   }
               }
               return true;
           }

       });
    });





});