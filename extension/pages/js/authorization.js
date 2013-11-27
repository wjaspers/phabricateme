/**
 * Handles the Authorization plugin's options page.
 */
(function (ph) {
    'use strict';

    function Authorization() {
        this.defaults = {
            'client_name': '',
            'client_secret': '',
            'client_id': '',
            'update_interval': 5,
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

        var clientName = document.getElementById('clientId');
        clientName.value = (settings['client_id'] || this.defaults['client_id']);
        clientName.addEventListener('change', function () {
            settings['client_id'] = this.value;
        });

        var clientName = document.getElementById('clientName');
        clientName.value = (settings['client_name'] || this.defaults['client_name']);
        clientName.addEventListener('change', function () {
            settings['client_name'] = this.value;
        });

        var clientSecret = document.getElementById('clientSecret');
        clientSecret.value = (settings['client_secret'] || this.defaults['client_secret']);
        clientSecret.addEventListener('change', function () {
            settings['client_secret'] = this.value;
        });

        var updateInterval = document.getElementById('updateInterval');
        updateInterval.value = (settings['update_interval'] || this.defaults['update_interval']);
        updateInterval.addEventListener('change', function () {
            settings['update_interval'] = this.value;
        });

        var authMe = document.getElementById('authorize');
        authMe.addEventListener('click', function (event) {
            ph.Authorization.authorize();
            event.preventDefault();
            return false;
        });

        window.toggleVisibility(this.authorizationOptions, enabled.checked);
    };

    ph.Options.Authorization = new Authorization;
})(window.PhabricateMe);
