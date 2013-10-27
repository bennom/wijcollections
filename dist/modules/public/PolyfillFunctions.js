/*
 * wijcollections - Polyfill Functions
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define("wijcModules/PolyfillFunctions",[],function(){Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(this==null)throw new TypeError;var t,n,r=Object(this),i=r.length>>>0;if(i===0)return-1;t=0,arguments.length>1&&(t=Number(arguments[1]),t!==t?t=0:t!==0&&t!==Infinity&&t!==-Infinity&&(t=(t>0||-2)*Math.floor(Math.abs(t))));if(t>=i)return-1;for(n=t>=0?t:Math.max(i-Math.abs(t),0);n<i;n++)if(n in r&&r[n]===e)return n;return-1}),window.JSON||(window.JSON={parse:function(sJSON){return eval("("+sJSON+")")},stringify:function(e){if(e instanceof Object){var t="";if(e.constructor===Array){for(var n=0;n<e.length;t+=this.stringify(e[n])+",",n++);return"["+t.substr(0,t.length-1)+"]"}if(e.toString!==Object.prototype.toString)return'"'+e.toString().replace(/"/g,"\\$&")+'"';for(var r in e)t+='"'+r.replace(/"/g,"\\$&")+'":'+this.stringify(e[r])+",";return"{"+t.substr(0,t.length-1)+"}"}return typeof e=="string"?'"'+e.replace(/"/g,"\\$&")+'"':String(e)}})}),define("modules/public/PolyfillFunctions",function(){});