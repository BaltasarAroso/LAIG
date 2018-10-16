/**
 * MyLamp
 * @constructor
 */
class MyLamp extends CGFobject {
	constructor(scene, slices, stacks, length_s = 0.5, length_t = 0.5, isTop) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.length_s = length_s;
		this.length_t = length_t;
		this.isTop = isTop;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.initBuffers();
	}

	initBuffers() {
		/* Starts deploying side to side triangles on the first stack;
             Following stacks are pairs of complementary triangles.
             (obs: if stacks = 1 => cone/pyramid) */

		// Y-axis oriented
		this.vertices.push(0, 1, 0);
		this.normals.push(0, 1, 0);
		this.texCoords.push(0.5 * this.length_s, 0.5 * this.length_t);
		for (let t = 1; t <= this.stacks; t++) {
			let theta = (t / this.stacks) * (Math.PI / 2);

			for (let p = 0; p < this.slices; p++) {
				let phi = (p / this.slices) * 2 * Math.PI;

				this.vertices.push(
					Math.sin(theta) * Math.cos(phi),
					Math.cos(theta),
					Math.sin(theta) * Math.sin(phi)
				);

				if (this.isTop) {
					this.texCoords.push(
						this.length_s + (this.length_s / 2 + 0.5 * Math.cos(phi)),
						this.length_t - (this.length_t / 2 - 0.5 * Math.sin(phi))
					);
				} else {
					this.texCoords.push(
						this.length_s / 2 + 0.5 * Math.cos(phi),
						this.length_t / 2 - 0.5 * Math.sin(phi)
					);
				}

				this.normals.push(
					Math.sin(theta) * Math.cos(phi),
					Math.cos(theta),
					Math.sin(theta) * Math.sin(phi)
				);

				if (t === 1) {
					// 1 triangles
					if (p === this.slices - 1) {
						this.indices.push(0, p + 2 - this.slices, p + 1);
					} else {
						this.indices.push(0, p + 2, p + 1);
					}
				} else {
					// 2 triangles
					if (p === this.slices - 1) {
						this.indices.push(
							p + 1 + (t - 2) * this.slices,
							p + 2 + (t - 2) * this.slices,
							p + 1 + (t - 1) * this.slices
						);
						this.indices.push(
							p + 2 + (t - 2) * this.slices,
							p + 1 + (t - 2) * this.slices,
							p + 2 + (t - 3) * this.slices
						);
					} else {
						this.indices.push(
							p + 1 + (t - 2) * this.slices,
							p + 2 + (t - 1) * this.slices,
							p + 1 + (t - 1) * this.slices
						);
						this.indices.push(
							p + 2 + (t - 1) * this.slices,
							p + 1 + (t - 2) * this.slices,
							p + 2 + (t - 2) * this.slices
						);
					}
				}
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
