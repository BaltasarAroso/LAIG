/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, trajectory, duration) {
		super(scene, duration);

		this.trajectory = trajectory;

		console.log(this);
	}
}
