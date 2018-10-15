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

		// add a group of controls (and open/expand by defult)
		this.groupLights = this.gui.addFolder("Lights");
		this.groupViews = this.gui.addFolder("Views");

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
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
     * Adds a folder containing the IDs of the views passed as parameter.
     * @param {array} views
     */
    addCamerasGroup(views) {
		// TODO: changing views in the dropdown menu does nothing
		this.groupViews.add(this.scene, 'cameras', views);
	}
	

}
