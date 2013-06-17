(function(j,h){function m(){}"undefined"===typeof UMC&&(UMC={},"undefined"!==typeof j&&(j.UMC=UMC));var n=[],p=1,l=function(a){return a=Array.prototype.slice.call(a,0)};UMC.inc=function(){return!0};UMC.register=function(a,c){for(var b=a.split("."),e=UMC,d=null;d=b.shift();)if(b.length)void 0===e[d]&&(e[d]={}),e=e[d];else if(void 0===e[d])try{e[d]=c(UMC)}catch(f){}};UMC.E=function(a){return"string"===typeof a?h.getElementById(a):a};UMC.C=function(a){a=a.toUpperCase();return"TEXT"==a?h.createTextNode(""):
"BUFFER"==a?h.createDocumentFragment():h.createElement(a)};UMC.query=function(a,c){a=a.trim();void 0===c&&(c=h);return"#"===a[0]&&-1===a.indexOf(" ")&&-1===a.indexOf(">")?c==h?c.getElementById(a.replace("#","")):l(c.querySelectorAll(a)):l(c.querySelectorAll(a))};UMC.log=function(a){n.push("["+(new Date).toString()+"]: "+a)};UMC.getErrorLogInformationList=function(a){return n.splice(0,a||n.length)};UMC.trim=function(a){if("string"!==typeof a)throw"trim need a string as parameter";for(var c=a.length,
b=0,e=/(\u3000|\s|\t|\u00A0)/;b<c&&e.test(a.charAt(b));)b+=1;for(;c>b&&e.test(a.charAt(c-1));)c-=1;return a.slice(b,c)};UMC.addClassName=function(a,c){1===a.nodeType&&!UMC.hasClassName(a,c)&&(a.className=UMC.trim(a.className)+" "+c)};UMC.removeClassName=function(a,c){1===a.nodeType&&UMC.hasClassName(a,c)&&(a.className=a.className.replace(RegExp("(^|\\s)"+c+"($|\\s)")," "))};UMC.hasClassName=function(a,c){return RegExp("(^|\\s)"+c+"($|\\s)").test(a.className)};UMC.toggleClassName=function(a,c){UMC.hasClassName(a,
c)?UMC.removeClassName(a,c):UMC.addClassName(a,c)};UMC.addEvent=function(a,c,b,e){a=UMC.E(a);if(null==a||"function"!=typeof b)return!1;a.addEventListener(c,b,e);return!0};UMC.removeEvent=function(a,c,b,e){a=$.E(a);if(null==a||"function"!=typeof b)return!1;a.removeEventListener(c,b,e);return!0};UMC.fireEvent=function(a,c){var b=UMC.E(a),e=h.createEvent("HTMLEvents");e.initEvent(c,!0,!0);b.dispatchEvent(e)};UMC.delegatedEvent=function(){};UMC.queryToJson=function(a){if("string"===UMC.getType(a)){a=
a.split("&");for(var c={},b=0,e=a.length;b<e;b++)if(a[b]){var d=a[b].split("="),f=d[0],h=d[1];2>d.length&&(h=f,f="$nullName");c[f]?("array"!==$.getType(c[f])&&(c[f]=[c[f]]),c[f].push(decodeURIComponent(h))):c[f]=decodeURIComponent(h)}return c}};UMC.isEmptyObj=function(a,c){var b=!0,e;for(e in a)if(c){b=!1;break}else if(a.hasOwnProperty(e)){b=!1;break}return b};UMC.insertElement=function(a,c,b){a=UMC.E(a)||h.body;b=b?b.toLowerCase():"beforeend";switch(b){case "beforebegin":a.parentNode.insertBefore(c,
a);break;case "afterbegin":a.insertBefore(c,a.firstChild);break;case "beforeend":a.appendChild(c);break;case "afterend":a.nextSibling?a.parentNode.insertBefore(c,a.nextSibling):a.parentNode.appendChild(c)}};UMC.domReady=function(a){"complete"===h.readyState||"loaded"===h.readyState||!UMC.os.ie&&"interactive"===h.readyState?a():h.addEventListener("DOMContentLoaded",a,!1)};UMC.getType=function(a){var c;return("object"==(c=typeof a)?null==a&&"null"||Object.prototype.toString.call(a).slice(8,-1):c).toLowerCase()};
UMC.each=function(a,c){if("array"===UMC.getType(a)){for(var b=[],e=0,d=a.length;e<d;e+=1){var f=c(a[e],e);if(!1===f)break;else null!==f&&(b[e]=f)}return b}if("object"===UMC.getType(a)){b={};for(e in a)if(f=c(a[e],e),!1===f)break;else null!==f&&(b[e]=f);return b}return null};var q={};UMC.param=function(a,c){var b=[],e;for(e in a){var d=c?c+"["+e+"]":e,f=a[e];b.push("object"===UMC.getType(f)?UMC.param(f,d):d+"="+encodeURIComponent(f))}return b.join("&")};UMC.parseParam=function(a,c,b){var e,d={};c=
c||{};for(e in a)d[e]=a[e],null!=c[e]&&(b?a.hasOwnProperty[e]&&(d[e]=c[e]):d[e]=c[e]);return d};var r={method:"GET",beforeSend:m,onSuccess:m,onError:m,onComplete:m,context:void 0,timeout:3E4,responseType:"json"};UMC.jsonP=function(a){var c="jsonp_callback"+ ++p,b="",d=h.getElementsByTagName("head")[0],g=h.createElement("script");j[c]=function(f){clearTimeout(b);d.removeChild(g);delete j[c];a.onSuccess.call(void 0,f)};g.src=a.url.replace(/=\?/,"="+c);a.onError&&(g.onerror=function(){clearTimeout(b);
a.onError.call(void 0,"","error")});d.appendChild(g);0<a.timeout&&(b=setTimeout(function(){a.onError.call(void 0,"","timeout")},a.timeout));return{}};UMC.ajax=function(a){var c;try{var b=a||{},d;for(d in r)"undefined"==typeof b[d]&&(b[d]=r[d]);b.url||(b.url=j.location);b.contentType||(b.contentType="application/x-www-form-urlencoded");b.headers||(b.headers={});if(!("asynchronous"in b)||!1!==b.asynchronous)b.asynchronous=!0;if(b.responseType)switch(b.responseType){case "script":b.responseType="text/javascript, application/javascript";
break;case "json":b.responseType="application/json";break;case "xml":b.responseType="application/xml, text/xml";break;case "html":b.responseType="text/html";break;case "text":b.responseType="text/plain";break;default:b.responseType="text/html";break;case "jsonp":return UMC.jsonP(a)}else b.responseType="text/html";"object"===UMC.getType(b.args)&&(b.args=UMC.param(b.args));"get"===b.method.toLowerCase()&&b.args&&(b.url=-1===b.url.indexOf("?")?b.url+("?"+b.args):b.url+("&"+b.args));if(/=\?/.test(b.url))return UMC.jsonP(b);
var g,f=b.context,n=/^([\w-]+:)\/\//.test(b.url)?RegExp.$1:j.location.protocol;c=new j.XMLHttpRequest;c.onreadystatechange=function(){var a=b.responseType;if(4===c.readyState){clearTimeout(g);var d,e=!1;if(200<=c.status&&300>c.status||0===c.status&&"file:"==n){if("application/json"===a&&!/^\s*$/.test(c.responseText))try{d=JSON.parse(c.responseText)}catch(m){e=m}else if("application/xml, text/xml"===a)d=c.responseXML;else if("text/html"==a){if(d=c.responseText,a=d){if("string"==typeof a){var k=h.createElement("div");
k.innerHTML=a;a=k}a=a.getElementsByTagName("script");for(k=0;k<a.length;k++)if(0<a[k].src.length&&!q[a[k].src]){var l=h.createElement("script");l.type=a[k].type;l.src=a[k].src;h.getElementsByTagName("head")[0].appendChild(l);q[a[k].src]=1}else j.eval(a[k].innerHTML)}}else d=c.responseText;0===c.status&&0===d.length&&(e=!0);e?b.onError.call(f,c,"parsererror",e):b.onSuccess.call(f,d,"success",c)}else e=!0,b.onError.call(f,c,"error");b.onComplete.call(f,c,e?"error":"success")}};c.open(b.method,b.url,
b.asynchronous);b.withCredentials&&(c.withCredentials=!0);b.contentType&&(b.headers["Content-Type"]=b.contentType);for(var l in b.headers)c.setRequestHeader(l,b.headers[l]);if(!1===b.beforeSend.call(f,c,b))return c.abort(),!1;0<b.onTimeout&&(g=setTimeout(function(){c.onreadystatechange=m;c.abort();b.onError.call(f,c,"timeout")},b.timeout));c.send(b.args)}catch(p){UMC.log(p)}return c};UMC.get=function(a,c){return UMC.ajax({url:a,onSuccess:c})};UMC.post=function(a,c,b,d){"function"===typeof c&&(b=c,
c={});void 0===d&&(d="html");return UMC.ajax({url:a,method:"POST",args:c,responseType:d,onSuccess:b})};UMC.getJSON=function(a,c,b){"function"===typeof data&&(success=data,data={});return that.ajax({url:a,args:c,onSuccess:b,responseType:"json"})};var d=UMC,g=navigator.userAgent;d.os={};d.os.webkit=g.match(/WebKit\/([\d.]+)/)?!0:!1;d.os.android=g.match(/(Android)\s+([\d.]+)/)||g.match(/Silk-Accelerated/)?!0:!1;d.os.androidICS=d.os.android&&g.match(/(Android)\s4/)?!0:!1;d.os.ipad=g.match(/(iPad).*OS\s([\d_]+)/)?
!0:!1;d.os.iphone=!d.os.ipad&&g.match(/(iPhone\sOS)\s([\d_]+)/)?!0:!1;d.os.webos=g.match(/(webOS|hpwOS)[\s\/]([\d.]+)/)?!0:!1;d.os.touchpad=d.os.webos&&g.match(/TouchPad/)?!0:!1;d.os.ios=d.os.ipad||d.os.iphone;d.os.playbook=g.match(/PlayBook/)?!0:!1;d.os.blackberry=d.os.playbook||g.match(/BlackBerry/)?!0:!1;d.os.blackberry10=d.os.blackberry&&g.match(/Safari\/536/)?!0:!1;d.os.chrome=g.match(/Chrome/)?!0:!1;d.os.opera=g.match(/Opera/)?!0:!1;d.os.fennec=g.match(/fennec/i)?!0:g.match(/Firefox/)?!0:!1;
d.os.ie=g.match(/MSIE 10.0/i)?!0:!1;d.os.supportsTouch=j.DocumentTouch&&h instanceof j.DocumentTouch||"ontouchstart"in j;d.feat={};g=h.documentElement.getElementsByTagName("head")[0];d.feat.nativeTouchScroll="undefined"!==typeof g.style["-webkit-overflow-scrolling"]||d.os.ie;d.feat.cssPrefix=d.os.webkit?"Webkit":d.os.fennec?"Moz":d.os.ie?"ms":d.os.opera?"O":"";d.feat.cssTransformStart=!d.os.opera?"3d(":"(";d.feat.cssTransformEnd=!d.os.opera?",0)":")";d.os.android&&!d.os.webkit&&(d.os.android=!1)})(window,
document);
