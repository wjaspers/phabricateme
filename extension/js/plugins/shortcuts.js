(function (ph) {
	'use strict';

	/**
	 * Links to display in the popup.
	 */
	var links = {
		"audits": {
			"href": "/audit",
			"tip": "Tell 'em like it is.",
			"title": "Audit Code"
		},
		"tasks": {
			"href": "/maniphest",
			"tip": "Did you get your chores done?",
			"title": "Open Tasks"
		},
		"flags": {
			"href": "/flag",
			"tip": "Give post-it notes a run for their money.",
			"title": "Review Flags"
		},
		"problems": {
			"href": "/audit",
			"tip": "Or just use the force.",
			"title": "Fix Problems"
		},
		"create-task": {
			"href": "/maniphest/task/create",
			"tip": "I AM THE DELEGATOR!",
			"title": "Create a Task"
		},
		"phame": {
			"href": "/phame",
			"tip": "Hear your thoughts roar.",
			"title": "Blog"
		},
		"pholio": {
			"href": "/pholio",
			"tip": "Show it off!",
			"title": "Portfolio"
		},
		"ponder": {
			"href": "/ponder",
			"tip": "Not the quarterback...",
			"title": "Q & A"
		},
		"conpherence": {
			"href": "/conpherence",
			"tip": "Does anyone know the call-in number?",
			"title": "Conferencing"
		},
		"chatlog": {
			"href": "/chatlog",
			"tip": "What were we arguing about again?",
			"title": "Chat Log"
		},
		"calendar": {
			"href": "/calendar",
			"tip": "When was that going to be done again?",
			"title": "Calendar"
		},
		"diviner": {
			"href": "/diviner",
			"tip": "Its whats for dinner.",
			"title": "Documentation"
		},
		"feed": {
			"href": "/feed",
			"tip": "NOM NOM NOM",
			"title": "Feed"
		},
		"drydock": {
			"href": "/drydock",
			"tip": "",
			"title": "Drydock"
		},
		"fact": {
			"href": "/fact",
			"tip": "It is a statement of fact.",
			"title": "Facts"
		},
		"paste": {
			"href": "/paste",
			"tip": "I'm only gonna say this once...",
			"title": "Share a Snippet"
		},
		"file": {
			"href": "/file/upload",
			"tip": "Why isn't this in the repository?",
			"title": "Upload a File"
		},
		"wiki": {
			"href": "/w",
			"tip": "Wikka wikka wiiiiiiiki!",
			"title": "Wiki"
		},
		"diff": {
			"href": "/differential/diff/create",
			"tip": "You weren't really about to commit that, were you?",
			"title": "Share a Diff"
		},
		"personnel": {
			"href": "/people",
			"tip": "Keep track of the kids.",
			"title": "Personnel"
		},
		"countdown": {
			"href": "/countdown",
			"tip": "Are we there yet?",
			"title": "Timers"
		},
		"projects": {
			"href": "/project/filter/all",
			"tip": "",
			"title": "Projects"
		},
		"slowvote": {
			"href": "/vote",
			"tip": "Because designing by committee always works.",
			"title": "Slowvote"
		},
		"daemons": {
			"href": "/daemon",
			"tip": "MAAAAAAAT DAAAAAAMON",
			"title": "Daemon Management"
		},
		"repository": {
			"href": "/repository",
			"tip": "Manage managed files.",
			"title": "Repositories"
		},
		"token": {
			"href": "/token",
			"tip": "Ring?",
			"title": "Tokens"
		}
	};


	function Shortcuts() {
		this.initialize();
	};


	/**
	 * Returns the map of links we have defined.
	 * @return Object
	 */
	Shortcuts.prototype.getAllLinks = function () {
		return links;
	};


	Shortcuts.prototype.fetchDefinition = function (name) {
		return this.getAllLinks()[name] || undefined;
	};


	/**
	 * Tasks to perform when the plugin starts up.
	 * @return Shortcuts
	 */
	Shortcuts.prototype.initialize = function () {
		chrome.runtime.onMessage.addListener(this.onMessage);
		chrome.alarms.onAlarm.addListener(this.onAlarm);
	};


	Shortcuts.prototype.onAlarm = function () {
		console.log('Shortcuts alarm was triggered');
		console.log(arguments);
	};

	
	Shortcuts.prototype.onMessage = function (message) {
		console.log('Shortcuts plugin received message');
		console.log(arguments);
	};

	
	ph.Shortcuts = new Shortcuts;
})(window.PhabricateMe);
