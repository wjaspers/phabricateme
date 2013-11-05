/**
 * Rudimentary URI object for ensuring URL's 
 * are built/processed in a sane manner.
 */
(function () {
	'use strict';

	/**
	 * Creates a Uri object.
	 *
	 * @param string value
	 *  Optional argument to immediately convert a URI into this object.
	 */	
	function Uri(value) {
		this.fragment = undefined;
		this.hostname = undefined;
		this.password = undefined;
		this.pathname = undefined;
		this.port = undefined;
		this.protocol = undefined;
		this.query = undefined;
		this.username = undefined;
		if ('undefined' !== typeof value) {
			this.parse(value);
		}
	};


	/**
	 * Breaks the URI down into known components.
	 * @param string value
	 * @return Uri
	 */
	Uri.prototype.parse = function (value) {
		var authentication, domainAndPort, parts = [];

		// Process the #fragment
		parts = value.split('#');
		if (parts.length > 1) {
			this.fragment = decodeURIComponent(parts[1]);
			value = value.replace('#' + parts[1], '');
		}

		// Process the ?query[]=x
		parts = value.split('?');
		if (parts.length > 1) {
			this.query = decodeURIComponent(parts[1]);
			value = value.replace('?' + parts[1], '');
		}

		// Process <protocol>://
		parts = value.split('://');
		if (parts.length > 1) {
			this.protocol = parts[0];
			value = value.replace(this.protocol + '://', '');
		}


		// Process <username>:<password>@
		authentication = value.split('@');
		if (authentication.length > 1) {
			var authParts = authentication[0].split(':');
			if (authParts[0].length) {
				this.username = decodeURIComponent(authParts[0]);
			}
			if (authParts.length > 1) {
				this.password = decodeURIComponent(authParts[1]);
			}
			value = value.replace(authentication[0] + '@', '');
		}

		// Process <domain>:<port>/<pathname>
		parts = value.split('/');
		domainAndPort = parts[0].split(':');
		value = value.replace(parts[0], '');
		this.hostname = domainAndPort[0];
		if (domainAndPort.length > 1) {
			if (isPortValid(domainAndPort[1])) {
				this.port = domainAndPort[1];
			}
		}

		/* I'm not thrilled to add this magic behavior, but chrome
		 * doesn't appear to handle manually setting 
		 * <a>.port = undefined or <a>.port = null correctly.
		 */
		if (this.protocol && ! +this.port) {
			this.port = this.fetchDefaultPortForProtocol(this.protocol);
		}

		// All that should remain is the path
		this.pathname = decodeURIComponent(value);
		this.pathname = Uri.sanitizePath(this.pathname);
		return this;
	};


	/**
	 * Converts all the parts back into a valid URI.
	 * @return string
	 * @throws Error
	 *  If a hostname isn't present.
	 */
	Uri.prototype.toString = function () {
		var out = '';
		if (this.protocol) {
			out += this.protocol + '://';
		}
		if (this.username) {
			out += this.username;
		}
		if (this.password) {
			out += ':' + this.password;
		}
		if (this.username || this.password) {
			out += '@';
		}
		if (this.hostname) {
			out += this.hostname;
		}
		if (isPortValid(this.port)) {
			out += ':' + this.port;
		}
		if (this.pathname) {
			out += this.pathname;
		}
		if (this.query) {
			out += '?' + makeQuery(this.query);
		}
		if (this.fragment) {
			out += '#' + encodeURIComponent(this.fragment);
		}
		return out;
	};


	/**
	 * @param string protocol
	 * @return int
	 */
	Uri.prototype.fetchDefaultPortForProtocol = function (protocol) {
		switch (protocol.toLowerCase()) {
			case 'https':
				return 443;
			case 'http':
			default:
				return 80;
		};
	};


	/**
	 * Cleans the path passed to this method.
	 * @param string url
	 * @return string
	 */
	Uri.sanitizePath = function (value) {
		return value.replace(/\/\/+/g, '/');
	};


	/**
	 * @param int port
	 * @return boolean
	 */
	function isPortValid (port) {
		if (+port > 0) {
			if (port > 65535) {
				return false;
			}

			return true;
		}

		return false;
	};


	/**
	 * Converts an object of property: value pairs
	 * into a query string.
	 *
	 * @param Object object
	 * @return string
	 */
	function makeQuery (object) {
		var out = [];

		// Welp, nothing we can do.
		if ('string' === typeof object) {
			return object;
		}

		Object.getOwnPropertyNames(object).forEach(function (name) {
			var component = '', value = query[name];
			component += encodeUriComponent(name) + '=' + encodeUriComponent(value);
			out.push(component);
		});
		return out.join('&');
	};

	window.Uri = Uri;
})(window);
