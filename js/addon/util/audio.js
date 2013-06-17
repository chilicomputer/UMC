UMC.register("addon.util.audio", function($) {

    return function (node) {

		var that ={};

		if((node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType)){
			return false;
		}

		that.play = function(){
			node.play();
		}

		that.pause = function(){
			node.pause();
		}

		that.paused = function(){
			return node.paused;
		}

		return that;
    };
});

