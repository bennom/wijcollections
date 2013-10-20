/**
 * The actual test suite
 */

define( ['wijcModules/AbstractCollection'], function( AbstractCollection ) {
    module( 'AbstractCollection', {
        setup: function() {
            this.abstractCollection = new AbstractCollection();
            this.expectedAC = true;
        }
    } );

    test( '[AC] return value', function() {
        expect( 1 );

        equal( this.abstractCollection.add(), true, 'should be true here' );
    } );
} );
