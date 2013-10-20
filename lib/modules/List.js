/*
 * wijcollections - List
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/List", ['wijcModules/AbstractCollection'], function( AbstractCollection ) {
    var List = function() {
        var list = {},
            size = 0,
            first = {},
            last = {};

        console.warn( list, size, first, last );
    };

    // inherit from base class AbstractCollection
    List.prototype = new AbstractCollection();

    List.prototype.add = function() {
        console.warn( 'new add method' );
        return true;
    };

    return List;
} );
