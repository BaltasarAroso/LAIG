/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
	/**
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Initializes the interface.
	 * @param {CGFapplication} application
	 */
	init(application) {
		super.init(application);
		// init GUI. For more information on the methods, check:
		//  http://workshop.chromeexperiments.com/examples/gui

		this.gui = new dat.GUI();

		// add a group of controls
		this.groupLights = this.gui.addFolder('Lights');
		this.groupViews = this.gui.addFolder('Views');

		this.initKeys();

		return true;
	}

	/**
	 * Adds a folder containing the IDs of the lights passed as a parameter.
	 * @param {array} lights
	 */
	addLightsGroup(lights) {
		// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
		// e.g. this.option1=true; this.option2=false;
		for (var key in lights) {
			if (lights.hasOwnProperty(key)) {
				this.scene.lightValues[key] = lights[key].enabled;
				this.groupLights.add(this.scene.lightValues, key);
			}
		}
	}

	/**
	 * Adds a folder containing the names of the cameras passed as a parameter.
	 * @param {array} cameras
	 */
	addCamerasGroup(cameras) {
		let controller = this.groupViews.add(this.scene, 'currentCamera', cameras);
		this.groupViews.open();

		controller.onChange(function(value) {
			this.object.camera = this.object.cameraObjects[this.object.cameras.indexOf(value)];
		});
	}

	/**
	 * Initiates the keyboard processing
	 */
	initKeys() {
		this.scene.interface = this;
		this.processKeyboard = function() {};
	}

	/**
	 * Handler function for key down events
	 * @param {KeyboardEvent} event
	 */
	processKeyDown(event) {
		if (event.code === 'KeyM') {
			// if counter reaches Number.MAX_SAFE_INTEGER (unlikely), it resets
			if (this.scene.materialCounter === 9007199254740991) {
				this.scene.materialCounter = 0;
			}
			this.scene.materialCounter++;
		}
	}

	/**
	 * Handler function for key up events
	 * @param {KeyboardEvent} event
	 */
	processKeyUp(event) {
		// override with nothing
	}
}
