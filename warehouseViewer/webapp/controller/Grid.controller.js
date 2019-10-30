sap.ui.define([
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	],
	function (MessageToast, Controller, JSONModel) {
		"use strict";

		var PageController = Controller.extend("warehouseViewer.warehouseViewer.controller.Grid", {
			onInit: function () {
				var sPath = jQuery.sap.getModulePath("warehouseViewer.warehouseViewer", "/TaskData.json");
				this.oModel = new JSONModel(sPath);
				this.getView().setModel(this.oModel);
			},
			press: function (oEvent) {
				MessageToast.show("The radial micro chart is pressed.");
			}
		});

		return PageController;
	});
