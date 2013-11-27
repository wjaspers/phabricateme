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
	};


	/**
	 * Loads a PhabricateMe plugin and its associated Options page plugin.
	 *
	 * @param string name
	 * @param Closure callback
	 */
	Options.prototype.fetchPlugin = function (name, callback) {
		var self = this;
		ph.fetchPlugin (name, function () {
			var path, script;
			if ('undefined' !== typeof window.PhabricateMe.Options[name]) {
				return window.PhabricateMe.Options[name];
			}

			path = '/pages/js/' + name.toLowerCase() + '.js';
			ph._loadScript(path, function () {
				if (callback) {
					callback.apply(self, [self[name]]);
				}
			});
		});
	};

	ph.Options = new Options;
})(window.PhabricateMe);
