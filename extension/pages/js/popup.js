(function (ph) {
	'use strict';

	function Popup() {
		this.initialize();
	};

	Popup.prototype.initialize = function () {
		var popupEnabled, popupOptions, settings = ph.Settings.get('Popup');
		popupEnabled = document.getElementById("popupEnabled");
		popupOptions = document.getElementById("popupOptions");

		popupEnabled.addEventListener('change', function() {
			var path, self = this;
			ph.Settings.Popup.enabled = this.checked;
			path = this.checked ? 'pages/popup.htm' : '';
			setPopupLocation(path);
			window.toggleVisibility(popupOptions, this.checked);
		});

		popupEnabled.checked = settings.enabled || false;
		window.toggleVisibility(popupOptions, popupEnabled.checked);
	};

	function setPopupLocation (path) {
		var def = {};
		def.popup = path;
		chrome.browserAction.setPopup(def);
	};

	ph.Options.Popup = new Popup();
})(window.PhabricateMe);
