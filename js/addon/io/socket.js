UMC.register("addon.io.socket", function($) {

    return function (oOpts) {

        var empty = function(){};
        var conn = {};

        var opts = $.parseParam({
            'url': '',
            'onopen' : empty,
            'onmessage' : empty,
            'onclose' : empty
        }, oOpts);

        if (window.WebSocket === undefined) {
            return false;
        }

        if (window.MozWebSocket) {
            window.WebSocket = window.MozWebSocket;
        };

        if (conn.readyState === undefined || conn.readyState > 1) {
            conn = new WebSocket(opts['url']);
            conn.onopen = opts['onopen'];
            conn.onmessage = opts['onmessage'];
            conn.onclose = opts['onclose'];
            return conn;
        } else {
            return false;
        }
    };
});