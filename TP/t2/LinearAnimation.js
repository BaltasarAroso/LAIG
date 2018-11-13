/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, span = 0.0, trajectory = null) {
		super(scene, span);
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
			this.indexPosition = 0;
			this.numMoves = trajectory.length - 1;
			this.currentPath = [
				this.trajectory[this.indexPosition],
				this.trajectory[this.indexPosition + 1]
			];
			this.pathSpeed = {x: 0, y: 0, z: 0};
			let coordDistances = this.calculateCoordDistances(trajectory);
			this.totalDistance = coordDistances.x + coordDistances.y + coordDistances.z;
		} else {
			console.warn('Invalid trajectory.');
		}
	}

	/**
	 * Calculates distance between an array of points
	 * @param {Array} path array of points
	 */
	calculateCoordDistances(path) {
		let distance = {x: 0, y: 0, z: 0};
		let previousPoint = path[0];
		let point = {};
		for(let i = 1; i < path.length; i++) {
			point = path[i];
			distance.x += Math.abs(previousPoint.x - point.x);
			distance.y += Math.abs(previousPoint.y - point.y);
			distance.z += Math.abs(previousPoint.z - point.z);
			previousPoint = point;
		}
		return distance;
	}

	/**
	 * Calculates the proporcional time spent in the given path according to the totalDuration and its pathDistance
	 * @param {Array} path array of points
	 */
	calculatePathDurations(path) {
		var pathDistance = this.calculateCoordDistances(path);
		var pathDuration = 0;

		let fraccDistance = Math.sqrt(
			pathDistance.x * pathDistance.x +
			pathDistance.y * pathDistance.y +
			pathDistance.z * pathDistance.z
		);

		pathDuration = fraccDistance * this.span / this.totalDistance;
		
		return pathDuration;
	}

	/**
	 * Calculates speed of each path
	 * @param {Array} path
	 */
	calculateSpeed(path) {
		var pathDistance = this.calculateCoordDistances(path);
		var pathDuration = this.calculatePathDurations(path);
		this.pathSpeed.x = pathDistance.x / pathDuration;
		this.pathSpeed.y = pathDistance.y / pathDuration;
		this.pathSpeed.z = pathDistance.z / pathDuration;
	}

	/**
	 * Update Path
	 */
	updatePath() {
		if (this.indexPosition < this.numMoves) {
			this.calculateSpeed(this.currentPath);
			this.currentPath[0] = this.currentPath[1];
			this.currentPath[1] = this.trajectory[++this.indexPosition];
			this.currentPoint = this.currentPath[1];
		}
	}

	/**
	 * Override
	 */
	calculateTransformation() {
		if(this.timePassed < this.calculatePathDurations(this.currentPath) * 1000) {
			this.updatePath();
		}
		var Kx = this.pathSpeed.x * (this.currentTime - this.previousTime) / 1000.0;
		var Ky = this.pathSpeed.y * (this.currentTime - this.previousTime) / 1000.0;
		var Kz = this.pathSpeed.z * (this.currentTime - this.previousTime) / 1000.0;
		this.position.x = this.currentPath[0].x + Kx;
		this.position.y = this.currentPath[0].y + Ky;
		this.position.z = this.currentPath[0].z + Kz;	

		console.log(this.currentPath);
	}

}
