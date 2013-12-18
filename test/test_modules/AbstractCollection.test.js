/**
 * The actual test suite
 */

define( ['wijcModules/private/AbstractCollection'], function( AbstractCollection ) {
    module( 'AbstractCollection', {
        setup: function() {
            this.abstractCollection = new AbstractCollection();
        }
    } );

    test( '[methods]', function() {
        equal( this.abstractCollection.add(), undefined, '[add] should be undefined here' );
        equal( this.abstractCollection.get(), undefined, '[get] should be undefined here' );
        equal( this.abstractCollection.clear(), undefined, '[clear] should be undefined here' );
        equal( this.abstractCollection.contains(), undefined, '[contains] should be undefined here' );
        equal( this.abstractCollection.isEmpty(), undefined, '[isEmpty] should be undefined here' );
        equal( this.abstractCollection.remove(), undefined, '[remove] should be undefined here' );
        equal( this.abstractCollection.size(), undefined, '[size] should be undefined here' );
        equal( this.abstractCollection.toString(), undefined, '[toString] should be undefined here' );
    } );

    test( '[getHash]', function() {
        var foo = function() { $.noop(); };

        deepEqual( this.abstractCollection.getHash( 'foo' ), '101574', 'hash for \"foo\" is correct' );
        deepEqual( this.abstractCollection.getHash( 'bar' ), '97299', 'hash for \"bar\" is correct' );
        deepEqual( this.abstractCollection.getHash( ['baz', 'foo', 'bar', 'quux'] ), '-1133304195', 'hash for Array is correct' );
        deepEqual( this.abstractCollection.getHash( {'foo': 12, 'bar': 34} ), '-1396304513', 'hash for Object is correct' );
        deepEqual( this.abstractCollection.getHash( true ), '3569038', 'hash for Boolean is correct' );
        deepEqual( this.abstractCollection.getHash( 123456 ), '1450575459', 'hash for Number (int) is correct' );
        deepEqual( this.abstractCollection.getHash( 123.56 ), '1450569693', 'hash for Number (double) is correct' );
        deepEqual( this.abstractCollection.getHash(), null, 'return value for undefined was null' );
        deepEqual( this.abstractCollection.getHash( null ), null, 'return value for null was null' );
        deepEqual( this.abstractCollection.getHash( foo ), null, 'return value for function was null' );
    } );

    test( '[sortObjectByKeys]', function() {
        deepEqual( this.abstractCollection.sortObjectByKeys( {'foo': 'baz', 'bar': 1, 123: 'har'} ), {123: "har", bar: 1, foo: "baz"}, 'Object sorted correctly' );
        deepEqual( this.abstractCollection.sortObjectByKeys(), null, 'Non object - returned null' );
        deepEqual( this.abstractCollection.sortObjectByKeys( [1, '2', {'foo': 'bar'}] ), null, 'Non object - returned null' );
    } );

    test( '[needsHashing]', function() {
        equal( this.abstractCollection.needsHashing( 'foo' ), false, 'String - no hashing' );
        equal( this.abstractCollection.needsHashing( {'bar': 1, 'foo': 'baz'} ), true, 'Object - hashing' );
        equal( this.abstractCollection.needsHashing( 23 ), false, 'Number - no hashing' );
        equal( this.abstractCollection.needsHashing( [1, 2, 3, 4] ), true, 'Array - hashing' );
        equal( this.abstractCollection.needsHashing( new Date( 2013, 9, 24 ) ), true, 'Date - hashing' );
        equal( this.abstractCollection.needsHashing( false ), false, 'Boolean - no hashing' );
        equal( this.abstractCollection.needsHashing( 23.21 ), true, '23.21 returns true' );
        equal( this.abstractCollection.needsHashing( 0.1 ), true, '0.1 returns true' );
        equal( this.abstractCollection.needsHashing(), null, 'undefined returns null' );
    } );
} );
