(function (ph, Uri) {
	'use strict';

	function Shortcuts() {
		this.shortcutsEnabled = document.getElementById('shortcutsEnabled');
		this.shortcutsOptions = document.getElementById('shortcutsOptions');
	};

	Shortcuts.prototype.initialize = function (list) {
		var self = this, settings = ph.Settings.get('Shortcuts');
		self.shortcutsEnabled.addEventListener('change', function () {
			window.toggleVisibility(self.shortcutsOptions, this.checked);
			settings.enabled = this.checked;
		});

		this.generateList(list);
		shortcutsEnabled.checked = settings.enabled;
		window.toggleVisibility(self.shortcutsOptions, settings.enabled);
	};

	/**
	 * Generates the checkboxes and labels for each shortcut option.
	 */
	Shortcuts.prototype.generateList = function (list) {
		var self = this, settings = ph.Settings.Shortcuts, uri = new Uri();
		// Iterate across shortcuts and turn them into checkboxes.
		Object.getOwnPropertyNames(list).forEach(function (name) {
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
			input.checked = settings[name] || false;
			input.type = "checkbox";
			input.name = name;
			input.id   = className;
			input.value = 1;
			input.addEventListener('change', function (event) {
				var rel = previewLink.rel;
				settings[rel] = this.checked;
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
		if ('string' === typeof uri) {
			uri = new Uri(uri);
		}
		links = document.getElementsByClassName('shortcut-preview');
		Object.keys(links).forEach(function (index) {
			var pathDef = ph.Shortcuts.fetchDefinition(links[index].rel);
			links[index].protocol = uri.protocol;
			/**
			 * FIXME: This is a bug in chrome.
			 *        If I set the port number to absolutely
			 *        anything non-numeric, chrome forces
		 	 *        it to 0, resulting in invalid links.
			 */
			if (! +uri.port) {
				delete links[index].port;
			} else {
				links[index].port = uri.port;
			}
			links[index].hostname = uri.hostname;
			if (pathDef) {
				links[index].pathname = Uri.sanitizePath(uri.pathname + pathDef.href);
			}
		});
	};

	ph.Options.Shortcuts = new Shortcuts;
})(window.PhabricateMe, window.Uri);
