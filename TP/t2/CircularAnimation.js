/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation {
	constructor(scene, span = 0.0, center = {x: 0, y: 0, z: 0}, radius = 1, startAng = 0, rotAng = 360) {
		super(scene, span);

		this.setCenter(center);
		this.setRadius(radius);
		this.setStartAng(startAng);
		this.setRotAng(rotAng);
		this.setSpeed(rotAng - startAng, span);

		// Initial angle of 180 (Math.PI / 2) given his intial orientation to z+ only if movement is not around himself (radius != 0)
		this.initialAngle = 0;
		if (this.radius != 0) {
			this.initialAngle = Math.PI / 2;
		}
		this.currentAng = 0;
		this.angleXZ = this.startAng * DEGREE_TO_RAD;
	}

	setCenter(center) {
		this.center = center;
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

	setSpeed(rotAng, span = 1) {
		this.speed = rotAng / span;
	}
	
	calculateTransformation() {
		if (!this.lastPiece) {
			this.currentAng += this.speed * (this.currentTime - this.previousTime) / 1000;
		} else {
			this.currentAng = this.rotAng;
			this.lastPiece = false;
		}

		// Never moves in the y axis
		this.position.x = this.center.x + this.radius * Math.sin(this.startAng + this.currentAng * DEGREE_TO_RAD);
		this.position.y = this.center.y;
		this.position.z = this.center.z + this.radius * Math.cos(this.startAng + this.currentAng * DEGREE_TO_RAD);

		this.angleXZ = this.initialAngle + (this.startAng + this.currentAng) * DEGREE_TO_RAD;
	}
}
