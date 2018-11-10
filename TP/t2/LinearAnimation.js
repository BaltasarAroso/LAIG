/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, duration = 0.0, trajectory = null) {
		super(scene, duration);
		this.setTrajectory(trajectory);
		//TODO: resetAnimation()
	}

	setTrajectory(trajectory = null) {
		if (trajectory) {
			if (trajectory.length < 2) {
				return ('Trajectory invalid length.');
			}
			this.trajectory = trajectory;
			this.position = trajectory[0];
			this.numMoves = trajectory.length;
			this.seqNum = 0;
			this.distance = 0;
			this.speed = 0;
			this.calculateSpeed(trajectory, this.duration);
		} else {
			this.distance = 0;
			return ('Trajectory invalid.');
		}
	}

	calculateDistance(trajectory) {
		let i = 0;
		let previousPoint = {};
		trajectory.forEach(point => {
			if (i === 0) {
				i++;
			} else {
				i++;
				this.distance += this.distance3D(previousPoint, point);
			}
			previousPoint = point;
		});
		return this.duration;
	}

	calculateSpeed(trajectory, duration) {
		this.speed = this.calculateDistance(trajectory) / duration;
	}

	calculateFinalPoint(point1, point2) {
		return {x: point1.x + point2.x, y: point1.y + point2.y, z: point1.z + point2.z};
	}

	smoothPath(point, K) {
		return {x: point.x * K, y: point.y * K, z: point.z * K};
	}

	update(deltaTime) {
		// TODO: verify cycle of updates and establish an end
		var point = calculateFinalPoint(this.position, this.currentPoint);
		var K = this.speed * deltaTime / 1000;
		this.position = this.smoothPath(point, K);
		this.seqNum++;

		if (this.timePassed < this.duration) {
			this.updatePath();
		}
	}

	updatePath() {
		if (this.seqNum < this.numMoves) {
			this.currentPoint = this.trajectory[this.seqNum];
		}
	}

	display() {
		this.scene.translate(this.position.x, this.position.y, this.position.z);
        // TODO: change this.scene.rotate() according to  updateRotateAnimation()
	}
}
