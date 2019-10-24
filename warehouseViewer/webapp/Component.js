sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"warehouseViewer/warehouseViewer/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("warehouseViewer.warehouseViewer.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// Prepare the OData Model for storage bins
			var oModel = this.getModel("warehouseBins"),
				bRefreshed;
			var oListBinding = oModel.bindList("/Bins", undefined, undefined, undefined, {
				$select: "whseNo"
			});
			
			var oJSONModel = this.getModel("whseBinsJSON");
			
			function handleChangeB(oEvent) {
				var aContexts = oListBinding.getContexts(0, Infinity), //get all bin entries
					oData;
				if (bRefreshed) {
					oData = {
						WhseBins: aContexts.map(oContext => oContext.getObject())
					};
					oJSONModel.setData(oData);
				} else {
					oListBinding.attachEventOnce("change", handleChangeB);
				}
			}

			oListBinding.getContexts(0, Infinity);
			oListBinding.attachEventOnce("change", handleChangeB);
			oListBinding.attachEventOnce("refresh", function (oEvent) {
				oListBinding.getContexts(0, Infinity);
				bRefreshed = true;
			});
			
			// Prepare the OData Model for storage bin types
			var oModelT = this.getModel("warehouseBinTypes"),
				bRefreshedT;
			var oListBindingT = oModelT.bindList("/BinTypes", undefined, undefined, undefined, {
				$select: "whseNo"
			});
			var oJSONBinTypes = this.getModel("whseBinTypesJSON");

			function handleChangeT(oEvent) {
				var aContexts = oListBindingT.getContexts(0, Infinity), //get all entries
					oData;
				if (bRefreshedT) {
					oData = {
						WhseBinTypes: aContexts.map(oContext => oContext.getObject())
					};
					oJSONBinTypes.setData(oData);
				} else {
					oListBindingT.attachEventOnce("change", handleChangeT);
				}
			}
			oListBindingT.getContexts(0, Infinity);
			oListBindingT.attachEventOnce("change", handleChangeT);
			oListBindingT.attachEventOnce("refresh", function (oEvent) {
				oListBindingT.getContexts(0, Infinity);
				bRefreshedT = true;
			});
		}
	});
});