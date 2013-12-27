define( ['public/List'], function( List ) {
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

    test( '[add]', function() {
        var referenceList = ["foo", this.list.hashObject( {'bar': 1, 'foo': 'baz'} ), 23, this.list.hashObject( [1, 2, 3, 4] ), this.list.hashObject( new Date( 2013, 9, 24 ) ), false];

        equal( this.list.add( 'foo' ), true, 'adding an element correctly' );
        equal( this.list.add(), null, 'adding element failed - should be null' );
        equal( this.list.add( {'bar': 1, 'foo': 'baz'} ), true, 'adding Object element' );
        equal( this.list.add( 23 ), true, 'adding Number element' );
        equal( this.list.add( [1, 2, 3, 4] ), true, 'adding Array element' );
        equal( this.list.add( new Date( 2013, 9, 24 ) ), true, 'adding Date Object element' );
        equal( this.list.add( false ), true, 'adding Boolean element' );
        equal( this.list.add( function() { return true; } ), null, 'adding Function returns null' );
        deepEqual( this.list.list, referenceList, 'list elements are in the right position' );
    } );

    test( '[addAt]', function() {
        var resultReference = [this.list.hashObject( new Date( 2013, 9, 22 ) ), "baz", "foo", this.list.hashObject( {'bar': 1, 'foo': 'baz'} ), "bar", "quux", this.list.hashObject( [1, 2, 3, 4] ), this.list.hashObject( [5, 6] ), 'Rhabarberbarbar'];

        deepEqual( this.list.addAt(), null, 'adding undefined returns null' );
        equal( this.list.addAt( 'bar' ), true, 'adding element without position (at the end)' );
        equal( this.list.addAt( 'baz', 0 ), true, 'adding element at position 0' );
        equal( this.list.addAt( 'quux' ), true, 'adding element at last position' );
        equal( this.list.addAt( 'foo', 1 ), true, 'adding element at position 1' );
        equal( this.list.addAt( {'bar': 1, 'foo': 'baz'}, 2 ), true, 'adding element at position 2' );
        equal( this.list.addAt( [1, 2, 3, 4] ), true, 'adding element at position 3' );
        equal( this.list.addAt( new Date( 2013, 9, 22 ), 0 ), true, 'adding element at position 3' );

        // adding some duplicates
        equal( this.list.addAt( {'bar': 1, 'foo': 'baz'}, 2 ), true, '[Duplicate] adding element (position not relevant)' );
        equal( this.list.addAt( {'bar': 1, 'foo': 'baz'}, 2 ), true, '[Duplicate] adding element (position not relevant)' );
        equal( this.list.addAt( [1, 2, 3, 4], 1 ), true, '[Duplicate] adding element (position not relevant)' );
        equal( this.list.addAt( new Date( 2013, 9, 22 ), 3 ), true, '[Duplicate] adding element (position not relevant)' );

        // testing some out of bounds issues
        equal( this.list.addAt( [5, 6], 2013 ), true, 'adding element on higher index' );
        equal( this.list.addAt( 'Rhabarberbarbar', 2014 ), true, 'adding element (no hashing) on higher index' );

        deepEqual( this.list.list, resultReference, 'list elements are in the right position' );
        deepEqual( this.list.size(), 9, 'size() returns valid number of elements in the Array' );
        deepEqual( this.list.size( true ), 13, 'Duplicate counter returns valid number' );

    } );

    test( '[get]', function() {
        equal( this.exampleList.get(), null, 'undefined index returns null' );

        equal( this.exampleList.get( 0 ), 'foo', 'got the right element' );
        equal( this.exampleList.get( 1 ), 'bar', 'got the right element' );
        equal( this.exampleList.list[1], 'bar', 'elements still present in the list' );
        deepEqual( this.exampleList.get( 5 ), null, 'index out of bounds - should be null' );

        deepEqual( this.mixedList.get( 0 ), 'foo', 'got the right element' );
        deepEqual( this.mixedList.get( 1 ), 22, 'got the right element' );
        deepEqual( this.mixedList.get( 2 ), {'bar': 1, 'foo': 'baz'}, 'got the right element' );
        deepEqual( this.mixedList.get( 3 ), ['baz', 'foo', 'bar'], 'got the right element' );
        deepEqual( this.mixedList.get( 4 ), new Date( 2013, 9, 24 ), 'got the right element' );
        deepEqual( this.mixedList.get( 5 ), false, 'got the right element' );
        deepEqual( this.mixedList.get( 6 ), null, 'got the right element' );
    } );

    test( '[size]', function() {
        deepEqual( this.list.size(), 0, 'list is empty' );

        this.list.add( 'foo' );
        deepEqual( this.list.size(), 1, 'list has one element' );

        this.list.add( 'bar' );
        deepEqual( this.list.size(), 2, 'list has two elements' );

        this.mixedList.add( 'foo' );
        this.mixedList.add( {'bar': 1, 'foo': 'baz'} );
        this.mixedList.add( {'bar': 1, 'foo': 'baz'} );
        this.mixedList.add( ['baz', 'foo', 'bar'] );

        deepEqual( this.mixedList.size(), 7, 'size() returns valid number of elements in the Array' );
        deepEqual( this.mixedList.size( true ), 10, 'Duplicate counter returns valid number' );
    } );

    test( '[indexOf]', function() {
        deepEqual( this.mixedList.indexOf(), -1, 'undefined index returns -1' );
        deepEqual( this.mixedList.indexOf( 'foo' ), 0, 'right index for \"foo"\ found' );
        deepEqual( this.mixedList.indexOf( 22 ), 1, 'right index for \"22\" found' );
        deepEqual( this.mixedList.indexOf( {'bar': 1, 'foo': 'baz'} ), 2, 'right index for Object found' );
        deepEqual( this.mixedList.indexOf( ['baz', 'foo', 'bar'] ), 3, 'right index for Array found' );
        deepEqual( this.mixedList.indexOf( new Date( 2013, 9, 24 ) ), 4, 'right index for Date Object found' );
        deepEqual( this.mixedList.indexOf( false ), 5, 'right index for Boolean found' );
        deepEqual( this.mixedList.indexOf( 'not found' ), -1, 'right value for non existing value' );
    } );

    test( '[clear]', function() {
        var emptyList = new List(); // reference object

        // increment the internal counter for test
        this.exampleList.clear();

        equal( this.exampleList.size(), 0, 'list cleared' )
        deepEqual( this.exampleList.baseObject, emptyList.baseObject, 'internal baseObject reset' )

    } );

    test( '[contains]', function() {
        deepEqual( this.exampleList.contains(), null, 'passing undefined returns null' );

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

    test( '[isEmpty]', function() {
        var emptyList = new List();

        deepEqual( this.exampleList.isEmpty(), false, 'Example list is not empty' );
        deepEqual( emptyList.isEmpty(), true, 'Empty list is empty :-)' );
    } );

    test( '[remove]', function() {
        var resultListReference = new List();

        // add a duplicate entry
        this.mixedList.add( {'bar': 1, 'foo': 'baz'} );

        deepEqual( this.mixedList.remove(), false, 'passing undefined as parameter returns false' );
        deepEqual( this.mixedList.remove( 'Rhabarberbarbar' ), false, 'passing not existing element as parameter returns false' );
        deepEqual( this.mixedList.remove( {'name': 'Rhabarberbarbar'} ), false, 'passing not existing element (with hashing) as parameter returns false' );

        deepEqual( this.mixedList.remove( 'foo' ), true, 'Removed a element' );
        deepEqual( this.mixedList.remove( 22 ), true, 'Removed a element' );
        deepEqual( this.mixedList.remove( {'bar': 1, 'foo': 'baz'} ), true, 'Removed a duplicate element' );
        deepEqual( this.mixedList.remove( ['baz', 'foo', 'bar'] ), true, 'Removed a element' );
        deepEqual( this.mixedList.remove( new Date( 2013, 9, 24 ) ), true, 'Removed a element' );
        deepEqual( this.mixedList.remove( false ), true, 'Removed a element' );
        deepEqual( this.mixedList.size(), 1, 'List should contain one Object' );

        // one duplicate should be over at the end
        resultListReference.add( {'bar': 1, 'foo': 'baz'} );

        deepEqual( this.mixedList.baseObject, resultListReference.baseObject, 'List baseObject is empty' );
    } );

    test( '[set]', function() {
        var resultList = [this.mixedList.hashObject( {'baz': 5, 'quux': 'foo'} ), 44, this.mixedList.hashObject( {'baz': 3} ), this.mixedList.hashObject( [1, 2, 3] ), this.mixedList.hashObject( new Date( 2013, 9, 28 ) ), true, 22];

        // some unwanted bahvior tests
        deepEqual( this.mixedList.set( 0 ), null, 'one missing parameter returns null' );
        deepEqual( this.mixedList.set( {'baz': 3}, -5 ), null, 'setting to index < 0 returns null' );
        deepEqual( this.mixedList.set( {'baz': 3}, 2013 ), null, 'setting to index > array.size() returns null' );

        // adding some basic duplicates first
        this.mixedList.add( 22 );
        this.mixedList.add( {'bar': 1, 'foo': 'baz'} );
        this.mixedList.add( ['baz', 'foo', 'bar'] );

        deepEqual( this.mixedList.set( 'bar', 0 ), 'foo', 'replaced Strings' );
        deepEqual( this.mixedList.set( 44, 1 ), 22, 'replaced Number' );
        deepEqual( this.mixedList.set( {'baz': 3}, 2 ), {'bar': 1, 'foo': 'baz'}, 'replaced Object' );
        deepEqual( this.mixedList.set( [1, 2, 3], 3 ), ['baz', 'foo', 'bar'], 'replaced Array' );
        deepEqual( this.mixedList.set( new Date( 2013, 9, 28 ), 4 ), new Date( 2013, 9, 24 ), 'replaced Date object' );
        deepEqual( this.mixedList.set( true, 5 ), false, 'replaced Boolean' );
        deepEqual( this.mixedList.set( {'baz': 5, 'quux': 'foo'}, 0 ), 'bar', 'replaced String with Object' );

        // adding a duplicate and check that the duplicate is known
        deepEqual( this.mixedList.add( {'baz': 5, 'quux': 'foo'} ), true, 'added duplicate' );
        deepEqual( this.mixedList.listObject.listObject.duplicateCnt, 1, 'identified duplicate correctly' );

        deepEqual( this.mixedList.list, resultList, 'Result Array equals the expected one' );
    } );

    test( '[toString]', function() {
        deepEqual( this.mixedList.toString(), "foo,22," + this.mixedList.hashObject( {'bar': 1, 'foo': 'baz'} ) + "," + this.mixedList.hashObject( ['baz', 'foo', 'bar'] ) + "," + this.mixedList.hashObject( new Date( 2013, 9, 24 ) ) + ",false", "return the right String" );
    } );
} );
