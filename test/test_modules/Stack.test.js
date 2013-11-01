define( ['wijcModules/public/Stack'], function( Stack ) {
    module( 'Stack', {
        setup: function() {
            this.stack = new Stack();
            this.mixedStack = new Stack();

            this.mixedStack.push( 'foo' );
            this.mixedStack.push( {'bar': 1, 'foo': 'baz'} );
            this.mixedStack.push( {'bar': 1, 'foo': 'baz'} ); // duplicate entry
            this.mixedStack.push( 23 );
            this.mixedStack.push( [1, 2, 3, 4] );
            this.mixedStack.push( new Date( 2013, 9, 24 ) );
            this.mixedStack.push( false );
        }
    } );

    test( '[empty]', 2, function() {
        deepEqual( this.stack.empty(), true, 'Stack is empty' );
        this.stack.push( 'Rudi' );
        deepEqual( this.stack.empty(), false, 'Stack is not empty anymore' );
    } );

    test( '[peek]', 7, function() {
        this.stack.push( 'Rudi' );
        deepEqual( this.stack.peek(), 'Rudi', 'String - peeked right' );

        this.stack.push( 22 );
        deepEqual( this.stack.peek(), 22, 'Number - peeked right' );

        this.stack.push( {firstName: 'Rudi', age: 22} );
        deepEqual( this.stack.peek(), {firstName: 'Rudi', age: 22}, 'Object - peeked right' );

        this.stack.push( [1, 2, 3] );
        deepEqual( this.stack.peek(), [1, 2, 3], 'Array - peeked right' );

        this.stack.push( true );
        deepEqual( this.stack.peek(), true, 'Boolean - peeked right' );

        this.stack.push( {firstName: 'Rudi', age: 22, foo: {'bar': 'baz'}} );
        deepEqual( this.stack.peek(), {firstName: 'Rudi', age: 22, foo: {'bar': 'baz'}}, 'Object with object - peeked right' );

        this.stack.push( new Date( 2013, 9, 24 ) );
        deepEqual( this.stack.peek(), new Date( 2013, 9, 24 ), 'Date - peeked right' );
    } );

    test( '[pop]', 9, function() {
        deepEqual( this.mixedStack.pop(), false, 'got the right object from stack' );
        deepEqual( this.mixedStack.pop(), new Date( 2013, 9, 24 ), 'got the right object from stack' );
        deepEqual( this.mixedStack.pop(), [1, 2, 3, 4], 'got the right object from stack' );
        deepEqual( this.mixedStack.pop(), 23, 'got the right object from stack' );
        deepEqual( this.mixedStack.pop(), {'bar': 1, 'foo': 'baz'}, 'got the right object from stack' );
        deepEqual( this.mixedStack.pop(), {'bar': 1, 'foo': 'baz'}, 'got the right object from stack' );
        deepEqual( this.mixedStack.pop(), 'foo', 'got the right object from stack' );
        deepEqual( this.mixedStack.pop(), null, 'Stack is empty, yay' );
        deepEqual( this.mixedStack.empty(), true, 'Stack is really empty!' );
    } );

    test( '[push]', 6, function() {
        var resultRef = ["Rudi", 22, "2fcd40f12d511a726078114f0ddb41c2", "f1e46f328e6decd56c64dd5e761dc2b7", true];

        deepEqual( this.stack.push( 'Rudi' ), 'Rudi', 'String pushed' );
        deepEqual( this.stack.push( 22 ), 22, 'Number pushed' );
        deepEqual( this.stack.push( {firstName: 'Rudi', age: 22} ), {firstName: 'Rudi', age: 22}, 'Object pushed' );
        deepEqual( this.stack.push( [1, 2, 3] ), [1, 2, 3], 'Array pushed' );
        deepEqual( this.stack.push( true ), true, 'Boolean pushed' );
        deepEqual( this.stack.stack, resultRef, 'Result stack is fine' );
    } );

    test( '[search]', 7, function() {
        deepEqual( this.mixedStack.search( 'foo' ), 7, 'Found String' );
        deepEqual( this.mixedStack.search( {'bar': 1, 'foo': 'baz'} ), 5, 'Found Object' ); // duplicate here
        deepEqual( this.mixedStack.search( 23 ), 4, 'Found Number' );
        deepEqual( this.mixedStack.search( [1, 2, 3, 4] ), 3, 'Found Array' );
        deepEqual( this.mixedStack.search( new Date( 2013, 9, 24 ) ), 2, 'Found Date' );
        deepEqual( this.mixedStack.search( false ), 1, 'Found Boolean' );
        deepEqual( this.mixedStack.search( {'not': 'found'} ), -1, 'Identified invalid element' );
    } );
} );
