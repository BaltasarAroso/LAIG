/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, inner = 0.5, outter = 1, slices = 30, loops = 30) {
		super(scene);

		this.inner = inner; // diameter of the circles that together create the torus's ring
		this.outter = outter; // radius from the center of torus until the center of his ring's circles
		this.slices = slices; // number of bands in xy
		this.loops = loops; // number of bands in zy

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.moonVerticePositionBuffer = [];
		this.moonVerticeIndiceBuffer = [];

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

				let x = (this.outter + this.inner * cosPhi) * cosTheta;
				let y = (this.outter + this.inner * cosPhi) * sinTheta;
				let z = this.inner * sinPhi;

				this.normals.push(x);
				this.normals.push(y);
				this.normals.push(z);
				this.vertices.push(this.inner * x);
				this.vertices.push(this.inner * y);
				this.vertices.push(this.inner * z);

				let u = 1 - loopNumber / this.loops;
				let v = 1 - sliceNumber / this.slices;
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

		this.moonVerticePositionBuffer = this.scene.gl.createBuffer();
		this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.moonVerticePositionBuffer);
		this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, new Float32Array(this.vertices),this.scene.gl.STATIC_DRAW);
		this.moonVerticePositionBuffer.itemSize = 3;
		this.moonVerticePositionBuffer.numItems = this.vertices.length / 3;

		this.moonVerticeIndiceBuffer = this.scene.gl.createBuffer();
		this.scene.gl.bindBuffer(this.scene.gl.ELEMENT_ARRAY_BUFFER, this.moonVerticeIndiceBuffer);
		this.scene.gl.bufferData(this.scene.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.scene.gl.STATIC_DRAW);
		this.moonVerticeIndiceBuffer.itemSize = 1;
		this.moonVerticeIndiceBuffer.numItems = this.indices.length;

		this.initGLBuffers();
	}
}
