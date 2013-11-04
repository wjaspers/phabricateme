/**
 * A plugin which handles option storage
 * and loading plugins for the options page.
 */
(function (ph) {
	'use strict';

	/**
	 * A pseudo-controller for the options page.
	 */
	function Options() {
		this.settings = {};
		this.loadSettings();
	};


	/**
	 * Loads a PhabricateMe plugin and its associated Options page plugin.
	 *
	 * @param string name
	 * @param Closure callback
	 */
	Options.prototype.fetchPlugin = function (name, callback) {
		ph.fetchPlugin (name, function () {
			var path, script, self = this;
			if ('undefined' !== typeof window.PhabricateMe.Options[name]) {
				return window.PhabricateMe.Options[name];
			}

			path = '/pages/js/' + name.toLowerCase() + '.js';
			ph._loadScript(path, function () {
				callback.apply(self, [ph.Options[name]]);
			});
		});
	};


	/**
	 * Retrieve settings from local storage.
	 */
	Options.prototype.loadSettings = function (callback) {
		var self = this;

		chrome.storage.local.get(function (settings) {
			self.settings = settings;
			if (callback) {
				callback.apply(self, [self]);
			}
		});
	};


	/**
	 * Commit settings to chrome's local storage.
	 *
	 * @param Closure callback
	 *  Optional callback to execute when local storage is done updating.
	 */
	Options.prototype.saveSettings = function (callback) {
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

	ph.Options = new Options;
})(window.PhabricateMe);
