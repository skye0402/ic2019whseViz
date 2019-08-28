/*global QUnit*/

sap.ui.define([
	"warehouseViewer/warehouseViewer/controller/whseView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("whseView Controller");

	QUnit.test("I should test the whseView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});