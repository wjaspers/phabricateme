/**
 * Handles the Authorization plugin's options page.
 */
(function (ph) {
	'use strict';

	function Authorization() {
		this.defaults = {
			'client-name': '',
			'client-secret': '',
			'update-interval': 5,
			'enabled': false
		};
		this.authorizationOptions = document.getElementById('authorizationOptions');
		this.initialize();
	};

	Authorization.prototype.initialize = function () {
		var self = this, settings = ph.Settings.get('Authorization');
		var enabled = document.getElementById('authorizationEnabled');

		enabled.checked = (settings.enabled || this.defaults.enabled);
		enabled.addEventListener('change', function () {
			window.toggleVisibility(self.authorizationOptions, this.checked);
			settings.enabled = this.checked;
		});		

		var clientName = document.getElementById('client-name');
		clientName.value = (settings['client-name'] || this.defaults['client-name']);
		clientName.addEventListener('change', function () {
			settings['client-name'] = this.value;
		});

		var clientSecret = document.getElementById('client-secret');
		clientSecret.value = (settings['client-secret'] || this.defaults['client-secret']);
		clientSecret.addEventListener('change', function () {
			settings['client-secret'] = this.value;
		});

		var updateInterval = document.getElementById('update-interval');
		updateInterval.value = (settings['update-interval'] || this.defaults['update-interval']);
		updateInterval.addEventListener('change', function () {
			settings['update-interval'] = this.value;
		});

		window.toggleVisibility(this.authorizationOptions, enabled.checked);
	};

	ph.Options.Authorization = new Authorization;
})(window.PhabricateMe);
