/**
 * MyCylinder
 * @constructor
 */
 class MyCylinder extends CGFobject
 {
	constructor(scene, slices, stacks)
	{
		super(scene);

		this.tube = new MyTube(this.scene, slices, stacks);
		this.top = new MyCircle(this.scene, slices);
		this.bottom = new MyCircle(this.scene, slices);

    	this.init();
	};

  init() {
    	this.scene.materialSteel = new CGFappearance(this.scene);
		this.scene.materialSteel.setSpecular(0.9,0.9,0.9,1);
		this.scene.materialSteel.setAmbient(0.270, 0.227, 0.235,1);
		this.scene.materialSteel.setDiffuse(0.270, 0.227, 0.235,1);
  }

	display()
	{
    	this.scene.materialSteel.apply();

		this.scene.pushMatrix();

			this.scene.scale(1, 1, 1);
			this.tube.display();

			this.scene.translate(0, 1, 0);
			this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
			this.scene.scale(1, 1, 1);
			this.top.display();

			this.scene.translate(0, -1, 0);
			this.scene.rotate(90 * DEGREE_TO_RAD, 1, 0, 0);
			this.scene.scale(1, 1, 1);
			this.bottom.display();

		this.scene.popMatrix();
	};
 };
