(function () {
	'use strict';

	/**
	 * A list of plugins supported by PhabricateMe.
	 * These should be the same as the Object name you
	 * would reference. The plugin loader will automatically
	 * convert them to lowercase.
	 */
	var pluginList, pluginListStr;


	pluginList = [
		'Authorization',
		'Options', // FIXME: Remove this. Only the Options page should be able to load this.
		'Popup',
		'Settings',
		'Shortcuts',
	];


	/**
	 * Preload the list of plugins so name checks are quick
	 * This is defined outside the object so users cant
	 * forge the name of a plugin and attempt to load it. 
	 */
	pluginListStr = pluginList.join();


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

		/* Dont let users ask for plugins we haven't registered. */
		if (! this.isValidPlugin(name)) {
			throw Error('Unknown plugin: ' + name);
		}

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
		if (this.loading) {
			this.queueLoad(path, callback);
			return;
		}
		self.loading = true;
		// chrome.tabs.executeScript doesnt work with background pages.
		script = document.createElement('script');
		script.src = chrome.extension.getURL(path);
		script.addEventListener('load', function () {
			self.finishLoadEvent();
			if (callback) {
				callback.apply(self);
			}
		}, false);
		document.head.appendChild(script);
	};

	/**
	 * Needed to prevent race conditions between plugins being loaded.
	 */
	PhabricateMe.prototype.finishLoadEvent = function () {
		var self = this, next = self.queued.shift();
		self.loading = false;
		if (next) {
			self._loadScript(next.path, next.callback);
		}
	};

	PhabricateMe.prototype.queueLoad = function (path, callback) {
		this.queued.push({path: path, callback: callback});
	};

	/**
	 * Checks if the plugin name provided is actually defined.
	 *
	 * @param string name
	 * @return boolean
	 */
	PhabricateMe.prototype.isValidPlugin = function (name) {
		return (pluginListStr.search(name) >= 0);
	};

	window.PhabricateMe = new PhabricateMe;
})(window);
