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

		console.log(this);
	}

	setCenter(x = 0, y = 0, z = 0) {
<<<<<<< HEAD
		this.center = (x = x, y = y, z = z);
=======
		this.center = { x: x, y: y, z: z };
>>>>>>> 2bde8edf25adfa967879d423508d309b77ab5ff6
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
}
