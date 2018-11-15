/**
 * Animation
 * @constructor
 */
class Animation {
	constructor(scene, span = 0.0) {
		this.scene = scene;
		this.setDuration(span);
	}

	update() {
		let time = new Date();
		if (this.firstCall) {
			this.initialTime = time.getTime();
			this.previousTime = this.initialTime;
			this.firstCall = false;
		}
		this.currentTime = time.getTime();
		this.timePassed = this.currentTime - this.initialTime;
		if (this.timePassed <= this.span * 1000) {
			this.calculateTransformation();
		}
		this.apply();
		this.previousTime = this.currentTime;	
	}

	apply() {
		this.scene.translate(this.position.x, this.position.y, this.position.z);
	}

	setDuration(span = 0.0) {
		this.span = span;
	}

	calculateTransformation() {
		// Override me!
	}

}
