/* jshint unused: false */

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
define( function() {
    /**
     * <h2><strong>Do not instanciate this one ever!</strong></h2>
     * Basic, abstract Class.
     *
     * @class AbstractCollection
     * @constructor
     */
    function AbstractCollection() {
        var MAX_ARRAY_LENGTH = Math.floor( (Math.pow( 2, 32 ) - 1) / 2 ),
            that = this;

        /**
         * Returns the maximum array length for the collections API.
         *
         * @protected
         * @method getMaxArrayLength
         * @return {Number} the maximum Array length
         */
        that.getMaxArrayLength = function() {
            return MAX_ARRAY_LENGTH;
        };

        /**
         * Using the Java hashCode function to generate a Integer hash code.
         *
         * @protected
         * @see http://stackoverflow.com/a/7616484
         * @method hashCode
         * @param  {String} str String representation of any object
         * @return {String}     hash code
         */
        that.hashCode = function( str ) {
            var hashValue = 0, len = str.length;

            if( len === 0 ) {
                return hashValue;
            }

            for( var i = 0; i < len; i++ ) {
                hashValue = ( (hashValue << 5) - hashValue ) + str.charCodeAt( i );
                hashValue = hashValue & hashValue; // Convert to 32bit integer
            }

            // convert Number to String here, because we're using the hash code
            // as a Object key
            return hashValue;
        };

        /**
         * Applies a supplemental hash function to a given hashCode, which defends against
         * poor quality hash functions. This is critical because HashMap uses power-of-two
         * length hash tables, that otherwise encounter collisions for hashCodes that do not
         * differ in lower bits.
         *
         * @protected
         * @see http://www.docjar.com/docs/api/java/util/HashMap.html#hash(int)
         * @method hash
         * @param  {Number} h The hash code
         * @return {String}   String respresentation of the calculates hash code
         */
        this.hash = function( h ) {
            // This function ensures that hashCodes that differ only by
            // constant multiples at each bit position have a bounded
            // number of collisions (approximately 8 at default load factor).
            h ^= (h >>> 20) ^ (h >>> 12);
            return h ^ (h >>> 7) ^ (h >>> 4);
        };

        /**
         * Check if a given number is a floating point number
         * @param  {Number} number the number to check
         * @return {Boolean}       true, if the specified number is a floating point number, else false
         */
        that.isFloat = function( number ) {
            if( number === undefined ) {
                return false;
            }

            if( number.constructor !== Number ) {
                return false;
            }

            return number === +number && number !== (number|0);
        };

        /**
         * Internal function for sorting a object by key (if needed) and
         * returning a valid hash value, if the specified object
         * needs a hashing
         *
         * @protected
         * @method hashObject
         * @param  {Object} obj the specified object that'll be processed
         * @return {Object}     a hash string if hashing is needed, else the object itself
         */
        that.hashObject = function( obj ) {
            if( obj.constructor === Object ) {
                // pseudo sorting
                obj = that.sortObjectByKeys( obj );
            }

            if( that.needsHashing( obj ) ) {
                obj = that.getHash( obj );
            }

            return obj;
        };

        return true;
    }

    AbstractCollection.prototype.constructor = AbstractCollection;

    /**
     * Public API definition
     */

    /**
     * Central function to check if an given element needs to be processed
     * with hashing (like Object, Array) or not (e.g. String)
     *
     * @public
     * @method needsHashing
     * @param  {Object} element the element to check
     * @return {Boolean}        true, if element needs hashing
     */
    AbstractCollection.prototype.needsHashing = function( element ) {
        if( element === undefined ) {
            return null;
        }

        if( this.isFloat( element ) ) {
            return true;
        }

        var elementType = element.constructor;

        if( elementType === String || elementType === Number || elementType === Boolean || elementType === Function ) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Create a Hash of a given String
     *
     * @public
     * @method getHash
     * @param  {String} str the String to build a hash on
     * @return {String}     the actual hash value, <code>null</code> if parameter is missing or a Function
     */
    AbstractCollection.prototype.getHash = function( obj ) {
        if( obj !== undefined && obj !== null ) {
            // No hash for functions :(
            if( obj.constructor === Function ) {
                return null;
            }

            // we need a String for hashing
            // returning string as the hash is used for indexing in an object
            if( obj.constructor !== String ) {
                return this.hash( this.hashCode( JSON.stringify( obj ) ) ) + '';
            } else {
                return this.hash( this.hashCode( obj ) ) + '';
            }
        }

        // and we need a parameter at least :-/
        return null;
    };

    /**
     * Sort the keys in an object by it's keys. Although objects do not
     * have a guaranteed key order, this function will help to identify
     * when two objects are "equal".
     *
     * @public
     * @method sortObjectByKeys
     * @param  {Object} obj the object to sort the keys
     * @return {Object}     sorted object (a copy of the specified one)
     */
    AbstractCollection.prototype.sortObjectByKeys = function( obj ) {
        if( obj !== undefined && obj.constructor === Object ) {
            var objKeys = [],
                sortedObject = {};

            // grab all keys here
            for( var key in obj ) {
                if( obj.hasOwnProperty( key ) ) {
                    objKeys.push( key );
                }
            }

            // using Array.sort() will ensurce an sorted array
            objKeys.sort();

            // "reimplement" the keys
            for( var i = 0, iMax = objKeys.length; i < iMax; i++ ) {
                sortedObject[objKeys[i]] = obj[objKeys[i]];
            }

            return sortedObject;
        }

        return null;
    };

    /**
     * Clone Objects, Arrays or date objects
     *
     * @public
     * @method cloneObject
     * @param  {Object} original the element to copy
     * @return {Object}          the copied element
     */
    AbstractCollection.prototype.cloneObject = function( original ) {
        var copy;

        if( original === undefined ) {
            return null;
        }

        if( original.constructor === Array ) {
            copy = [];

            for( var a = 0, aMax = original.length; a < aMax; a++ ) {
                copy[a] = original[a];
            }
        }

        if( original.constructor === Object ) {
            copy = {};

            for( var prop in original ) {
                // when the original object has the given property,
                // do some recursive cloning
                if( original.hasOwnProperty( prop ) ) {
                    // if the value is another object, copy recursive
                    if( original[prop].constructor === Object ) {
                        copy[prop] = this.cloneObject( original[prop] );
                    } else {
                        // else, if the the value is not an object, we can
                        // simply copy the value here
                        copy[prop] = original[prop];
                    }
                }
            }
        }

        if( original.constructor === Date ) {
            copy = new Date();
            copy.setTime( original.getTime() );
        }

        return copy || null;
    };

    // returning the constructor enables us to use the prototypal
    // inheritance and assign the sub class prototype to this
    // constructor
    return AbstractCollection;
} );
