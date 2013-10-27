/*
 * wijcollections - Abstract Collection
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define("wijcModules/private/AbstractCollection",["md5/wiMD5"],function(e){function t(){var t=this;return t.generateMd5=function(t){return e(t)},!0}return t.prototype.constructor=t,t.prototype.add=function(e){return!!e},t.prototype.get=function(e){return!!e},t.prototype.size=function(){return!0},t.prototype.clear=function(){return!0},t.prototype.contains=function(e){return!!e},t.prototype.isEmpty=function(){return!0},t.prototype.remove=function(e){return!!e},t.prototype.toString=function(){return!0},t.prototype.getHash=function(e){if(e!==undefined&&e!==null){if(e.constructor===Function)throw new TypeError("[AC-getHash] cannot convert functions to MD5!");return e.constructor!==String?this.generateMd5(JSON.stringify(e)):this.generateMd5(e)}return null},t.prototype.sortObjectByKeys=function(e){if(e!==undefined&&e.constructor===Object){var t=[],n={};for(var r in e)e.hasOwnProperty(r)&&t.push(r);t.sort();for(var i=0,s=t.length;i<s;i++)n[t[i]]=e[t[i]];return n}return null},t}),define("modules/private/AbstractCollection",function(){});