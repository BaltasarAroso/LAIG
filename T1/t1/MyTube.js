/**
 * MyTube
 * @constructor
 */
class MyTube extends CGFobject {
	constructor(scene, bottom, top, slices, stacks, length_s, length_t) {
		super(scene);

		this.bottom = bottom;
		this.top = top;
		this.slices = slices;
		this.stacks = stacks;
		this.length_s = length_s;
		this.length_t = length_t;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.angle = (2 * Math.PI) / this.slices;

		this.initBuffers();
	}

	initBuffers() {
		let aux = 0;
		let newRadius = this.bottom;
		let growRate = (this.top - this.bottom) / this.stacks;

		for (let z = 0; z <= this.stacks; z++) {
			for (let i = 0; i < this.slices; i++) {
				if (growRate == 0) {
					this.vertices.push(
						this.bottom * Math.cos(i * this.angle),
						this.bottom * Math.sin(i * this.angle),
						z / this.stacks
					);
				} else {
					if (z > aux) {
						newRadius += growRate;
						aux = z;
					}
					this.vertices.push(
						newRadius * Math.cos(i * this.angle),
						newRadius * Math.sin(i * this.angle),
						z / this.stacks
					);
				}

				this.texCoords.push(i % 2 === 0 ? 0 : 1 * this.length_s, (z / this.stacks) * this.length_t);

				if (z > 0) {
					if (i === this.slices - 1) {
						this.indices.push(
							i + (z - 1) * this.slices,
							i + 1 + (z - 2) * this.slices,
							i + z * this.slices
						);

						this.indices.push(
							i + 1 + (z - 1) * this.slices,
							i + z * this.slices,
							i + 1 + (z - 2) * this.slices
						);
					} else {
						this.indices.push(
							i + (z - 1) * this.slices,
							i + 1 + (z - 1) * this.slices,
							i + z * this.slices
						);

						this.indices.push(
							i + 1 + z * this.slices,
							i + z * this.slices,
							i + 1 + (z - 1) * this.slices
						);
					}
				}

				this.normals.push(Math.cos(i * this.angle), Math.sin(i * this.angle), 0);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
