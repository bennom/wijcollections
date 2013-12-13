/*
 * wijcollections - HashMap
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define("wijcModules/public/HashMap",["wijcModules/private/AbstractCollection","wijcModules/private/ListObject"],function(e,t){function n(){var e=this;e.keyList=[],this.keyHashToValueHash={},this.keyHashToKey={},e.valueList=new t,e.clear()}return n.prototype=new e,n.prototype.constructor=n,n.prototype.clear=function(){this.keyList.length=0,this.keyHashToValueHash={},this.keyHashToKey={},this.valueList.clear()},n.prototype.clone=function(){},n.prototype.containsKey=function(e){return e===undefined?!1:(e=this.hashObject(e),this.keyHashToKey[e]!==undefined)},n.prototype.containsValue=function(e){if(e===undefined)return!1;var t=this.hashObject(e);for(var n in this.keyHashToValueHash)if(this.keyHashToValueHash[n]===t)return!0;return!1},n.prototype.entrySet=function(){},n.prototype.get=function(e){return this.containsKey(e)===!1?null:(e=this.hashObject(e),this.valueList.get(e).ref)},n.prototype.isEmpty=function(){return this.keyList.length===0},n.prototype.keySet=function(){return this.keyList},n.prototype.put=function(e,t){if(e===undefined||t===undefined||e===null)return null;e.constructor===Object&&(e=this.sortObjectByKeys(e));var n=this.hashObject(e),r=this.hashObject(t);if(this.keyHashToKey[n]!==undefined){var i=this.valueList.get(n).ref;return this.valueList.replace(n,t,!0),i}return this.keyList.push(e),this.valueList.add(t,n),this.keyHashToValueHash[n]=r,this.keyHashToKey[n]=e,null},n.prototype.putAll=function(e){if(e===undefined||e.constructor!==n)return null;var t=e.keySet();for(var r in t)this.put(t[r],e.get(t[r]))},n.prototype.remove=function(e){if(e===undefined)return null;e=this.hashObject(e);if(this.keyHashToKey[e]===undefined)return null;var t=this.valueList.get(e).ref;delete this.keyHashToKey[e],delete this.keyHashToValueHash[e],this.valueList.delete(e);for(var n=0,r=this.keyList.length;n<r;n++){var i=this.hashObject(this.keyList[n]);if(e===i)return this.keyList.splice(n,1),t}return null},n.prototype.size=function(){return this.keyList.length>=this.getMaxArrayLength()?this.getMaxArrayLength():this.keyList.length},n.prototype.values=function(){var e=[];for(var t in this.valueList.listObject){var n=this.valueList.get(t).ref;n!==undefined&&e.push(n)}return e},n}),define("modules/public/HashMap",function(){});