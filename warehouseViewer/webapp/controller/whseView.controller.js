sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/model/odata/v4/ODataModel"
], function (Controller, MessageToast, ContentResource, ContentConnector, threejs, ODataModel) {
	//"use strict";

	// ----------- Get i18n model -----------------------------------
	var oResourceBundle;
	// ----------- Resources and their location----------------------
	var oPromiseContexts;
	var oJSONResources;
	var oListBindingResources;
	var oModelResources;
	var bRequestComplete = true;

	// ----------- Threejs functions and variables ------------------
	var camera, scene, renderer, hemiLight;
	var bulbMat, ballMat, cubeMat, floorMat;

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

	function initScene(binData, binTypeData) {
		camera = new THREE.PerspectiveCamera(50, 1.6, 0.1, 100); //----TODO Must adjust the ratio dynamically!
		camera.position.x = -4;
		camera.position.z = 4;
		camera.position.y = 2;
		scene = new THREE.Scene();
		scene.name = "Warehouse";

		// create ceiling lights
		for (var i = 1; i < 4; i++) {
			var bulbGeometry = new THREE.SphereBufferGeometry(0.02, 16, 8);
			var bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
			bulbLight.name = "Warehouse Light ".concat(i.toString());
			bulbMat = new THREE.MeshStandardMaterial({
				emissive: 0xffffee,
				emissiveIntensity: 1,
				color: 0x000000
			});
			bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
			bulbLight.position.set(10, 3, i * 10);
			bulbLight.castShadow = true;
			scene.add(bulbLight);
		}

		hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
		hemiLight.name = "Surrounding light";
		scene.add(hemiLight);
		floorMat =
			new THREE.MeshStandardMaterial({
				roughness: 0.8,
				color: 0xffffff,
				metalness: 0.2,
				bumpScale: 0.0005
			});
		var textureLoader = new THREE.TextureLoader();
		textureLoader.load("textures/hardwood2_diffuse.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(10, 24);
			floorMat.map = map;
			floorMat.needsUpdate = true;
		});
		textureLoader.load("textures/hardwood2_bump.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(10, 24);
			floorMat.bumpMap = map;
			floorMat.needsUpdate = true;
		});
		textureLoader.load("textures/hardwood2_roughness.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(10, 24);
			floorMat.roughnessMap = map;
			floorMat.needsUpdate = true;
		});
		cubeMat = new THREE.MeshStandardMaterial({
			roughness: 0.7,
			color: 0xffffff,
			bumpScale: 0.002,
			metalness: 0.2
		});
		//changed the texture of bins
		textureLoader.load("textures/white_plastic_fence_boards_texture.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(1, 1);
			cubeMat.map = map;
			cubeMat.needsUpdate = true;
		});
		// textureLoader.load("textures/brick_bump.jpg", function (map) {
		// 	map.wrapS = THREE.RepeatWrapping;
		// 	map.wrapT = THREE.RepeatWrapping;
		// 	map.anisotropy = 4;
		// 	map.repeat.set(1, 1);
		// 	cubeMat.bumpMap = map;
		// 	cubeMat.needsUpdate = true;
		// });

		var floorGeometry = new THREE.PlaneBufferGeometry(100, 80);
		var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
		floorMesh.name = "Floor mesh";
		floorMesh.receiveShadow = true;
		floorMesh.rotation
			.x = -Math.PI / 2.0;
		scene.add(floorMesh);

		// Check if the data is loaded from OData Model
		if (binData === undefined) {
			sleep(1000); // Yea, this is not nice...
		}
		// Create bin visualization from EWM Masterdata
		for (i = 0; i < binData.length; i++) {
			var obj = binData[i];
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
				if (v.whseNo == obj.whseNo && v.binType == obj.binType) {
					binType = v; // Found the storage bin type
					return;
				}
			});
			//To change the vizualization of bins, 
			//just replaced the content of "WHSEVIZ_WAREHOUSEBINS_BINTABLE" with the testdata "WHSEVIZ_WAREHOUSEBINS_BINTABLE.hdbdata"
			var boxGeometry = new THREE.BoxBufferGeometry(binType.maxLength, binType.maxHeight, binType.maxWidth);
			var boxMesh = new THREE.Mesh(boxGeometry, cubeMat);
			boxMesh.position.set(parseFloat(obj.xC), parseFloat(obj.zC) + 0.25, parseFloat(obj.yC));
			boxMesh.castShadow = true;
			boxMesh.name = obj.binNo;
			scene.add(boxMesh);
		}

		renderer = new THREE.WebGLRenderer();
		renderer.physicallyCorrectLights = true;
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMap.enabled = true;
		renderer.toneMapping = THREE.ReinhardToneMapping;
		renderer.setPixelRatio(window.devicePixelRatio);
	}

	function initResources(resourceData) {
		// Load 3D models asynchronous
		var gltfLoaderURL = oResourceBundle.getText("gltfLoaderURL").toString().trim();
		jQuery.ajax({
			url: gltfLoaderURL,
			dataType: "script",
			cache: true
		}).done(function () {
			var loader = new THREE.GLTFLoader();
			loader.load("resources/Forklift.gltf", function (gltf) {
				gltf.scene.traverse(function (node) {
					if (node instanceof THREE.Mesh) {
						node.castShadow = true;
					}
				});
				gltf.scene.name = "Forklift";
				gltf.scene.position.x = 15;
				gltf.scene.position.y = 0;
				gltf.scene.position.z = 24;
				scene.add(gltf.scene);
			}, undefined, function (error) {
				console.error(error);
			});
			loader.load("resources/Picker.gltf", function (gltf) {
				gltf.scene.traverse(function (node) {
					if (node instanceof THREE.Mesh) {
						node.castShadow = true;
					}
				});
				gltf.scene.name = "Picker";
				gltf.scene.position.x = 17;
				gltf.scene.position.y = 0;
				gltf.scene.position.z = 20;
				gltf.scene.castShadow = true;
				scene.add(gltf.scene);
			}, undefined, function (error) {
				console.error(error);
			});
		});
	}

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

		renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
		renderer.shadowMap.enabled = params.shadows;

		var forklift = oThreejsScene.getObjectByName("Forklift");
		if (forklift !== undefined) {
			var time = Date.now() * 0.0005;
			forklift.position.x = Math.cos(time) * 1.5 + 1.25;
			forklift.rotation.y = Math.PI / 2 * time;
		}

		var picker = oThreejsScene.getObjectByName("Picker");
		if (picker !== undefined) {
			picker.position.x = oJSONResources.oData[0].x;
			picker.position.y = oJSONResources.oData[0].y;
			picker.position.z = oJSONResources.oData[0].z;
			picker.rotation.y = Math.PI / 2 * time;
		}
		renderer.render(scene, camera);
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
		onInit: function () {
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
			oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			ContentConnector.addContentManagerResolver(threejsContentManagerResolver);

			// Prepare the OData Model for the resources
			oModelResources = this.getView().getModel("resourceData");
			oListBindingResources = oModelResources.bindList("/Resource", undefined, undefined, undefined, {
				$select: "whseNo"
			});
			oPromiseContexts = oListBindingResources.requestContexts(0, Infinity);
			oJSONResources = this.getView().getModel("whseResourcesJSON");

			//Get storage bin data and pass it to the init function
			var oJSONBins = this.getView().getModel("whseBinsJSON");
			var oJSONBinTypes = this.getView().getModel("whseBinTypesJSON");
			oViewerReference = this.getView().byId("viewer");

			// Call the 3D Scene Initialization with the fetched data
			initScene(oJSONBins.oData.WhseBins, oJSONBinTypes.oData.WhseBinTypes);

			oViewerReference.attachSceneLoadingSucceeded(function (oEvent) {
				// Contains the reference to the scene
				oThreejsScene = oEvent.getParameter("scene").getSceneRef();
				animate();
			});

			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: scene,
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
		}
	});
});