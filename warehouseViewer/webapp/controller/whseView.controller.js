sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/model/odata/v4/ODataModel"
], function (Controller, MessageToast, ContentResource, ContentConnector, threejs, ODataModel) {
	"use strict";

	// ----------- Threejs functions and variables ------------------
	var camera, scene, renderer, hemiLight;
	var ballMat, cubeMat, floorMat;
	// ref for lumens: http://www.power-sure.com/lumens.htm
	var bulbLuminousPowers = {
		"110000 lm (1000W)": 110000,
		"3500 lm (300W)": 3500,
		"1700 lm (100W)": 1700,
		"800 lm (60W)": 800,
		"400 lm (40W)": 400,
		"180 lm (25W)": 180,
		"20 lm (4W)": 20,
		"Off": 0
	};
	// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
	var hemiLuminousIrradiances = {
		"0.0001 lx (Moonless Night)": 0.0001,
		"0.002 lx (Night Airglow)": 0.002,
		"0.5 lx (Full Moon)": 0.5,
		"3.4 lx (City Twilight)": 3.4,
		"50 lx (Living Room)": 50,
		"100 lx (Very Overcast)": 100,
		"350 lx (Office Room)": 350,
		"400 lx (Sunrise/Sunset)": 400,
		"1000 lx (Overcast)": 1000,
		"18000 lx (Daylight)": 18000,
		"50000 lx (Direct Sun)": 50000
	};
	var params = {
		shadows: true,
		exposure: 0.68,
		bulbPower: Object.keys(bulbLuminousPowers)[4],
		hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
	};

	var previousShadowMap = false;

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

			ContentConnector.addContentManagerResolver(threejsContentManagerResolver);

			//Get storage bin data and pass it to the init function
			var oJSONModel = this.getView().getModel("whseBinsJSON");
			init(oJSONModel.oData.WhseBins);

			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: scene,
					sourceType: "THREE.Scene",
					name: "Scene"
				})
			);

			//animate();
		}
	});

	function init(binData) {
		camera = new THREE.PerspectiveCamera(50, 1.6, 0.1, 100); //----TODO Must adjust the ratio dynamically!
		camera.position.x = -4;
		camera.position.z = 4;
		camera.position.y = 2;
		scene = new THREE.Scene();
		scene.name = "Warehouse";

		// Load models
		var url = "https://threejs.org/examples/js/loaders/GLTFLoader.js";

		jQuery.ajax({
			url: url,
			dataType: "script",
			cache: true
		}).done(function () {
			var loader = new THREE.GLTFLoader();
			loader.load('resources/Forklift.gltf', function (gltf) {
				gltf.name = "Forklift";
				scene.add(gltf.scene);
			}, undefined, function (error) {
				console.error(error);
			});
		});
		// create ceiling lights
		for (var i = 1; i < 4; i++) {
			var bulbGeometry = new THREE.SphereBufferGeometry(0.02, 16, 8);
			var bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
			bulbLight.name = "Warehouse Light ".concat(i.toString());
			var bulbMat = new THREE.MeshStandardMaterial({
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
		textureLoader.load("textures/brick_diffuse.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(1, 1);
			cubeMat.map = map;
			cubeMat.needsUpdate = true;
		});
		textureLoader.load("textures/brick_bump.jpg", function (map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set(1, 1);
			cubeMat.bumpMap = map;
			cubeMat.needsUpdate = true;
		});
		ballMat = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.5,
			metalness: 1.0
		});
		textureLoader.load("textures/earth_atmos_2048.jpg", function (map) {
			map.anisotropy = 4;
			ballMat.map = map;
			ballMat.needsUpdate = true;
		});
		textureLoader.load("textures/earth_specular_2048.jpg", function (map) {
			map.anisotropy = 4;
			ballMat.metalnessMap = map;
			ballMat.needsUpdate = true;
		});
		var floorGeometry = new THREE.PlaneBufferGeometry(100, 80);
		var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
		floorMesh.name = "Floor mesh";
		floorMesh.receiveShadow = true;
		floorMesh.rotation
			.x = -Math.PI / 2.0;
		scene.add(floorMesh);
		var ballGeometry = new THREE.SphereBufferGeometry(0.25, 32, 32);
		var ballMesh = new THREE.Mesh(ballGeometry, ballMat);
		ballMesh.name = "Globe Model";
		ballMesh.position.set(1, 0.25, 1);
		ballMesh.rotation
			.y = Math.PI;
		ballMesh.castShadow = true;
		scene.add(ballMesh);
		//H	0.6 B	0.35 T	0.40
		var boxGeometry = new THREE.BoxBufferGeometry(0.58, 0.58, 0.33);

		// Create bin visualization from EWM Masterdata
		for (var i = 0; i < binData.length; i++) {
			var obj = binData[i];
			var boxMesh = new THREE.Mesh(boxGeometry, cubeMat);
			boxMesh.position.set(parseFloat(obj.xC), parseFloat(obj.zC) + 0.25, parseFloat(obj.yC));
			boxMesh.castShadow = true;
			boxMesh.name = obj.binNo;
			scene.add(boxMesh);
		}

		renderer = new THREE.WebGLRenderer();
		renderer.physicallyCorrectLights = true;
		renderer.gammaInput = true;
		renderer.gammaOutput =
			true;
		renderer.shadowMap.enabled = true;
		renderer.toneMapping = THREE.ReinhardToneMapping;
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer
			.setSize(800, 500); //---TODO get size of available window for 3D
		/*container.appendChild(renderer.domElement);
		var controls = new OrbitControls(camera, renderer.domElement);
		window.addEventListener('resize', onWindowResize, false);
		var gui = new GUI();
		gui.add(params, 'hemiIrradiance', Object.keys(hemiLuminousIrradiances));
		gui.add(params, 'bulbPower', Object.keys(bulbLuminousPowers));
		gui.add(params, 'exposure', 0, 1);
		gui.add(params, 'shadows');
		gui.open();*/
	}

	/*	function initObject(obj, name, posX, posY, posZ, id) {
			obj.name = name;
			obj.position.set(posX, posY, posZ);
			obj.userData.treeNode = {
				sid: id
			};
		}*/

	/*	function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}*/
	//
	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
		renderer.shadowMap.enabled = params.shadows;
		bulbLight.castShadow = params.shadows;
		if (params.shadows !== previousShadowMap) {
			ballMat.needsUpdate = true;
			cubeMat.needsUpdate = true;
			floorMat.needsUpdate = true;
			previousShadowMap = params.shadows;
		}
		bulbLight.power = bulbLuminousPowers[params.bulbPower];
		bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface
		hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
		var time = Date.now() * 0.0005;
		bulbLight.position.y = Math.cos(time) * 0.75 + 1.25;
		renderer.render(scene, camera);
		//stats.update();
	}
});