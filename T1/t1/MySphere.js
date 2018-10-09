/**
 * MySphere
 * @constructor
 */
 class MySphere extends CGFobject
 {
	constructor(scene, slices, stacks)
	{
		super(scene);

		this.top = new MyLamp(this.scene, slices, stacks);
		this.bottom = new MyLamp(this.scene, slices, stacks);


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
			this.top.display();

			this.scene.rotate(180 * DEGREE_TO_RAD, 1, 0, 0);
			this.scene.scale(1, 1, 1);
			this.bottom.display();

		this.scene.popMatrix();
	};
 };
