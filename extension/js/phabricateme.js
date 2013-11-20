(function () {
	'use strict';

	/**
	 * A list of plugins supported by PhabricateMe.
	 * These should be the same as the Object name you
	 * would reference. The plugin loader will automatically
	 * convert them to lowercase.
	 */
	var pluginList = [
		'Authorization',
		'Options',
		'Popup',
		'Settings',
		'Shortcuts',
	];


	function PhabricateMe() {
		var self = this;
		self.isLoading = false;
		self.queued = [];
		this.fetchPlugin('Settings');
	};


	/**
	 * Loads all plugins defined here.
	 * Use sparingly!
	 */
	PhabricateMe.prototype.fetchAllPlugins = function () {
		var self = this;
		pluginList.forEach(function (name) {
			self.fetchPlugin(name);
		});
	};


	/**
	 * Attempts to load a plugin and attach it to this
	 * PhabricateMe instance.
	 *
	 * @param string name
	 * @param Closure callback
	 */
	PhabricateMe.prototype.fetchPlugin = function (name, callback) {
		var path, self = this;

		// See if we've already loaded it.
		if ('undefined' !== typeof self[name]) {
			return self[name];
		}

		path = '/js/plugins/' + name.toLowerCase() + '.js';
		this._loadScript(path, function () {
			if (callback) {
				callback.apply(self, [self[name]]);
			}
		});
	};


	/**
	 * @param string path
	 * @param Closure callback
	 */
	PhabricateMe.prototype._loadScript = function (path, callback) {
		var script, self = this;
		if (this.isLoading) {
			this.queueLoad(path, callback);
			return;
		}
		self.isLoading = true;
		script = document.createElement('script');
		script.src = chrome.extension.getURL(path);
		script.addEventListener('load', function () {
			if (callback) {
				callback.apply(self);
			}
			self.finishLoadEvent();
		}, false);
		document.head.appendChild(script);
	};


	/**
	 * Needed to prevent race conditions between plugins being loaded.
	 */
	PhabricateMe.prototype.finishLoadEvent = function () {
		var next = this.queued.shift();
		this.isLoading = false;
		if (next) {
			this._loadScript(next.path, next.callback);
		}
	};


	/**
	 * Adds the next script/callback to load to a stack.
	 * @param string path
	 * @param Closure callback
	 */
	PhabricateMe.prototype.queueLoad = function (path, callback) {
		this.queued.push({path: path, callback: callback});
	};

	window.PhabricateMe = new PhabricateMe;
})(window);
