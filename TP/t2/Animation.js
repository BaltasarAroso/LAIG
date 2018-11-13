/**
 * Animation
 * @constructor
 */
class Animation {
	constructor(scene, duration = 0.0) {
		this.scene = scene;
		this.time = new Date();
		this.setDuration(duration);
	}

	update() {
		if (this.firstCall) {
			this.intialTime = this.time.getTime();
			this.firstCall = false;
		}
		this.currentTime = this.time.getTime();
		this.timePassed = this.currentTime - this.initialTime;
		if (this.timePassed < this.duration) {
			this.calculateTransformation();
		}
		this.apply();
		this.previousTime = this.currentTime;	
	}

	apply() {
		this.scene.translate(this.position.x, this.position.y, this.position.z);
	}

	setDuration(duration = 0.0) {
		this.duration = duration;
	}

	calculateTransformation() {
		// Override me!
	}

}
