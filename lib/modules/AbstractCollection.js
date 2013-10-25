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
define( "wijcModules/AbstractCollection", ['md5/wiMD5'], function( MD5 ) {
    function AbstractCollection() {
        var that = this;

        that.generateMd5 = function( str ) {
            return MD5( str );
        };

        return true;
    }

    AbstractCollection.prototype.constructor = AbstractCollection;

    AbstractCollection.prototype.add = function( element ) {
        return !!element;
    };

    AbstractCollection.prototype.get = function( index ) {
        return !!index;
    };

    AbstractCollection.prototype.size = function() {
        return true;
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

    AbstractCollection.prototype.remove = function( index ) {
        return !!index;
    };

    AbstractCollection.prototype.toString = function() {
        return true;
    };

    /**
     * Create a Hash of a given String
     * @todo toString() for Numbers and Booleans?
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     * @param  {String} str the String to build a hash on
     * @return {Number}     the actual hash value (non-negative)
     */
    AbstractCollection.prototype.getHash = function( str ) {
        if( str !== undefined && str !== null ) {
            // No MD5 hash for functions :(
            if( str.constructor === Function ) {
                throw new TypeError( "[AC-getHash] cannot convert functions to MD5!" );
            }

            // for MD5, we need a String
            if( str.constructor !== String ) {
                return this.generateMd5( JSON.stringify( str ) );
            } else {
                return this.generateMd5( str );
            }
        }

        // and we need a parameter at least :-/
        return null;
    };

    // returning the constructor enables us to use the prototypal
    // inheritance and assign the sub class prototype to this
    // constructor
    return AbstractCollection;
} );
