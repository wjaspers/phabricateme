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
			ph.Options.fetchPlugin('Authorization', function (plugin) {
				var authMe = document.getElementById('authorize');
				authMe.addEventListener('click', function () {
					ph.Authorization.authorize();
				});
			});


			/**
			 *
			 */
			ph.Options.fetchPlugin('Popup', function (plugin) {
			});


			/**
			 *
			 */
			ph.Options.fetchPlugin('Shortcuts', function(plugin) {
				var list = ph.Shortcuts.getAllLinks();
				plugin.initialize(list);
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
				ph.Settings.domain = uri.toString();
			});

			domain.value = ph.Settings.get('domain');


			/**
			 * Bind a handler to the "save" button.
			 */
			document.getElementById("save").addEventListener('click', function(event) {
				ph.Settings.save(function() {
					alert("Settings saved!");
				});
				event.preventDefault();
				return false;
			});


			/*
			 * Allow the user to wipe extension data.
			 */
			document.getElementById("terminate").addEventListener('click', function(event) {
				if (confirm('Are you absolutely sure you want to erase ALL settings for PhabricateMe?')) {
					ph.Settings.clear(function () {	
						alert('Settings cleared.');
					});
				}
				event.preventDefault();
				return false;
			});
		});
	});

	/**
	 * Helper for controlling element visibility.
	 *
	 * @param DOMNode element
	 * @param boolean state
	 */
	window.toggleVisibility = function (element, state) {
		var classNames = element.className.split(' ');
		classNames = classNames.filter(function (className) {
			return className !== 'hide';
		});

		if (state === false) {
			classNames.push('hide');
		}

		element.className = classNames.join(' ');
	};
})(window.PhabricateMe, window.Uri);
