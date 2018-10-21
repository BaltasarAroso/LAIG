/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(
		scene,
		inner = 0.5,
		outer = 1,
		slices = 30,
		loops = 30,
		length_s = 1,
		length_t = 1
	) {
		super(scene);

		this.inner = inner; // diameter of the circles that together create the torus's ring
		this.outer = outer; // radius from the center of torus until the center of his ring's circles
		this.slices = slices; // number of bands in xy
		this.loops = loops; // number of bands in zy
		this.length_s = length_s;
		this.length_t = length_t;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.initBuffers();
	}

	initBuffers() {
		// torus structure
		for (let sliceNumber = 0; sliceNumber <= this.slices; sliceNumber++) {
			// theta is multiplied by 2 to get the 2 middle parts (above xz and under xz)
			let theta = (sliceNumber * Math.PI * 2) / this.slices;
			let sinTheta = Math.sin(theta);
			let cosTheta = Math.cos(theta);

			for (let loopNumber = 0; loopNumber <= this.loops; loopNumber++) {
				// phi is multiplied by 2 to get the 2 middle parts (front xy and back xy)
				let phi = (loopNumber * Math.PI * 2) / this.loops;
				let sinPhi = Math.sin(phi);
				let cosPhi = Math.cos(phi);

				let x = (this.outer + this.inner * cosPhi) * cosTheta;
				let y = (this.outer + this.inner * cosPhi) * sinTheta;
				let z = this.inner * sinPhi;

				this.normals.push(x);
				this.normals.push(y);
				this.normals.push(z);
				this.vertices.push(x);
				this.vertices.push(y);
				this.vertices.push(z);

				let u = (sliceNumber / this.slices) * this.length_t;
				let v = (loopNumber / this.loops) * this.length_s;
				this.texCoords.push(u);
				this.texCoords.push(v);
			}
		}

		// torus fill
		for (let sliceNumber = 0; sliceNumber < this.slices; sliceNumber++) {
			for (let loopNumber = 0; loopNumber < this.loops; loopNumber++) {
				let first = sliceNumber * (this.loops + 1) + loopNumber;
				let second = first + this.loops + 1;
				this.indices.push(first);
				this.indices.push(second);
				this.indices.push(first + 1);
				this.indices.push(second);
				this.indices.push(second + 1);
				this.indices.push(first + 1);
			}
		}

		this.initGLBuffers();
	}
}
