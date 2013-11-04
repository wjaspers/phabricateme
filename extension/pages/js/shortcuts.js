(function (ph, Uri) {
	'use strict';

	function Shortcuts() {
		// This is a global object and should not carry any properties.
	};


	/**
	 * Generates the checkboxes and labels for each shortcut option.
	 * @param Array list
	 */
	Shortcuts.generateList = function (list) {
		var container, uri = new Uri();
		container = document.getElementById('shortcuts-options');
		// Iterate across shortcuts and turn them into checkboxes.
		Object.getOwnPropertyNames(list).forEach(function (name, index) {
			var checked, className, definition, input, label, linkText, previewLink, wrapper;
			definition = list[name];
			className = "shortcut-" + name;

			// Generate the "Preview" link.
			linkText = document.createTextNode('Preview');
			previewLink = document.createElement('a');
			previewLink.className = 'shortcut-preview inline';
			previewLink.href = new Uri("https://secure.phabricator.com/" + definition.href).toString();
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
			container.appendChild(wrapper);
		});
	};


	/**
	 * Replace the domain with the one specified by the user for any
	 * preview links on the page.
	 * @param Uri uri the new URI to use
	 * @param string current The current domain setting.
	 */
	Shortcuts.updateLinks = function (uri, current) {
		var links = [], oldUri = new Uri(current);
		links = document.getElementsByClassName('shortcut-preview');
		Object.keys(links).forEach(function (index) {
			var pathDef;
			pathDef = ph.Shortcuts.fetchDefinition(links[index].rel);
			links[index].protocol = uri.protocol;
			links[index].port = uri.port;
			links[index].hostname = uri.hostname;
			if (pathDef) {
				links[index].pathname = uri.pathname + pathDef.href;
			}
		});
	};

	ph.Options.Shortcuts = Shortcuts;
})(window.PhabricateMe, window.Uri);
