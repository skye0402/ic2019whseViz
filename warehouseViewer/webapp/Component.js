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

			var oModel = this.getModel("warehouseBins"),
				bRefreshed;
			var oListBinding = oModel.bindList("/Bins", undefined, undefined, undefined, {
				$select: "whseBin"
			});

			function handleChange(oEvent) {
				var aContexts = oListBinding.getContexts(0, 10),
					oData;
				if (bRefreshed) {
					oData = {
						People: aContexts.map(oContext => oContext.getObject())
					};
					oData.People.unshift({
						UserName: "Add new user"
					});
					oJSONModel.setData(oData);
				} else {
					oListBinding.attachEventOnce("change", handleChange);
				}
			}

			oListBinding.getContexts(0, 10);
			oListBinding.attachEventOnce("change", handleChange);
			oListBinding.attachEventOnce("refresh", function (oEvent) {
				oListBinding.getContexts(0, 10);
				bRefreshed = true;
			});
		}
	});
});