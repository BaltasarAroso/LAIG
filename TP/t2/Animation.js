/**
 * Animation
 * @constructor
 */
class Animation {
	constructor(scene, duration = 0.0) {
		this.scene = scene;

		this.setDuration(duration);

		console.log(this);
	}

	update() {

	}

	apply() {

	}

	setDuration(duration = 0.0) {
		this.duration = duration;
	}
}
