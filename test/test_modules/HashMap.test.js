define( ['wijcModules/public/HashMap'], function( HashMap ) {
    module( 'HashMap', {
        setup: function() {
            this.emptyHm = new HashMap();
        }
    } );

    test( 'put', function() {
        ok( true, 'yay' );

        this.emptyHm.put( 'key1', ['baz', 'foo', 'bar', 'quux'] );
        this.emptyHm.put( 'key2', {'foo': 12, 'bar': 34} );
        this.emptyHm.put( 'key3', 123456 );
        this.emptyHm.put( 'key4', 123.56 );
        this.emptyHm.put( 'key5', new Date( 2013, 9, 22 ) );
        this.emptyHm.put( 'key7', 'foo' );
        this.emptyHm.put( 'key7', 'bar' );
        this.emptyHm.put( 'key8', true );

        this.emptyHm.put( ['baz', 'foo', 'bar', 'quux'], ['baz', 'foo', 'bar', 'quux'] );
        this.emptyHm.put( {'foo': 12, 'bar': 34}, {'foo': 12, 'bar': 34} );
        this.emptyHm.put( {'foo': 12, 'bar': 34}, {'foo': 24, 'bar': 34} );
        this.emptyHm.put( 123456, 123456 );
        this.emptyHm.put( 123.56, 123.56 );
        this.emptyHm.put( new Date( 2013, 9, 22 ), new Date( 2013, 9, 22 ) );
        this.emptyHm.put( 'foo', 'foo' );
        this.emptyHm.put( true, true );

        console.warn( this.emptyHm );
    } );
} );
