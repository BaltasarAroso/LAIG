/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation {
	constructor(scene, basePoint, radius, initAngle, rotateAngle, duration) {
		super(scene, duration);

		this.basePoint = basePoint;
		this.radius = radius;
		this.initAngle = initAngle;
		this.rotateAngle = rotateAngle;

		console.log(this);
	}
}
