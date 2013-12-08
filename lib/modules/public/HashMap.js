/*
 * wijcollections - HashMap
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/public/HashMap", ['wijcModules/private/AbstractCollection', 'wijcModules/private/ListObject'], function( AbstractCollection, ListObject ) {
    /**
     * HashMap constructor, inheriting from AbstractCollection Class.
     *
     * @constructor
     * @class HashMap
     * @extends {AbstractCollection}
     * @implements {ListObject}
     * @todo throw errors
     */
    function HashMap() {
        var that = this;

        that.keyList = []; // stores the original keys
        that.valueList = new ListObject(); // stores the values
        that.keyHashToValueHash = {}; // stores hash values of the key to the value
        that.keyHashToKey = {}; // maps hash of keys to the orginal keys
    }

    HashMap.prototype = new AbstractCollection();
    HashMap.prototype.constructor = HashMap;

    HashMap.prototype.clear = function() {
        // body...
    };

    HashMap.prototype.clone = function() {
        // body...
    };

    HashMap.prototype.containsKey = function( key ) {
        console.warn( key );
    };

    HashMap.prototype.containsValue = function( value ) {
        console.warn( value );
    };

    HashMap.prototype.entrySet = function() {
        // body...
    };

    HashMap.prototype.get = function( key ) {
        console.warn( key );
    };

    HashMap.prototype.isEmpty = function() {
        // body...
    };

    HashMap.prototype.keySet = function() {
        // body...
    };

    /**
     * Associate a specific value with a specific key.
     *
     * @public
     * @method put
     * @param  {Object} key   the key the value will be associated with
     * @param  {Object} value a value that will be associated with the key
     * @return {Object}       null, if the key isn't present yet, else the old stored value
     *                              of the key will be returned
     * @example
     *     var hm = new HashMap();
     *     hm.put( 'myKey', {'foo': new Date( 1984, 1, 15 )} ); // String as key with an Date object as value, returns null
     *     hm.put( {'bar': 1}, [1, 2, 3] ); // Object as key with Array as value, returns null
     *     hm.put( {'bar': 1}, 'Quux' ); // existing key with new value, the old value [1, 2, 3] will be returned
     */
    HashMap.prototype.put = function( key, value ) {
        // if anything is not defined, we need to return
        if( key === undefined || value === undefined || key === null ) {
            return undefined;
        }

        // building the hash values (if needed) we need for the store process
        var keyHash = this.needsHashing( key ) ? this.getHash( key ) : key,
            valueHash = this.needsHashing( value ) ? this.getHash( value ) : value;

        // the key is already present in our list
        if( this.keyHashToKey[keyHash] !== undefined ) {
            // get the old value (returning this later)
            var oldValue = this.valueList.get( keyHash ).ref;

            // replace the old value with the new one
            this.valueList.replace( keyHash, value, true );

            // return the old value
            return oldValue;
        }

        // add the original key to the key array
        this.keyList.push( key );

        // add the original value to the interal ListObject instance
        this.valueList.add( value, keyHash );

        // map the keyHash to the valueHash
        this.keyHashToValueHash[keyHash] = valueHash;

        // map the hashKey to the original key
        this.keyHashToKey[keyHash] = key;

        // if the element wasn't present yet, return null
        return null;
    };

    HashMap.prototype.putAll = function( keyValueObject ) {
        console.warn( keyValueObject );
    };

    HashMap.prototype.remove = function( key ) {
        console.warn( key );
    };

    HashMap.prototype.size = function() {
        if( this.keyList.length >= Number.MAX_VALUE ) {
            return Number.MAX_VALUE;
        }

        return this.keyList.length;
    };

    HashMap.prototype.values = function() {
        // body...
    };

    return HashMap;
} );
