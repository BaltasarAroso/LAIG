/**
 * MyCircle
 * @constructor
 */
class MyCircle extends CGFobject {
	constructor(scene, slices) {
		super(scene);

		this.slices = slices;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.angle = 2*Math.PI/this.slices;

		this.initBuffers();
	};

	initBuffers() {
		//center point
		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);
		for(let i = 0; i <= this.slices; i++) {
			this.vertices.push(Math.cos(i*this.angle), Math.sin(i*this.angle), 0);
			this.texCoords.push(0.5 + 0.5*Math.cos(i*this.angle), 0.5 - 0.5*Math.sin(i*this.angle));
			// this.normals.push(Math.cos(i*this.angle), Math.sin(i*this.angle), 0); //pointing outward
			this.normals.push(0, 0, 1);  //pointing forward (in z)

			if(i < this.slices) {
				this.indices.push(0, i+1, i+2);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
}
