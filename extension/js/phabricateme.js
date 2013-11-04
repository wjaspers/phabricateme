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
		'Options',
		'Shortcuts',
	];


	/**
	 * Preload the list of plugins so name checks are quick
	 * This is defined outside the object so users cant
	 * forge the name of a plugin and attempt to load it. 
	 */
	pluginListStr = pluginList.join();


	function PhabricateMe() {
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
		if ('undefined' !== typeof window.PhabricateMe[name]) {
			return window.PhabricateMe[name];
		}

		path = '/js/plugins/' + name.toLowerCase() + '.js';
		this._loadScript(path, function () {
			if (callback) {
				callback.apply(self, [window.PhabricateMe[name]]);
			}
		});
	};


	/**
	 * @param string path
	 * @param Closure callback
	 */
	PhabricateMe.prototype._loadScript = function (path, callback) {
		var script, self = this;
		// chrome.tabs.executeScript doesnt work with background pages.
		script = document.createElement('script');
		script.src = chrome.extension.getURL(path);
		script.addEventListener('load', function () { 
			if (callback) {
				callback.apply(self);
			}
		}, false);
		document.head.appendChild(script);
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
