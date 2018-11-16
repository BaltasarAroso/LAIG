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
			// Trajectory variables
			this.trajectory = trajectory;
			this.numMoves = trajectory.length - 1;
			this.totalDistance = this.calculateDistance(trajectory);
			
			// Current Point variables
			this.indexPosition = 0;
			this.position = this.trajectory[0];			

			// Current Path variables
			this.currentPath = [
				this.trajectory[this.indexPosition],
				this.trajectory[++this.indexPosition]
			];
			this.currentPathDuration = this.calculatePathDurations(this.currentPath);
			this.currentPathSpeed = this.calculateSpeed(this.currentPath);
			this.currentPathRotation = this.calculatePathRotation(this.currentPathSpeed);
			console.log(this.currentPath);

		} else {
			console.warn('Invalid trajectory.');
		}
	}

	/**
	 * Calculates the coordinator (x,y,z) independently distances between an array of points
	 * @param {Array} path array of points
	 */
	calculateCoordDistances(path) {
		let distance = {x: 0, y: 0, z: 0};
		let previousPoint = path[0];
		let point = {};
		for(let i = 1; i < path.length; i++) {
			point = path[i];
			distance.x += point.x - previousPoint.x;
			distance.y += point.y - previousPoint.y;
			distance.z += point.z - previousPoint.z;
			previousPoint = point;
		}
		return distance;
	}

	/**
	 * Calculates the three dimensional euclidean distance of an array of points
	 * @param {Array} path array of points
	 */
	calculateDistance(path) {
		let distance = 0;
		let previousPoint = path[0];
		let point = {};
		for(let i = 1; i < path.length; i++) {
			point = path[i];
			var dx = Math.abs(point.x - previousPoint.x);
 			var dy = Math.abs(point.y - previousPoint.y);
			var dz = Math.abs(point.z - previousPoint.z);
			distance += Math.sqrt(
				dx * dx +
				dy * dy +
				dz * dz
			);
			previousPoint = point;
		}
		return distance;
	}

	/**
	 * Calculates the proporcional time spent in the given path according to the totalDuration and its pathDistance
	 * @param {Array} path array of points
	 */
	calculatePathDurations(path) {
		var pathDuration = 0;
		let pathDistance = this.calculateDistance(path);

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
	 * Calculate the rotation angle of the current path
	 * NOTE: default direction in z+ and rotate only around y
	 * @param {List} distance Current Path distance in each coordinate
	 */
	calculatePathRotation(distance) {
		this.pathAngleXZ = 0;
		this.pathAngleXZ = Math.atan2(distance.x, distance.z);
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
			this.calculatePathRotation(this.calculateCoordDistances(this.currentPath));
			this.currentPathDuration += this.calculatePathDurations(this.currentPath);
		}
	}

	/**
	 * Override
	 */
	calculateTransformation() {
		if(this.timePassed >= this.currentPathDuration * 1000) {
			console.log(this.position);
			this.updatePath();
		}
		this.position.x += this.currentPathSpeed.x * (this.currentTime - this.previousTime) / 1000.0;
		this.position.y += this.currentPathSpeed.y * (this.currentTime - this.previousTime) / 1000.0;
		this.position.z += this.currentPathSpeed.z * (this.currentTime - this.previousTime) / 1000.0;
	}

}
