/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"DUMMYV4/DUMMYV4/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});