/*
 * wijcollections - List
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/List", ['wijcModules/AbstractCollection'], function( AbstractCollection ) {
    /**
     * List constructor
     */
    function List() {
        var that = this;
        that.list = [];

        // if object will be added:
        //  1st: create a hash code
        //  2nd: add that hash code to the Array
        //  3rd: map the hash code to the original object in the baseObject
        that.addToBaseObject = function( obj ) {
            var objectHash = that.getHash( obj );

            // map the object hash to the list position
            this.baseObject[objectHash] = obj;

            return objectHash;
        };
    }

    // inherit from base class AbstractCollection
    List.prototype = new AbstractCollection();
    List.prototype.constructor = List;

    /**
     * Appends an element at the end of the list
     * @param  {Object} element element to be appended to the list
     * @return {Boolean}        true if the element was appended
     */
    List.prototype.add = function( element ) {
        // only append the element if it's actually an element
        if( element !== undefined ) {
            // if the element is an Object or Array, we need to build
            // a hash for faster lookups
            if( element.constructor === Object || element.constructor === Array ) {
                // converting the element to a hash and add this
                // hash value. so we can lookup faster (no addition iterating)
                this.list.push( this.addToBaseObject( element ) );
                return true;
            } else if( element.constructor === Function ) {
                // no function handling yet
                return null;
            } else {
                this.list.push( element );
                return true;
            }
        }

        return null;
    };

    /**
     * Insert the given element at the specified position in the the list
     * @param  {Object} element the specified element to insert
     * @param  {Number} index   Index at which the specified element is to be inserted
     * @return {Boolean}        true if the element was inserted
     */
    List.prototype.addAt = function( element, index ) {
        if( element !== undefined ) {
            var listLength = this.size();

            // if an index is set, try to insert the element on the
            // index position
            if( index !== undefined && index.constructor === Number ) {
                if( index === 0 ) {
                    // first position -> do an unshift operation
                    this.list.unshift( element );
                    return true;
                } else if( index > 0 && index < (listLength - 1) ) {
                    // in the middle of the array
                    this.list.splice( index, 0, element );
                    return true;
                } else if( index >= (listLength - 1) ) {
                    // index is higher or equal the array length
                    this.list.push( element );
                    return true;
                } else {
                    // something's wrong in Denmark :-/
                    return null;
                }
            } else {
                // no index was given, simply push the element to the ned
                this.list.push( element );
                return true;
            }
        } else {
            // we need one valid element at least
            return null;
        }
    };

    /**
     * Returns the element at the specified position
     * @param  {Number} index the elements position in the list
     * @return {Object}       the object from the list, or false if something's wrong
     */
    List.prototype.get = function( index ) {
        if( typeof index !== undefined ) {
            // check that the given index is in the bounds of our Array
            if( index >= 0 && (index < this.list.length) ) {
                return this.list[index];
            }
        }

        // index not specified or out of bounds
        return null;
    };

    /**
     * Remove all elements from the List
     */
    List.prototype.clear = function() {
        // don't create a new Array here like:
        //      this.list = [];
        // this would break all old references to this array
        this.list.length = 0;

        // reset the internal baseObject
        this.resetBaseObject();
    };

    /**
     * Returns the number of elements the list is containing
     * @return {Number} element count
     */
    List.prototype.size = function() {
        return this.list.length;
    };

    List.prototype.contains = function( element ) {
        if( element !== undefined ) {
            return true;
        }

        return null;
    };

    return List;
} );
