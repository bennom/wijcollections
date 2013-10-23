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

        test( 'Basic method existing check', 8, function() {
            equal( this.abstractCollection.add(), false, '[add] should be false here' );
            equal( this.abstractCollection.get(), false, '[get] should be false here' );
            equal( this.abstractCollection.clear(), true, '[clear] should be true here' );
            equal( this.abstractCollection.contains(), false, '[contains] should be false here' );
            equal( this.abstractCollection.isEmpty(), true, '[isEmpty] should be true here' );
            equal( this.abstractCollection.remove(), false, '[remove] should be false here' );
            equal( this.abstractCollection.size(), true, '[size] should be true here' );
            equal( this.abstractCollection.toString(), true, '[toString] should be true here' );
        } );

        test( '[getHash]', 8, function() {
            deepEqual( this.abstractCollection.getHash( 'foo' ), 101574, 'hash for \"foo\" is correct' );
            deepEqual( this.abstractCollection.getHash( 'bar' ), 97299, 'hash for \"bar\" is correct' );
            deepEqual( this.abstractCollection.getHash( ['baz', 'foo', 'bar', 'quux'] ), 1133304195, 'hash for Array is correct' );
            deepEqual( this.abstractCollection.getHash( {'foo': 12, 'bar': 34} ), 1396304513, 'hash for Object is correct' );
            deepEqual( this.abstractCollection.getHash( true ), 3569038, 'hash for Boolean is correct' );
            deepEqual( this.abstractCollection.getHash( 123456 ), 1450575459, 'hash for Number (int) is correct' );
            deepEqual( this.abstractCollection.getHash( 123.56 ), 1450569693, 'hash for Number (double) is correct' );
            deepEqual( this.abstractCollection.getHash( new Date( '2013-10-22' ) ), 503512411, 'hash for Date is correct' );
        } );

        module( 'List', {
            setup: function() {
                this.list = new List();
                this.exampleList = new List();

                this.expectedLists = {
                    add: ['foo'],
                    addAt: ['baz', 'foo', 'bar', 'quux']
                };

                this.exampleList.add( 'foo' );
                this.exampleList.add( 'bar' );
                this.exampleList.add( 'baz' );
            }
        } );

        test( '[add]', 3, function() {
            equal( this.list.add( 'foo' ), true, 'adding an element correctly' );
            equal( this.list.add(), null, 'adding element failed - should be null' );

            deepEqual( this.list.list, this.expectedLists.add, 'list elements are in the right position' );

            this.list.add( {'foo': 1, 'bar': 'baz'} );
            this.list.add( {'bar': 1, 'foo': 'baz'} );
            this.list.add( [1, 2, 3, 4] );

            console.warn( this.list.list, this.list.baseObject );
        } );

        test( '[addAt]', 5, function() {
            equal( this.list.addAt( 'bar' ), true, 'adding element without position (at the end)' );
            equal( this.list.addAt( 'baz', 0 ), true, 'adding element at position 0' );
            equal( this.list.addAt( 'quux' ), true, 'adding element at position 0' );
            equal( this.list.addAt( 'foo', 1 ), true, 'adding element at position 1' );

            deepEqual( this.list.list, this.expectedLists.addAt, 'list elements are in the right position' );
        } );

        test( '[get]', 4, function() {
            equal( this.exampleList.get( 0 ), 'foo', 'got the right element' );
            equal( this.exampleList.get( 1 ), 'bar', 'got the right element' );
            deepEqual( this.exampleList.get( 5 ), null, 'index out of bounds - should be null' );
            equal( this.exampleList.list[1], 'bar', 'elements still present in the list' );
        } );


        test( '[size]', 3, function() {
            equal( this.list.size(), 0, 'list is empty' );

            this.list.add( 'foo' );
            equal( this.list.size(), 1, 'list has one element' );

            this.list.add( 'bar' );
            equal( this.list.size(), 2, 'list has two elements' );
        } );

        test( '[clear]', 2, function() {
            var emptyList = new List(); // reference object

            // increment the internal counter for test
            this.exampleList.clear();

            equal( this.exampleList.size(), 0, 'list cleared' )
            equal( this.exampleList.baseObject, emptyList.baseObject, 'internal baseObject reset' )
        } );

        test( '[contains]', 3, function() {
            equal( this.exampleList.contains( 'foo' ), true, 'element \"foo\" found in list' );
            equal( this.exampleList.contains( 'bar' ), true, 'element \"bar\" found in list' );
            equal( this.exampleList.contains( 'baz' ), true, 'element \"baz\" found in list' );
        } );
    }
);
