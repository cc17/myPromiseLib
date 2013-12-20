/**
 * author by 素人渔夫
 * email:dengxiaoming1217@gmail.com
 * description: 异步编程promise实现
 */
(function() {
	/*
	 * promise
	 */
	function EasyPromise() {
		this._callbacks = [];
	};
	EasyPromise.prototype = {
		then: function(func, context) {
			var p;
			if (this._isdone) {
				p = func.apply(context, this.result);
			} else {
				p = new EasyPromise();
				this._callbacks.push(function() {
					//此时apply context很重要，否则，res中的实例获取不到this
					var res = func.apply(context, arguments);
					if (res && typeof res.then === 'function') res.then(p.resolve, p);
				});
			}
			return p;
		},
		resolve: function() {
			this.result = arguments;
			this._isdone = true;
			for (var i = 0; i < this._callbacks.length; i++) {
				this._callbacks[i].apply(this.result, arguments);
			}
			this._callbacks = [];
		}
	};
	EasyPromise.when = function() {
		var AllPromises = [].slice.call(arguments, 0)[0];
		var p = new EasyPromise();
		var promiseLen = AllPromises.length;

		var doneParams = {};
		AllPromises.forEach(function(item, index) {
			item.__promise__name = index;
			doneParams[index] = {};
			item.then(checkAllPromiseDone, item);
		});
		var donePromiseCount = 0;

		function checkAllPromiseDone(data) {
			donePromiseCount++;
			doneParams[this.__promise__name] = data;
			if (donePromiseCount == promiseLen) {
				doneParams = makeArray(doneParams);
				p.resolve(doneParams);
			}
		};
		return p;
	};


	if (typeof define !== 'undefined') {
		define([], function() {
			return EasyPromise;
		});
	} else if (typeof exports !== 'undefined') {
		exports.EasyPromise = EasyPromise;
	} else {
		window.EasyPromise = EasyPromise;
	}
})();