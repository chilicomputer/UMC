/**
 * LocalStorage
 * @id UMC.core.util.storage
 * @alias UMC.core.util.storage
 * @author mabo@staff.sina.com.cn
 * @example
 * STK.core.util.storage.set(key);
 * STK.core.util.storage.get(key,value)
 * STK.core.util.storage.del(key)
 * STK.core.util.storage.clear
 * STK.core.util.storage.getAll
 */
UMC.register('addon.util.storage', function($){
	var objDS = window.localStorage;
	if (objDS) {
		return {
			/**
			 * Describe 获取值
			 * @method get
			 * @param {String} key
				
			 * @return {String}
			 * @example
			 */
			get: function(key){
				return unescape(objDS.getItem(key));
			},
			/**
			 * Describe 设置值
			 * @method set
			 * @param {String} key
			 * @param {String} value
			 * @return {void}
			 * @example
			 */
			set: function(key, value, exp){
				objDS.setItem(key, escape(value));
			},
			/**
			 * Describe 删除值
			 * @method	del
			 * @param {String} key
			 * @return {void}
			 * @example
			 */
			del: function(key){
				objDS.removeItem(key);
			},
			clear: function(){
				objDS.clear();
			},
			getAll: function(){
				var l = objDS.length, key = null, ac = [];
				for (var i = 0; i < l; i++) {
					key = objDS.key(i);
					ac.push(key + '=' + objDS.getItem(key));
				}
				return ac.join('; ');
			}
		};
	}
});
