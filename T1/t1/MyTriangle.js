/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject {
	constructor(scene, size = 1) {
		super(scene);
		this.size = size;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			-this.size / 2,
			0,
			0,
			this.size / 2,
			0,
			0,
			0,
			this.size * Math.sin(30 * DEGREE_TO_RAD),
			0
		];

		this.indices = [0, 1, 2];

		this.normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

		this.texCoords = [
			this.minS,
			this.maxT,
			this.maxS,
			this.maxT,
			this.minS,
			this.minT,
			this.maxS,
			this.minT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
