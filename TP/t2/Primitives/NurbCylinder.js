/**
 * NurbCylinder
 * @constructor
 */
class NurbCylinder extends CGFobject {
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
	}

	display() {
        
	}
}
