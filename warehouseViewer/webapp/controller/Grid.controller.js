sap.ui.define([
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		"sap/ui/core/routing/History"
	],
	function (MessageToast, Controller, JSONModel, History) {
		"use strict";

		var PageController = Controller.extend("warehouseViewer.warehouseViewer.controller.Grid", {
			onInit: function () {
				var sPath = jQuery.sap.getModulePath("warehouseViewer.warehouseViewer", "/TaskData.json");
				this.oModel = new JSONModel(sPath);
				this.getView().setModel(this.oModel);
			},
			press: function (oEvent) {
				MessageToast.show("The radial micro chart is pressed.");
			},
			onNavBack: function () {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("home", true);
				}
			}
		});

		return PageController;
	});