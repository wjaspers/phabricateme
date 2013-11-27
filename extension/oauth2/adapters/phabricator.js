/**
 * Create an OAuth adapater for Phabricator.
 * @link https://github.com/borismus/oauth2-extensions/blob/master/README.md
 * @link http://www.phabricator.com/docs/phabricator/article/Using_the_Phabricator_OAuth_Server.html
 */
OAuth2.adapter('phabricator', {
	/**
	 * Returns the HTTP verb used to obtain an access token.
	 * @return string
	 */
	accessTokenMethod: function() {
		return 'POST';
	},


	/**
	 * Generates an object containing the parameters needed
	 * to obtain an access token.
	 * @param string authorizationCode
	 *  The authorizationCode needed to obtain an access token.
	 * @param Object config
	 *  The configuration object.
	 * @return Object
	 */
	accessTokenParams: function(authorizationCode, config) {
		return {
			'client_id': config.clientId,
			'client_secret': config.clientSecret,
			'code': authorizationCode,
			'grant_type': 'token',
			'redirect_uri': this.redirectURL(config.options.domain)
		};
	},


	/**
	 * Generates the URL used to obtain an access token.
	 * @param string domain
	 * @return string
	 */
	accessTokenURL: function(domain) {
		return domain + '/oauthserver/token';
	},


	/**
	 * Generates an object containing the properties
	 * needed to obtain an authorization code.
	 * @param Object config
	 *  The configuration.
	 * @return Object
	 */
	authorizationCodeParams: function (config) {
		/* FIXME: We could add a "state" parameter for better security,
		 * but I have no idea how to handle it yet.
		 */
		return {
			'client_id': config.clientId,
			'redirect_uri': this.redirectURL(config.options.domain),
			'response_type': 'code',
			'scope': config.apiScope,
			'name': config.clientName
		};
	},


	/**
	 * Generates the URL required to obtain an authorization token.
	 * @param Object config
	 * @return string
	 */
	authorizationCodeURL: function(config) {
		var path = '/oauthserver/auth',
			parameters = {},
			url = '';
		url = config.options.domain;
		url += path;
		url += '?params=';
		parameters = this.authorizationCodeParams(config);
    		Object.getOwnPropertyNames(parameters).forEach(function (name) {
			url += '&' + name + '=' + parameters[name];
		});
		return url;
	},


	/**
	 * Processes the access token data.
	 * @param string response
	 * @return Object
	 */
	parseAccessToken: function(response) {
		var parsedResponse = JSON.parse(response);
		return {
			'accessToken': parsedResponse.access_token,
			'expiresIn': parsedResponse.expires_in,
			'refreshToken': parsedResponse.refresh_token
		};
	},


	/**
	 * Finds the authorization code for this client
	 * @param string url
	 *  The redirect URI from 
	 * @return string
	 */
	parseAuthorizationCode: function(url) {
		var error = url.match(/[&\?]error=([^&]+)/);
		if (error) {
			throw 'Error getting authorization code: ' + error[1];
		}

		return url.match(/[&\?]code=([\w\/\-]+)/)[1];
	},


	/**
	 * Returns the redirect_url from the config.
	 * @param string domain
	 * @return string
	 */
	redirectURL: function (domain) {
		/**
		 * For whatever reason, phabricator's request behavior requires
		 * a params key with an empty json object. It is realllllllly 
		 * really weird.
		 */
		return domain + '/api/conduit.ping?params={}';
	}
});
