/**
 * Functionality strictly for the extension's options page.
 */
(function (ph, uri) {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		ph.fetchPlugin('Options', function () {
			/**
			 * 
			 */
			ph.Options.fetchPlugin('Authorization', function () {
				var authMe = document.getElementById('authorize');
				authMe.addEventListener('click', function () {
					ph.Authorization.authorize();
				});
			});

			/**
			 *
			 */
			ph.Options.fetchPlugin('Popup', function () {
			});

			/**
			 *
			 */
			ph.Options.fetchPlugin('Shortcuts', function(plugin) {
				var list = ph.Shortcuts.getAllLinks();
				plugin.generateList(list);
				domain.addEventListener('change', function () {
					var uri = new Uri(this.value);
					plugin.updateLinks(uri);
				});
			});

			/**
			 * Listen for changes to the domain.
			 */
			var domain = document.getElementById("domain");
			domain.addEventListener('change', function () {
				var uri = new Uri(this.value);
				ph.Options.settings.domain = uri.toString();
			});
		});
	});

	/**
	 * Determines how form elements behave.
	 * @param Object options
	 *  Default values/settings retrieved from local storage.
	 */
	function bindUIEvents(options) {
		/**
		 * Bind a handler to the "save" button.
		 */
		document.getElementById("save").addEventListener('click', function() {
			ph.Options.saveSettings(function() {
				alert("Settings saved!");
			});
		});

		/**
		 * Bind a handler to the parent of option lists.
		 */
		var enableShortcuts = document.getElementById("shortcuts");

		/* FIXME: We shouldn't have to do things this way.
		 * Find a way to fix it.
		 */
		options['popup'] = options['popup'] || Object;
		enableShortcuts.checked = (options.popup.enableShortcuts || false);
		var shortcutsOptions = document.getElementById("shortcuts-options");
		if (options.popup.enableShortcuts) {
			shortcutsOptions.className = shortcutsOptions.className.replace('hide', '');
		}


		/*
		 * Allow the user to wipe extension data.
		 */
		document.getElementById("terminate").addEventListener('click', function() {
			if (confirm('Are you absolutely sure you want to erase ALL settings for PhabricateMe?')) {
				chrome.storage.local.clear();
				alert('Settings cleared.');
			}
		});

	};

	/**
	 * Helper for controlling element visibility.
	 *
	 * @param DOMNode element
	 * @param boolean state
	 */
	window.toggleVisibility = function (element, state) {
		var classNames = element.className.split(' ');
		classNames = classNames.filter(function (className) {
			if (className === 'hide') {
				return false;
			}
			return true;
		});

		if (state === false) {
			classNames.push('hide');
		}

		element.className = classNames.join(' ');
	};

})(window.PhabricateMe, window.Uri);
