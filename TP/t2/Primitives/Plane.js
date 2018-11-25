/**
 * Plane
 * @constructor
 */
class Plane extends CGFobject {
	constructor(scene, npartsU = 20, npartsV = 20) {
		super(scene);

		this.controlpoints = [
			// U = 0
			[ // V = 0..1;
				 [-0.5, 0, 0.5, 1],
				 [-0.5, 0, -0.5, 1]
			],
			// U = 1
			[ // V = 0..1
				 [0.5, 0, 0.5, 1],
				 [0.5, 0, -0.5, 1]
			]
		]

		this.degreeU = this.controlpoints.length - 1;
		this.degreeV = this.controlpoints[0].length - 1;

		this.patch = new Patch(this.scene, npartsU, npartsV, this.degreeU, this.degreeV, this.controlpoints);
	}

	display() {
		this.patch.display();
	}


}
