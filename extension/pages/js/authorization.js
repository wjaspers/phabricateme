/**
 * Handles the Authorization plugin's options page.
 */
(function (ph) {
	'use strict';

	function Authorization() {
		this.defaults = {
			'client-name': '',
			'client-secret': '',
			'update-interval': 5
		};
	};

	Authorization.prototype.bind = function () {
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
	};

	ph.Options.Authorization = new Authorization;
})(window.PhabricateMe);
