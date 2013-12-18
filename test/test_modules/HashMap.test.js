define( ['wijcModules/public/HashMap'], function( HashMap ) {
    module( 'HashMap', {
        setup: function() {
            this.emptyHm = new HashMap();
            this.exampleHm = new HashMap();

            this.exampleHm.put( 'key1', ['baz', 'foo', 'bar', 'quux'] );
            this.exampleHm.put( 'key2', {'foo': 12, 'bar': 34} );
            this.exampleHm.put( 'key3', 123456 );
            this.exampleHm.put( 'key4', 123.56 );
            this.exampleHm.put( 'key5', new Date( 2013, 9, 22 ) );
            this.exampleHm.put( 'key7', 'foo' );
            this.exampleHm.put( 'key8', true );
            this.exampleHm.put( {'foo': 12, 'bar': 34}, {'foo': 12, 'bar': 34} );
        }
    } );

    test( 'put (String Keys)', function() {
        // undefined parameter
        deepEqual( this.emptyHm.put(), null, 'no parameter given - returns false' );
        deepEqual( this.emptyHm.put( 'key1' ), null, 'no value given - returns false' );

        // basic entries
        deepEqual( this.emptyHm.put( 'key1', ['baz', 'foo', 'bar', 'quux'] ), null, 'new Array entry' );
        deepEqual( this.emptyHm.put( 'key2', {'foo': 12, 'bar': 34} ), null, 'new Object entry' );
        deepEqual( this.emptyHm.put( 'key3', 123456 ), null, 'new Number entry' );
        deepEqual( this.emptyHm.put( 'key4', 123.56 ), null, 'new Number (Float) entry' );
        deepEqual( this.emptyHm.put( 'key5', new Date( 2013, 9, 22 ) ), null, 'new Date entry' );
        deepEqual( this.emptyHm.put( 'key7', 'foo' ), null, 'new String entry' );
        deepEqual( this.emptyHm.put( 'key8', true ), null, 'new Boolean entry' );

        // duplicate tests
        deepEqual( this.emptyHm.put( 'key1', ['baz', 'foo'] ), ['baz', 'foo', 'bar', 'quux'], 'replaced Array entry' );
        deepEqual( this.emptyHm.put( 'key2', {'bar': 34} ), {'foo': 12, 'bar': 34}, 'replaced Object entry' );
        deepEqual( this.emptyHm.put( 'key3', 78 ), 123456, 'replaced Number entry' );
        deepEqual( this.emptyHm.put( 'key4', 78.91 ), 123.56, 'replaced Number (Float) entry' );
        deepEqual( this.emptyHm.put( 'key5', new Date( 2013, 9, 23 ) ), new Date( 2013, 9, 22 ), 'replaced Date entry' );
        deepEqual( this.emptyHm.put( 'key7', 'bar' ), 'foo', 'replaced String entry' );
        deepEqual( this.emptyHm.put( 'key8', false ), true, 'replaced Boolean entry' );

        // check internal lists
        deepEqual( this.emptyHm.keyHashToKey, {
            "key1": "key1",
            "key2": "key2",
            "key3": "key3",
            "key4": "key4",
            "key5": "key5",
            "key7": "key7",
            "key8": "key8"
        }, 'keyHashToKey Object is correct' );

        // key hash to value hash mapping
        deepEqual( this.emptyHm.keyHashToValueHash, {
            "key1": this.emptyHm.hashObject( ['baz', 'foo'] ),
            "key2": this.emptyHm.hashObject( {'bar': 34} ),
            "key3": 78,
            "key4": this.emptyHm.hashObject( 78.91 ),
            "key5": this.emptyHm.hashObject( new Date( 2013, 9, 23 ) ),
            "key7": "bar",
            "key8": false
        }, 'keyHashToValueHash Object is correct' );

        // key set
        deepEqual( this.emptyHm.keyList, ["key1", "key2", "key3", "key4", "key5", "key7", "key8"], 'keyHashToValueHash Object is correct' );

        // the central value list
        deepEqual( this.emptyHm.valueList.listObject, {
            "duplicateCnt": 0,
            "overallCnt": 7,
            "key1": {"cnt": 1, "ref": ["baz", "foo"]},
            "key2": {"cnt": 1, "ref": {"bar": 34}},
            "key3": {"cnt": 1, "ref": 78},
            "key4": {"cnt": 1, "ref": 78.91},
            "key5": {"cnt": 1, "ref": new Date( 2013, 9, 23 )},
            "key7": {"cnt": 1, "ref": "bar"},
            "key8": {"cnt": 1, "ref": false}
        }, 'valueList.listObject Object is correct' );
    } );

    test( 'put (Mixed Keys)', function() {
        // testing Array as key
        deepEqual( this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz', 'foo', 'bar', 'quux'] ), null, 'new Array key with Array value' );
        deepEqual( this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz', 'foo', 'bar'] ), ['baz', 'foo', 'bar', 'quux'], 'returned replaced entry' );
        deepEqual( this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz', 'foo'] ), ['baz', 'foo', 'bar'], 'returned replaced entry' );

        // testing Object as key
        deepEqual( this.emptyHm.put( {'foo': 12, 'bar': 34}, {'foo': 12, 'bar': 34} ), null, 'replaced Object' );
        deepEqual( this.emptyHm.put( {'foo': 12, 'bar': 34}, ['foo', 12] ), {'foo': 12, 'bar': 34}, 'replaced Object' );
        deepEqual( this.emptyHm.put( {'foo': 12, 'bar': 34}, {'quux': true, 'bar': 34} ), ['foo', 12], 'replaced Object' );

        // testing Date as key
        deepEqual( this.emptyHm.put( new Date( 2013, 9, 22 ), new Date( 2013, 9, 23 ) ), null, 'new Date key with Date value' );
        deepEqual( this.emptyHm.put( new Date( 2013, 9, 22 ), new Date( 2013, 10, 23 ) ), new Date( 2013, 9, 23 ), 'replaced Date key with Date value' );
        deepEqual( this.emptyHm.put( new Date( 2013, 9, 22 ), new Date( 1984, 1, 15 ) ), new Date( 2013, 10, 23 ), 'replaced Date key with Date value' );

        // to get a dynamic date hashing, we need to add the date hash key "on the fly"
        // and not by using a static hash string

        var refKeyHashToKey = {};

        refKeyHashToKey[this.emptyHm.hashObject( {"bar": 34, "foo": 12} )] = {"bar": 34, "foo": 12};
        refKeyHashToKey[this.emptyHm.hashObject( ['baz', 'foo', 'bar', 'quux'] )] = ['baz', 'foo', 'bar', 'quux'];
        refKeyHashToKey[this.emptyHm.hashObject( new Date( 2013, 9, 22 ) )] = new Date( 2013, 9, 22 );

        // check internal lists
        deepEqual( this.emptyHm.keyHashToKey, refKeyHashToKey, 'keyHashToKey Object is correct' );

        var refKeyHashToValueHash = {};

        refKeyHashToValueHash[this.emptyHm.hashObject( {"bar": 34, "foo": 12} )] = this.emptyHm.hashObject( {'quux': true, 'bar': 34} );
        refKeyHashToValueHash[this.emptyHm.hashObject( ['baz', 'foo', 'bar', 'quux'] )] = this.emptyHm.hashObject( ['baz', 'foo'] );
        refKeyHashToValueHash[this.emptyHm.hashObject( new Date( 2013, 9, 22 ) )] = this.emptyHm.hashObject( new Date( 1984, 1, 15 ) );

        // key hash to value hash mapping
        deepEqual( this.emptyHm.keyHashToValueHash, refKeyHashToValueHash, 'keyHashToValueHash Object is correct' );

        // key set
        deepEqual( this.emptyHm.keyList, [
            ['baz', 'foo', 'bar', 'quux'],
            {"bar": 34, "foo": 12},
            new Date( 2013, 9, 22 )
        ], 'keyHashToValueHash Object is correct' );

        var refListObject = {"duplicateCnt": 0, "overallCnt": 3};

        refListObject[this.emptyHm.hashObject( new Date( 2013, 9, 22 ) )] = {"cnt": 1, "ref": new Date( 1984, 1, 15 )};
        refListObject[this.emptyHm.hashObject( ['baz', 'foo', 'bar', 'quux'] )] = {"cnt": 1, "ref": ['baz', 'foo']};
        refListObject[this.emptyHm.hashObject( {"bar": 34, "foo": 12} )] = {"cnt": 1, "ref": {'quux': true, 'bar': 34}};

        // the central value list
        deepEqual( this.emptyHm.valueList.listObject, refListObject, 'valueList.listObject Object is correct' );
    } );

    test( 'putAll', function() {
        // undefined parameter
        deepEqual( this.emptyHm.putAll(), null, 'no parameter given - returns false' );
        deepEqual( this.emptyHm.putAll( 'key1' ), null, 'no value given - returns false' );

        // putting all entries from the example HashMap in the empty HashMap
        this.emptyHm.putAll( this.exampleHm );

        deepEqual( this.emptyHm, this.exampleHm, 'put all elements in the empty list' );
    } );

    test( 'remove', function() {
        deepEqual( this.exampleHm.remove(), null, 'remove with no parameter returns null' );
        deepEqual( this.exampleHm.remove( 'nope' ), null, 'remove with invalid key parameter returns null' );
        deepEqual( this.exampleHm.remove( 'key1' ), ['baz', 'foo', 'bar', 'quux'], 'remove valid key returns old object' );
        deepEqual( this.exampleHm.remove( {'foo': 12, 'bar': 34} ), {'bar': 34, 'foo': 12}, 'remove valid key returns old object' );

        // check the internal mappings that everything is removed successfully
        deepEqual( this.exampleHm.keyHashToKey['key1'], undefined, 'removed from keyHashToKey' )
        deepEqual( this.exampleHm.keyHashToValueHash['key1'], undefined, 'removed from keyHashToValueHash' )
        deepEqual( this.exampleHm.keyHashToKey['36ac5f4ee1c1b30a6fa56a511616e135'], undefined, 'removed from keyHashToKey' )
        deepEqual( this.exampleHm.keyHashToValueHash['36ac5f4ee1c1b30a6fa56a511616e135'], undefined, 'removed from keyHashToValueHash' )
        deepEqual( this.exampleHm.valueList.get( 'key1' ), null, 'removed from valueList' )
        deepEqual( this.exampleHm.valueList.get( '36ac5f4ee1c1b30a6fa56a511616e135' ), null, 'removed from valueList' )
        deepEqual( this.exampleHm.keyList.indexOf( 'key1' ), -1, 'removed from keyList' );
    } );

    test( 'keySet', function() {
        deepEqual( this.emptyHm.keySet(), [], 'empty hash map returns empty Array' );

        this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz', 'foo', 'bar', 'quux'] );
        this.emptyHm.put( new Date( 2013, 9, 22 ), new Date( 1984, 1, 15 ) );

        // check the key set after inserting some elements
        deepEqual( this.emptyHm.keySet(), [["baz", "foo", "bar", "quux"], new Date( 2013, 9, 22 )], 'correct key set after inserting elements' );
    } );

    test( 'values', function() {
        this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz', 'foo', 'bar', 'quux'] );
        this.emptyHm.put( new Date( 2013, 9, 22 ), new Date( 1984, 1, 15 ) );
        this.emptyHm.put( 'key1', 'foo' );

        // check the key set after inserting some elements
        deepEqual( this.emptyHm.values(), [['baz', 'foo', 'bar', 'quux'], new Date( 1984, 1, 15 ), 'foo'], 'got the right value set' );
    } );

    test( 'containsKey', function() {
        deepEqual( this.emptyHm.containsKey( 'key1' ), false, 'Accessing non existing key returns false' );
        deepEqual( this.emptyHm.containsKey(), false, 'Undefined key returns false' );
        deepEqual( this.exampleHm.containsKey( 'key1' ), true, 'Accessing existing key returns true' );
        deepEqual( this.exampleHm.containsKey( {'foo': 12, 'bar': 34} ), true, 'Accessing existing key returns true' );
    } );

    test( 'containsValue', function() {
        deepEqual( this.emptyHm.containsValue( 'nope' ), false, 'Accessing non existing value returns false' );
        deepEqual( this.emptyHm.containsValue(), false, 'undefined value returns false' );
        deepEqual( this.exampleHm.containsValue( 123456 ), true, 'Accessing existing value returns true' );
        deepEqual( this.exampleHm.containsValue( {'foo': 12, 'bar': 34} ), true, 'Accessing existing value returns true' );
        deepEqual( this.exampleHm.containsValue( {'bar': 34, 'foo': 12} ), true, 'Accessing existing value returns true' );
        deepEqual( this.exampleHm.containsValue( new Date( 2013, 9, 22 ) ), true, 'Accessing existing value returns true' );
        deepEqual( this.exampleHm.containsValue( 123.56 ), true, 'Accessing existing value returns true' );
        deepEqual( this.exampleHm.containsValue( 12 ), false, 'Accessing non existing value returns true' );
        deepEqual( this.exampleHm.containsValue( ['baz', 'foo', 'bar', 'quux'] ), true, 'Accessing existing value returns true' );
    } );

    test( 'get', function() {
        deepEqual( this.emptyHm.get( 'key1' ), null, 'Accessing non existing key returns null' );
        deepEqual( this.exampleHm.get( 'key1' ), ['baz', 'foo', 'bar', 'quux'], 'Accessing valid key returns the mapped value' );
        deepEqual( this.exampleHm.get( 'key2' ), {'foo': 12, 'bar': 34}, 'Accessing valid key returns the mapped value' );
        deepEqual( this.exampleHm.get( 'key3' ), 123456, 'Accessing valid key returns the mapped value' );
        deepEqual( this.exampleHm.get( 'key4' ), 123.56, 'Accessing valid key returns the mapped value' );
        deepEqual( this.exampleHm.get( 'key5' ), new Date( 2013, 9, 22 ), 'Accessing valid key returns the mapped value' );
        deepEqual( this.exampleHm.get( 'key7' ), 'foo', 'Accessing valid key returns the mapped value' );
        deepEqual( this.exampleHm.get( 'key8' ), true, 'Accessing valid key returns the mapped value' );
        deepEqual( this.exampleHm.get( {'foo': 12, 'bar': 34} ), {'foo': 12, 'bar': 34}, 'Accessing valid key returns the mapped value' );
    } );

    test( 'isEmpty', function() {
        equal( this.emptyHm.isEmpty(), true, 'Empty HashMap is empty :-)' );
        this.emptyHm.put( 'key3', 78 );
        equal( this.emptyHm.isEmpty(), false, 'After putting an element, HashMap is not empty anymore' );

        equal( this.exampleHm.isEmpty(), false, 'Example (filled) HashMap is NOT empty' );
    } );

    test( 'size', function() {
        equal( this.emptyHm.size(), 0, 'Empty list -> 0' );

        // adding some basic entries
        this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz', 'foo', 'bar', 'quux'] );
        this.emptyHm.put( new Date( 2013, 9, 22 ), new Date( 1984, 1, 15 ) );
        equal( this.emptyHm.size(), 2, 'size is 2' );

        // add a already existing key with new object
        this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz'] );
        equal( this.emptyHm.size(), 2, 'size is still 2' );

        // fake a maximum amount of Array entries
        this.emptyHm.keyList.length = Math.floor( (Math.pow( 2, 32 ) - 1) / 2 );
        equal( this.emptyHm.size(), this.emptyHm.getMaxArrayLength(), 'size equals the defined max size for Arrays' );
    } );
} );
