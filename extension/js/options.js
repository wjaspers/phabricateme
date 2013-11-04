/**
 * Functionality strictly for the extension's options page.
 */
(function (ph) {
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
		enableShortcuts.addEventListener('change', function() {
			var myself = this, child = shortcutsOptions;
			if (this.checked === true) {
				child.className = child.className.replace("hide", '');
			} else {
				child.className += " hide";
			}
		});

		/*
		 * Allow the user to wipe extension data.
		 */
		document.getElementById("terminate").addEventListener('click', function() {
			if (confirm('Are you absolutely sure you want to erase ALL settings for PhabricateMe?')) {
				chrome.storage.local.clear();
				alert('Settings cleared.');
			}
		});

		/*
		 * Allows the user to disable the popup button.
		 */
		var popupEnabled = document.getElementById("popup-enabled");
		popupEnabled.checked = (options.popup.enabled || false);
		popupEnabled.addEventListener('change', function() {
			var myself = this, popup = {'popup': ''};

			if (this.checked === true) {
				popup = { 'popup' : 'pages/popup.html' };
			}

			chrome.browserAction.setPopup(popup);
		});
	};

})(window.PhabricateMe);
