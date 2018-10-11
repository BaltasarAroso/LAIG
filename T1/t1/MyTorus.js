/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, ringDiameter = 0.5, outterRadius = 1, latitudeBands = 30, longitudeBands = 30) {
		super(scene);

		this.ringDiameter = ringDiameter; // diameter of the circles that together create the torus's ring
		this.outterRadius = outterRadius; // radius from the center of torus until the outter side of his ring
		this.latitudeBands = latitudeBands; // number of bands in xy
		this.longitudeBands = longitudeBands; // number of bands in zy

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
		for (let latNumber = 0; latNumber <= this.latitudeBands; latNumber++) {
			// theta is multiplied by 2 to get the 2 middle parts (above xz and under xz)
			let theta = (latNumber * Math.PI * 2) / this.latitudeBands;
			let sinTheta = Math.sin(theta);
			let cosTheta = Math.cos(theta);

			for (let longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
				// phi is multiplied by 2 to get the 2 middle parts (front xy and back xy)
				let phi = (longNumber * Math.PI * 2) / this.longitudeBands;
				let sinPhi = Math.sin(phi);
				let cosPhi = Math.cos(phi);

				let x = (this.outterRadius + this.ringDiameter * cosPhi) * cosTheta;
				let y = (this.outterRadius + this.ringDiameter * cosPhi) * sinTheta;
				let z = this.ringDiameter * sinPhi;

				this.normals.push(x);
				this.normals.push(y);
				this.normals.push(z);
				this.vertices.push(this.ringDiameter * x);
				this.vertices.push(this.ringDiameter * y);
				this.vertices.push(this.ringDiameter * z);

				let u = 1 - longNumber / this.longitudeBands;
				let v = 1 - latNumber / this.latitudeBands;
				this.texCoords.push(u);
				this.texCoords.push(v);
			}
		}

		// torus fill
		for (let latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
			for (let longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
				let first = latNumber * (this.longitudeBands + 1) + longNumber;
				let second = first + this.longitudeBands + 1;
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
