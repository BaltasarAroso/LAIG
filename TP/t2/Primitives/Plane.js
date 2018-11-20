/**
 * Plane
 * @constructor
 */
class Plane extends CGFobject {
	constructor(scene, npartsU = 20, npartsV = 20) {
		super(scene);

		this.controlvertexes = [
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

		this.degreeU = 1;
		this.degreeV = 1;

		this.patch = new Patch(this.scene, npartsU, npartsV, this.degreeU, this.degreeV, this.controlvertexes);
	}

	display() {
		this.patch.display();
	}


}
