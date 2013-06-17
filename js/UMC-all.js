(function(window, document) {
    if ("undefined" === typeof UMC) {
        UMC = {};
        if ("undefined" !== typeof window) {
            window.UMC = UMC;
        }
    }
    var errorList = [];
    var _jsonPID = 1;
    var _makeArray = function(array, results) {
        array = Array.prototype.slice.call(array, 0);
        return array;
    };
    UMC.inc = function(ns, undepended) {
        return true;
    };
    UMC.register = function(ns, maker) {
        var NSList = ns.split(".");
        var step = UMC;
        var k = null;
        while (k = NSList.shift()) {
            if (NSList.length) {
                if (step[k] === undefined) {
                    step[k] = {};
                }
                step = step[k];
            } else {
                if (step[k] === undefined) {
                    try {
                        step[k] = maker(UMC);
                    } catch (exp) {}
                }
            }
        }
    };
    UMC.E = function(id) {
        if (typeof id === "string") {
            return document.getElementById(id);
        } else {
            return id;
        }
    };
    UMC.C = function(tagName) {
        var dom;
        tagName = tagName.toUpperCase();
        if (tagName == "TEXT") {
            dom = document.createTextNode("");
        } else if (tagName == "BUFFER") {
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
        errorList.push("[" + (new Date).toString() + "]: " + str);
    };
    UMC.getErrorLogInformationList = function(n) {
        return errorList.splice(0, n || errorList.length);
    };
    UMC.trim = function(str) {
        if (typeof str !== "string") {
            throw "trim need a string as parameter";
        }
        var len = str.length;
        var s = 0;
        var reg = /(\u3000|\s|\t|\u00A0)/;
        while (s < len) {
            if (!reg.test(str.charAt(s))) {
                break;
            }
            s += 1;
        }
        while (len > s) {
            if (!reg.test(str.charAt(len - 1))) {
                break;
            }
            len -= 1;
        }
        return str.slice(s, len);
    };
    UMC.addClassName = function(node, className) {
        if (node.nodeType === 1) {
            if (!UMC.hasClassName(node, className)) {
                node.className = UMC.trim(node.className) + " " + className;
            }
        }
    };
    UMC.removeClassName = function(node, className) {
        if (node.nodeType === 1) {
            if (UMC.hasClassName(node, className)) {
                node.className = node.className.replace(new RegExp("(^|\\s)" + className + "($|\\s)"), " ");
            }
        }
    };
    UMC.hasClassName = function(node, className) {
        return (new RegExp("(^|\\s)" + className + "($|\\s)")).test(node.className);
    };
    UMC.toggleClassName = function(node, className) {
        if (UMC.hasClassName(node, className)) {
            UMC.removeClassName(node, className);
        } else {
            UMC.addClassName(node, className);
        }
    };
    UMC.addEvent = function(sNode, sEventType, oFunc, useCapture) {
        var oElement = UMC.E(sNode);
        if (oElement == null || typeof oFunc != "function") {
            return false;
        }
        oElement.addEventListener(sEventType, oFunc, useCapture);
        return true;
    };
    UMC.removeEvent = function(el, evType, func, useCapture) {
        var oElement = $.E(el);
        if (oElement == null || typeof func != "function") {
            return false;
        }
        oElement.removeEventListener(evType, func, useCapture);
        return true;
    };
    UMC.fireEvent = function(el, sEvent) {
        var _el = UMC.E(el);
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(sEvent, true, true);
        _el.dispatchEvent(evt);
    };
    UMC.delegatedEvent = function() {};
    UMC.queryToJson = function(_query) {
        if (UMC.getType(_query) !== "string") return;
        var _array = _query.split("&");
        var _json = {};
        for (var i = 0, len = _array.length; i < len; i++) {
            if (_array[i]) {
                var _hash = _array[i].split("=");
                var _key = _hash[0];
                var _value = _hash[1];
                if (_hash.length < 2) {
                    _value = _key;
                    _key = "$nullName";
                }
                if (!_json[_key]) {
                    _json[_key] = decodeURIComponent(_value);
                } else {
                    if ($.getType(_json[_key]) !== "array") {
                        _json[_key] = [ _json[_key] ];
                    }
                    _json[_key].push(decodeURIComponent(_value));
                }
            }
        }
        return _json;
    };
    UMC.isEmptyObj = function(o, isprototype) {
        var ret = true;
        for (var k in o) {
            if (isprototype) {
                ret = false;
                break;
            } else {
                if (o.hasOwnProperty(k)) {
                    ret = false;
                    break;
                }
            }
        }
        return ret;
    };
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
    UMC.domReady = function(callback) {
        if (document.readyState === "complete" || document.readyState === "loaded" || !UMC.os.ie && document.readyState === "interactive") callback(); else {
            document.addEventListener("DOMContentLoaded", callback, false);
        }
    };
    UMC.getType = function(obj) {
        var _t;
        return ((_t = typeof obj) == "object" ? obj == null && "null" || Object.prototype.toString.call(obj).slice(8, -1) : _t).toLowerCase();
    };
    UMC.each = function(elements, callback) {
        if (UMC.getType(elements) === "array") {
            var r = [];
            for (var i = 0, len = elements.length; i < len; i += 1) {
                var x = callback(elements[i], i);
                if (x === false) {
                    break;
                } else if (x !== null) {
                    r[i] = x;
                }
            }
            return r;
        } else if (UMC.getType(elements) === "object") {
            var r = {};
            for (var key in elements) {
                var x = callback(elements[key], key);
                if (x === false) {
                    break;
                } else if (x !== null) {
                    r[key] = x;
                }
            }
            return r;
        }
        return null;
    };
    var remoteJSPages = {};
    var _parseJS = function(div) {
        if (!div) return;
        if (typeof div == "string") {
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
                document.getElementsByTagName("head")[0].appendChild(doc);
                remoteJSPages[scripts[i].src] = 1;
                doc = null;
            } else {
                window.eval(scripts[i].innerHTML);
            }
        }
    };
    UMC.param = function(obj, prefix) {
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(UMC.getType(v) === "object" ? UMC.param(v, k) : k + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    };
    UMC.parseParam = function(oSource, oParams, isown) {
        var key, obj = {};
        oParams = oParams || {};
        for (key in oSource) {
            obj[key] = oSource[key];
            if (oParams[key] != null) {
                if (isown) {
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
    function empty() {}
    var ajaxSettings = {
        method: "GET",
        beforeSend: empty,
        onSuccess: empty,
        onError: empty,
        onComplete: empty,
        context: undefined,
        timeout: 30 * 1e3,
        responseType: "json"
    };
    UMC.jsonP = function(options) {
        var callbackName = "jsonp_callback" + ++_jsonPID;
        var abortTimeout = "", context;
        var headDOM = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        var abort = function() {
            headDOM.removeChild(script);
            if (window[callbackName]) window[callbackName] = empty;
        };
        window[callbackName] = function(data) {
            clearTimeout(abortTimeout);
            headDOM.removeChild(script);
            delete window[callbackName];
            options.onSuccess.call(context, data);
        };
        script.src = options.url.replace(/=\?/, "=" + callbackName);
        if (options.onError) {
            script.onerror = function() {
                clearTimeout(abortTimeout);
                options.onError.call(context, "", "error");
            };
        }
        headDOM.appendChild(script);
        if (options.timeout > 0) abortTimeout = setTimeout(function() {
            options.onError.call(context, "", "timeout");
        }, options.timeout);
        return {};
    };
    UMC.ajax = function(opts) {
        var xhr;
        try {
            var settings = opts || {};
            for (var key in ajaxSettings) {
                if (typeof settings[key] == "undefined") settings[key] = ajaxSettings[key];
            }
            if (!settings.url) settings.url = window.location;
            if (!settings.contentType) settings.contentType = "application/x-www-form-urlencoded";
            if (!settings.headers) settings.headers = {};
            if (!("asynchronous" in settings) || settings.asynchronous !== false) settings.asynchronous = true;
            if (!settings.responseType) settings.responseType = "text/html"; else {
                switch (settings.responseType) {
                  case "script":
                    settings.responseType = "text/javascript, application/javascript";
                    break;
                  case "json":
                    settings.responseType = "application/json";
                    break;
                  case "xml":
                    settings.responseType = "application/xml, text/xml";
                    break;
                  case "html":
                    settings.responseType = "text/html";
                    break;
                  case "text":
                    settings.responseType = "text/plain";
                    break;
                  default:
                    settings.responseType = "text/html";
                    break;
                  case "jsonp":
                    return UMC.jsonP(opts);
                    break;
                }
            }
            if (UMC.getType(settings.args) === "object") settings.args = UMC.param(settings.args);
            if (settings.method.toLowerCase() === "get" && settings.args) {
                if (settings.url.indexOf("?") === -1) settings.url += "?" + settings.args; else settings.url += "&" + settings.args;
            }
            if (/=\?/.test(settings.url)) {
                return UMC.jsonP(settings);
            }
            var abortTimeout;
            var context = settings.context;
            var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
            xhr = new window.XMLHttpRequest;
            xhr.onreadystatechange = function() {
                var mime = settings.responseType;
                if (xhr.readyState === 4) {
                    clearTimeout(abortTimeout);
                    var result, error = false;
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 0 && protocol == "file:") {
                        if (mime === "application/json" && !/^\s*$/.test(xhr.responseText)) {
                            try {
                                result = JSON.parse(xhr.responseText);
                            } catch (e) {
                                error = e;
                            }
                        } else if (mime === "application/xml, text/xml") {
                            result = xhr.responseXML;
                        } else if (mime == "text/html") {
                            result = xhr.responseText;
                            _parseJS(result);
                        } else result = xhr.responseText;
                        if (xhr.status === 0 && result.length === 0) error = true;
                        if (error) settings.onError.call(context, xhr, "parsererror", error); else {
                            settings.onSuccess.call(context, result, "success", xhr);
                        }
                    } else {
                        error = true;
                        settings.onError.call(context, xhr, "error");
                    }
                    settings.onComplete.call(context, xhr, error ? "error" : "success");
                }
            };
            xhr.open(settings.method, settings.url, settings.asynchronous);
            if (settings.withCredentials) xhr.withCredentials = true;
            if (settings.contentType) settings.headers["Content-Type"] = settings.contentType;
            for (var name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
            if (settings.beforeSend.call(context, xhr, settings) === false) {
                xhr.abort();
                return false;
            }
            if (settings.onTimeout > 0) abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty;
                xhr.abort();
                settings.onError.call(context, xhr, "timeout");
            }, settings.timeout);
            xhr.send(settings.args);
        } catch (e) {
            UMC.log(e);
        }
        return xhr;
    };
    UMC.get = function(url, success) {
        return UMC.ajax({
            url: url,
            onSuccess: success
        });
    };
    UMC.post = function(url, data, onSuccess, responseType) {
        if (typeof data === "function") {
            onSuccess = data;
            data = {};
        }
        if (responseType === undefined) responseType = "html";
        return UMC.ajax({
            url: url,
            method: "POST",
            args: data,
            responseType: responseType,
            onSuccess: onSuccess
        });
    };
    UMC.getJSON = function(url, args, onSuccess) {
        if (typeof data === "function") {
            success = data;
            data = {};
        }
        return that.ajax({
            url: url,
            args: args,
            onSuccess: onSuccess,
            responseType: "json"
        });
    };
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
        $.os.ie = userAgent.match(/MSIE 10.0/i) ? true : false;
        $.os.supportsTouch = window.DocumentTouch && document instanceof window.DocumentTouch || "ontouchstart" in window;
        $.feat = {};
        var head = document.documentElement.getElementsByTagName("head")[0];
        $.feat.nativeTouchScroll = typeof head.style["-webkit-overflow-scrolling"] !== "undefined" || $.os.ie;
        $.feat.cssPrefix = $.os.webkit ? "Webkit" : $.os.fennec ? "Moz" : $.os.ie ? "ms" : $.os.opera ? "O" : "";
        $.feat.cssTransformStart = !$.os.opera ? "3d(" : "(";
        $.feat.cssTransformEnd = !$.os.opera ? ",0)" : ")";
        if ($.os.android && !$.os.webkit) $.os.android = false;
    }
    detectUA(UMC, navigator.userAgent);
})(window, document);;


UMC.register("addon.evt.delegatedEvent", function($) {
    var checkContains = function(parent, node) {
        if (parent === node) {
            return false;
        } else if (parent.compareDocumentPosition) {
            return (parent.compareDocumentPosition(node) & 16) === 16;
        } else if (parent.contains && node.nodeType === 1) {
            return parent.contains(node);
        } else {
            while (node = node.parentNode) {
                if (parent === node) {
                    return true;
                }
            }
        }
        return false;
    };
    return function(actEl) {
        if (!(actEl != undefined && Boolean(actEl.nodeName) && Boolean(actEl.nodeType))) {
            throw "UMC.delegatedEvent need an Element as first Parameter";
        }
        var evtList = {};
        var bindEvent = function(evt) {
            var el = evt.target;
            var type = evt.type;
            var actionType = null;
            var checkBuble = function() {
                var tg = el;
                if (evtList[type] && evtList[type][actionType]) {
                    return evtList[type][actionType]({
                        evt: evt,
                        el: tg,
                        box: actEl,
                        data: $.queryToJson(tg.getAttribute("action-data") || "")
                    });
                } else {
                    return true;
                }
            };
            if (!checkContains(actEl, el)) {
                return false;
            } else {
                while (el && el !== actEl) {
                    if (el.nodeType == 1) {
                        actionType = el.getAttribute("action-type");
                        if (actionType && checkBuble() === false) {
                            break;
                        }
                    }
                    el = el.parentNode;
                }
            }
        };
        var that = {};
        that.add = function(funcName, evtType, process) {
            if (!evtList[evtType]) {
                evtList[evtType] = {};
                $.addEvent(actEl, evtType, bindEvent);
            }
            evtList[evtType][funcName] = process;
        };
        that.remove = function(funcName, evtType) {
            if (evtList[evtType]) {
                delete evtList[evtType][funcName];
                if ($.isEmptyObj(evtList[evtType])) {
                    delete evtList[evtType];
                    $.removeEvent(actEl, evtType, bindEvent);
                }
            }
        };
        return that;
    };
});;


UMC.register("addon.evt.event", function($) {
    return function(type, touch) {
        var event, property;
        event = document.createEvent("Events");
        event.initEvent(type, true, true, null, null, null, null, null, null, null, null, null, null, null, null);
        if (touch) {
            for (property in touch) {
                event[property] = touch[property];
            }
        }
        return event;
    };
});;


UMC.register("addon.evt.trigger", function($) {
    return function(el, event, data, touch) {
        if ($.getType(event) === "string") {
            event = $.addon.evt.event(event, touch);
        }
        event.data = data;
        return el.dispatchEvent(event);
    };
});;


UMC.register("addon.evt.gestures", function($) {
    var MOBILE_EVENT_TYPE = {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup",
        tap: "click",
        doubletap: "dblclick",
        orientationchange: "resize"
    };
    var IS_WEBKIT, SUPPORTED_OS;
    IS_WEBKIT = /WebKit\/([\d.]+)/;
    SUPPORTED_OS = {
        Android: /(Android)\s+([\d.]+)/,
        ipad: /(iPad).*OS\s([\d_]+)/,
        iphone: /(iPhone\sOS)\s([\d_]+)/,
        blackberry: /(BlackBerry).*Version\/([\d.]+)/,
        blackberryPlaybook: /(PlayBook).*Version\/([\d.]+)/,
        webos: /(webOS|hpwOS)[\s\/]([\d.]+)/
    };
    return function() {
        var _current, _detectBrowser, _detectEnvironment, _detectOS, _detectScreen, isMobile, environment;
        _current = null;
        isMobile = function() {
            _current = _current || _detectEnvironment();
            return _current.isMobile;
        };
        environment = function() {
            _current = _current || _detectEnvironment();
            return _current;
        };
        _detectBrowser = function(user_agent) {
            var is_webkit;
            is_webkit = user_agent.match(IS_WEBKIT);
            if (is_webkit) {
                return is_webkit[0];
            } else {
                return user_agent;
            }
        };
        _detectOS = function(user_agent) {
            var detected_os, os, supported;
            detected_os = null;
            for (os in SUPPORTED_OS) {
                supported = user_agent.match(SUPPORTED_OS[os]);
                if (supported) {
                    detected_os = {
                        name: os === "iphone" || os === "ipad" ? "ios" : os,
                        version: supported[2].replace("_", ".")
                    };
                    break;
                }
            }
            return detected_os;
        };
        _detectScreen = function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        };
        _detectEnvironment = function() {
            var environment, user_agent;
            user_agent = navigator.userAgent;
            environment = {};
            environment.browser = _detectBrowser(user_agent);
            environment.os = _detectOS(user_agent);
            environment.isMobile = !!environment.os;
            environment.screen = _detectScreen();
            return environment;
        };
        var CURRENT_TOUCH, FIRST_TOUCH, GESTURE, GESTURES, HOLD_DELAY, TOUCH_TIMEOUT, _angle, _capturePinch, _captureRotation, _cleanGesture, _distance, _fingersPosition, _getTouches, _hold, _isSwipe, _listenTouches, _onTouchEnd, _onTouchMove, _onTouchStart, _parentIfText, _swipeDirection, _trigger;
        GESTURE = {};
        FIRST_TOUCH = [];
        CURRENT_TOUCH = [];
        TOUCH_TIMEOUT = void 0;
        HOLD_DELAY = 650;
        var that = {};
        GESTURES = [ "doubleTap", "hold", "swipe", "swiping", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "rotate", "rotating", "rotateLeft", "rotateRight", "pinch", "pinching", "pinchIn", "pinchOut", "drag", "dragLeft", "dragRight", "dragUp", "dragDown" ];
        that.add = function(oNode, oType, cb) {
            if (oType === "touch") {
                $.addEvent(oNode, "touchstart", cb);
            } else if (oType == "tap") {
                $.addEvent(oNode, "click", cb);
            }
            for (var i = 0; i < GESTURES.length; i++) {
                if (oType === GESTURES[i] && $.getType(cb) === "function") {
                    $.addEvent(oNode, GESTURES[i], cb);
                    break;
                }
            }
        };
        _listenTouches = function() {
            var documentBody = document.body;
            var touchstart = isMobile() ? "touchstart" : MOBILE_EVENT_TYPE.touchstart;
            var touchmove = isMobile() ? "touchmove" : MOBILE_EVENT_TYPE.touchmove;
            var touchend = isMobile() ? "touchend" : MOBILE_EVENT_TYPE.touchend;
            $.addEvent(documentBody, touchstart, _onTouchStart);
            $.addEvent(documentBody, touchmove, _onTouchMove);
            $.addEvent(documentBody, touchend, _onTouchEnd);
            $.addEvent(documentBody, "touchcancel", _cleanGesture);
            return true;
        };
        _onTouchStart = function(event) {
            var delta, fingers, now, touches;
            now = Date.now();
            delta = now - (GESTURE.last || now);
            TOUCH_TIMEOUT && clearTimeout(TOUCH_TIMEOUT);
            touches = _getTouches(event);
            fingers = touches.length;
            FIRST_TOUCH = _fingersPosition(touches, fingers);
            GESTURE.el = _parentIfText(touches[0].target);
            GESTURE.fingers = fingers;
            GESTURE.last = now;
            if (fingers === 1) {
                GESTURE.isDoubleTap = delta > 0 && delta <= 250;
                return setTimeout(_hold, HOLD_DELAY);
            } else if (fingers === 2) {
                GESTURE.initial_angle = parseInt(_angle(FIRST_TOUCH), 10);
                GESTURE.initial_distance = parseInt(_distance(FIRST_TOUCH), 10);
                GESTURE.angle_difference = 0;
                return GESTURE.distance_difference = 0;
            }
        };
        _onTouchMove = function(event) {
            var fingers, touches;
            if (GESTURE.el) {
                touches = _getTouches(event);
                fingers = touches.length;
                if (fingers === GESTURE.fingers) {
                    CURRENT_TOUCH = _fingersPosition(touches, fingers);
                    if (_isSwipe(event)) {
                        _trigger("swiping");
                    }
                    if (fingers === 2) {
                        _captureRotation();
                        _capturePinch();
                        event.preventDefault();
                    }
                } else {
                    _cleanGesture();
                }
            }
            return true;
        };
        _isSwipe = function(event) {
            var move_horizontal, move_vertical, ret;
            ret = false;
            if (CURRENT_TOUCH[0]) {
                move_horizontal = Math.abs(FIRST_TOUCH[0].x - CURRENT_TOUCH[0].x) > 30;
                move_vertical = Math.abs(FIRST_TOUCH[0].y - CURRENT_TOUCH[0].y) > 30;
                ret = GESTURE.el && (move_horizontal || move_vertical);
            }
            return ret;
        };
        _onTouchEnd = function(event) {
            var anyevent, drag_direction, pinch_direction, rotation_direction, swipe_direction;
            if (GESTURE.isDoubleTap) {
                _trigger("doubleTap");
                return _cleanGesture();
            } else if (GESTURE.fingers === 1) {
                if (_isSwipe()) {
                    _trigger("swipe");
                    swipe_direction = _swipeDirection(FIRST_TOUCH[0].x, CURRENT_TOUCH[0].x, FIRST_TOUCH[0].y, CURRENT_TOUCH[0].y);
                    _trigger("swipe" + swipe_direction);
                    return _cleanGesture();
                } else {
                    _trigger("tap");
                    return TOUCH_TIMEOUT = setTimeout(_cleanGesture, 250);
                }
            } else if (GESTURE.fingers === 2) {
                anyevent = false;
                if (GESTURE.angle_difference !== 0) {
                    _trigger("rotate", {
                        angle: GESTURE.angle_difference
                    });
                    rotation_direction = GESTURE.angle_difference > 0 ? "rotateRight" : "rotateLeft";
                    _trigger(rotation_direction, {
                        angle: GESTURE.angle_difference
                    });
                    anyevent = true;
                }
                if (GESTURE.distance_difference !== 0) {
                    _trigger("pinch", {
                        angle: GESTURE.distance_difference
                    });
                    pinch_direction = GESTURE.distance_difference > 0 ? "pinchOut" : "pinchIn";
                    _trigger(pinch_direction, {
                        distance: GESTURE.distance_difference
                    });
                    anyevent = true;
                }
                if (!anyevent && CURRENT_TOUCH[0]) {
                    if (Math.abs(FIRST_TOUCH[0].x - CURRENT_TOUCH[0].x) > 10 || Math.abs(FIRST_TOUCH[0].y - CURRENT_TOUCH[0].y) > 10) {
                        _trigger("drag");
                        drag_direction = _swipeDirection(FIRST_TOUCH[0].x, CURRENT_TOUCH[0].x, FIRST_TOUCH[0].y, CURRENT_TOUCH[0].y);
                        _trigger("drag" + drag_direction);
                    }
                }
                return _cleanGesture();
            }
        };
        _fingersPosition = function(touches, fingers) {
            var i, result;
            result = [];
            i = 0;
            touches = touches[0].targetTouches ? touches[0].targetTouches : touches;
            while (i < fingers) {
                result.push({
                    x: touches[i].pageX,
                    y: touches[i].pageY
                });
                i++;
            }
            return result;
        };
        _captureRotation = function() {
            var angle, diff, i, symbol;
            angle = parseInt(_angle(CURRENT_TOUCH), 10);
            diff = parseInt(GESTURE.initial_angle - angle, 10);
            if (Math.abs(diff) > 20 || GESTURE.angle_difference !== 0) {
                i = 0;
                symbol = GESTURE.angle_difference < 0 ? "-" : "+";
                while (Math.abs(diff - GESTURE.angle_difference) > 90 && i++ < 10) {
                    eval("diff " + symbol + "= 180;");
                }
                GESTURE.angle_difference = parseInt(diff, 10);
                return _trigger("rotating", {
                    angle: GESTURE.angle_difference
                });
            }
        };
        _capturePinch = function() {
            var diff, distance;
            distance = parseInt(_distance(CURRENT_TOUCH), 10);
            diff = GESTURE.initial_distance - distance;
            if (Math.abs(diff) > 10) {
                GESTURE.distance_difference = diff;
                return _trigger("pinching", {
                    distance: diff
                });
            }
        };
        _trigger = function(type, params) {
            if (GESTURE.el) {
                params = params || {};
                if (CURRENT_TOUCH[0]) {
                    params.iniTouch = GESTURE.fingers > 1 ? FIRST_TOUCH : FIRST_TOUCH[0];
                    params.currentTouch = GESTURE.fingers > 1 ? CURRENT_TOUCH : CURRENT_TOUCH[0];
                }
                return $.addon.evt.trigger(GESTURE.el, type, params);
            }
        };
        _cleanGesture = function(event) {
            FIRST_TOUCH = [];
            CURRENT_TOUCH = [];
            GESTURE = {};
            return clearTimeout(TOUCH_TIMEOUT);
        };
        _angle = function(touches_data) {
            var A, B, angle;
            A = touches_data[0];
            B = touches_data[1];
            angle = Math.atan((B.y - A.y) * -1 / (B.x - A.x)) * (180 / Math.PI);
            if (angle < 0) {
                return angle + 180;
            } else {
                return angle;
            }
        };
        _distance = function(touches_data) {
            var A, B;
            A = touches_data[0];
            B = touches_data[1];
            return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)) * -1;
        };
        _getTouches = function(event) {
            if (isMobile()) {
                return event.touches;
            } else {
                return [ event ];
            }
        };
        _parentIfText = function(node) {
            if ("tagName" in node) {
                return node;
            } else {
                return node.parentNode;
            }
        };
        _swipeDirection = function(x1, x2, y1, y2) {
            var xDelta, yDelta;
            xDelta = Math.abs(x1 - x2);
            yDelta = Math.abs(y1 - y2);
            if (xDelta >= yDelta) {
                if (x1 - x2 > 0) {
                    return "Left";
                } else {
                    return "Right";
                }
            } else {
                if (y1 - y2 > 0) {
                    return "Up";
                } else {
                    return "Down";
                }
            }
        };
        _hold = function() {
            if (GESTURE.last && Date.now() - GESTURE.last >= HOLD_DELAY) {
                return _trigger("hold");
            }
        };
        $.domReady(function() {
            return _listenTouches();
        });
        return that;
    };
});;


