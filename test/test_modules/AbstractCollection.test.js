/**
 * The actual test suite
 */

define( ['wijcModules/private/AbstractCollection'], function( AbstractCollection ) {
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
        deepEqual( this.abstractCollection.getHash( foo ), null, 'return value for function was null' );
    } );

    test( '[sortObjectByKeys]', 3, function() {
        deepEqual( this.abstractCollection.sortObjectByKeys( {'foo': 'baz', 'bar': 1, 123: 'har'} ), {123: "har", bar: 1, foo: "baz"}, 'Object sorted correctly' );
        deepEqual( this.abstractCollection.sortObjectByKeys(), null, 'Non object - returned null' );
        deepEqual( this.abstractCollection.sortObjectByKeys( [1, '2', {'foo': 'bar'}] ), null, 'Non object - returned null' );
    } );

    test( '[needsHashing]', 7, function() {
        equal( this.abstractCollection.needsHashing( 'foo' ), false, 'String - no hashing' );
        equal( this.abstractCollection.needsHashing( {'bar': 1, 'foo': 'baz'} ), true, 'Object - hashing' );
        equal( this.abstractCollection.needsHashing( 23 ), false, 'Number - no hashing' );
        equal( this.abstractCollection.needsHashing( [1, 2, 3, 4] ), true, 'Array - hashing' );
        equal( this.abstractCollection.needsHashing( new Date( 2013, 9, 24 ) ), true, 'Date - hashing' );
        equal( this.abstractCollection.needsHashing( false ), false, 'Boolean - no hashing' );
        equal( this.abstractCollection.needsHashing(), null, 'undefined returns null' );
    } );
} );
