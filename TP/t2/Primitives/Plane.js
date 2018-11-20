/**
 * Plane
 * @constructor
 */
class Plane extends CGFobject {
	constructor(scene, npartsU, npartsV) {
		super(scene);

		this.controlvertexes = [
			// U = 0
			[ // V = 0..1;
				 [0.5, 0, -0.5, 1],
				 [0.5, 0, 0.5, 1]
			],
			// U = 1
			[ // V = 0..1
				 [-0.5, 0, -0.5, 1],
				 [-0.5, 0, 0.5, 1]
			]
		]

		this.npointsU = 1;
		this.npointsV = 1;

		this.patch = new Patch(this.scene, npartsU, npartsV, this.npointsU, this.npointsV, this.controlvertexes);
	}

	display() {
		this.patch.display();
	}


}
