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
            }
        } );

        test( 'Basic method existing check', 7, function() {
            equal( this.abstractCollection.add(), false, '[add] should be false here' );
            equal( this.abstractCollection.clear(), true, '[clear] should be true here' );
            equal( this.abstractCollection.contains(), false, '[contains] should be false here' );
            equal( this.abstractCollection.isEmpty(), true, '[isEmpty] should be true here' );
            equal( this.abstractCollection.remove(), false, '[remove] should be false here' );
            equal( this.abstractCollection.size(), true, '[size] should be true here' );
            equal( this.abstractCollection.toString(), true, '[toString] should be true here' );
        } );

        module( 'List', {
            setup: function() {
                this.list = new List();
                this.expectedLists = {
                    add: ['foo'],
                    addAt: ['baz', 'foo', 'bar', 'quux']
                };
            }
        } );

        test( '[add]', 3, function() {
            equal( this.list.add( 'foo' ), true, 'adding an element correctly' );
            equal( this.list.add(), false, 'adding element failed - should be false' );

            deepEqual( this.list.list, this.expectedLists.add, 'list elements are in the right position' );
        } );

        test( '[addAt]', 5, function() {
            equal( this.list.addAt( 'bar' ), true, 'adding element without position (at the end)' );
            equal( this.list.addAt( 'baz', 0 ), true, 'adding element at position 0' );
            equal( this.list.addAt( 'quux' ), true, 'adding element at position 0' );
            equal( this.list.addAt( 'foo', 1 ), true, 'adding element at position 1' );

            deepEqual( this.list.list, this.expectedLists.addAt, 'list elements are in the right position' );
        } );

        test( '[size]', 3, function() {
            equal( this.list.size(), 0, 'list is empty' );

            this.list.add( 'foo' );
            equal( this.list.size(), 1, 'list has one element' );

            this.list.add( 'bar' );
            equal( this.list.size(), 2, 'list has two elements' );
        } );
    }
);
