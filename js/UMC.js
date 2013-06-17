(function(window, document){
    if ('undefined' === typeof UMC) {
      UMC = {};

      if ('undefined' !== typeof window) {
        window.UMC = UMC;
      }
    }

    var errorList = [];
    var _jsonPID = 1;
    var _makeArray = function(array, results) {
        array = Array.prototype.slice.call(array, 0);
        return array;
    };

    //$Import
    UMC.inc = function(ns, undepended) {
        return true;
    };
    //STK.register
    UMC.register = function(ns, maker) {
        var NSList = ns.split('.');
        var step = UMC;
        var k = null;
        while ( k = NSList.shift()) {
            if (NSList.length) {
                if (step[k] === undefined) {
                    step[k] = {};
                }
                step = step[k];
            } else {
                if (step[k] === undefined) {
                    try {
                        step[k] = maker(UMC);
                    } catch(exp) {

                    }
                }
            }
        }
    };
    //UMC.E
    UMC.E = function(id) {
        if ( typeof id === 'string') {
            return document.getElementById(id);
        } else {
            return id;
        }
    };
    //UMC.C
    UMC.C = function(tagName) {
        var dom;
        tagName = tagName.toUpperCase();
        if (tagName == 'TEXT') {
            dom = document.createTextNode('');
        } else if (tagName == 'BUFFER') {
            dom = document.createDocumentFragment();
        } else {
            dom = document.createElement(tagName);
        }
        return dom;
    };

    UMC.query = function(selector, what) {
        selector = selector.trim();
        if (what === undefined) {
            what = document;
        }
        if (selector[0] === "#" && selector.indexOf(" ") === -1 && selector.indexOf(">") === -1) {
            if (what == document) {
                return what.getElementById(selector.replace("#", ""));
            } else {
                return _makeArray(what.querySelectorAll(selector));
            }
        } else {
            return _makeArray(what.querySelectorAll(selector));
        }
    };

    UMC.log = function(str) {
        errorList.push('[' + (new Date()).toString() + ']: ' + str);
    };

    UMC.getErrorLogInformationList = function(n) {
        return errorList.splice(0, n || errorList.length);
    };

    UMC.trim = function (str) {
        if(typeof str !== 'string'){
            throw 'trim need a string as parameter';
        }
        var len = str.length;
        var s = 0;
        var reg = /(\u3000|\s|\t|\u00A0)/;
        
        while(s < len){
            if(!reg.test(str.charAt(s))){
                break;
            }
            s += 1;
        }
        while(len > s){
            if(!reg.test(str.charAt(len - 1))){
                break;
            }
            len -= 1;
        }
        return str.slice(s, len);
    };

    /**
     * Add a classname for an Element
     * @id UMC.addClassName
     * @param {Element} node
     * @param {String} className
     * @author mabo| mabo@staff.sina.com.cn
     * @example
     * UMC.addClassName($.E('test'),'classname1');
     */
    UMC.addClassName = function(node, className) {
        if(node.nodeType === 1){
            if (!UMC.hasClassName(node,className)) {
                node.className = UMC.trim(node.className) + ' ' + className;
            }
        }
    };
    /**
     * remove a classname for an Element
     * @id UMC.removeClassName
     * @param {Element} node
     * @param {String} className
     * @author mabo@staff.sina.com.cn
     * @example
     * UMC.removeClassName($.E('test'),'classname1');
     */
    UMC.removeClassName = function(node, className) {
        if(node.nodeType === 1){
            if(UMC.hasClassName(node,className)){
                node.className = node.className.replace(new RegExp('(^|\\s)' + className + '($|\\s)'),' ');
            }
        }
    };
    /**
     * to decide whether Element A has an classname B
     * @id UMC.hasClassName
     * @param {Element} node
     * @param {String} className
     * @author mabo@staff.sina.com.cn
     * @example
     * UMC.hasClassName($.E('test'),'classname1');
     */
    UMC.hasClassName = function(node, className) {
        return (new RegExp('(^|\\s)' + className + '($|\\s)').test(node.className))
    };
    /**
     * toggle a classname for an Element
     * @id UMC.toggleClassName
     * @param {Element} node
     * @param {String} className
     * @author mabo@staff.sina.com.cn
     * @example
     * UMC.toggleClassName($.E('test'),'classname1');
     */
    UMC.toggleClassName = function(node, className) {
        if (UMC.hasClassName(node, className)) {
            UMC.removeClassName (node, className);
        } else {
            UMC.addClassName (node, className);
        }
    };
    /**
    * Add event for a node
    * @id UMC.addEvent
    * @param {Node} sNode
    * @param {String} sEventType
    * @param {Function} oFunc
    * @return {Boolean} TRUE/FALSE
    * @author yadong2@staff.sina.com.cn
    * @example
    * UMC.addEvent($.E('id'),'click',function(e){
    *  console.log(e);
    * });
    */
    UMC.addEvent = function(sNode, sEventType, oFunc, useCapture) {
        var oElement = UMC.E(sNode);
        if (oElement == null || typeof oFunc != "function") {
            return false;
        }
        oElement.addEventListener(sEventType, oFunc, useCapture);
        return true;
    };
    /**
     * Remove event for a node
     * @id UMC.removeEvent
     * @alias UMC.removeEvent
     * @param {Node} el
     * @param {Function} func
     * @param {String} sEventType
     * @return {Boolean} TRUE/FALSE
     * @author yadong2@staff.sina.com.cn
     * @example
     * var hock= function(e){console.log(e);}
     * UMC.removeEvent($.E('id'), hock, 'click');
     */
    UMC.removeEvent = function(el, evType, func, useCapture) {
        var oElement = $.E(el);
        if (oElement == null || typeof func != "function") {
            return false;
        }
        oElement.removeEventListener(evType, func, useCapture);
        return true;
    };
    /**
     * Fire a node's event
     * @id UMC.fireEvent
     * @alias UMC.fireEvent
     * @param {Node} el
     * @param {String} sEvent
     * @author yadong2@staff.sina.com.cn
     * @example
     * UMC.fireEvent($.E('id'),'click');
     */
    UMC.fireEvent = function(el, sEvent) {
        var _el = UMC.E(el);
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(sEvent, true, true);
        _el.dispatchEvent(evt);
    };

    UMC.delegatedEvent = function(){

    };


     /**
     * query to json
     * @id UMC.queryToJson
     * @alias UMC.queryToJson
     * @param {String} querystring
     * @return {Json} JSON
     * @author jipeng1@staff.sina.com.cn
     * @example
     * var q1 = 'a=1&b=2&c=3';
     * UMC.queryToJson(q1) === {'a':1,'b':2,'c':3};
     */
    UMC.queryToJson = function(_query){
        if(UMC.getType(_query) !== 'string') return;
        var _array = _query.split('&');
        var _json = {};
        for (var i=0,len =_array.length;i<len;i++){
            if(_array[i]){
                var _hash = _array[i].split('=');
                var _key = _hash[0];
                var _value= _hash[1];
                if(_hash.length<2){// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
                    _value = _key;
                    _key = '$nullName';
                }
                if(!_json[_key]){// 如果缓存堆栈中没有这个数据
                    _json[_key] = decodeURIComponent(_value);
                }else {// 如果堆栈中已经存在这个数据，则转换成数组存储
                    if($.getType(_json[_key]) !== 'array') {
                        _json[_key] = [_json[_key]];
                    }
                    _json[_key].push(decodeURIComponent(_value));
                }
            }
        }
        return _json;
    };

     /**
     * @id UMC.isEmptyObj
     * @alias UMC.isEmptyObj
     * @param {Object} o
     * @return {Boolean} ret
     * @author jipeng1@staff.sina.com.cn
     * @example
     * UMC.isEmptyObj({}) === true;
     * UMC.isEmptyObj({'test':'test'}) === false;
     */
    UMC.isEmptyObj = function(o,isprototype){
        var ret = true;
        for(var k in o){
            if(isprototype){
                ret = false;
                break;
            }else{
                if(o.hasOwnProperty(k)){
                    ret = false;
                    break;
                }
            }
        }
        return ret;
    };
    /**
     * 在指定位置写入dom对象
     * 注意,使用此方法进行写入时,使用的是appendChild方法,所以不会存在两份dom元素
     * @id UMC.insertElement
     * @alias UMC.insertElement
     * @param {Element} node 
     * @param {Element} element 需要写入的节点
     * @param {String} where beforebegin/afterbegin/beforeend/afterend
     * @author yadong2@staff.sina.com.cn
     * @example
     * UMC.insertElement($.E('test'),document.createElement('input'),'beforebegin');
     */
    UMC.insertElement = function(node, element, where) {
        node = UMC.E(node) || document.body;

        where = where ? where.toLowerCase() : "beforeend";

        switch (where) {
            case "beforebegin":
                node.parentNode.insertBefore(element, node);
                break;
            case "afterbegin":
                node.insertBefore(element, node.firstChild);
                break;
            case "beforeend":
                node.appendChild(element);
                break;
            case "afterend":
                if (node.nextSibling) {
                    node.parentNode.insertBefore(element, node.nextSibling);
                } else {
                    node.parentNode.appendChild(element);
                }
                break;
        }
    };
    /**
     * domReady
     * @id UMC.domReady
     * @alias UMC.domReady
     * @param {Function} callback
     * @author yadong2@staff.sina.com.cn
     * @example
     * UMC.domReady(function(){});
     */
    UMC.domReady = function(callback) {
        if (document.readyState === "complete" || document.readyState === "loaded" || (!UMC.os.ie&&document.readyState==="interactive"))//IE10 fires interactive too early
            callback();
        else {
            document.addEventListener("DOMContentLoaded", callback, false);
        }

    };
    /**
     * getType
     * @id UMC.getType
     * @alias UMC.getType
     * @param {Object} obj
     * @author yadong2@staff.sina.com.cn
     * @example
     * var a = [1,2,3]
     * UMC.getType(a) === array;
     */
    UMC.getType = function(obj) {
        var _t;
        return (( _t = typeof (obj)) == "object" ? obj == null && "null" || Object.prototype.toString.call(obj).slice(8, -1) : _t).toLowerCase();
    };
    /**
     * 遍历数组
     * @id UMC.foreach
     * @alias UMC.foreach
     * @param {Array} elements
     * @param {Function} callback
        function(value,index){}
        函数到第一个值参数是数组的值，第二个参数是索引，函数如果返回false会阻断遍历，函数的返回值进入foreach的返回数组
     * @return {Array}
     * @author mabo@staff.sina.com.cn
     * @example
     * var li1 = [1,2,3,4]
     * var li2 = UMC.each(li1,function(v,i){return v + i});
     */
    UMC.each = function(elements, callback) {
        if (UMC.getType(elements) === 'array') {
            var r = [];
            for (var i = 0, len = elements.length; i < len; i += 1) {
                var x = callback(elements[i], i);
                if (x === false){
                    break;
                } else if (x !== null) {
                    r[i] = x;
                }
            }
            return r;
        } else if (UMC.getType(elements) === 'object') {
            var r = {};
            for (var key in elements) {
                var x = callback(elements[key], key);
                if (x === false){
                    break;
                } else if (x !== null) {
                    r[key] = x;
                }
            }
            return r;
        }
        return null;
    };


    /**
     * this function executes javascript in HTML.
     ```
     $.parseJS(content)
     ```
     * @param {String|DOM} content
     * @title $.parseJS(content);
     */
    var remoteJSPages = {};
    var _parseJS = function(div) {
        if (!div)
            return;
        if ( typeof (div) == "string") {
            var elem = document.createElement("div");
            elem.innerHTML = div;
            div = elem;
        }
        var scripts = div.getElementsByTagName("script");
        div = null;
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.length > 0 && !remoteJSPages[scripts[i].src]) {
                var doc = document.createElement("script");
                doc.type = scripts[i].type;
                doc.src = scripts[i].src;
                document.getElementsByTagName('head')[0].appendChild(doc);
                remoteJSPages[scripts[i].src] = 1;
                doc = null;
            } else {
                window.eval(scripts[i].innerHTML);
            }
        }
    };

    /**
     * Converts an object into a key/value par with an optional prefix.  Used for converting objects to a query string
     ```
     var obj={
     foo:'foo',
     bar:'bar'
     }
     var kvp=$.param(obj,'data');
     ```

     * @param {Object} object
     * @param {String} [prefix]
     * @return {String} Key/value pair representation
     * @title $.param(object,[prefix];
     */
    UMC.param = function(obj, prefix) {
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((UMC.getType(v) === 'object') ? UMC.param(v, k) : (k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    };
    /**
     * 合并参数，不影响源
     * @id UMC.parseParam
     * @alias UMC.parseParam
     * @param {Object} oSource 需要被赋值参数的对象
     * @param {Object} oParams 传入的参数对象
     * @param {Boolean} isown 是否仅复制自身成员，不复制prototype，默认为false，会复制prototype
     * @author mabo@staff.sina.com.cn
     * @example
     * var cfg = {
     *  name: '123',
     *  value: 'aaa'
     * };
     * cfg2 = UMC.parseParam(cfg, {name: '456'});
     * //cfg2 == {name:'456',value:'aaa'}
     * //cfg == {name:'123',value:'aaa'}
     */
    UMC.parseParam = function(oSource, oParams, isown) {
        var key, obj = {};
        oParams = oParams || {};
        for (key in oSource) {
            obj[key] = oSource[key];
            if (oParams[key] != null) {
                if (isown) {// 仅复制自己
                    if (oSource.hasOwnProperty[key]) {
                        obj[key] = oParams[key];
                    }
                } else {
                    obj[key] = oParams[key];
                }
            }
        }
        return obj;
    };

    /* AJAX functions*/

    function empty() {
    };

    var ajaxSettings = {
        method : 'GET',
        beforeSend : empty,
        onSuccess : empty,
        onError : empty,
        onComplete : empty,
        context : undefined,
        timeout : 30 * 1000,
        responseType : 'json'
        //crossDomain: null
    };
     /**
     * jsonp
     * @id UMC.jsonp
     * @alias UMC.jsonp
     * @param {String} url 
     * @param {function} success 
     * @param {function} error 
     * @author mabo@staff.sina.com.cn
     * @example
     * var options = {
     *  url: 'mysite.php?callback=?&foo=bar',
     *  success: function(){},
     *  error : function(){}   
     * };
     * UMC.jsonP(options);
     */
    UMC.jsonP = function(options) {
        var callbackName = 'jsonp_callback' + (++_jsonPID);
        var abortTimeout = "", context;
        var headDOM = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        var abort = function() {
            headDOM.removeChild(script);
            if (window[callbackName])
                window[callbackName] = empty;
        };
        window[callbackName] = function(data) {
            clearTimeout(abortTimeout);
            headDOM.removeChild(script);
            delete window[callbackName];
            options.onSuccess.call(context, data);
        };
        script.src = options.url.replace(/=\?/, '=' + callbackName);
        if (options.onError) {
            script.onerror = function() {
                clearTimeout(abortTimeout);
                options.onError.call(context, "", 'error');
            }
        }
        headDOM.appendChild(script);
        if (options.timeout > 0)
            abortTimeout = setTimeout(function() {
                options.onError.call(context, "", 'timeout');
            }, options.timeout);
        return {};
    };
     /**
     * ajax
     * @id UMC.ajax
     * @alias UMC.ajax
     * @param {String}method - Type of request
     * @param {Function}onSuccess - success callback
     * @param {Function}onError - error callback
     * @param {Function}onComplete - complete callback - callled with a success or error
     * @param {Function}onTimeout - timeout to wait for the request
     * @param {String}url - URL to make request against
     * @param {String}contentType - HTTP Request Content Type
     * @param {Object}headers - Object of headers to set
     * @param {JSON|XML|SCRIPT|HTML|TEXT|JSONP}dataType - Data type of request
     * @param {Objec}data - data to pass into request.  $.param is called on objects
     * @author mabo@staff.sina.com.cn
     * @example
     * var options = {
     *      method:"GET",
     *      onSuccess:function(data){},
     *      url:"mypage.php",
     *      args:{bar:'bar'},
     *      onError : function(){}
     * };
     * UMC.ajax(options);
     */
    UMC.ajax = function(opts) {
        var xhr;
        try {
            var settings = opts || {};
            for (var key in ajaxSettings) {
                if ( typeof (settings[key]) == 'undefined')
                    settings[key] = ajaxSettings[key];
            }
            if (!settings.url)
                settings.url = window.location;
            if (!settings.contentType)
                settings.contentType = "application/x-www-form-urlencoded";
            if (!settings.headers)
                settings.headers = {};

            if (!('asynchronous' in settings) || settings.asynchronous !== false)
                settings.asynchronous = true;

            if (!settings.responseType)
                settings.responseType = "text/html";
            else {
                switch (settings.responseType) {
                    case "script":
                        settings.responseType = 'text/javascript, application/javascript';
                        break;
                    case "json":
                        settings.responseType = 'application/json';
                        break;
                    case "xml":
                        settings.responseType = 'application/xml, text/xml';
                        break;
                    case "html":
                        settings.responseType = 'text/html';
                        break;
                    case "text":
                        settings.responseType = 'text/plain';
                        break;
                    default:
                        settings.responseType = "text/html";
                        break;
                    case "jsonp":
                        return UMC.jsonP(opts);
                        // -----------
                        break;
                }
            }

            if (UMC.getType(settings.args) === 'object')
                settings.args = UMC.param(settings.args);
            if (settings.method.toLowerCase() === "get" && settings.args) {
                if (settings.url.indexOf("?") === -1)
                    settings.url += "?" + settings.args;
                else
                    settings.url += "&" + settings.args;
            }

            if (/=\?/.test(settings.url)) {
                return UMC.jsonP(settings);
            }
            var abortTimeout;
            var context = settings.context;
            var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;

            //ok, we are really using xhr
            xhr = new window.XMLHttpRequest();

            xhr.onreadystatechange = function() {
                var mime = settings.responseType;
                if (xhr.readyState === 4) {
                    clearTimeout(abortTimeout);
                    var result, error = false;
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0 && protocol == 'file:') {
                        if (mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
                            try {
                                result = JSON.parse(xhr.responseText);
                            } catch (e) {
                                error = e;
                            }
                        } else if (mime === 'application/xml, text/xml') {
                            result = xhr.responseXML;
                        } else if (mime == "text/html") {
                            result = xhr.responseText;
                            _parseJS(result);
                        } else
                            result = xhr.responseText;
                        //If we're looking at a local file, we assume that no response sent back means there was an error
                        if (xhr.status === 0 && result.length === 0)
                            error = true;
                        if (error)
                            settings.onError.call(context, xhr, 'parsererror', error);
                        else {
                            settings.onSuccess.call(context, result, 'success', xhr);
                        }
                    } else {
                        error = true;
                        settings.onError.call(context, xhr, 'error');
                    }
                    settings.onComplete.call(context, xhr, error ? 'error' : 'success');
                }
            };
            xhr.open(settings.method, settings.url, settings.asynchronous);
            if (settings.withCredentials)
                xhr.withCredentials = true;

            if (settings.contentType)
                settings.headers['Content-Type'] = settings.contentType;
            for (var name in settings.headers)
            xhr.setRequestHeader(name, settings.headers[name]);
            if (settings.beforeSend.call(context, xhr, settings) === false) {
                xhr.abort();
                return false;
            }

            if (settings.onTimeout > 0)
                abortTimeout = setTimeout(function() {
                    xhr.onreadystatechange = empty;
                    xhr.abort();
                    settings.onError.call(context, xhr, 'timeout');
                }, settings.timeout);
            xhr.send(settings.args);
        } catch (e) {
            UMC.log(e);
        }
        return xhr;
    };

    /**
     * Shorthand call to an Ajax GET request
     ```
     $.get("mypage.php?foo=bar",function(data){});
     ```

     * @param {String} url to hit
     * @param {Function} success
     * @title $.get(url,success)
     */
    UMC.get = function(url, success) {
        return UMC.ajax({
            url : url,
            onSuccess : success
        });
    };
    /**
     * Shorthand call to an Ajax POST request
     ```
     $.post("mypage.php",{bar:'bar'},function(data){});
     ```

     * @param {String} url to hit
     * @param {Object} [data] to pass in
     * @param {Function} success
     * @param {String} [dataType]
     * @title $.post(url,[data],success,[dataType])
     */
    UMC.post = function(url, data, onSuccess, responseType) {
        if ( typeof (data) === "function") {
            onSuccess = data;
            data = {};
        }
        if (responseType === undefined)
            responseType = "html";
        return UMC.ajax({
            url : url,
            method : "POST",
            args : data,
            responseType : responseType,
            onSuccess : onSuccess
        });
    };

    /**
     * Shorthand call to an Ajax request that expects a JSON response
     ```
     $.getJSON("mypage.php",{bar:'bar'},function(data){});
     ```

     * @param {String} url to hit
     * @param {Object} [args]
     * @param {Function} [onSuccess]
     * @title $.getJSON(url,args,onSuccess)
     */
    UMC.getJSON = function(url, args, onSuccess) {
        if ( typeof (data) === "function") {
            success = data;
            data = {};
        }
        return that.ajax({
            url : url,
            args : args,
            onSuccess : onSuccess,
            responseType : "json"
        });
    };
    /**
     * Helper function to parse the user agent.  Sets the following
     * .os.webkit
     * .os.android
     * .os.ipad
     * .os.iphone
     * .os.webos
     * .os.touchpad
     * .os.blackberry
     * .os.opera
     * .os.fennec
     * @api private
     */
    function detectUA($, userAgent) {
        $.os = {};
        $.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
        $.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
        $.os.androidICS = $.os.android && userAgent.match(/(Android)\s4/) ? true : false;
        $.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
        $.os.iphone = !$.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
        $.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
        $.os.touchpad = $.os.webos && userAgent.match(/TouchPad/) ? true : false;
        $.os.ios = $.os.ipad || $.os.iphone;
        $.os.playbook = userAgent.match(/PlayBook/) ? true : false;
        $.os.blackberry = $.os.playbook || userAgent.match(/BlackBerry/) ? true : false;
        $.os.blackberry10 = $.os.blackberry && userAgent.match(/Safari\/536/) ? true : false;
        $.os.chrome = userAgent.match(/Chrome/) ? true : false;
        $.os.opera = userAgent.match(/Opera/) ? true : false;
        $.os.fennec = userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false;
        $.os.ie = userAgent.match(/MSIE 10.0/i) ? true : false
        $.os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window);
        //features
        $.feat = {};
        var head = document.documentElement.getElementsByTagName("head")[0];
        $.feat.nativeTouchScroll = typeof (head.style["-webkit-overflow-scrolling"]) !== "undefined" || $.os.ie;
        $.feat.cssPrefix = $.os.webkit ? "Webkit" : $.os.fennec ? "Moz" : $.os.ie ? "ms" : $.os.opera ? "O" : "";
        $.feat.cssTransformStart = !$.os.opera ? "3d(" : "(";
        $.feat.cssTransformEnd = !$.os.opera ? ",0)" : ")";
        if ($.os.android && !$.os.webkit)
            $.os.android = false;
    };
    detectUA(UMC, navigator.userAgent);
})(window, document);
