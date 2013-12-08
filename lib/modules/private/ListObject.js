/*
 * wijcollections - ListObject
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/private/ListObject", ['wijcModules/private/AbstractCollection'], function( AbstractCollection ) {
    /**
     * This class will manage the objects of the List class implementation.
     * Because Objects can't have the same key name multiple times, the
     * counter variables take effect. Furthermore this will save memory
     * on larger objects.
     *
     * @constructor
     * @class ListObject
     * @extends {AbstractCollection}
     */
    function ListObject() {
        var that = this;

        // the initial creation of our object
        that.reset();
    }

    // inherit from AbstractCollection for some basic functinalites
    ListObject.prototype = new AbstractCollection();
    ListObject.constructor = ListObject;

    /**
     * Creates or resets the interal mapping object
     *
     * @method reset
     * @public
     */
    ListObject.prototype.reset = function() {
        this.listObject = {
            overallCnt: 0,
            duplicateCnt: 0
        };
    };

    /**
     * Every object that is not a String, Boolean or Number wil be converted
     * to a hash internally.
     *
     * @public
     * @method add
     * @param  {Object} element The object to add and map
     * @param  {String} hash    Optional hash string used for object key (only for a internal purpose!)
     * @return {String}         The objects Hash String
     */
    ListObject.prototype.add = function( element, hash ) {
        var objectHash;

        // sort the objects keys, so we can identify when the hash
        // of the object is already stored (duplication)
        if( element.constructor === Object ) {
            element = this.sortObjectByKeys( element );
        }

        if( hash !== undefined && hash.constructor === String ) {
            objectHash = hash;
        } else {
            objectHash = hash || this.needsHashing( element ) ? this.getHash( element ) : element;
        }

        // map the object hash to the list position if not already
        // existent in the baseObject
        if( this.listObject[objectHash] === undefined ) {
            this.listObject[objectHash] = {
                'ref': element,
                'cnt': 1
            };

            this.listObject.overallCnt++;
            // console.warn( 'decreased', element );
        } else {
            // if that object is already in the list,
            // increment the counter only
            this.listObject[objectHash].cnt++;
            this.listObject.duplicateCnt++;
            // console.warn( 'increased', element );
        }

        return objectHash;
    };

    /**
     * Checks, if the speficied hash value (for an object) is in the list.
     * @param  {String} hash the hash value of an object to look for
     * @return {Boolean}     true, if there's an object with the specified hash
     */
    ListObject.prototype.contains = function( hash ) {
        return this.listObject[hash] !== undefined;
    };

    /**
     * Returns a reference of the baseObj from a specified hash
     *
     * @public
     * @method getInteralObject
     * @param  {String} hash the hash value of the specified element
     * @return {Object}      the object reference
     */
    ListObject.prototype.get = function( hash ) {
        // if the there's an object stored in the list with the
        // specified hash, return that reference
        if( this.contains( hash ) ) {
            return this.listObject[hash];
        }

        return null;
    };

    /**
     * Get the duplicate counter of the whole List
     *
     * @public
     * @method getDuplicateCount
     * @return {Number} duplicate counter
     */
    ListObject.prototype.getDuplicateCount = function() {
        return this.listObject.duplicateCnt;
    };

    /**
     * Get the object counter (incl. duplicates)
     *
     * @public
     * @method getObjectCount
     * @param  {String} hash a string specifying the object
     * @return {Number}      object counter
     */
    ListObject.prototype.getObjectCount = function( hash ) {
        return this.listObject[hash].cnt;
    };

    /**
     * This method will remove an object **without duplicate
     * checking**
     *
     * @public
     * @method delete
     * @param  {String} hash a hash string identifying the object to remove completely
     */
    ListObject.prototype.delete = function( hash ) {
        // delete the whole object and increment the overall counter
        // of elements stored
        delete this.listObject[hash];
        this.listObject.overallCnt--;
    };

    /**
     * Removes an object, but **also performs a duplicate check**
     *
     * @public
     * @method remove
     * @param  {String} hash a hash string identifying the object to remove,
     *                       or remove one duplicate entry
     */
    ListObject.prototype.remove = function( hash ) {
        // if an object is stored multiple times, only
        // decrement the counter for duplicates and the
        // counter of this object in particular
        if( this.getObjectCount( hash ) > 1 ) {
            this.listObject[hash].cnt--;
            this.listObject.duplicateCnt--;
        } else {
            // if only one object is left, remove the whole
            // object
            this.delete( hash );
        }
    };

    /**
     * Replacing an (old) object with a new one
     *
     * @public
     * @method replace
     * @param  {String}  oldHash   hash code that identifies the old element
     * @param  {Object}  element   new element to add
     * @param  {Boolean} isOldHash if true, the old element hash will be used as new hash again
     * @return {String}            hash code of the new element
     */
    ListObject.prototype.replace = function( oldHash, element, isOldHash ) {
        // 1st: check duplicate counter
        var oldEntryDuplicateCounter = this.listObject[oldHash].cnt;

        // 2nd: subtract the duplicate counter of this object from the
        //      overall counter (if there are duplicates)
        if( oldEntryDuplicateCounter > 1 ) {
            this.listObject.duplicateCnt -= oldEntryDuplicateCounter - 1;
        }

        // 3rd: if the new element is an object, "sort" the keys
        if( element.constructor === Object ) {
            element = this.sortObjectByKeys( element );
        }

        // 4th: delete the old object entry
        this.delete( oldHash );

        // add the new element
        // use old element hash again if the flag was set (e.g. like HashMap class)
        return this.add( element, isOldHash ? oldHash : undefined );
    };

    return ListObject;
} );
