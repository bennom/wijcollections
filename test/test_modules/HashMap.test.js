define( ['wijcModules/public/HashMap'], function( HashMap ) {
    module( 'HashMap', {
        setup: function() {
            this.emptyHm = new HashMap();
        }
    } );

    test( 'put (String Keys)', function() {
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
            "key1": "57400b3ad8a6f9352e09ae496d7527f0",
            "key2": "8e31c476951c83023b96e480f875cbce",
            "key3": 123456,
            "key4": "5010f043e9aa18e14d721598a4aeb856",
            "key5": "4273dd148172616f335e01fa1a17ce4e",
            "key7": "foo",
            "key8": true
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
        ok( true, 'yay' );

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

        // check internal lists
        deepEqual( this.emptyHm.keyHashToKey, {
            "8e31c476951c83023b96e480f875cbce": {"bar": 34, "foo": 12},
            "4273dd148172616f335e01fa1a17ce4e": new Date( 2013, 9, 22 ),
            "57400b3ad8a6f9352e09ae496d7527f0": ['baz', 'foo', 'bar', 'quux']
        }, 'keyHashToKey Object is correct' );

        // key hash to value hash mapping
        deepEqual( this.emptyHm.keyHashToValueHash, {
            "8e31c476951c83023b96e480f875cbce": "8e31c476951c83023b96e480f875cbce",
            "4273dd148172616f335e01fa1a17ce4e": "af4aee04cca6ba43ce7368e6805fecc4",
            "57400b3ad8a6f9352e09ae496d7527f0": "57400b3ad8a6f9352e09ae496d7527f0"
        }, 'keyHashToValueHash Object is correct' );

        // key set
        deepEqual( this.emptyHm.keyList, [
            ['baz', 'foo', 'bar', 'quux'],
            {"bar": 34, "foo": 12},
            new Date( 2013, 9, 22 )
        ], 'keyHashToValueHash Object is correct' );

        // the central value list
        deepEqual( this.emptyHm.valueList.listObject, {
            "duplicateCnt": 0,
            "overallCnt": 3,
            "8e31c476951c83023b96e480f875cbce": {"cnt": 1, "ref": {"bar": 34, "quux": true}},
            "4273dd148172616f335e01fa1a17ce4e": {"cnt": 1, "ref": new Date( 1984, 1, 15 )},
            "57400b3ad8a6f9352e09ae496d7527f0": {"cnt": 1, "ref": ['baz', 'foo']}
        }, 'valueList.listObject Object is correct' );
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
    } );
} );
