/*
 * wijcollections - Abstract Collection
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

/**
 * Just an abstract definition
 */
define( "wijcModules/AbstractCollection", function() {
    function AbstractCollection() {
        return true;
    }

    AbstractCollection.prototype.constructor = AbstractCollection;

    AbstractCollection.prototype.add = function( element ) {
        return !!element;
    };

    AbstractCollection.prototype.clear = function() {
        return true;
    };

    AbstractCollection.prototype.contains = function( element ) {
        return !!element;
    };

    AbstractCollection.prototype.isEmpty = function() {
        return true;
    };

    AbstractCollection.prototype.remove = function( element ) {
        return !!element;
    };

    AbstractCollection.prototype.size = function() {
        return true;
    };

    AbstractCollection.prototype.toString = function() {
        return true;
    };

    // returning the constructor enables us to use the prototypal
    // inheritance and assign the sub class prototype to this
    // constructor
    return AbstractCollection;
} );
