sap.ui.define([
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageBox',
		"sap/ui/core/routing/History"
	],
	function (Controller, JSONModel, MessageBox, History) {
		"use strict";

		var PageController = Controller.extend("warehouseViewer.warehouseViewer.controller.Page", {

			onInit: function () {
				// create model
				var oModel = new JSONModel();
				oModel.setData({
					startDate: new Date("2019", "10", "8", "8", "0"),
					people: [{
						pic: "images/pic_3.jpg",
						name: "Albrecht, Gunter",
						role: "Manager",
						appointments: [{
							start: new Date("2019", "10", "1", "08", "30"),
							end: new Date("2019", "10", "1", "09", "30"),
							title: "Meet Max Mustermann",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "4", "10", "0"),
							end: new Date("2019", "0", "4", "12", "0"),
							title: "Team meeting",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "0", "5", "11", "30"),
							end: new Date("2019", "0", "5", "13", "30"),
							title: "Lunch",
							info: "canteen",
							type: "Type03",
							tentative: true
						}, {
							start: new Date("2019", "10", "8", "08", "30"),
							end: new Date("2019", "10", "8", "09", "30"),
							title: "Meet Max Mustermann",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "10", "0"),
							end: new Date("2019", "10", "8", "12", "0"),
							title: "Team meeting",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "11", "30"),
							end: new Date("2019", "10", "8", "13", "30"),
							title: "Lunch",
							info: "canteen",
							type: "Type03",
							tentative: true
						}, {
							start: new Date("2019", "10", "8", "13", "30"),
							end: new Date("2019", "10", "8", "17", "30"),
							title: "Skype Meeting with clients",
							info: "online meeting",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "9", "04", "00"),
							end: new Date("2019", "0", "9", "22", "30"),
							title: "Discussion of the plan",
							info: "Online meeting",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "0", "11", "08", "30"),
							end: new Date("2019", "0", "11", "09", "30"),
							title: "Meeting with the manager",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "11", "11", "30"),
							end: new Date("2019", "0", "11", "13", "30"),
							title: "Lunch",
							info: "canteen",
							type: "Type03",
							tentative: true
						}, {
							start: new Date("2019", "0", "11", "1", "0"),
							end: new Date("2019", "0", "11", "22", "0"),
							title: "Team meeting",
							info: "regular",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "0", "14", "00", "30"),
							end: new Date("2019", "0", "14", "23", "30"),
							title: "New Product",
							info: "room 105",
							type: "Type03",
							tentative: true
						}, {
							start: new Date("2019", "0", "18", "11", "30"),
							end: new Date("2019", "0", "18", "13", "30"),
							title: "Lunch",
							type: "Type03",
							tentative: true
						}, {
							start: new Date("2019", "0", "22", "10", "0"),
							end: new Date("2019", "0", "22", "12", "0"),
							title: "Team meeting",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "0", "23", "08", "30"),
							end: new Date("2019", "0", "23", "09", "30"),
							title: "Meet Max Mustermann",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "23", "10", "0"),
							end: new Date("2019", "0", "23", "12", "0"),
							title: "Team meeting",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "0", "23", "11", "30"),
							end: new Date("2019", "0", "23", "13", "30"),
							title: "Lunch",
							type: "Type03",
							tentative: true
						}, {
							start: new Date("2019", "0", "23", "13", "30"),
							end: new Date("2019", "0", "23", "17", "30"),
							title: "Discussion with clients",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "24", "10", "00"),
							end: new Date("2019", "0", "24", "11", "30"),
							title: "Discussion of the plan",
							info: "Online meeting",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "1", "3", "08", "30"),
							end: new Date("2019", "1", "4", "09", "30"),
							title: "Meeting with the manager",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "1", "4", "10", "0"),
							end: new Date("2019", "1", "4", "12", "0"),
							title: "Team meeting",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "2", "23", "10", "0"),
							end: new Date("2019", "4", "26", "12", "0"),
							title: "Working out of the building",
							type: "Type07",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}],
						headers: [{
							start: new Date("2019", "0", "15", "8", "0"),
							end: new Date("2019", "0", "15", "10", "0"),
							title: "Reminder",
							type: "Type06"
						}, {
							start: new Date("2019", "0", "15", "17", "0"),
							end: new Date("2019", "0", "15", "19", "0"),
							title: "Resource Plan",
							type: "Type06"
						}, {
							start: new Date("2019", "8", "1", "0", "0"),
							end: new Date("2019", "9", "30", "23", "59"),
							title: "New quarter",
							type: "Type10",
							tentative: false
						}, {
							start: new Date("2018", "1", "1", "0", "0"),
							end: new Date("2018", "3", "30", "23", "59"),
							title: "New quarter",
							type: "Type10",
							tentative: false
						}]
					}, {
						pic: "images/pic_2.jpg",
						name: "Yuta Kanbe",
						role: "Folklift operator",
						appointments: [{
							start: new Date("2019", "0", "10", "18", "00"),
							end: new Date("2019", "0", "10", "19", "10"),
							title: "Discussion of the plan",
							info: "Online meeting",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "0", "2", "10", "0"),
							end: new Date("2019", "0", "6", "12", "0"),
							title: "Workshop out of the country",
							type: "Type07",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "08", "00"),
							end: new Date("2019", "10", "8", "09", "00"),
							title: "Maintenance",
							info: "Garage D",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "09", "30"),
							end: new Date("2019", "10", "8", "12", "30"),
							title: "Stock-taking",
							info: "Shelf 1-35",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "12", "45"),
							end: new Date("2019", "10", "8", "14", "00"),
							title: "Lunch",
							info: "Cafeteria",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "14", "00"),
							end: new Date("2019", "10", "8", "17", "30"),
							title: "Special operation for SAP",
							info: "Include briefing",
							type: "Type07",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "17", "30"),
							end: new Date("2019", "10", "8", "18", "30"),
							title: "Meeting with Gunter",
							info: "room A",
							type: "Type10",
							tentative: false
						}, {
							start: new Date("2019", "01", "4", "10", "0"),
							end: new Date("2019", "02", "13", "12", "0"),
							title: "Team collaboration",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "3", "01", "10", "0"),
							end: new Date("2019", "3", "31", "12", "0"),
							title: "Workshop out of the country",
							type: "Type07",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "4", "01", "10", "0"),
							end: new Date("2019", "4", "31", "12", "0"),
							title: "Out of the office",
							type: "Type08",
							tentative: false
						}, {
							start: new Date("2019", "7", "1", "0", "0"),
							end: new Date("2019", "7", "31", "23", "59"),
							title: "Vacation",
							info: "out of office",
							type: "Type04",
							tentative: false
						}],
						headers: [{
							start: new Date("2019", "10", "8", "9", "0"),
							end: new Date("2019", "10", "8", "10", "0"),
							title: "Move",
							type: "Type06"
						}]
					}, {
						pic: "images/pic_4.jpg",
						name: "Mizutani, Shigefumi",
						role: "Warehouse worker",
						appointments: [{
							start: new Date("2019", "10", "8", "08", "30"),
							end: new Date("2019", "10", "8", "09", "30"),
							title: "Work Prep",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "09", "30"),
							end: new Date("2019", "10", "8", "10", "30"),
							title: "Team MTG",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "10", "30"),
							end: new Date("2019", "10", "8", "12", "30"),
							title: "Product Pick-up ",
							info: "Shelf 1-15",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "12", "30"),
							end: new Date("2019", "10", "8", "13", "30"),
							title: "Lunch",
							info: "Cafeteria",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "13", "30"),
							end: new Date("2019", "10", "8", "16", "00"),
							title: "Stock-taking ",
							info: "Shelf 20-25",
							type: "Type07",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "16", "30"),
							end: new Date("2019", "10", "8", "18", "30"),
							title: "Briefing for new picking process",
							info: "room 3",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "10", "9", "0", "0"),
							end: new Date("2019", "10", "9", "23", "59"),
							title: "Vacation",
							info: "out of office",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "0", "10", "1", "0"),
							end: new Date("2019", "0", "11", "22", "0"),
							title: "Workshop",
							info: "regular",
							type: "Type07",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "0", "12", "08", "30"),
							end: new Date("2019", "0", "12", "18", "30"),
							title: "Meet John Doe",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "12", "10", "0"),
							end: new Date("2019", "0", "12", "16", "0"),
							title: "Team meeting",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "0", "12", "07", "00"),
							end: new Date("2019", "0", "12", "17", "30"),
							title: "Discussion with clients",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "13", "0", "0"),
							end: new Date("2019", "0", "13", "23", "59"),
							title: "Vacation",
							info: "out of office",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "0", "22", "07", "00"),
							end: new Date("2019", "0", "27", "17", "30"),
							title: "Discussion with clients",
							info: "out of office",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "2", "6", "9", "0"),
							end: new Date("2019", "2", "10", "10", "0"),
							title: "Payment week",
							type: "Type06"
						}, {
							start: new Date("2019", "03", "3", "0", "0"),
							end: new Date("2019", "05", "9", "23", "59"),
							title: "Vacation",
							info: "out of office",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "07", "1", "0", "0"),
							end: new Date("2019", "09", "31", "23", "59"),
							title: "New quarter",
							type: "Type10",
							tentative: false
						}],
						headers: [{
							start: new Date("2019", "0", "16", "0", "0"),
							end: new Date("2019", "0", "16", "23", "59"),
							title: "Private",
							type: "Type05"
						}]
					}, {
						pic: "images/pic_5.jpg",
						name: "Haruyuki Kobayashi",
						role: "Warehouse worker",
						appointments: [{
							start: new Date("2019", "10", "8", "08", "30"),
							end: new Date("2019", "10", "8", "09", "30"),
							title: "Work Prep",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "09", "30"),
							end: new Date("2019", "10", "8", "10", "30"),
							title: "Team MTG",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "10", "30"),
							end: new Date("2019", "10", "8", "12", "30"),
							title: "Product Pick-up ",
							info: "Shelf 1-15",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "12", "30"),
							end: new Date("2019", "10", "8", "13", "30"),
							title: "Lunch",
							info: "Cafeteria",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "13", "30"),
							end: new Date("2019", "10", "8", "16", "00"),
							title: "Stock-taking ",
							info: "Shelf 20-25",
							type: "Type07",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "10", "8", "16", "30"),
							end: new Date("2019", "10", "8", "18", "30"),
							title: "Briefing for new picking process",
							info: "room 3",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "12", "10", "0"),
							end: new Date("2019", "0", "12", "16", "0"),
							title: "Team meeting",
							info: "room 1",
							type: "Type01",
							pic: "sap-icon://sap-ui5",
							tentative: false
						}, {
							start: new Date("2019", "0", "12", "07", "00"),
							end: new Date("2019", "0", "12", "17", "30"),
							title: "Discussion with clients",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "0", "13", "0", "0"),
							end: new Date("2019", "0", "13", "23", "59"),
							title: "Vacation",
							info: "out of office",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "0", "15", "07", "00"),
							end: new Date("2019", "0", "20", "17", "30"),
							title: "Discussion with clients",
							info: "out of office",
							type: "Type02",
							tentative: false
						}, {
							start: new Date("2019", "2", "13", "9", "0"),
							end: new Date("2019", "2", "17", "10", "0"),
							title: "Payment week",
							type: "Type06"
						}, {
							start: new Date("2019", "03", "10", "0", "0"),
							end: new Date("2019", "05", "16", "23", "59"),
							title: "Vacation",
							info: "out of office",
							type: "Type04",
							tentative: false
						}, {
							start: new Date("2019", "07", "1", "0", "0"),
							end: new Date("2019", "09", "31", "23", "59"),
							title: "New quarter",
							type: "Type10",
							tentative: false
						}],
						headers: [{
							start: new Date("2019", "0", "16", "0", "0"),
							end: new Date("2019", "0", "16", "23", "59"),
							title: "Private",
							type: "Type05"
						}]
					}]
				});
				this.getView().setModel(oModel);

			},

			handleAppointmentSelect: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment"),
					sSelected;
				if (oAppointment) {
					sSelected = oAppointment.getSelected() ? "selected" : "deselected";
					MessageBox.show("'" + oAppointment.getTitle() + "' " + sSelected + ". \n Selected appointments: " + this.byId("PC1").getSelectedAppointments()
						.length);
				} else {
					var aAppointments = oEvent.getParameter("appointments");
					var sValue = aAppointments.length + " Appointments selected";
					MessageBox.show(sValue);
				}
			},

			handleSelectionFinish: function (oEvent) {
				var aSelectedKeys = oEvent.getSource().getSelectedKeys();
				this.byId("PC1").setBuiltInViews(aSelectedKeys);
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