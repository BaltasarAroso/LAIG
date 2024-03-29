/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject {
	constructor(
		scene,
		x1 = 1,
		x2 = 0,
		x3 = -1,
		y1 = 0,
		y2 = 1,
		y3 = 0,
		z1 = 0,
		z2 = 0,
		z3 = 0,
		length_s = 1,
		length_t = 1
	) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;
		this.length_s = length_s;
		this.length_t = length_t;
		this.initBuffers();
	}

	initBuffers() {
		/**
		 * 					(P0) x1, y1, z1
		 * 							/\
		 * 						   /  \
		 * 						  /	   \
		 * 						 b		a
		 * 						/		 \
		 * 					   /		  \
		 * 					  /			   \
		 * 	 (P1) x2, y2, z2 ------- c ------  (P2) x3, y3, z3
		 */

		let a = Math.sqrt(
			(this.x1 - this.x3) * (this.x1 - this.x3) +
				(this.y1 - this.y3) * (this.y1 - this.y3) +
				(this.z1 - this.z3) * (this.z1 - this.z3)
		);
		let b = Math.sqrt(
			(this.x2 - this.x1) * (this.x2 - this.x1) +
				(this.y2 - this.y1) * (this.y2 - this.y1) +
				(this.z2 - this.z1) * (this.z2 - this.z1)
		);
		let c = Math.sqrt(
			(this.x3 - this.x2) * (this.x3 - this.x2) +
				(this.y3 - this.y2) * (this.y3 - this.y2) +
				(this.z3 - this.z2) * (this.z3 - this.z2)
		);

		// let cosBC = (-1 * a * a + b * b + c * c) / (2 * b * c);
		let cosCA = (a * a - b * b + c * c) / (2 * c * a);
		// let cosAB = (a * a + b * b - c * c) / (2 * a * b);

		// let alpha = Math.acos(cosBC);
		let beta = Math.acos(cosCA);
		// let gama = Math.acos(cosAB);

		let P0 = { s: c - a * cosCA, t: this.length_t - a * Math.sin(beta) };
		let P1 = { s: 0, t: this.length_t };
		let P2 = { s: c, t: this.length_t };

		this.vertices = [
			this.x1,
			this.y1,
			this.z1,
			this.x2,
			this.y2,
			this.z2,
			this.x3,
			this.y3,
			this.z3
		];

		this.indices = [0, 1, 2];

		this.normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

		this.texCoords = [P0.s, P0.t, P1.s, P1.t, P2.s, P2.t];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
