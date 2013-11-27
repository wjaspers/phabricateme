/**
 * Functionality strictly for the extension's options page.
 */
(function (ph, uri) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        ph.fetchPlugin('Options', function () {
            ph.Settings.load(function () {
                /**
                 * Listen for changes to the domain.
                 */
                var domain = document.getElementById("domain");
                domain.addEventListener('change', function () {
                    var links = [], uri = new Uri(this.value);
                    ph.Settings.domain = uri.toString();
                    this.value = ph.Settings.domain;
                    updateLinks(uri);
                });

                if (ph.Settings.domain) {
                    domain.value = ph.Settings.domain;
                    updateLinks(domain.value);
                }

                ph.Options.fetchPlugin('Authorization');
                ph.Options.fetchPlugin('Popup');
                ph.Options.fetchPlugin('Shortcuts', function (plugin) {
            var list = ph.Shortcuts.getAllLinks();
            plugin.initialize(list);
            domain.addEventListener('change', function () {
                var uri = new Uri(this.value);
                plugin.updateLinks(uri);
            });
                   
            if (ph.Settings.domain) { 
                plugin.updateLinks(ph.Settings.domain);
            }
                });


                /**
                 * Bind a handler to the "save" button.
                 */
                document.getElementById("save").addEventListener('click', function (event) {
                    ph.Settings.save(function() {
                        alert("Settings saved!");
                    });
                    event.preventDefault();
                    return false;
                });


                /*
                 * Allow the user to wipe extension data.
                 */
                document.getElementById("terminate").addEventListener('click', function (event) {
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
    });

    /**
     * Helper for controlling element visibility.
     * If I ever add a 3rd party js library this will probably go away.
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

    window.updateLink = function updateLink (link, uri) {
        if ('string' === typeof uri) {
            uri = new Uri(uri);
        }

        link.protocol = uri.protocol;
        if (uri.port) {
            link.port = uri.port;
        } else {
            // FIXME: This is a bug in chrome
            delete link.port;
        }

        link.hostname = uri.hostname;
        link.pathname = Uri.sanitizePath(uri.pathname + link.pathname);
    };

    window.updateLinks = function updateLinks (uri) {
        var links;
        if ('string' === typeof uri) {
            uri = new Uri(uri);
        }

        links = document.getElementsByClassName('preview');
        Object.keys(links).forEach(function (link) {
            window.updateLink(links[link], uri);	
        });
    };
})(window.PhabricateMe, window.Uri);
