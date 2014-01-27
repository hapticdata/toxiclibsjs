var toxi = require('../index'),
    assert = require('assert');

describe('BernsteinPolynomial', function(){
    var isNear = function( v1, v2 ){
        return Math.abs(v1-v2) < 0.0001;
    };
    var expected = {
        4: [
            [ 1.0, 0.29629624, 0.03703703, 0.0  ],
            [ 0.0, 0.4444444, 0.2222222, 0.0  ],
            [ 0.0, 0.22222224, 0.44444448, 0.0  ],
            [ 0.0, 0.03703704, 0.29629633, 1.0  ]
        ],
        6: [
            [ 1.0, 0.512, 0.21600002, 0.06399999, 0.0079999985, 0.0  ],
            [ 0.0, 0.38400003, 0.43200004, 0.288, 0.09599999, 0.0  ],
            [ 0.0, 0.09600001, 0.28800002, 0.43199998, 0.384, 0.0  ],
            [ 0.0, 0.0080, 0.064, 0.21600002, 0.512, 1.0  ]
        ],
        13: [
            [ 1.0, 0.7702547, 0.57870364, 0.421875, 0.29629624, 0.19849536, 0.125, 0.07233798, 0.03703705, 0.015625011, 0.004629636, 5.7870575E-4, 1.6940659E-21  ],
            [ 0.0, 0.21006945, 0.3472222, 0.421875, 0.4444444, 0.4253472, 0.375, 0.30381948, 0.22222225, 0.14062504, 0.0694445, 0.019097265, 4.2632557E-14  ],
            [ 0.0, 0.019097226, 0.06944445, 0.140625, 0.22222224, 0.30381945, 0.375, 0.4253472, 0.44444442, 0.42187503, 0.34722233, 0.21006964, 3.5762778E-7  ],
            [ 0.0, 5.7870377E-4, 0.00462963, 0.015625, 0.03703704, 0.07233798, 0.125, 0.19849536, 0.29629624, 0.4218749, 0.5787035, 0.7702544, 0.99999964  ]
        ]
    };
    var eachNear = function(res,bNum){
        return function(b, i){
            assert.ok( isNear(b,expected[res][bNum][i]) );
        };
    };
    var forBers = function( bers ){
        var r = bers.resolution;
        bers.b0.forEach(eachNear(r,0));
        bers.b1.forEach(eachNear(r,1));
        bers.b2.forEach(eachNear(r,2));
        bers.b3.forEach(eachNear(r,3));
    };
    it('should match the java output for resolution 4', function(){
        forBers(new toxi.geom.BernsteinPolynomial(4));
    });

    it('should match the java output for resolution 6', function(){
        forBers(new toxi.geom.BernsteinPolynomial(6));
    });

    it('should match the java output for resolution 13', function(){
        forBers(new toxi.geom.BernsteinPolynomial(13));
    });
});
