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

	distance3D(point, previousPoint) {
		var dx = previousPoint.x - point.x;
		var dy = previousPoint.y - point.y;
		var dz = previousPoint.z - point.z;
		return (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2)));
	}
}
