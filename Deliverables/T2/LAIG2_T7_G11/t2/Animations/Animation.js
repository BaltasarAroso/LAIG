/**
 * Animation
 * @constructor
 * @param {Object} scene 		Scene where the animation will be applied
 * @param {number} span 		Animation's duration in seconds
 */
class Animation {
	constructor(scene, span = 0.0) {
		this.scene = scene;
		this.setDuration(span);

		this.firstCall = true;
		this.lastPiece = false;
		this.done = false;
		this.next = null;
		this.position = {x: 0, y: 0, z: 0};
	}

	/**
	 * Set span (duration)
	 * @param {Interger} span 
	 */
	setDuration(span = 0.0) {
		this.span = span;
	}

	/**
	 * Updates the object position
	 */
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

	/**
	 * Apply the calculated transformations according to the current state of the animation
	 */
	apply() {
		this.scene.translate(this.position.x, this.position.y, this.position.z);
		this.scene.rotate(this.angleXZ, 0, 1, 0);
	}

	/**
	 * Calculate transformations being done in the scene
	 */
	calculateTransformation() {
		// Override me!
	}

}
