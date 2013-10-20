/*
 * wijcollections - Abstract Collection
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/AbstractCollection", function() {
    var AbstractCollection = function() {
        return true;
    };

    AbstractCollection.prototype.add = function( element ) {
        console.warn( 'in add', element );
        return true;
    };

    AbstractCollection.prototype.clear = function() {
        console.warn( 'clearing element' );
        return true;
    };

    AbstractCollection.prototype.contains = function( element ) {
        console.warn( 'contain element', element );
        return true;
    };

    AbstractCollection.prototype.isEmpty = function() {
        console.warn( 'isEmpty' );
        return true;
    };

    AbstractCollection.prototype.remove = function( element ) {
        console.warn( 'removing element', element );
        return true;
    };

    AbstractCollection.prototype.size = function() {
        console.warn( 'getting size' );
        return true;
    };

    AbstractCollection.prototype.toString = function() {
        console.warn( 'toString collection' );
        return true;
    };

    // returning the constructor enables us to use the prototypal
    // inheritance and assign the sub class prototype to this
    // constructor
    return AbstractCollection;
} );
