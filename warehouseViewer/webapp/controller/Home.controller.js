sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("warehouseViewer.warehouseViewer.controller.Home", {

		PressTile1: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("warehouse");
		},
		
		PressTile2: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("page");
		},

		PressTile3: function () {
			var oRouter =  sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("grid");
		},

		onTilePressed2: function () {
			sap.m.URLHelper.redirect("https://www.orange-book.com", true);
		}

	});
});