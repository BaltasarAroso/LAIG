/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, duration = 0.0, trajectory = null) {
		super(scene, duration);

		this.setTrajectory(trajectory);

		console.log(this);
	}

	setTrajectory(trajectory = null) {
		if(trajectory) {
			this.trajectory = trajectory;
		}
	}
}
