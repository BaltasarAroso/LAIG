/**
 * MySemiSphere
 * @constructor
 */
class MySemiSphere extends CGFobject {
	constructor(scene, slices, stacks, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.initBuffers();
	}

	initBuffers() {
		/*
			Starts deploying side to side triangles on the first stack;
            Following stacks are pairs of complementary triangles.
			(obs: if stacks = 1 => cone/pyramid)
			'r' (= 1), 'theta' and 'phi' are spherical coordinates
		*/

		// Y-axis oriented
		this.vertices.push(0, 1, 0);
		this.normals.push(0, 1, 0);
		this.texCoords.push(
			this.minS + 0.5 * (this.maxS - this.minS),
			this.minT + 0.5 * (this.maxT - this.minT)
		);
		for (let t = 1; t <= this.stacks; t++) {
			let theta = (t / this.stacks) * (Math.PI / 2);

			for (let p = 0; p < this.slices; p++) {
				let phi = (p / this.slices) * 2 * Math.PI;

				this.vertices.push(
					Math.sin(theta) * Math.cos(phi),
					Math.cos(theta),
					Math.sin(theta) * Math.sin(phi)
				);

				let sRadius = (this.maxS - this.minS) / 2;
				let tRadius = (this.maxT - this.minT) / 2;
				this.texCoords.push(
					this.minS + sRadius + sRadius * (t / this.stacks) * Math.cos(phi),
					this.minT + tRadius + tRadius * (t / this.stacks) * Math.sin(phi)
				);

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
							(t - 2) * this.slices + 1,
							(t - 1) * this.slices + 1,
							(t - 2) * this.slices + p + 1
						);
						this.indices.push(
							(t - 2) * this.slices + p + 1,
							(t - 1) * this.slices + 1,
							(t - 1) * this.slices + p + 1
						);
					} else {
						this.indices.push(
							(t - 2) * this.slices + p + 2,
							(t - 1) * this.slices + p + 2,
							(t - 2) * this.slices + p + 1
						);
						this.indices.push(
							(t - 2) * this.slices + p + 1,
							(t - 1) * this.slices + p + 2,
							(t - 1) * this.slices + p + 1
						);
					}
				}
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
