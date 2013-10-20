/**
 * The actual test suite
 */

define( [
        'wijcModules/AbstractCollection',
        'wijcModules/List'
    ],
    function( AbstractCollection, List ) {
        module( 'AbstractCollection', {
            setup: function() {
                this.abstractCollection = new AbstractCollection();
                this.list = new List();
            }
        } );

        test( '[AC] Basic method existing check', function() {
            expect( 7 );

            console.warn( this.list.add() );

            equal( this.abstractCollection.add(), true, '[add] should be true here' );
            equal( this.abstractCollection.clear(), true, '[clear] should be true here' );
            equal( this.abstractCollection.contains(), true, '[contains] should be true here' );
            equal( this.abstractCollection.isEmpty(), true, '[isEmpty] should be true here' );
            equal( this.abstractCollection.remove(), true, '[remove] should be true here' );
            equal( this.abstractCollection.size(), true, '[size] should be true here' );
            equal( this.abstractCollection.toString(), true, '[toString] should be true here' );
        } );
    }
);
