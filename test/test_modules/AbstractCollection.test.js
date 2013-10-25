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

        test( '[methods]', 8, function() {
            equal( this.abstractCollection.add(), false, '[add] should be false here' );
            equal( this.abstractCollection.get(), false, '[get] should be false here' );
            equal( this.abstractCollection.clear(), true, '[clear] should be true here' );
            equal( this.abstractCollection.contains(), false, '[contains] should be false here' );
            equal( this.abstractCollection.isEmpty(), true, '[isEmpty] should be true here' );
            equal( this.abstractCollection.remove(), false, '[remove] should be false here' );
            equal( this.abstractCollection.size(), true, '[size] should be true here' );
            equal( this.abstractCollection.toString(), true, '[toString] should be true here' );
        } );

        test( '[getHash]', 11, function() {
            var foo = function() { $.noop(); };

            deepEqual( this.abstractCollection.getHash( 'foo' ), 'acbd18db4cc2f85cedef654fccc4a4d8', 'hash for \"foo\" is correct' );
            deepEqual( this.abstractCollection.getHash( 'bar' ), '37b51d194a7513e45b56f6524f2d51f2', 'hash for \"bar\" is correct' );
            deepEqual( this.abstractCollection.getHash( ['baz', 'foo', 'bar', 'quux'] ), '57400b3ad8a6f9352e09ae496d7527f0', 'hash for Array is correct' );
            deepEqual( this.abstractCollection.getHash( {'foo': 12, 'bar': 34} ), '8e31c476951c83023b96e480f875cbce', 'hash for Object is correct' );
            deepEqual( this.abstractCollection.getHash( true ), 'b326b5062b2f0e69046810717534cb09', 'hash for Boolean is correct' );
            deepEqual( this.abstractCollection.getHash( 123456 ), 'e10adc3949ba59abbe56e057f20f883e', 'hash for Number (int) is correct' );
            deepEqual( this.abstractCollection.getHash( 123.56 ), '5010f043e9aa18e14d721598a4aeb856', 'hash for Number (double) is correct' );
            deepEqual( this.abstractCollection.getHash( new Date( 2013, 9, 22 ) ), '4273dd148172616f335e01fa1a17ce4e', 'hash for Date is correct' );
            deepEqual( this.abstractCollection.getHash(), null, 'return value for undefined was null' );
            deepEqual( this.abstractCollection.getHash( null ), null, 'return value for null was null' );

            try {
                this.abstractCollection.getHash( foo );
            } catch( e ) {
                deepEqual( e.name, "TypeError", "TypeError thrown when a function is passed." );
            }
        } );

        test( '[sortObjectByKeys]', 3, function() {
            deepEqual( this.abstractCollection.sortObjectByKeys( {'foo': 'baz', 'bar': 1, 123: 'har'} ), {123: "har", bar: 1, foo: "baz"}, 'Object sorted correctly' );
            deepEqual( this.abstractCollection.sortObjectByKeys(), null, 'Non object - returned null' );
            deepEqual( this.abstractCollection.sortObjectByKeys( [1, '2', {'foo': 'bar'}] ), null, 'Non object - returned null' );
        } );

        module( 'List', {
            setup: function() {
                this.list = new List();
                this.exampleList = new List();
                this.mixedList = new List();

                this.mixedList.add( 'foo' );
                this.mixedList.add( 22 );
                this.mixedList.add( {'bar': 1, 'foo': 'baz'} );
                this.mixedList.add( ['baz', 'foo', 'bar'] );
                this.mixedList.add( new Date( 2013, 9, 24 ) );
                this.mixedList.add( false );

                this.exampleList.add( 'foo' );
                this.exampleList.add( 'bar' );
                this.exampleList.add( 'baz' );

                this.expectedLists = {
                    add: ['foo'],
                    addAt: ['baz', 'foo', 'bar', 'quux']
                };
            }
        } );

        test( '[add]', 8, function() {
            var refereneList = ["foo", "bb9f0348505124479bfd044dae6b5f14", "37693cfc748049e45d87b8c7d8b9aacd", "7bd4c63ba2cdadb060f5730e7bf66a30", "2a836fc743df1093df08e60055474916", "68934a3e9455fa72420237eb05902327"];

            equal( this.list.add( 'foo' ), true, 'adding an element correctly' );
            equal( this.list.add(), null, 'adding element failed - should be null' );
            equal( this.list.add( {'bar': 1, 'foo': 'baz'} ), true, 'adding Object element' );
            equal( this.list.add( 23 ), true, 'adding Number element' );
            equal( this.list.add( [1, 2, 3, 4] ), true, 'adding Array element' );
            equal( this.list.add( new Date( 2013, 9, 24 ) ), true, 'adding Date Object element' );
            equal( this.list.add( false ), true, 'adding Boolean element' );

            deepEqual( this.list.list, refereneList, 'list elements are in the right position' );
        } );

        test( '[addAt]', 8, function() {
            var resultReference = ["4273dd148172616f335e01fa1a17ce4e", "baz", "foo", "bb9f0348505124479bfd044dae6b5f14", "bar", "quux", "7bd4c63ba2cdadb060f5730e7bf66a30"];

            equal( this.list.addAt( 'bar' ), true, 'adding element without position (at the end)' );
            equal( this.list.addAt( 'baz', 0 ), true, 'adding element at position 0' );
            equal( this.list.addAt( 'quux' ), true, 'adding element at last position' );
            equal( this.list.addAt( 'foo', 1 ), true, 'adding element at position 1' );
            equal( this.list.addAt( {'bar': 1, 'foo': 'baz'}, 2 ), true, 'adding element at position 2' );
            equal( this.list.addAt( [1, 2, 3, 4] ), true, 'adding element at position 3' );
            equal( this.list.addAt( new Date( 2013, 9, 22 ), 0 ), true, 'adding element at position 3' );

            deepEqual( this.list.list, resultReference, 'list elements are in the right position' );
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

        test( '[indexOf]', 7, function() {
            deepEqual( this.mixedList.indexOf( 'foo' ), 0, 'right index for \"foo"\ found' );
            deepEqual( this.mixedList.indexOf( 22 ), 1, 'right index for \"22\" found' );
            deepEqual( this.mixedList.indexOf( {'bar': 1, 'foo': 'baz'} ), 2, 'right index for Object found' );
            deepEqual( this.mixedList.indexOf( ['baz', 'foo', 'bar'] ), 3, 'right index for Array found' );
            deepEqual( this.mixedList.indexOf( new Date( 2013, 9, 24 ) ), 4, 'right index for Date Object found' );
            deepEqual( this.mixedList.indexOf( false ), 5, 'right index for Boolean found' );
            deepEqual( this.mixedList.indexOf( 'not found' ), -1, 'right value for non existing value' );
        } );

        test( '[clear]', 2, function() {
            var emptyList = new List(); // reference object

            // increment the internal counter for test
            this.exampleList.clear();

            equal( this.exampleList.size(), 0, 'list cleared' )
            deepEqual( this.exampleList.baseObject, emptyList.baseObject, 'internal baseObject reset' )

        } );

        test( '[contains]', 6, function() {
            equal( this.exampleList.contains( 'foo' ), true, 'element \"foo\" found in list' );
            equal( this.exampleList.contains( 'bar' ), true, 'element \"bar\" found in list' );
            equal( this.exampleList.contains( 'baz' ), true, 'element \"baz\" found in list' );

            // adding some objects
            this.exampleList.add( 'foo' );
            this.exampleList.add( [1, 'bar', 2] );
            this.exampleList.add( {'foo': 1, 'bar': 2} );

            equal( this.exampleList.contains( 'foo' ), true, 'String found in list' );
            equal( this.exampleList.contains( [1, 'bar', 2] ), true, 'Array found in list' );
            equal( this.exampleList.contains( {'foo': 1, 'bar': 2} ), true, 'Object found in list' );
        } );

        test( '[isEmpty]', 2, function() {
            var emptyList = new List();

            deepEqual( this.exampleList.isEmpty(), false, 'Example list is not empty' );
            deepEqual( emptyList.isEmpty(), true, 'Empty list is empty :-)' );
        } );

        test( '[remove]', 8, function() {
            var mixedList = new List(),
                emptyList = new List();

            mixedList.add( 'foo' );
            mixedList.add( 22 );
            mixedList.add( {'bar': 1, 'foo': 'baz'} );
            mixedList.add( ['baz', 'foo', 'bar'] );
            mixedList.add( new Date( 2013, 9, 24 ) );
            mixedList.add( false );

            deepEqual( mixedList.remove( 'foo' ), true, 'Removed a element' );
            deepEqual( mixedList.remove( 22 ), true, 'Removed a element' );
            deepEqual( mixedList.remove( {'bar': 1, 'foo': 'baz'} ), true, 'Removed a element' );
            deepEqual( mixedList.remove( ['baz', 'foo', 'bar'] ), true, 'Removed a element' );
            deepEqual( mixedList.remove( new Date( 2013, 9, 24 ) ), true, 'Removed a element' );
            deepEqual( mixedList.remove( false ), true, 'Removed a element' );
            deepEqual( mixedList.size(), 0, 'List is empty now' );
            deepEqual( mixedList.baseObject, emptyList.baseObject, 'List baseObject is empty' );
        } );

        test( '[toString]', 1, function() {
            deepEqual( this.mixedList.toString(), "foo,b6d767d2f8ed5d21a44b0e5886680cb9,bb9f0348505124479bfd044dae6b5f14,7641a52cc856c97d63f5b1b306896fc1,2a836fc743df1093df08e60055474916,68934a3e9455fa72420237eb05902327", "return the right String" );
        } );
    }
);
