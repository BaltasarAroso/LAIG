/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation {
	constructor(scene, duration = 0.0, center = [0, 0, 0], radius = 1, startAng = 0, rotAng = 360) {
		super(scene, duration);

		this.setCenter(center[0], center[1], center[2]);
		this.setRadius(radius);
		this.setStartAng(startAng);
		this.setRotAng(rotAng);
		this.setSpeed(rotAng, duration);
	}

	update() {

	}


	// Setters

	setCenter(x = 0, y = 0, z = 0) {
		this.center = { x: x, y: y, z: z };
	}

	setRadius(radius = 1) {
		this.radius = radius;
	}

	setStartAng(startAng = 0) {
		this.startAng = startAng;
	}

	setRotAng(rotAng = 360) {
		this.rotAng = rotAng;
	}

	setSpeed(rotAng = 360, duration = 1) {
		this.speed = rotAng / duration;
	}
}
