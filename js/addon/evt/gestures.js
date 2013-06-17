UMC.register("addon.evt.gestures", function($) {

    var MOBILE_EVENT_TYPE = {
        touchstart : "mousedown",
        touchmove : "mousemove",
        touchend : "mouseup",
        tap : "click",
        doubletap : "dblclick",
        orientationchange : "resize"
    }
    var IS_WEBKIT = /WebKit\/([\d.]+)/;
    var SUPPORTED_OS = {
        Android : /(Android)\s+([\d.]+)/,
        ipad : /(iPad).*OS\s([\d_]+)/,
        iphone : /(iPhone\sOS)\s([\d_]+)/,
        blackberry : /(BlackBerry).*Version\/([\d.]+)/,
        blackberryPlaybook : /(PlayBook).*Version\/([\d.]+)/,
        webos : /(webOS|hpwOS)[\s\/]([\d.]+)/
    };

    var GESTURE = {};
    var FIRST_TOUCH = [];
    var CURRENT_TOUCH = [];
    var TOUCH_TIMEOUT = void 0;
    var HOLD_DELAY = 650;
    var that = {};
    var GESTURES = ["doubleTap", "hold", "swipe", "swiping", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "rotate", "rotating", "rotateLeft", "rotateRight", "pinch", "pinching", "pinchIn", "pinchOut", "drag", "dragLeft", "dragRight", "dragUp", "dragDown"];

    var evtEvent = function(type, touch){
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

    var evtTrigger = function(el, event, data, touch){
        if ($.getType(event) === "string") {
            event = evtEvent(event, touch);
        }
        event.data = data;
        return el.dispatchEvent(event);
    }

    return function() {
        var _current = null;
        var isMobile = function() {
            _current = _current || detectEnvironment();
            return _current.isMobile;
        };
        var environment = function() {
            _current = _current || detectEnvironment();
            return _current;
        };
        var detectBrowser = function(user_agent) {
            var is_webkit = user_agent.match(IS_WEBKIT);
            if (is_webkit) {
                return is_webkit[0];
            } else {
                return user_agent;
            }
        };
        var detectOS = function(user_agent) {
            var detected_os, os, supported;
            detected_os = null;
            for (os in SUPPORTED_OS) {
                supported = user_agent.match(SUPPORTED_OS[os]);
                if (supported) {
                    detected_os = {
                        name : (os === "iphone" || os === "ipad" ? "ios" : os),
                        version : supported[2].replace("_", ".")
                    };
                    break;
                }
            }
            return detected_os;
        };

        var detectEnvironment = function() {
            var environment, user_agent;
            user_agent = navigator.userAgent;
            environment = {};
            environment.browser = detectBrowser(user_agent);
            environment.os = detectOS(user_agent);
            environment.isMobile = !!environment.os;
            environment.screen = {
                width : window.innerWidth,
                height : window.innerHeight
            }
            return environment;
        };

        var cleanGesture = function(event) {
            FIRST_TOUCH = [];
            CURRENT_TOUCH = [];
            GESTURE = {};
            return clearTimeout(TOUCH_TIMEOUT);
        };
        
        
        var getTouches = function(event) {
            if (isMobile()) {
                return event.touches;
            } else {
                return [event];
            }
        };

        var until = {
            parentIfText : function(node) {
                if ("tagName" in node) {
                    return node;
                } else {
                    return node.parentNode;
                }
            },

            distance : function(touches_data) {
                var A, B;
                A = touches_data[0];
                B = touches_data[1];
                return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)) * -1;
            },

            swipeDirection : function(x1, x2, y1, y2) {
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
            },
            angle : function(touches_data) {
                var A, B, angle;
                A = touches_data[0];
                B = touches_data[1];
                angle = Math.atan((B.y - A.y) * -1 / (B.x - A.x)) * (180 / Math.PI);
                if (angle < 0) {
                    return angle + 180;
                } else {
                    return angle;
                }
            },
            capturePinch : function() {
                var diff, distance;
                distance = parseInt(distance(CURRENT_TOUCH), 10);
                diff = GESTURE.initial_distance - distance;
                if (Math.abs(diff) > 10) {
                    GESTURE.distance_difference = diff;
                    return trigger("pinching", {
                        distance : diff
                    });
                }
            },
            captureRotation : function() {
                var angle, diff, i, symbol;
                angle = parseInt(until.angle(CURRENT_TOUCH), 10);
                diff = parseInt(GESTURE.initial_angle - angle, 10);
                if (Math.abs(diff) > 20 || GESTURE.angle_difference !== 0) {
                    i = 0;
                    symbol = GESTURE.angle_difference < 0 ? "-" : "+";
                    while (Math.abs(diff - GESTURE.angle_difference) > 90 && i++ < 10) {
                        eval("diff " + symbol + "= 180;");
                    }
                    GESTURE.angle_difference = parseInt(diff, 10);
                    return trigger("rotating", {
                        angle : GESTURE.angle_difference
                    });
                }
            },

            fingersPosition : function(touches, fingers) {
                var i, result;
                result = [];
                i = 0;
                touches = touches[0].targetTouches ? touches[0].targetTouches : touches;
                while (i < fingers) {
                    result.push({
                        x : touches[i].pageX,
                        y : touches[i].pageY
                    });
                    i++;
                }
                return result;
            },

            isSwipe : function(event) {
                var move_horizontal, move_vertical, ret;
                ret = false;
                if (CURRENT_TOUCH[0]) {
                    move_horizontal = Math.abs(FIRST_TOUCH[0].x - CURRENT_TOUCH[0].x) > 30;
                    move_vertical = Math.abs(FIRST_TOUCH[0].y - CURRENT_TOUCH[0].y) > 30;
                    ret = GESTURE.el && (move_horizontal || move_vertical);
                }
                return ret;
            }
        };
        
        var touchobj = {
            onTouchStart : function(event) {
                var delta, fingers, now, touches;
                now = Date.now();
                delta = now - (GESTURE.last || now);
                TOUCH_TIMEOUT && clearTimeout(TOUCH_TIMEOUT);
                touches = getTouches(event);
                fingers = touches.length;
                FIRST_TOUCH = until.fingersPosition(touches, fingers);
                GESTURE.el = until.parentIfText(touches[0].target);
                GESTURE.fingers = fingers;
                GESTURE.last = now;
                if (fingers === 1) {
                    GESTURE.isDoubleTap = delta > 0 && delta <= 250;
                    return setTimeout(function(){
                        if (GESTURE.last && (Date.now() - GESTURE.last >= HOLD_DELAY)) {
                            return touchobj.trigger("hold");
                        }
                    }, HOLD_DELAY);
                } else if (fingers === 2) {
                    GESTURE.initial_angle = parseInt(until.angle(FIRST_TOUCH), 10);
                    GESTURE.initial_distance = parseInt(until.distance(FIRST_TOUCH), 10);
                    GESTURE.angle_difference = 0;
                    return GESTURE.distance_difference = 0;
                }
            },
            onTouchMove : function(event) {
                var fingers, touches;
                if (GESTURE.el) {
                    touches = getTouches(event);
                    fingers = touches.length;
                    if (fingers === GESTURE.fingers) {
                        CURRENT_TOUCH = until.fingersPosition(touches, fingers);
                        if (until.isSwipe(event)) {
                            touchobj.trigger("swiping");
                        }
                        if (fingers === 2) {
                            until.captureRotation();
                            until.capturePinch();
                            event.preventDefault();
                        }
                    } else {
                        cleanGesture();
                    }
                }
                return true;
            },

            onTouchEnd : function(event) {
                var anyevent, drag_direction, pinch_direction, rotation_direction, swipe_direction;
                if (GESTURE.isDoubleTap) {
                    touchobj.trigger("doubleTap");
                    return cleanGesture();
                } else if (GESTURE.fingers === 1) {
                    if (until.isSwipe()) {
                        touchobj.trigger("swipe");
                        swipe_direction = until.swipeDirection(FIRST_TOUCH[0].x, CURRENT_TOUCH[0].x, FIRST_TOUCH[0].y, CURRENT_TOUCH[0].y);
                        touchobj.trigger("swipe" + swipe_direction);
                        return cleanGesture();
                    } else {
                        touchobj.trigger("tap");
                        return TOUCH_TIMEOUT = setTimeout(cleanGesture, 250);
                    }
                } else if (GESTURE.fingers === 2) {
                    anyevent = false;
                    if (GESTURE.angle_difference !== 0) {
                        touchobj.trigger("rotate", {
                            angle : GESTURE.angle_difference
                        });
                        rotation_direction = GESTURE.angle_difference > 0 ? "rotateRight" : "rotateLeft";
                        touchobj.trigger(rotation_direction, {
                            angle : GESTURE.angle_difference
                        });
                        anyevent = true;
                    }
                    if (GESTURE.distance_difference !== 0) {
                        touchobj.trigger("pinch", {
                            angle : GESTURE.distance_difference
                        });
                        pinch_direction = GESTURE.distance_difference > 0 ? "pinchOut" : "pinchIn";
                        touchobj.trigger(pinch_direction, {
                            distance : GESTURE.distance_difference
                        });
                        anyevent = true;
                    }
                    if (!anyevent && CURRENT_TOUCH[0]) {
                        if (Math.abs(FIRST_TOUCH[0].x - CURRENT_TOUCH[0].x) > 10 || Math.abs(FIRST_TOUCH[0].y - CURRENT_TOUCH[0].y) > 10) {
                            touchobj.trigger("drag");
                            drag_direction = until.swipeDirection(FIRST_TOUCH[0].x, CURRENT_TOUCH[0].x, FIRST_TOUCH[0].y, CURRENT_TOUCH[0].y);
                            touchobj.trigger("drag" + drag_direction);
                        }
                    }
                    return cleanGesture();
                }
            },
            trigger : function(type, params) {
                if (GESTURE.el) {
                    params = params || {};
                    if (CURRENT_TOUCH[0]) {
                        params.iniTouch = (GESTURE.fingers > 1 ? FIRST_TOUCH : FIRST_TOUCH[0]);
                        params.currentTouch = (GESTURE.fingers > 1 ? CURRENT_TOUCH : CURRENT_TOUCH[0]);
                    }
                    return evtTrigger(GESTURE.el, type, params);
                }
            }
        };


        var instance = function() {
            var documentBody = document.body;
            var touchstart = isMobile() ? "touchstart" : MOBILE_EVENT_TYPE.touchstart;
            var touchmove = isMobile() ? "touchmove" : MOBILE_EVENT_TYPE.touchmove;
            var touchend = isMobile() ? "touchend" : MOBILE_EVENT_TYPE.touchend;
            $.addEvent(documentBody, touchstart, touchobj.onTouchStart);
            $.addEvent(documentBody, touchmove, touchobj.onTouchMove);
            $.addEvent(documentBody, touchend, touchobj.onTouchEnd);
            $.addEvent(documentBody, "touchcancel", cleanGesture);
            return true;
        };

        instance();

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

        that.remove = function(){
            return cleanGesture();
        }

        return that;
    }
});
