/**
 * Vehicle
 * @constructor
 */
class Vehicle extends CGFobject {
	constructor(scene) {
        super(scene);
        
		console.log("I'm a beer.");
		this.cylinder2 = new Cylinder2(this.scene, 2, 0.001, 1, 20, 20, 0.5, 0.5);
	}

	display() {
		// Display beer stuff

		this.scene.pushMatrix();
		this.cylinder2.display();
		this.scene.popMatrix();
	}
}
