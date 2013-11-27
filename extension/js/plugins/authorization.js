(function (ph) {
    'use strict';

    function Authorization() {
        this.adapter = null;
    };


    /**
     * Attempts to make an OAuth2 authorization against your Phabricator instance.
     * @param Closure callback
     */
    Authorization.prototype.authorize = function (callback) {
        var self = this;
        this.initialize(function () {
            self.adapter.authorize(function () {
                var accessToken = self.adapter.getAccessToken();
                if (callback) {
                    callback.apply(self);
                }
            });
        });
    };


    /**
     * Checks if we have an access token.
     * @return boolean
     */
    Authorization.prototype.isAuthorized = function () {
        return this.adapter.hasAccessToken();
    };


    Authorization.prototype.getAccessToken = function () {
        if (this.isAuthorized()) {
            this.adapter.getAccessToken();
        }

        return undefined;
    };

    /**
     * Instantiates a new OAuth2 adapter.
     */
    Authorization.prototype.initialize = function (callback) {
        var self = this;
        ph.Settings.load(function (settings) {
            var domain = settings.domain, configuration = settings.Authorization;
            configuration = {
                'client_id': configuration['client_id'],
                'client_secret': configuration['client_secret'],
                'client_name': configuration['client_name'],
                'api_scope': 'offline_access',
                'options': {
                    'domain': domain
                }
            };
            self.adapter = new OAuth2('phabricator', configuration);
            if (callback) {
                callback.apply(self);
            }
        });
    };


    ph.Authorization = new Authorization;
})(window.PhabricateMe);
