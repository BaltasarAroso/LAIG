/**
 * Animation
 * @constructor
 */
class Animation {
	constructor(scene, duration = 0.0) {
		this.scene = scene;

		this.setDuration(duration);
	}

	update() {

	}

	apply() {

	}

	setDuration(duration = 0.0) {
		this.duration = duration;
	}
}
