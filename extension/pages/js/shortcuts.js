(function (ph, Uri) {
	'use strict';

	function Shortcuts() {
		this.shortcutsEnabled = document.getElementById('shortcutsEnabled');
		this.shortcutsOptions = document.getElementById('shortcutsOptions');
		this.initialize();
	};

	Shortcuts.prototype.initialize = function () {
		var self = this;
		self.shortcutsEnabled.addEventListener('change', function () {
			window.toggleVisibility(self.shortcutsOptions, this.checked);
		});
	};

	/**
	 * Generates the checkboxes and labels for each shortcut option.
	 * @param Array list
	 */
	Shortcuts.prototype.generateList = function (list) {
		var self = this, uri = new Uri();
		// Iterate across shortcuts and turn them into checkboxes.
		Object.getOwnPropertyNames(list).forEach(function (name, index) {
			var checked, className, definition, input, label, linkText, previewLink, wrapper;
			definition = list[name];
			className = "shortcut-" + name;

			// Generate the "Preview" link.
			linkText = document.createTextNode('Preview');
			previewLink = document.createElement('a');
			previewLink.className = 'shortcut-preview inline';
			previewLink.href = uri.parse("https://secure.phabricator.com/" + definition.href).toString();
			previewLink.target = "_blank";
			previewLink.rel = name;
			previewLink.appendChild(linkText);

			// Generate the input checkbox.
			input = document.createElement('input');
			input.checked = false;
			input.type = "checkbox";
			input.name = name;
			input.id   = className;
			input.value = 1;
			input.addEventListener('change', function () {
					var myself = this, popup = {'shortcuts': {}};
					popup.shortcuts[myself.name] = myself.checked;
				}, false);

			// Generate the label.
			label = document.createElement('label');
			label.htmlFor = className;
			label.title = definition.tip;
			label.className = "inline";
			label.appendChild(document.createTextNode(definition.title));

			// Put everything inside a wrapper.
			wrapper = document.createElement('div');
			wrapper.className = "checkbox";
			wrapper.appendChild(input);
			wrapper.appendChild(label);
			wrapper.appendChild(previewLink);
			self.shortcutsOptions.appendChild(wrapper);
		});
	};


	/**
	 * Replace the domain with the one specified by the user for any
	 * preview links on the page.
	 * @param Uri uri the new URI to use
	 * @param string current The current domain setting.
	 */
	Shortcuts.prototype.updateLinks = function (uri, current) {
		var links = [], oldUri = new Uri(current);
		links = document.getElementsByClassName('shortcut-preview');
		Object.keys(links).forEach(function (index) {
			var pathDef = ph.Shortcuts.fetchDefinition(links[index].rel);
			links[index].protocol = uri.protocol;
			links[index].port = uri.port;
			links[index].hostname = uri.hostname;
			if (pathDef) {
				links[index].pathname = Uri.sanitizePath(uri.pathname + pathDef.href);
			}
		});
	};

	ph.Options.Shortcuts = new Shortcuts;
})(window.PhabricateMe, window.Uri);
