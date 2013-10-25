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

        that.resetBaseObject = function() {
            that.baseObject = {};
        };

        // create the baseObject intially
        that.resetBaseObject();

        // if object will be added:
        //  1st: create a hash code
        //  2nd: add that hash code to the Array
        //  3rd: map the hash code to the original object in the baseObject
        that.addNonStringObject = function( obj ) {
            if( obj.constructor === Object ) {
                obj = that.sortObjectByKeys( obj );
            }

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
            if( element.constructor !== String ) {
                // converting the element to a hash and add this
                // hash value. so we can lookup faster (no addition iterating)
                this.list.push( this.addNonStringObject( element ) );
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
        /**
         * general note: all elements that aren't a String will be
         * hashed and stored in the internal baseObject. the hash value
         * in particular will be stored in the actual Array
         */

        if( element !== undefined ) {
            var listLength = this.size();

            // if an index is set, try to insert the element on the
            // index position
            if( index !== undefined && index.constructor === Number ) {
                if( index === 0 ) {
                    // first position -> do an unshift operation
                    if( element.constructor !== String ) {
                        this.list.unshift( this.addNonStringObject( element ) );
                    } else {
                        this.list.unshift( element );
                    }

                    return true;
                } else if( index > 0 && index < (listLength - 1) ) {
                    // in the middle of the array
                    if( element.constructor !== String ) {
                        this.list.splice( index, 0, this.addNonStringObject( element ) );
                    } else {
                        this.list.splice( index, 0, element );
                    }

                    return true;
                } else if( index >= (listLength - 1) ) {
                    // index is higher or equal the array length
                    if( element.constructor !== String ) {
                        this.list.push( this.addNonStringObject( element ) );
                    } else {
                        this.list.push( element );
                    }
                    return true;
                } else {
                    // something's wrong in Denmark :-/
                    return null;
                }
            } else {
                // no index was given, simply push the element to the ned
                if( element.constructor !== String ) {
                    this.list.push( this.addNonStringObject( element ) );
                } else {
                    this.list.push( element );
                }
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

    /**
     * Get the index position of the specified element
     * @param  {Object} element the element to get the index of
     * @return {Number}         index position, -1 if not present
     */
    List.prototype.indexOf = function( element ) {
        if( element !== undefined ) {
            if( element.constructor !== String ) {
                if( element.constructor === Object ) {
                    element = this.sortObjectByKeys( element );
                }

                // because List internally maintains an Array, we need
                // to hash every Object that isn't a String
                // check if the hash value of the element is in the list
                return this.list.indexOf( this.getHash( element ) );
            } else {
                // Strings can be searched directly
                return this.list.indexOf( element );
            }
        }

        return -1;
    };

    /**
     * Checks, if the specified element is in the list
     * @param  {Object} element the element to look up to
     * @return {Boolean}        true, if the element was found in the list
     */
    List.prototype.contains = function( element ) {
        if( element !== undefined ) {
            // indexOf will return a value larger than -1 if the
            // specified element is in the list
            return this.indexOf( element ) > -1;
        }

        return null;
    };

    /**
     * Test if the list contains elements
     * @return {Boolean} true, if the list is empty
     */
    List.prototype.isEmpty = function() {
        // if the list is empty, the length is 0
        return this.list.length === 0;
    };

    /**
     * Removes specified element from the list (the FIRST one found)
     * @param  {Object} element the element to remove
     * @return {[type]}         [description]
     */
    List.prototype.remove = function( element ) {
        if( element !== undefined ) {
            if( element.constructor !== String ) {
                // 1st: create the hash
                var hash = this.getHash( element ),
                    indexPositionObject = this.indexOf( hash );

                // if the element is within the list
                if( indexPositionObject > -1 ) {
                    // 2nd: remove the hash entry vom this.baseObject
                    delete this.baseObject[hash];

                    // 3rd: remove the hash from the Array list
                    if( this.list.splice( indexPositionObject, 1 ).length === 1 ) {
                        return true;
                    }
                }
            } else {
                var indexPositionElement = this.indexOf( element );

                // remove from the Array list
                if( indexPositionElement > -1 ) {
                    if( this.list.splice( indexPositionElement, 1 ).length === 1 ) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    /**
     * Simple String representation of the internal Array list
     * @return {String} Stringifyed Array list
     */
    List.prototype.toString = function() {
        return this.list.toString();
    };

    return List;
} );
