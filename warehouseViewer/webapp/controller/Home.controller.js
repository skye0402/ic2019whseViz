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
			sap.m.URLHelper.redirect("https://help.sap.com/viewer/product/SAP_EXTENDED_WAREHOUSE_MANAGEMENT/9.5.0.2/en-US", true);
		}

	});
});