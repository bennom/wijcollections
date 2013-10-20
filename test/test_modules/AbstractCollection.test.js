/**
 * The actual test suite
 */

define( ['wijcModules/AbstractCollection'], function( ac ) {
    module( 'AbstractCollection', {
        setup: function() {
            this.expectedAC = true;
        }
    } );

    test( '[AC] return value', function() {
        expect( 1 );

        equal( ac, true, 'should be true here' );
    } );
} );
