/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
	constructor(
		scene,
		base = 1,
		top = 1,
		height = 1,
		slices = 20,
		stacks = 20,
		length_s = 1,
		length_t = 1
	) {
		super(scene);

		this.height = height;

		this.tube = new MyTube(this.scene, base, top, slices, stacks, length_s, length_t);
		this.topCircle = new MyCircle(this.scene, top, slices, length_s, length_t);
		this.baseCircle = new MyCircle(this.scene, base, slices, length_s, length_t);

		this.init();
	}

	init() {
		this.scene.materialSteel = new CGFappearance(this.scene);
		this.scene.materialSteel.setSpecular(0.9, 0.9, 0.9, 1);
		this.scene.materialSteel.setAmbient(0.27, 0.227, 0.235, 1);
		this.scene.materialSteel.setDiffuse(0.27, 0.227, 0.235, 1);
	}

	display() {
		this.scene.materialSteel.apply();

		this.scene.pushMatrix();

		this.scene.scale(1, this.height, 1);
		this.tube.display();

		this.scene.scale(1, 1, 1 / this.height);
		this.scene.rotate(180 * DEGREE_TO_RAD, 1, 0, 0);
		this.baseCircle.display();

		this.scene.rotate(180 * DEGREE_TO_RAD, 1, 0, 0);
		this.scene.translate(0, 0, this.height);
		this.topCircle.display();

		this.scene.popMatrix();
	}
}
