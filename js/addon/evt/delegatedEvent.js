/**
 * 通过冒泡的方式做的事件代理对象
 * @id extension.evt.delegatedEvent
 * @param {Element} actEl
 * @param {Array} expEls
 * @author jipeng1@staff.sina.com.cn
 * @return {delegatedEvent Object}
 *  {
 *      add : function,
 *      remove : function
 *      pushExcept : function
 *      destroy : function
 *  }
 */
UMC.register('addon.evt.delegatedEvent',function($){
    var checkContains = function(parent,node){
        if(parent === node){
            return false;
        }else if(parent.compareDocumentPosition){
            return ((parent.compareDocumentPosition(node) & 16) === 16);
        }else if(parent.contains && node.nodeType === 1) {
            return  parent.contains(node);
        }else{
            while(node = node.parentNode) {
                if(parent === node){
                    return true;
                }
            }
        }
        return false;
    };
     
    return function(actEl){
        if(!((actEl != undefined) && Boolean(actEl.nodeName) && Boolean(actEl.nodeType))){
            throw 'UMC.delegatedEvent need an Element as first Parameter';
        }
        var evtList = {};
        var bindEvent = function(evt){
            var el = evt.target;
            var type = evt.type;
            var actionType = null;
            var checkBuble = function(){
                var tg = el;
                if(evtList[type] && evtList[type][actionType]){
                    return evtList[type][actionType]({
                        'evt' : evt,
                        'el' : tg,
                        'box' : actEl,
                        'data' : $.queryToJson(tg.getAttribute('action-data') || '')
                    });
                }else{
                    return true;
                }
            };
            if(!checkContains(actEl, el)){
                return false;
            }else{
                while(el && el !== actEl){
                    if(el.nodeType == 1){
                        actionType = el.getAttribute('action-type');
                        if(actionType && checkBuble() === false){
                            break;
                        }
                    }
                    el = el.parentNode;
                }  
            }
        };
        var that = {};
        /**
         * 添加代理事件
         * @method add
         * @param {String} funcName
         * @param {String} evtType
         * @param {Function} process
         * @return {void}
         *
         */
        that.add = function(funcName, evtType, process){
            if(!evtList[evtType]){
                evtList[evtType] = {};
                $.addEvent(actEl, evtType, bindEvent);
            }
            evtList[evtType][funcName] = process;
        };
        /**
         * 移出代理事件
         * @method remove
         * @param {String} funcName
         * @param {String} evtType
         * @return {void}
         */
        that.remove = function(funcName, evtType){
            if(evtList[evtType]){
                delete evtList[evtType][funcName];
                if($.isEmptyObj(evtList[evtType])){
                    delete evtList[evtType];
                    $.removeEvent(actEl, evtType, bindEvent);
                }
            }
        };
        return that;
    };
});
