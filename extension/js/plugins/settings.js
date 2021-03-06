/**
 * This is the best solution I could conjure up to handle getting/setting
 * options on a per-plugin basis.
 */
(function (ph) {
	'use strict';

	function Settings() {
	};


	Settings.prototype.initialize = function (callback) {
		var self = this;
		chrome.storage.local.get(function (settings) {
			Object.getOwnPropertyNames(settings).forEach(function (property) {
				var value = settings[property];
				self[property] = value;
			});
			if (callback) {
				callback.apply(self, [self]);
			}
		});
	};


	Settings.prototype.clear = function (callback) {
		var self = this;
		chrome.storage.local.clear(function () {
			Object.getOwnPropertyNames(self).forEach(function (property) {
				delete self[property];
			});
			if ('function' === typeof callback) {
				callback.apply(self);
			}
		});
	};

	Settings.prototype.load = function (callback) {
		this.initialize(callback);
	};

	Settings.prototype.get = function (name) {
		if ('undefined' === typeof this[name]) {
			this[name] = {};
		}
		return this[name];
	};

	/**
	 * Commits the settings to local storage.
	 */
	Settings.prototype.save = function (callback) {
		var self = this;
		/* FIXME:
		 * Chrome doesn't remove properties when the object changes.
		 * For now, we'll wipe the slate clean and store only
		 * what we currently have.
		 */
		chrome.storage.local.clear(function () {
			chrome.storage.local.set(self, function () {
				if (callback) {
					callback.apply(self);
				}
			});
		});
	};

	ph.Settings = new Settings;
})(window.PhabricateMe);
