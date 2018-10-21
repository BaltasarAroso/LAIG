var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
	/**
	 * @constructor
	 * @param {MyInterface} myinterface
	 */
	constructor(myinterface) {
		super();

		this.interface = myinterface;
		this.lightValues = {};
	}

	/**
	 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
	 * @param {CGFApplication} application
	 */
	init(application) {
		super.init(application);

		this.sceneInited = false;

		this.cameras = [];
		this.initCameras();

		this.enableTextures(true);

		this.textures = [];
		this.materials = [];

		this.materialCounter = 0;

		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);

		this.setUpdatePeriod(75); // updates scene every 75 ms
	}
	/**
	 * Initializes the scene's default cameras
	 */
	initCameras() {
		// Set up default camera
		this.cameraObjects = [];
		this.cameras = [];

		this.cameraObjects.push(
			new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(80, 40, 100), vec3.fromValues(0, 5, 0))
		);
		this.cameras.push('default');

		this.camera = this.cameraObjects[this.cameras.indexOf('default')];

		this.currentCamera = this.cameras[0];
	}

	/**
	 * Initializes the scene lights with the values read from the XML file.
	 */
	initLights() {
		let i = 0; // Lights index.

		// Reads the lights from the scene graph.
		for (const key in this.graph.lights) {
			if (i >= 8) break; // Only eight lights allowed by WebGL.

			if (this.graph.lights.hasOwnProperty(key)) {
				let light = this.graph.lights[key];

				//lights are predefined in cgfscene
				this.lights[i].setPosition(
					light.location.x,
					light.location.y,
					light.location.z,
					light.location.w
				);
				this.lights[i].setAmbient(
					light.ambient.r,
					light.ambient.g,
					light.ambient.b,
					light.ambient.a
				);
				this.lights[i].setDiffuse(
					light.diffuse.r,
					light.diffuse.g,
					light.diffuse.b,
					light.diffuse.a
				);
				this.lights[i].setSpecular(
					light.specular.r,
					light.specular.g,
					light.specular.b,
					light.specular.a
				);

				this.lights[i].setVisible(true);
				light.enabled ? this.lights[i].enable() : this.lights[i].disable();

				this.lights[i].update();
				i++;
			}
		}
	}

	/* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
	onGraphLoaded() {
		this.axis = new CGFaxis(this, this.graph.axis_length);

		// Set ambient
		this.setGlobalAmbientLight(
			this.graph.ambient.ambient.r,
			this.graph.ambient.ambient.g,
			this.graph.ambient.ambient.b,
			this.graph.ambient.ambient.a
		);

		// Set background
		this.gl.clearColor(
			this.graph.ambient.background.r,
			this.graph.ambient.background.g,
			this.graph.ambient.background.b,
			this.graph.ambient.background.a
		);

		// Load views
		let viewList = Object.keys(this.graph.views);

		for (let i = 0; i < viewList.length; i++) {
			// Check if camera already exists; if not, create it
			if (this.cameras.indexOf(viewList[i]) === -1) {
				let view = this.graph.views[viewList[i]];

				if (view.type.match(/perspective/i)) {
					this.cameraObjects.push(
						new CGFcamera(
							(view.angle / 180) * Math.PI,
							view.near,
							view.far,
							vec3.fromValues(view.from.x, view.from.y, view.from.z),
							vec3.fromValues(view.to.x, view.to.y, view.to.z)
						)
					);
				} else if (view.type.match(/ortho/i)) {
					this.cameraObjects.push(
						new CGFcameraOrtho(
							view.left,
							view.right,
							view.bottom,
							view.top,
							view.near,
							view.far,
							vec3.fromValues(view.from.x, view.from.y, view.from.z),
							vec3.fromValues(view.to.x, view.to.y, view.to.z),
							vec3.fromValues(view.up.x, view.up.y, view.up.z)
						)
					);
				}

				this.cameras.push(viewList[i]);
			}
		}

		// Change starting camera according to yas
		this.currentCamera = this.graph.defaultView;
		this.camera = this.cameraObjects[this.cameras.indexOf(this.currentCamera)];

		this.initLights();

		// Interface - add lights group
		this.interface.addLightsGroup(this.graph.lights);

		// Interface - add views group
		this.interface.addCamerasGroup(this.cameras);

		// Load textures
		let textureList = Object.keys(this.graph.textures);

		for (let i = 0; i < textureList.length; i++) {
			// Check if texture already exists; if not, create it
			if (!this.textures.hasOwnProperty(textureList[i])) {
				let texture = this.graph.textures[textureList[i]];

				this.textures[textureList[i]] = new CGFappearance(this);
				this.textures[textureList[i]].loadTexture(texture);
				// this.textures[textureList[i]].setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
			}
		}

		// Load materials
		let materialList = Object.keys(this.graph.materials);

		for (let i = 0; i < materialList.length; i++) {
			// Check if texture already exists; if not, create it
			if (!this.materials.hasOwnProperty(materialList[i])) {
				let material = this.graph.materials[materialList[i]];

				this.materials[materialList[i]] = new CGFappearance(this);

				this.materials[materialList[i]].setAmbient(
					material.ambient.r,
					material.ambient.g,
					material.ambient.b,
					material.ambient.a
				);
				this.materials[materialList[i]].setDiffuse(
					material.diffuse.r,
					material.diffuse.g,
					material.diffuse.b,
					material.diffuse.a
				);
				this.materials[materialList[i]].setEmission(
					material.emission.r,
					material.emission.g,
					material.emission.b,
					material.emission.a
				);
				this.materials[materialList[i]].setSpecular(
					material.specular.r,
					material.specular.g,
					material.specular.b,
					material.specular.a
				);
				this.materials[materialList[i]].setShininess(material.shininess);
			}
		}

		this.sceneInited = true;
	}

	/**
	 * Handles dynamic changes to the scene (e.g.: gui/key triggered events)
	 */
	update() {
		// Update state of every light
		let i = 0;
		for (const key in this.lightValues) {
			if (this.lightValues.hasOwnProperty(key)) {
				if (this.lightValues[key]) {
					this.lights[i].setVisible(true);
					this.lights[i].enable();
				} else {
					this.lights[i].setVisible(false);
					this.lights[i].disable();
				}
				this.lights[i].update();
				i++;
			}
		}
	}

	/**
	 * Displays the scene.
	 */
	display() {
		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		this.pushMatrix();

		if (this.sceneInited) {
			// Draw axis
			this.axis.display();

			// Displays the scene (MySceneGraph function).
			if (this.graph.rootId != null) {
				this.graph.displayScene(this.graph.rootId);
			}
		} else {
			// Draw axis only
			this.axis.display();
		}

		this.popMatrix();
	}
}
