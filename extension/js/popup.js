/**
 * Functionality specific to the browser button.
 */
(function(ph, uri) {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        ph.fetchPlugin('Settings', function (plugin) {
            plugin.initialize(function (settings) {
                var shortcuts = settings.Shortcuts;
                ph.fetchPlugin('Popup', function () {
                    ph.fetchPlugin('Shortcuts', function (plugin) {
                        var domain = ph.Settings.domain, uri;
                        uri = new Uri(domain);
                        makeLinks(plugin.getAllLinks(), shortcuts, uri);
                    });
                });

            });
        });
    });

    function makeLinks(shortcutsList, shortcuts, uri) {
        if ('string' === typeof uri) {
            uri = new Uri(uri);
        }
        var links = document.getElementsByClassName('shortcut-preview');
        Object.keys(shortcuts).forEach(function (name) {
            var link, linkText;
            if ('undefined' !== typeof shortcutsList[name]) {
                linkText = document.createTextNode(shortcutsList[name].title);
                link = document.createElement('a');
                link.className = 'shortcut';
                link.target = "_blank";
                link.rel = name;
                link.appendChild(linkText);
                link.protocol = uri.protocol;
                if (uri.port) {
                    link.port = uri.port;
                } else {
                    // FIXME: This is a bug in chrome
                    delete link.port;
                }
                link.title = shortcutsList[name].tip;
                link.hostname = uri.hostname;
                link.pathname = Uri.sanitizePath(uri.pathname + shortcutsList[name].href);
                document.body.appendChild(link);
            }
        });
    };

})(window.PhabricateMe, window.Uri);
