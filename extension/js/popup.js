/**
 * Functionality specific to the browser button.
 */
(function() {
	/**
	 * Wait for the popup's DOM to be ready.
	 */
	document.addEventListener('DOMContentLoaded', function () {
		chrome.storage.local.get(function (options) {
		});
		chrome.runtime.getBackgroundPage(function (page) {	
		});
	});
})(window);
