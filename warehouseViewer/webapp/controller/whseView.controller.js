jQuery.sap.registerModulePath('ext.GLTFLoader', './resources/js/GLTFLoader');

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/model/odata/v4/ODataModel",
	"ext/GLTFLoader",
	"sap/ui/core/routing/History"
], function (Controller, MessageToast, ContentResource, ContentConnector, threejs, ODataModel, GLTFLoader, History) {
	"use strict";

	// ----------- Get i18n model -----------------------------------
	var oResourceBundle;
	// ----------- Resources and their location----------------------
	var oPromiseContexts;
	var oJSONResources;
	var oListBindingResources;
	var oModelResources;
	var bRequestComplete = true;
	// ----------- Collision indicator
	var sCollision = "None";

	// ----------- Threejs functions and variables ------------------
	var oCamera, oScene, oRenderer, oHemiLight;
	// var oBulbMat, oCubeMat, oFloorMat, oTextMat;

	var params = {
		shadows: true,
		exposure: 0.68
	};

	var oThreejsScene; // Used to take the reference to the scene
	var oViewerReference; // Reference to the viewer

	// Not nice but only called if the data is not yet loaded
	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds) {
				break;
			}
		}
	}

	//--- Load fonts, create TextGeometry and hand it back to callin function
	function create3DText(sFontName, sFontWeight, sText, sSize, sHeight, sCurveSegments, sBevelThickness, sBevelSize, sBevelEnabled) {
		var oLoader = new THREE.FontLoader();

		return new Promise(resolve => {
			oLoader.load("resources/fonts/" + sFontName + '_' + sFontWeight + ".typeface.json",
				// onLoad callback (called when load has been completed)
				function (oFont) {
					let o3DText = new THREE.TextGeometry(sText, {
						font: oFont,
						size: sSize,
						height: sHeight,
						curveSegments: sCurveSegments,
						bevelThickness: sBevelThickness,
						bevelSize: sBevelSize,
						bevelEnabled: sBevelEnabled,
						material: 0,
						extrudeMaterial: 1
					});
					resolve(o3DText);
				});
		});
	}

	async function initScene(binData, binTypeData) {
		oCamera = new THREE.PerspectiveCamera(50, 1.6, 0.1, 100);
		oCamera.position.x = 4;
		oCamera.position.z = -4;
		oCamera.position.y = 2;
		oScene = new THREE.Scene();
		oScene.name = "Warehouse";

		// create ceiling lights
		var bulbX = -10;
		var bulbZ = -5;
		var bX = bulbX;
		var bZ = bulbZ;
		var bulbStepX = 3;
		var bulbStepZ = 3;
		var bulbStepRes = 3;

		for (var i = 1; i < 4; i++) {
			var oBulbGeometry = new THREE.SphereBufferGeometry(0.02, 16, 8);
			var oBulbLight = new THREE.PointLight(0xffeeaa, 1, 100, 2);
			oBulbLight.name = "Warehouse Light ".concat(i.toString());
			var oBulbMat = new THREE.MeshStandardMaterial({
				emissive: 0xeeeeee,
				emissiveIntensity: 0.2,
				color: 0x000000
			});
			oBulbLight.add(new THREE.Mesh(oBulbGeometry, oBulbMat));
			oBulbLight.position.set(bX * -1, 8, bZ);
			oBulbLight.castShadow = true;
			oScene.add(oBulbLight);
			bX = bX + bulbStepX;
			if ((i % 3) == 0) {
				bX = bulbX
				bZ = bZ + bulbStepZ;
			}
		}

		var oHemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
		oHemiLight.name = "Surrounding light";
		oScene.add(oHemiLight);
		var oFloorMat =
			new THREE.MeshStandardMaterial({
				roughness: 0.9,
				color: 0xAAAAAA,
				metalness: 0.1,
				bumpScale: 0.0005
			});
		var textureLoader = new THREE.TextureLoader();
		textureLoader.load("resources/textures/hardwood2_diffuse.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(20, 48);
			oFloorMat.map = map;
			oFloorMat.needsUpdate = true;
		});
		textureLoader.load("resources/textures/hardwood2_bump.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(20, 48);
			oFloorMat.bumpMap = map;
			oFloorMat.needsUpdate = true;
		});
		textureLoader.load("resources/textures/hardwood2_roughness.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(20, 48);
			oFloorMat.roughnessMap = map;
			oFloorMat.needsUpdate = true;
		});
		var oBinBlockMat = new THREE.MeshStandardMaterial({
			roughness: 0.7,
			color: 0xAAAAAA,
			bumpScale: 0.002,
			metalness: 0.2
		});
		var oBinFullMat = new THREE.MeshStandardMaterial({
			roughness: 0.7,
			color: 0xff7777,
			bumpScale: 0.002,
			metalness: 0.2
		});
		var oBinEmptyMat = new THREE.MeshStandardMaterial({
			roughness: 0.7,
			color: 0xffffff,
			bumpScale: 0.002,
			metalness: 0.2,
			transparent: true,
			wireframe: true,
			opacity: 0.4
		});
		var oBinFillMat = new THREE.MeshStandardMaterial({
			roughness: 0.7,
			color: 0x88ff88,
			bumpScale: 0.002,
			metalness: 0.5
		});

		var oFloorGeometry = new THREE.PlaneBufferGeometry(14.6, 10);
		var oFloorMesh = new THREE.Mesh(oFloorGeometry, oFloorMat);
		oFloorMesh.name = "Warehouse floor";
		oFloorMesh.receiveShadow = true;
		oFloorMesh.rotation
			.x = -Math.PI / 2.0;
		oScene.add(oFloorMesh);

		// Check if the data is loaded from OData Model
		/*		if (binData === undefined) {
					sleep(1000); // Yea, this is not nice...
				}*/
		// Create bin visualization from EWM Masterdata
		for (i = 0; i < binData.length; i++) {
			var oStorageBin = binData[i];
			// Now search the bin type data
			/*			binTypeData = [{
							"whseNo": "SG01",
							"binType": "ST01",
							"maxLength": "0.58",
							"maxWidth": 0.32,
							"maxHeight": 0.58,
							"unit": "M",
							"texture": "undefined"
						}];*/
			var binType;
			$.each(binTypeData, function (i, v) {
				if (v.whseNo == oStorageBin.whseNo && v.binType == oStorageBin.binType) {
					binType = v; // Found the storage bin type
					return;
				}
			});

			//changed the texture of bins
			let oBinMap = undefined;

			function loadBinTexture(binType) {
				return new Promise(resolve => {
					var oMap = undefined;
					textureLoader.load("resources/textures/" + binType.texture, function (map) {
						map.wrapS = THREE.RepeatWrapping;
						map.wrapT = THREE.RepeatWrapping;
						map.anisotropy = 4;
						map.repeat.set(1, 1);
						oMap = map;
						resolve(oMap);
					});
				});
			}
			oBinMap = await loadBinTexture(binType);

			// To change the vizualization of bins
			var boxGeometry = new THREE.BoxBufferGeometry(binType.maxLength, binType.maxHeight, binType.maxWidth);
			let oBinMesh = undefined;
			var bNormal = false;
			if (oStorageBin.indFull == "X") {
				oBinFullMat.map = oBinMap;
				oBinFullMat.needsUpdate = true;
				oBinMesh = new THREE.Mesh(boxGeometry, oBinFullMat);
			} else if (oStorageBin.remBlk == "X" || oStorageBin.putBlk == "X" || oStorageBin.invBlk == "X") {
				oBinBlockMat.map = oBinMap;
				oBinBlockMat.needsUpdate = true;
				oBinMesh = new THREE.Mesh(boxGeometry, oBinBlockMat);
			} else if (oStorageBin.indEmpty == "X") {
				oBinMesh = new THREE.Mesh(boxGeometry, oBinEmptyMat);
			} else { // in between full and empty
				var oBinGroup = new THREE.Group;
				var fillHeight = binType.maxHeight * (oStorageBin.freeCap / oStorageBin.maxCap);
				boxGeometry = new THREE.BoxBufferGeometry(binType.maxLength, fillHeight, binType.maxWidth);
				oBinFillMat.map = oBinMap;
				oBinFillMat.needsUpdate = true;
				let oBinMesh1 = new THREE.Mesh(boxGeometry, oBinFillMat);
				oBinMesh1.position.set(0, 0 - binType.maxHeight / 2 + fillHeight / 2, 0);
				oBinMesh1.castShadow = true;
				oBinGroup.add(oBinMesh1);
				boxGeometry = new THREE.BoxBufferGeometry(binType.maxLength, binType.maxHeight - fillHeight, binType.maxWidth);
				let oBinMesh2 = new THREE.Mesh(boxGeometry, oBinEmptyMat);
				oBinMesh2.position.set(0, 0 - binType.maxHeight / 2 + fillHeight + (binType.maxHeight - fillHeight) / 2, 0);
				oBinMesh2.castShadow = true;
				oBinGroup.add(oBinMesh2);
				oBinGroup.name = oStorageBin.binNo;
				oBinGroup.position.set(parseFloat(oStorageBin.xC), parseFloat(oStorageBin.zC) + 0.1, parseFloat(oStorageBin.yC));
				oScene.add(oBinGroup);
				bNormal = true; // Bin is filled to some extent
			};
			if (bNormal == false) {
				oBinMesh.position.set(parseFloat(oStorageBin.xC), parseFloat(oStorageBin.zC) + 0.1, parseFloat(oStorageBin.yC));
				oBinMesh.castShadow = true;
				oBinMesh.name = oStorageBin.binNo;
				oScene.add(oBinMesh);
			}
			bNormal = false;
		}

		oRenderer = new THREE.WebGLRenderer();
		oRenderer.physicallyCorrectLights = true;
		oRenderer.gammaInput = true;
		oRenderer.gammaOutput = true;
		oRenderer.shadowMap.enabled = true;
		oRenderer.toneMapping = THREE.ReinhardToneMapping;
		oRenderer.setPixelRatio(window.devicePixelRatio);
	}

	async function initResources(resourceData) {
		// Load 3D models asynchronous based on the data provided
		var oLoader = new THREE.GLTFLoader();

		var oTextMat = new THREE.MeshStandardMaterial({
			roughness: 0.2,
			color: 0xAAFFAA,
			bumpScale: 0.01,
			metalness: 0.8
		});
		var oTextMatCol = new THREE.MeshStandardMaterial({
			roughness: 0.4,
			color: 0xFF7777,
			bumpScale: 0.01,
			metalness: 0.5
		});

		// Collision detection indicator
		let o3DTextGCol = await create3DText("helvetiker", "bold", "ALERT!", 10, 2, 8, 2, 0.3, true);
		let o3DTextCol = new THREE.Mesh(o3DTextGCol, oTextMatCol);
		o3DTextCol.scale.set(0.2, 0.2, 0.2);
		o3DTextCol.name = "ALERT";
		o3DTextCol.position.x = 4.5;
		o3DTextCol.position.y = 1.5;
		o3DTextCol.position.z = 0;
		o3DTextCol.rotation.y = Math.PI;
		o3DTextCol.visible = false;
		oScene.add(o3DTextCol);
		// --- End of collision detection indicator

		// Loop over the resources
		for (let oResource of resourceData) {
			let o3DTextGeo = await create3DText("helvetiker", "regular", oResource.rsrc, 10, 2, 8, 2, 0.3, true); // The 3D Name of our resource

			let o3DText = new THREE.Mesh(o3DTextGeo, oTextMat);
			o3DText.scale.set(0.03, 0.03, 0.03);
			o3DText.geometry.center();
			o3DText.position.x = parseFloat(oResource.x);
			o3DText.position.y = parseFloat(oResource.z) + 2;
			o3DText.position.z = parseFloat(oResource.y);
			o3DText.rotation.y = Math.PI;

			let sModelName = "resources/" + oResource.model3D + ".gltf";
			oLoader.load(sModelName, function (gltf) {
				gltf.scene.traverse(function (node) {
					if (node instanceof THREE.Mesh) {
						node.castShadow = true;
					}
				});
				gltf.scene.name = oResource.model3D + "-" + oResource.tagID;
				gltf.scene.position.x = 0;
				gltf.scene.position.y = 0;
				gltf.scene.position.z = 0;
				gltf.scene.scale.x = 0.5;
				gltf.scene.scale.y = 0.5;
				gltf.scene.scale.z = 0.5;
				if (oResource.model3D == "Picker") gltf.scene.rotation.y = Math.PI; // Tweaking the model
				if (oResource.model3D == "Forklift") gltf.scene.rotation.y = Math.PI / 2; // Tweaking the model
				var oResGroup = new THREE.Group();
				oResGroup.add(gltf.scene);
				oResGroup.add(o3DText);
				oResGroup.name = gltf.scene.name
				new THREE.Box3().setFromObject(oResGroup).getCenter(oResGroup.position).multiplyScalar(-1);
				oScene.add(oResGroup);
			}, undefined, function (error) {
				console.error(error);
			});
		}
	};
	//--- Does the animation
	function render() {
		// Update resource data (positions) once the promise is complete
		if (bRequestComplete) {
			bRequestComplete = false;
			oListBindingResources = oModelResources.bindList("/Resource", undefined, undefined, undefined, {
				$select: "whseNo"
			});
			oPromiseContexts = oListBindingResources.requestContexts(0, Infinity);
		}
		if (oRenderer == undefined) return;
		oRenderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
		oRenderer.shadowMap.enabled = params.shadows;

		// Loop over resources to update to the latest position
		for (let i = 0; i < oJSONResources.oData.length; i++) {
			// Aquire the object from the scene
			let oResource = oJSONResources.oData[i];
			let oObject3D = oThreejsScene.getObjectByName(oResource.model3D + "-" + oResource.tagID);
			if (oObject3D !== undefined) {
				oObject3D.position.x = oResource.x;
				oObject3D.position.y = oResource.z;
				oObject3D.position.z = oResource.y;
				oObject3D.rotation.x = oResource.angleX;
				oObject3D.rotation.y = oResource.angleZ;
				oObject3D.rotation.z = oResource.angleY;
			}
			// ----- Begin Collision detection
			if (Math.abs(oJSONResources.oData[0].x - oJSONResources.oData[1].x) < 2 &&
				Math.abs(oJSONResources.oData[0].y - oJSONResources.oData[1].y) < 2 &&
				sCollision != "InAlert") {
				sCollision = "Detected";
			}
			// ----- End Collision detection
		}

		// ----- Collision handling
		if (sCollision == "Detected") {
			let oObject3D = oThreejsScene.getObjectByName("ALERT");
			if (oObject3D != undefined) {
				sCollision = "InAlert";
				oObject3D.visible = true
				var oAudio = new Audio("resources/audio/airhorn.mp3");
				oAudio.play();
				setTimeout(function () {
					sCollision = "None";
					oObject3D.visible = false
				}, 5000);
			}
		}
		// ------ End of handling 

		oRenderer.clear();
		oRenderer.render(oScene, oCamera);
		oViewerReference.getViewport().setShouldRenderFrame(); // Updates the SAP viewport

		// This is the list with the resources
		Promise.all([oPromiseContexts]).then(function (aResourceContexts) {
			oJSONResources.setData(aResourceContexts[0].map(oContexts => oContexts.getObject()));
			bRequestComplete = true;
		});
	}

	//--- Manages the animation
	function animate() {
		// Recursive call of the animate function whenever the browser is ready (battery-friendly)
		requestAnimationFrame(animate);
		render();
	}

	return Controller.extend("warehouseViewer.warehouseViewer.controller.whseView", {
		onInit: async function () {
			function threejsObjectLoader(parentNode, contentResource) {
				parentNode.add(contentResource.getSource());
				return Promise.resolve({
					node: parentNode,
					contentResource: contentResource
				});
			}

			function threejsContentManagerResolver(contentResource) {
				if (contentResource.getSource() instanceof THREE.Object3D) {
					return Promise.resolve({
						dimension: 3,
						contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
						settings: {
							loader: threejsObjectLoader
						}
					});
				} else {
					return Promise.reject();
				}
			}
			// Create reference to i18n model
			oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			ContentConnector.addContentManagerResolver(threejsContentManagerResolver);

			// Prepare the OData Model for the resources
			oModelResources = this.getOwnerComponent().getModel("resourceData");
			oListBindingResources = oModelResources.bindList("/Resource", undefined, undefined, undefined, {
				$select: "whseNo"
			});
			oPromiseContexts = oListBindingResources.requestContexts(0, Infinity);
			oJSONResources = this.getOwnerComponent().getModel("whseResourcesJSON");

			//Get storage bin data and pass it to the init function
			var oJSONBins = this.getOwnerComponent().getModel("whseBinsJSON");
			var oJSONBinTypes = this.getOwnerComponent().getModel("whseBinTypesJSON");
			oViewerReference = this.getView().byId("viewer");

			// Call the 3D Scene Initialization with the fetched data
			await initScene(oJSONBins.oData.WhseBins, oJSONBinTypes.oData.WhseBinTypes);

			oViewerReference.attachSceneLoadingSucceeded(function (oEvent) {
				// Contains the reference to the scene
				oThreejsScene = oEvent.getParameter("scene").getSceneRef();
				animate();
			});

			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: oScene,
					sourceType: "THREE.Scene",
					name: "Scene"
				})
			);

			// This is the list with the resources
			Promise.all([oPromiseContexts]).then(function (aResourceContexts) {
				oJSONResources.setData(aResourceContexts[0].map(oContexts => oContexts.getObject()));
				// Call the resource loading according to the resources announced by OData-Service
				initResources(oJSONResources.oData);
			});
		},

		// Called every time the view is rendered again
		onBeforeRendering: function () {
			var threejsContent = this.getView().byId("viewer").getContentResources(); //TODO test only

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
});