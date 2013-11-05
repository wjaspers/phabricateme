(function(ph) {
	'use strict';

	function Authorization() {
		this.adapter = null;
		this.settings = {};
		this.initialize();
	};


	/**
	 * Attempts to make an OAuth2 authorization against your Phabricator instance.
	 * @param Closure callback
	 */
	Authorization.prototype.authorize = function (callback) {
		var self = this;
		this.adapter.authorize(function () {
			var accessToken = self.adapter.getAccessToken();
			if (callback) {
				callback.call(self);
			}
		});
	};


	/**
	 * Checks if we have an access token.
	 * @return boolean
	 */
	Authorization.prototype.isAuthorized = function () {
		return this.adapter.hasAccessToken();
	};


	/**
	 * Instantiates a new OAuth2 adapter.
	 */
	Authorization.prototype.initialize = function () {
		var configuration = {
			'client_id': 'PHID-OASC-724xk3enzosxirfap7fw',
			'client_secret': '7wcqoucqc6ysrrodqguzj2pofetneags',
			'api_scope': 'offline_access'
		};
		this.adapter = new OAuth2('phabricator', configuration);
	};


	ph.Authorization = new Authorization;
})(window.PhabricateMe);
