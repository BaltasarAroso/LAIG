/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);

		this.base = base;
		this.top = top;
		this.height = height;

		this.tube = new MyTube(this.scene, slices, stacks);
		this.top = new MyCircle(this.scene, this.top, slices);
		this.bottom = new MyCircle(this.scene, this.base, slices);

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
		this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
		this.tube.display();

		this.scene.scale(1, 1, 1 / this.height);
		this.scene.rotate(180 * DEGREE_TO_RAD, 1, 0, 0);
		this.bottom.display();

		this.scene.rotate(180 * DEGREE_TO_RAD, 1, 0, 0);
		this.scene.translate(0, 0, this.height);
		this.top.display();

		this.scene.popMatrix();
	}
}
