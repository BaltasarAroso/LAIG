/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, span = 0.0, trajectory = null) {
		super(scene, span);
		this.firstCall = true;
		this.position = {x: 0, y: 0, z: 0};
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
			// Initial variables
			this.indexPosition = 0;

			// Trajectory variables
			this.trajectory = trajectory;
			this.numMoves = trajectory.length - 1;
			var coordDistances = this.calculateCoordDistances(trajectory);
			this.totalDistance = coordDistances.x + coordDistances.y + coordDistances.z;

			// Current Path variables
			this.currentPath = [
				this.trajectory[this.indexPosition],
				this.trajectory[++this.indexPosition]
			];
			this.currentPathDuration = this.calculatePathDurations(this.currentPath);
			this.currentPathSpeed = this.calculateSpeed(this.currentPath);

			// Initial variables
			this.position = this.trajectory[0];
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
		var coordsPathDistance = this.calculateCoordDistances(path);
		var pathDuration = 0;
		let pathDistance = Math.sqrt(
			coordsPathDistance.x * coordsPathDistance.x +
			coordsPathDistance.y * coordsPathDistance.y +
			coordsPathDistance.z * coordsPathDistance.z
		);

		pathDuration = pathDistance * this.span / this.totalDistance;
		
		return pathDuration;
	}

	/**
	 * Calculates speed of each path
	 * @param {Array} path array of points
	 */
	calculateSpeed(path) {
		var coordsPathDistance = this.calculateCoordDistances(path);
		var pathDuration = this.calculatePathDurations(path);
		var pathSpeed = {};

		pathSpeed.x = coordsPathDistance.x / pathDuration;
		pathSpeed.y = coordsPathDistance.y / pathDuration;
		pathSpeed.z = coordsPathDistance.z / pathDuration;

		return pathSpeed;
	}

	/**
	 * Update Path
	 */
	updatePath() {
		if (this.indexPosition < this.numMoves) {
			// Update current path variables and indexPosition
			this.currentPath = [
				this.trajectory[this.indexPosition],
				this.trajectory[++this.indexPosition]
			]
			this.currentPathSpeed = this.calculateSpeed(this.currentPath);
			this.currentPathDuration += this.calculatePathDurations(this.currentPath);
		}
	}

	/**
	 * Override
	 */
	calculateTransformation() {
		if(this.timePassed >= this.currentPathDuration * 1000) {
			this.updatePath();
		}
		this.position.x += this.currentPathSpeed.x * (this.currentTime - this.previousTime) / 1000.0;
		this.position.y += this.currentPathSpeed.y * (this.currentTime - this.previousTime) / 1000.0;
		this.position.z += this.currentPathSpeed.z * (this.currentTime - this.previousTime) / 1000.0;
	}

	// resetAnimation() { // Wait 2 seconds
	// 	const sleep = (milliseconds) => {
	// 		return new Promise(resolve => setTimeout(resolve, milliseconds))
	// 	}
	// 	await sleep(2000);
	// 	this.position = this.trajectory[0];
	// }

}
