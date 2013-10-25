/*
 * wijcollections - List
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

/**
 * This list implementation will only store Strings directly in the
 * internal Array. Every other object type will be hashed. That hash
 * String will be stored in the the actual Array. The original object
 * reference will be mapped to an interal HashMap like object. The
 * Object entries will look like:
 *     {
 *         "hashString": {
 *             "ref": Object,
 *             "cnt": Number
 *         },
 *
 *         "overallCnt": Number,
 *         "duplicateCnt": Number
 *     }
 *
 * Because Objects can't have the same key name multiple times, the
 * counter variables take effect. Furthermore this will save memory.
 */

define( "wijcModules/List", ['wijcModules/AbstractCollection'], function( AbstractCollection ) {
    /**
     * List constructor
     */
    function List() {
        var that = this;
        that.list = [];

        that.resetBaseObject = function() {
            that.baseObject = {
                overallCnt: 0,
                douplicateCnt: 0
            };
        };

        // create the baseObject intially
        that.resetBaseObject();

        // if object will be added:
        //  1st: create a hash code
        //  2nd: add that hash code to the Array
        //  3rd: map the hash code to the original object in the baseObject
        //  4th: increment the counter if that Object is already stored
        that.addNonStringObject = function( obj ) {
            if( obj.constructor === Object ) {
                obj = that.sortObjectByKeys( obj );
            }

            var objectHash = that.getHash( obj );

            // map the object hash to the list position if not already
            // existent in the baseObject
            if( this.baseObject[objectHash] === undefined ) {
                this.baseObject[objectHash] = {
                    'ref': obj,
                    'cnt': 1
                };
                this.baseObject.overallCnt++;
            } else {
                // if that object is already in the list,
                // increment the counter only
                this.baseObject[objectHash].cnt++;
                this.baseObject.douplicateCnt++;
            }


            return objectHash;
        };

        /**
         * Returns a reference of the baseObj from a specified hash
         * @param  {String} hash the hash value of the specified element
         * @return {Object}      the object reference
         */
        that.getInternalObject = function( hash ) {
            return that.baseObject[hash];
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
                var objectHash = this.getHash( element );

                // if the hash is already stored in the Array,
                // only increment the internal counter, DO NOT push
                // the object hash to the Array!
                if( this.getInternalObject( objectHash ) !== undefined ) {
                    this.addNonStringObject( element );
                } else {
                    // converting the element to a hash and add this
                    // hash value. so we can lookup faster (no addition iterating)
                    this.list.push( this.addNonStringObject( element ) );
                }

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
            var listLength = this.size(),
                elementIsNoString = element.constructor !== String;

            // if an index is set, try to insert the element on the
            // index position
            if( index !== undefined && index.constructor === Number ) {
                // firstly, check if that element is already present in the Array
                if( elementIsNoString ) {
                    var objectHash = this.getHash( element );
                    // if that element is present
                    if( this.getInternalObject( objectHash ) !== undefined ) {
                        // only increment the duplicate counter,
                        // do not add the element to the Array list
                        this.addNonStringObject( element );

                        return true;
                    }
                }

                if( index === 0 ) {
                    // first position -> do an unshift operation
                    if( elementIsNoString ) {
                        this.list.unshift( this.addNonStringObject( element ) );
                    } else {
                        this.list.unshift( element );
                    }

                    return true;
                } else if( index > 0 && index < (listLength - 1) ) {
                    // in the middle of the array
                    if( elementIsNoString ) {
                        this.list.splice( index, 0, this.addNonStringObject( element ) );
                    } else {
                        this.list.splice( index, 0, element );
                    }

                    return true;
                } else if( index >= (listLength - 1) ) {
                    // index is higher or equal the array length
                    if( elementIsNoString ) {
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
                if( elementIsNoString ) {
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
     * Returns the element at the specified position, does not delete the element
     * from the original list
     * @todo think about a collision, when an Object hash equals a normal String
     * @param  {Number} index the elements position in the list
     * @return {Object}       the object from the list, or false if something's wrong
     */
    List.prototype.get = function( index ) {
        if( typeof index !== undefined ) {
            // check that the given index is in the bounds of our Array
            if( index >= 0 && (index < this.list.length) ) {
                // check if the requested entry is probably a hashed
                // object entry
                if( this.getInternalObject( this.list[index] ) !== undefined ) {
                    // if there's an entry, return the reference
                    return this.getInternalObject( this.list[index] ).ref;
                }

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
     * @param {Boolean} includeDuplicates set to true, if you also want to count the duplicate entries
     * @return {Number} element count
     */
    List.prototype.size = function( includeDuplicates ) {
        if( includeDuplicates ) {
            return this.list.length + this.baseObject.douplicateCnt;
        } else {
            return this.list.length;
        }
    };

    /**
     * Get the index position of the specified element
     * @param  {Object} element the element to get the index of
     * @return {Number}         index position, -1 if not present
     */
    List.prototype.indexOf = function( element ) {
        if( element !== undefined ) {
            if( element.constructor !== String ) {
                // "sort" the object keys here, if though objects do not
                // really have a guaranteed order
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
     * Removes specified element from the list (the FIRST one found). When one object
     * is stored multiple times, only the internal counter for this object
     * will be decremented until 0, then the object itself will also be deleted.
     * @param  {Object}  element the element to remove
     * @param  {Boolean} if true, all (indentically) added Objects will be removed
     * @return {[type]}         [description]
     */
    List.prototype.remove = function( element, all ) {
        if( element !== undefined ) {
            if( element.constructor !== String ) {
                // 1st: create the hash
                var hash = this.getHash( element ),
                    indexPositionObject = this.indexOf( hash );

                // if the element is within the list
                if( indexPositionObject > -1 ) {
                    // 2nd: remove the hash entry vom this.baseObject
                    if( this.baseObject[hash].cnt < 2  || all ) {
                        // if the object is stored only one time, or the
                        // flag to delete all object is set, delete the object(s)
                        delete this.baseObject[hash];

                        // decrement the overall counter
                        this.baseObject.overallCnt--;

                        // 3rd: remove the hash from the Array list
                        if( this.list.splice( indexPositionObject, 1 ).length === 1 ) {
                            return true;
                        }
                    } else {
                        // the object is stored multiple times, only increment
                        // the internal counter
                        this.baseObject[hash].cnt--;
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
