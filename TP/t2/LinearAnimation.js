/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, totalDuration = 0.0, trajectory = null) {
		super(scene, totalDuration);
		this.firstCall = true;
		this.setTrajectory(trajectory);
		//TODO: resetAnimation()
	}

	/**
	 * Set Trajectory
	 * @param {Array} trajectory array of points
	 */
	setTrajectory(trajectory = null) {
		if (trajectory) {
			if (trajectory.length < 2) {
				console.warn('Invalid trajectory length.');
			}
			this.trajectory = trajectory;
			this.position = 0;
			this.numMoves = trajectory.length;
			this.currentPath = [this.trajectory[this.position], this.trajectory[this.position + 1]];
			this.pathSpeed = {x: 0, y: 0, z: 0};
			this.totalDistance = this.calculateDistance(trajectory);
		} else {
			console.warn('Invalid trajectory.');
		}
	}

	/**
	 * Calculates distance between a array of points
	 * @param {Array} path array of points
	 */
	calculateDistance(path) {
		let distance = {x: 0, y: 0, z: 0};
		let previousPoint = path[0];
		let point = {};
		for(let i = 1; i < path.length; i++) {
			point = path[i];
			distance.x = previousPoint.x - point.x;
			distance.y = previousPoint.y - point.y;
			distance.z = previousPoint.z - point.z;
			previousPoint = point;
		}
		return distance;
	}

	/**
	 * Calculates the proporcional time spent in the given path according to the totalDuration and its pathDistance
	 * @param {Array} path array of points
	 */
	calculatePathDurations(path) {
		var pathDistance = this.calculateDistance(path);
		this.pathDuration.x = pathDistance.x * this.totalDuration / this.totalDistance;
		this.pathDuration.y = pathDistance.x * this.totalDuration / this.totalDistance;
		this.pathDuration.z = pathDistance.x * this.totalDuration / this.totalDistance;
		return this.pathDuration;
	}

	/**
	 * Calculates speed of each path
	 * @param {Array} path
	 */
	calculateSpeed(path) {
		var pathDistance = this.calculateDistance(path);
		var pathDuration = this.calculatePathDurations(path);
		this.pathSpeed.x = pathDistance.x / pathDuration.x;
		this.pathSpeed.y = pathDistance.y / pathDuration.y;
		this.pathSpeed.z = pathDistance.z / pathDuration.z;
	}

	/**
	 * Update Path
	 */
	updatePath() {
		if (this.position < this.numMoves) {
			this.calculateSpeed(this.currentPath);
			this.currentPoint = this.currentPath[++this.position];
		}
	}

	/**
	 * Override
	 */
	calculateTransformation() {
		this.updatePath();
		var Kx = this.pathSpeed.x * (this.currentTime - this.previousTime) / 1000;
		var Ky = this.pathSpeed.y * (this.currentTime - this.previousTime) / 1000;
		var Kz = this.pathSpeed.z * (this.currentTime - this.previousTime) / 1000;
		this.position.x = this.path[0].x + Kx * this.path[1];
		this.position.y = this.path[0].y + Ky * this.path[1];
		this.position.z = this.path[0].z + Kz * this.path[1];	
	}

}
