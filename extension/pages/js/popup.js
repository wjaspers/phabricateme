(function (ph) {
	'use strict';

	function Popup() {
		this.initialize();
	};

	Popup.prototype.initialize = function () {
		/*
		 * Allows the user to disable the popup button.
		 */
		var popupEnabled, popupOptions;
		popupEnabled = document.getElementById("popupEnabled");
		popupOptions = document.getElementById("popupOptions");
		popupEnabled.checked = false; // Where do option values come from?
		popupEnabled.addEventListener('change', function() {
			var myself = this, popup = {'popup': ''};

			if (this.checked === true) {
				popup = { 'popup' : 'pages/popup.html' };
			}

			chrome.browserAction.setPopup(popup);
			window.toggleVisibility(popupOptions, this.checked);
		});
	};

	ph.Options.Popup = new Popup();
})(window.PhabricateMe);
