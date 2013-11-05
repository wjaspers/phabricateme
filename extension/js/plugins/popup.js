/**
 * Handles the Popup javascript.
 */
(function(ph, Uri) {
	'use strict';

	function Popup() {
	};

	Popup.prototype.initialize = function () {
		var self = this;
		ph.fetchPlugin('Shortcuts', function () {
			self.buildShortcuts();
		});
	};

	Popup.prototype.buildShortcuts = function () {
		var all = ph.Shortcuts.getAllLinks(), self = this;
		return Object.getOwnPropertyNames(all).map(function (name) {
			document.body.appendChild(self.makeShortcut(name));
		});
	};

	Popup.prototype.makeShortcut = function (name) {
		var definition, el, text;
		definition = ph.Shortcuts.fetchDefinition(name);
		el = document.createElement('a');
		text = document.createTextNode(definition.title);
		el.href = definition.href;
		el.target = '_blank';
		el.title = definition.tip || '';
		el.appendChild(text);
		return el;
	};

	ph.Popup = new Popup;
})(window.PhabricateMe, window.Uri);
