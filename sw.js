"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){if("object"==("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).toolbox=e()}}(function(){return function i(c,a,s){function u(t,e){if(!a[t]){if(!c[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(p)return p(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=a[t]={exports:{}};c[t][0].call(o.exports,function(e){return u(c[t][1][e]||e)},o,o.exports,i,c,a,s)}return a[t].exports}for(var p="function"==typeof require&&require,e=0;e<s.length;e++)u(s[e]);return u}({1:[function(e,t,n){function s(e,t){((t=t||{}).debug||a.debug)&&console.log("[sw-toolbox] "+e)}function i(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||a.cache.name,caches.open(t)}function r(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}var c,a=e("./options"),u=e("./idb-cache-expiration");t.exports={debug:s,fetchAndCache:function(r,o){var t=(o=o||{}).successResponses||a.successResponses;return fetch(r.clone()).then(function(e){return"GET"===r.method&&t.test(e.status)&&i(o).then(function(n){n.put(r,e).then(function(){var e,t=o.cache||a.cache;(t.maxEntries||t.maxAgeSeconds)&&t.name&&(e=function(e,n,t){var r=e.url,o=t.maxAgeSeconds,i=t.maxEntries,c=t.name,a=Date.now();return s("Updating LRU order for "+r+". Max entries is "+i+", max age is "+o),u.getDb(c).then(function(e){return u.setTimestampForUrl(e,r,a)}).then(function(e){return u.expireEntries(e,i,o,a)}).then(function(e){s("Successfully updated IDB.");var t=e.map(function(e){return n.delete(e)});return Promise.all(t).then(function(){s("Done with cache cleanup.")})}).catch(function(e){s(e)})}.bind(null,r,n,t),c=c?c.then(e):e())})}),e.clone()})},openCache:i,renameCache:function(t,e,n){return s("Renaming cache: ["+t+"] to ["+e+"]",n),caches.delete(e).then(function(){return Promise.all([caches.open(t),caches.open(e)]).then(function(e){var n=e[0],r=e[1];return n.keys().then(function(e){return Promise.all(e.map(function(t){return n.match(t).then(function(e){return r.put(t,e)})}))}).then(function(){return caches.delete(t)})})})},cache:function(t,e){return i(e).then(function(e){return e.add(t)})},uncache:function(t,e){return i(e).then(function(e){return e.delete(t)})},precache:function(e){e instanceof Promise||r(e),a.preCacheItems=a.preCacheItems.concat(e)},validatePrecacheInput:r,isResponseFresh:function(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r&&new Date(r).getTime()+1e3*t<n)return!1}return!0}}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){var o="sw-toolbox-",i=1,u="store",p="url",f="timestamp",c={};t.exports={getDb:function(e){return e in c||(c[e]=(r=e,new Promise(function(e,t){var n=indexedDB.open(o+r,i);n.onupgradeneeded=function(){n.result.createObjectStore(u,{keyPath:p}).createIndex(f,f,{unique:!1})},n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}}))),c[e];var r},setTimestampForUrl:function(r,o,i){return new Promise(function(e,t){var n=r.transaction(u,"readwrite");n.objectStore(u).put({url:o,timestamp:i}),n.oncomplete=function(){e(r)},n.onabort=function(){t(n.error)}})},expireEntries:function(e,n,t,r){return(c=e,a=t,s=r,a?new Promise(function(e,t){var r=1e3*a,o=[],n=c.transaction(u,"readwrite"),i=n.objectStore(u);i.index(f).openCursor().onsuccess=function(e){var t=e.target.result;if(t&&s-r>t.value[f]){var n=t.value[p];o.push(n),i.delete(n),t.continue()}},n.oncomplete=function(){e(o)},n.onabort=t}):Promise.resolve([])).then(function(t){return(r=e,s=n,s?new Promise(function(e,t){var o=[],n=r.transaction(u,"readwrite"),i=n.objectStore(u),c=i.index(f),a=c.count();c.count().onsuccess=function(){var r=a.result;s<r&&(c.openCursor().onsuccess=function(e){var t=e.target.result;if(t){var n=t.value[p];o.push(n),i.delete(n),r-o.length>s&&t.continue()}})},n.oncomplete=function(){e(o)},n.onabort=t}):Promise.resolve([])).then(function(e){return t.concat(e)});var r,s});var c,a,s}}},{}],3:[function(e,t,n){function r(e){return e.reduce(function(e,t){return e.concat(t)},[])}e("serviceworker-cache-polyfill");var o=e("./helpers"),i=e("./router"),c=e("./options");t.exports={fetchListener:function(e){var t=i.match(e.request);t?e.respondWith(t(e.request)):i.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(i.default(e.request))},activateListener:function(e){o.debug("activate event fired");var t=c.cache.name+"$$$inactive$$$";e.waitUntil(o.renameCache(t,c.cache.name))},installListener:function(e){var t=c.cache.name+"$$$inactive$$$";o.debug("install event fired"),o.debug("creating cache ["+t+"]"),e.waitUntil(o.openCache({cache:{name:t}}).then(function(t){return Promise.all(c.preCacheItems).then(r).then(o.validatePrecacheInput).then(function(e){return o.debug("preCache list: "+(e.join(", ")||"(none)")),t.addAll(e)})}))}}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null,queryOptions:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){var o=new URL("./",self.location).pathname,i=e("path-to-regexp"),r=function(e,t,n,r){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=o+t),this.keys=[],this.regexp=i(t,this.keys)),this.method=e,this.options=r,this.handler=n};r.prototype.makeHandler=function(e){var n;if(this.regexp){var r=this.regexp.exec(e);n={},this.keys.forEach(function(e,t){n[e.name]=r[t+1]})}return function(e){return this.handler(e,n,this.options)}.bind(this)},t.exports=r},{"path-to-regexp":15}],6:[function(e,t,n){var u=e("./route"),p=e("./helpers"),a=function(e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;)new RegExp(r.value[0]).test(t)&&o.push(r.value[1]),r=n.next();return o},o=function(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null};["get","post","put","delete","head","any"].forEach(function(r){o.prototype[r]=function(e,t,n){return this.add(r,e,t,n)}}),o.prototype.add=function(e,t,n,r){var o;r=r||{},o=t instanceof RegExp?RegExp:(o=r.origin||self.location.origin)instanceof RegExp?o.source:o.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),e=e.toLowerCase();var i=new u(e,t,n,r);this.routes.has(o)||this.routes.set(o,new Map);var c=this.routes.get(o);c.has(e)||c.set(e,new Map);var a=c.get(e),s=i.regexp||i.fullUrlRegExp;a.has(s.source)&&p.debug('"'+t+'" resolves to same regex as existing route.'),a.set(s.source,i)},o.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,a(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},o.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],i=o&&o.get(e.toLowerCase());if(i){var c=a(i,n);if(0<c.length)return c[0].makeHandler(n)}}return null},o.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new o},{"./helpers":1,"./route":5}],7:[function(e,t,n){var i=e("../options"),c=e("../helpers");t.exports=function(n,e,r){var o=(r=r||{}).cache||i.cache,t=o.queryOptions;return c.debug("Strategy: cache first ["+n.url+"]",r),c.openCache(r).then(function(e){return e.match(n,t).then(function(e){var t=Date.now();return c.isResponseFresh(e,o.maxAgeSeconds,t)?e:c.fetchAndCache(n,r)})})}},{"../helpers":1,"../options":4}],8:[function(e,t,n){var i=e("../options"),c=e("../helpers");t.exports=function(t,e,n){var r=(n=n||{}).cache||i.cache,o=r.queryOptions;return c.debug("Strategy: cache only ["+t.url+"]",n),c.openCache(n).then(function(e){return e.match(t,o).then(function(e){var t=Date.now();if(c.isResponseFresh(e,r.maxAgeSeconds,t))return e})})}},{"../helpers":1,"../options":4}],9:[function(e,t,n){var u=e("../helpers"),p=e("./cacheOnly");t.exports=function(c,a,s){return u.debug("Strategy: fastest ["+c.url+"]",s),new Promise(function(t,n){var r=!1,o=[],i=function(e){o.push(e.toString()),r?n(new Error('Both cache and network failed: "'+o.join('", "')+'"')):r=!0},e=function(e){e instanceof Response?t(e):i("No result returned")};u.fetchAndCache(c.clone(),s).then(e,i),p(c,a,s).then(e,i)})}},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){var r=e("../options"),h=e("../helpers");t.exports=function(c,e,a){var s=(a=a||{}).cache||r.cache,u=s.queryOptions,p=a.successResponses||r.successResponses,f=a.networkTimeoutSeconds||r.networkTimeoutSeconds;return h.debug("Strategy: network first ["+c.url+"]",a),h.openCache(a).then(function(e){var t,n,r=[];if(f){var o=new Promise(function(r){t=setTimeout(function(){e.match(c,u).then(function(e){var t=Date.now(),n=s.maxAgeSeconds;h.isResponseFresh(e,n,t)&&r(e)})},1e3*f)});r.push(o)}var i=h.fetchAndCache(c,a).then(function(e){if(t&&clearTimeout(t),p.test(e.status))return e;throw h.debug("Response was an HTTP error: "+e.statusText,a),n=e,new Error("Bad response")}).catch(function(t){return h.debug("Network or response error, fallback to cache ["+c.url+"]",a),e.match(c,u).then(function(e){if(e)return e;if(n)return n;throw t})});return r.push(i),Promise.race(r)})}},{"../helpers":1,"../options":4}],12:[function(e,t,n){var r=e("../helpers");t.exports=function(e,t,n){return r.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}},{"../helpers":1}],13:[function(e,t,n){var r=e("./options"),o=e("./router"),i=e("./helpers"),c=e("./strategies"),a=e("./listeners");i.debug("Service Worker Toolbox is loading"),self.addEventListener("install",a.installListener),self.addEventListener("activate",a.activateListener),self.addEventListener("fetch",a.fetchListener),t.exports={networkOnly:c.networkOnly,networkFirst:c.networkFirst,cacheOnly:c.cacheOnly,cacheFirst:c.cacheFirst,fastest:c.fastest,router:o,options:r,cache:i.cache,uncache:i.uncache,precache:i.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function i(e,t){for(var n,r=[],o=0,i=0,c="",a=t&&t.delimiter||"/";null!=(n=S.exec(e));){var s=n[0],u=n[1],p=n.index;if(c+=e.slice(i,p),i=p+s.length,u)c+=u[1];else{var f=e[i],h=n[2],l=n[3],d=n[4],m=n[5],g=n[6],v=n[7];c&&(r.push(c),c="");var x=null!=h&&null!=f&&f!==h,y="+"===g||"*"===g,w="?"===g||"*"===g,b=n[2]||a,E=d||m;r.push({name:l||o++,prefix:h||"",delimiter:b,optional:w,repeat:y,partial:x,asterisk:!!v,pattern:E?(k=E,k.replace(/([=!:$\/()])/g,"\\$1")):v?".*":"[^"+R(b)+"]+?"})}}var k;return i<e.length&&(c+=e.substr(i)),c&&r.push(c),r}function h(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function r(p){for(var f=new Array(p.length),e=0;e<p.length;e++)"object"==_typeof(p[e])&&(f[e]=new RegExp("^(?:"+p[e].pattern+")$"));return function(e,t){for(var n="",r=e||{},o=(t||{}).pretty?h:encodeURIComponent,i=0;i<p.length;i++){var c=p[i];if("string"!=typeof c){var a,s=r[c.name];if(null==s){if(c.optional){c.partial&&(n+=c.prefix);continue}throw new TypeError('Expected "'+c.name+'" to be defined')}if(m(s)){if(!c.repeat)throw new TypeError('Expected "'+c.name+'" to not repeat, but received `'+JSON.stringify(s)+"`");if(0===s.length){if(c.optional)continue;throw new TypeError('Expected "'+c.name+'" to not be empty')}for(var u=0;u<s.length;u++){if(a=o(s[u]),!f[i].test(a))throw new TypeError('Expected all "'+c.name+'" to match "'+c.pattern+'", but received `'+JSON.stringify(a)+"`");n+=(0===u?c.prefix:c.delimiter)+a}}else{if(a=c.asterisk?encodeURI(s).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):o(s),!f[i].test(a))throw new TypeError('Expected "'+c.name+'" to match "'+c.pattern+'", but received "'+a+'"');n+=c.prefix+a}}else n+=c}return n}}function R(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function l(e,t){return e.keys=t,e}function d(e){return e.sensitive?"":"i"}function c(e,t,n){m(t)||(n=t||n,t=[]);for(var r=(n=n||{}).strict,o=!1!==n.end,i="",c=0;c<e.length;c++){var a=e[c];if("string"==typeof a)i+=R(a);else{var s=R(a.prefix),u="(?:"+a.pattern+")";t.push(a),a.repeat&&(u+="(?:"+s+u+")*"),i+=u=a.optional?a.partial?s+"("+u+")?":"(?:"+s+"("+u+"))?":s+"("+u+")"}}var p=R(n.delimiter||"/"),f=i.slice(-p.length)===p;return r||(i=(f?i.slice(0,-p.length):i)+"(?:"+p+"(?=$))?"),i+=o?"$":r&&f?"":"(?="+p+"|$)",l(new RegExp("^"+i,d(n)),t)}function a(e,t,n){return m(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return l(e,t)}(e,t):m(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(a(e[o],t,n).source);return l(new RegExp("(?:"+r.join("|")+")",d(n)),t)}(e,t,n):(r=t,c(i(e,o=n),r,o));var r,o}var m=e("isarray");t.exports=a,t.exports.parse=i,t.exports.compile=function(e,t){return r(i(e,t))},t.exports.tokensToFunction=r,t.exports.tokensToRegExp=c;var S=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&46<=r||"Chrome"===n&&50<=r)||(Cache.prototype.addAll=function(n){function r(e){this.name="NetworkError",this.code=19,this.message=e}var o=this;return r.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return n=n.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(n.map(function(e){"string"==typeof e&&(e=new Request(e));var t=new URL(e.url).protocol;if("http:"!==t&&"https:"!==t)throw new r("Invalid scheme");return fetch(e.clone())}))}).then(function(e){if(e.some(function(e){return!e.ok}))throw new r("Incorrect response status");return Promise.all(e.map(function(e,t){return o.put(n[t],e)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)}),self.addEventListener("install",function(){return self.skipWaiting()}),self.addEventListener("active",function(){return self.clients.claim()});var precacheUrls=[];precacheUrls.push("/*"),precacheUrls.push("/2017/12/12/2017-12-12-react中受控与非受控组件/"),precacheUrls.push("/2018/06/19/2018-06-19-JavaScript编码风格指南/"),precacheUrls.push("/2017/12/27/2017-12-27-在npm上发布包/"),precacheUrls.push("/2017/05/24/2017-05-24-react-redux/"),precacheUrls.push("/2018/04/15/2018-04-15-vue中需要注意的问题总结(一)/"),toolbox.precache(precacheUrls),toolbox.options={networkTimeoutSeconds:5},toolbox.router.any(/hm.baidu.com/,toolbox.networkOnly),toolbox.router.any(/.*\.(js|css|jpg|jpeg|png|gif)$/,toolbox.cacheFirst),toolbox.router.any(/\//,toolbox.networkFirst);