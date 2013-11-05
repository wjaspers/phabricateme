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
		'Popup',
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
		this.loadSettings(function (settings) {
			self.settings = settings;
		});
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


	/**
	 * @param string pluginName
	 * @param Closure callback
	 */
	PhabricateMe.prototype.loadPluginSettings = function (pluginName, callback) {
		var self = this;
		this.loadSettings(function (settings) {
			var pluginSettings = settings[pluginName] || undefined;
			return callback.apply(self, [pluginSettings]);
		});
	};


	/**
	 * Retrieve settings from local storage.
	 * @param Closure callback
	 */
	PhabricateMe.prototype.loadSettings = function (callback) {
		var self = this;

		chrome.storage.local.get(function (settings) {
			self.settings = settings;
			if (callback) {
				callback.apply(self, [settings]);
			}
		});
	};


	/**
	 * Commit settings to chrome's local storage.
	 *
	 * @param Closure callback
	 *  Optional callback to execute when local storage is done updating.
	 */
	PhabricateMe.prototype.saveSettings = function (callback) {
		var myself = this;
		/* FIXME:
		 * Chrome doesn't remove properties when the object changes.
		 * For now, we'll wipe the slate clean and store only
		 * what we currently have.
		 */
		chrome.storage.local.clear(function () {
			chrome.storage.local.set(myself.settings, callback);
		});
	};

	window.PhabricateMe = new PhabricateMe;
})(window);
