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
        var that = this;

        that.incrementBaseObjectCounter = function() {
            that.baseObject.counter++;
        };

        that.decrementBaseObjectCounter = function() {
            that.baseObject.counter--;
        };

        that.resetBaseObject = function() {
            that.baseObject = {
                counter: 0
            };
        };

        // create the baseObject intially
        that.resetBaseObject();

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
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     * @param  {String} str the String to build a hash on
     * @return {Number}     the actual hash value (non-negative)
     */
    AbstractCollection.prototype.getHash = function( str ) {
        var hash = 0, c;

        // we can't do anything if there's nothing to process
        if( str === undefined ) {
            return null;
        }

        // if the given parameter is not a String, we have to
        // convert this thing in a String
        // (the PolyfillFunctions offers a fallback for IE8+ here)
        if( str.constructor !== String ) {
            str = JSON.stringify( str );
        }

        // check the lenght
        if( str.length === 0 ) {
            return hash;
        }

        for( var i = 0, iMax = str.length; i < iMax; i++ ) {
            c = str.charCodeAt( i );
            hash = ( ( hash << 5 ) - hash ) + c;
            hash = hash & hash; // Convert to 32bit integer
        }

        // return the non-negative hash code
        return Math.abs( parseInt( hash, 10 ) );
    };

    // returning the constructor enables us to use the prototypal
    // inheritance and assign the sub class prototype to this
    // constructor
    return AbstractCollection;
} );
