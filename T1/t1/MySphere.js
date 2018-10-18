/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject {
	constructor(scene, radius = 1, slices = 30, stacks = 30, length_s = 1, length_t = 1) {
		super(scene);

		this.radius = radius;
		this.top = new MySemiSphere(this.scene, slices, stacks, 0, length_s / 2, 0, length_t);
		this.bottom = new MySemiSphere(
			this.scene,
			slices,
			stacks,
			length_s / 2,
			length_s,
			0,
			length_t
		);
	}

	display() {
		this.scene.pushMatrix();

		this.scene.scale(this.radius, this.radius, this.radius);

		this.top.display();

		this.scene.rotate(180 * DEGREE_TO_RAD, 1, 0, 0);
		this.scene.rotate(180 * DEGREE_TO_RAD, 0, 1, 0);
		this.bottom.display();

		this.scene.popMatrix();
	}
}