UMC.register("addon.util.storage", function($) {
    var objDS = window.localStorage;
    if (objDS) {
        return {
            get: function(key) {
                return unescape(objDS.getItem(key));
            },
            set: function(key, value, exp) {
                objDS.setItem(key, escape(value));
            },
            del: function(key) {
                objDS.removeItem(key);
            },
            clear: function() {
                objDS.clear();
            },
            getAll: function() {
                var l = objDS.length, key = null, ac = [];
                for (var i = 0; i < l; i++) {
                    key = objDS.key(i);
                    ac.push(key + "=" + objDS.getItem(key));
                }
                return ac.join("; ");
            }
        };
    }
});;


UMC.register("addon.util.audio", function($) {
    return function(node) {
        var that = {};
        if (node != undefined && Boolean(node.nodeName) && Boolean(node.nodeType)) {
            return false;
        }
        that.play = function() {
            node.play();
        };
        that.pause = function() {
            node.pause();
        };
        that.paused = function() {
            return node.paused;
        };
        return that;
    };
});;


UMC.register("addon.util.easyTemplate", function($) {
    var easyTemplate = function(s, d) {
        if (!s) {
            return "";
        }
        if (s !== easyTemplate.template) {
            easyTemplate.template = s;
            easyTemplate.aStatement = easyTemplate.parsing(easyTemplate.separate(s));
        }
        var aST = easyTemplate.aStatement;
        var process = function(d2) {
            if (d2) {
                d = d2;
            }
            return arguments.callee;
        };
        process.toString = function() {
            return (new Function(aST[0], aST[1]))(d);
        };
        return process;
    };
    easyTemplate.separate = function(s) {
        var r = /\\'/g;
        var sRet = s.replace(/(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g, function(a, b, c, d, e, f, g, h) {
            if (b) {
                return "{|}" + (c ? "-" : "+") + d + "{|}";
            }
            if (e) {
                return "\\'";
            }
            if (f) {
                return "";
            }
            if (g) {
                return "'+(" + h.replace(r, "'") + ")+'";
            }
        });
        return sRet;
    };
    easyTemplate.parsing = function(s) {
        var mName, vName, sTmp, aTmp, sFL, sEl, aList, aStm = [ "var aRet = [];" ];
        aList = s.split(/\{\|\}/);
        var r = /\s/;
        while (aList.length) {
            sTmp = aList.shift();
            if (!sTmp) {
                continue;
            }
            sFL = sTmp.charAt(0);
            if (sFL !== "+" && sFL !== "-") {
                sTmp = "'" + sTmp + "'";
                aStm.push("aRet.push(" + sTmp + ");");
                continue;
            }
            aTmp = sTmp.split(r);
            switch (aTmp[0]) {
              case "+et":
                mName = aTmp[1];
                vName = aTmp[2];
                aStm.push('aRet.push("<!--' + mName + ' start-->");');
                break;
              case "-et":
                aStm.push('aRet.push("<!--' + mName + ' end-->");');
                break;
              case "+if":
                aTmp.splice(0, 1);
                aStm.push("if" + aTmp.join(" ") + "{");
                break;
              case "+elseif":
                aTmp.splice(0, 1);
                aStm.push("}else if" + aTmp.join(" ") + "{");
                break;
              case "-if":
                aStm.push("}");
                break;
              case "+else":
                aStm.push("}else{");
                break;
              case "+list":
                aStm.push("if(" + aTmp[1] + ".constructor === Array){with({i:0,l:" + aTmp[1] + ".length," + aTmp[3] + "_index:0," + aTmp[3] + ":null}){for(i=l;i--;){" + aTmp[3] + "_index=(l-i-1);" + aTmp[3] + "=" + aTmp[1] + "[" + aTmp[3] + "_index];");
                break;
              case "-list":
                aStm.push("}}}");
                break;
              default:
                break;
            }
        }
        aStm.push('return aRet.join("");');
        return [ vName, aStm.join("") ];
    };
    return easyTemplate;
});;


UMC.register("addon.util.builder", function($) {
    return function(sHTML, oSelector) {
        var isHTML = typeof sHTML === "string";
        var container = sHTML;
        if (isHTML) {
            container = $.C("div");
            container.innerHTML = sHTML;
        }
        var domList, totalList;
        domList = {};
        if (oSelector) {
            for (key in selectorList) {
                domList[key] = $.query(oSelector[key].toString(), container);
            }
        } else {
            totalList = $.query("[node-type]", container);
            for (var i = 0, len = totalList.length; i < len; i += 1) {
                var key = totalList[i].getAttribute("node-type");
                if (!domList[key]) {
                    domList[key] = [];
                }
                domList[key].push(totalList[i]);
            }
        }
        var domBox = sHTML;
        if (isHTML) {
            domBox = $.C("buffer");
            while (container.childNodes[0]) {
                domBox.appendChild(container.childNodes[0]);
            }
        }
        return {
            box: domBox,
            list: domList
        };
    };
});;


UMC.register("addon.io.socket", function($) {
    return function(oOpts) {
        var empty = function() {};
        var conn = {};
        var opts = $.parseParam({
            url: "",
            onopen: empty,
            onmessage: empty,
            onclose: empty
        }, oOpts);
        if (window.WebSocket === undefined) {
            return false;
        }
        if (window.MozWebSocket) {
            window.WebSocket = window.MozWebSocket;
        }
        if (conn.readyState === undefined || conn.readyState > 1) {
            conn = new WebSocket(opts["url"]);
            conn.onopen = opts["onopen"];
            conn.onmessage = opts["onmessage"];
            conn.onclose = opts["onclose"];
            return conn;
        } else {
            return false;
        }
    };
});;


UMC.register("addon.location.geo", function($) {
    return function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                return {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            }, function(error) {
                $.log("The geo info is err");
            });
        } else {
            return false;
        }
    };
});;