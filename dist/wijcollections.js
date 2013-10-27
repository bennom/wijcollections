/*
 * wijcollections
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

(function(e){require.config({baseUrl:"../",paths:{wijcModules:"lib/modules",md5:"lib/modules/utils"}}),require(["wijcModules/public/List"],function(e){var t=new e;t.add("bar"),t.add({baz:1}),console.warn("List contains "+t.size()+" elements:"),console.warn(t.toString()),console.warn("The object is:",t.get(1)),t.add({baz:1});for(var n=0,r=t.size();n<r;n++)console.warn("unique entry",t.get(n))})})();