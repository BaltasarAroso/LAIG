/**
 * CircularAnimation
 * @constructor
 * @param {Object} scene 		Scene where the animation will be applied
 * @param {number} span 			Animation's duration in seconds
 * @param {Object} center 		Animation's initial displacement representing the center of the circular animation
 * @param {number} radius		Animation's radius
 * @param {number} startAng		Animation's start rotation angle in degrees
 * @param {number} rotAng		Animaiton's total rotated angle in its displacement in degrees
 */
class CircularAnimation extends Animation {
	constructor(scene, span = 0.0, center = {x: 0, y: 0, z: 0}, radius = 1, startAng = 0, rotAng = 360) {
		super(scene, span);
		this.setCenter(center);
		this.setRadius(radius);
		this.setStartAng(startAng);
		this.setRotAng(rotAng);

		this.setSpeed(rotAng - startAng, span);
		// (this.radius > 0.1) ? this.initialAngle = Math.PI / 2 : this.initialAngle = 0; // if movement is not around himself initial angle of 180 (z+)
		this.initialAngle = 0;
		this.currentAng = 0;
		this.angleXZ = this.startAng * DEGREE_TO_RAD;
	}

	/**
	 * Set center
	 * @param {Object} center 
	 */
	setCenter(center) {
		this.center = center;
	}

	/**
	 * Set radius
	 * @param {number} radius
	 */
	setRadius(radius = 1) {
		this.radius = radius;
	}

	/**
	 * Set startAng
	 * @param {number} startAng 
	 */
	setStartAng(startAng = 0) {
		this.startAng = startAng;
	}

	/**
	 * Set rotAng
	 * @param {number} rotAng 
	 */
	setRotAng(rotAng = 360) {
		this.rotAng = rotAng;
	}

	/**
	 * Set speed
	 * @param {number} rotAng 
	 * @param {number} span 
	 */
	setSpeed(rotAng, span = 1) {
		this.speed = rotAng / span;
	}
	
	/**
	 * Override
	 */
	calculateTransformation() {
		if (!this.lastPiece) {
			this.currentAng += this.speed * (this.currentTime - this.previousTime) / 1000;
		} else {
			this.currentAng = this.rotAng;
			this.lastPiece = false;
			this.done = true;
		}

		// Never moves in the y axis
		this.position.x = this.center.x + this.radius * Math.sin(this.startAng + this.currentAng * DEGREE_TO_RAD);
		this.position.y = this.center.y;
		this.position.z = this.center.z + this.radius * Math.cos(this.startAng + this.currentAng * DEGREE_TO_RAD);

		this.angleXZ = this.initialAngle + (this.startAng + this.currentAng) * DEGREE_TO_RAD;
	}
}
