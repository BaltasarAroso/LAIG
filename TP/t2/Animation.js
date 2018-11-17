/**
 * Animation
 * @constructor
 */
class Animation {
	constructor(scene, span = 0.0) {
		this.scene = scene;
		this.firstCall = true;
		this.position = {x: 0, y: 0, z: 0};
		// this.actualDistance = 0;
		// this.totalDistance = 0;
		this.setDuration(span);
	}

	update() {
		let time = new Date();
		if (this.firstCall) {
			this.initialTime = time.getTime();
			this.previousTime = this.initialTime;
			this.timePassed = 0;
			this.firstCall = false;
		}
		this.currentTime = time.getTime();
		this.timePassed = this.currentTime - this.initialTime;
		if (this.timePassed <= this.span * 1000) {
			this.calculateTransformation();
		} else if (this.actualDistance < this.totalDistance || this.currentAng < this.rotAng) {
			this.lastPiece = true;
			this.calculateTransformation();
		}
		this.apply();
		this.previousTime = this.currentTime;	
	}

	apply() {
		this.scene.translate(this.position.x, this.position.y, this.position.z);
		this.scene.rotate(this.angleXZ, 0, 1, 0);
	}

	setDuration(span = 0.0) {
		this.span = span;
	}

	calculateTransformation() {
		// Override me!
	}

}
