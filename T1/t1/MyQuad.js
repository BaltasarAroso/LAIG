/**
 * MyQuad
 * @constructor
 */
class MyQuad extends CGFobject {
	constructor(scene, x1 = -0.5, x2 = 0.5, y1 = -0.5, y2 = 0.5, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y1, 0,
			this.x1, this.y2, 0,
			this.x2, this.y2, 0
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
}
