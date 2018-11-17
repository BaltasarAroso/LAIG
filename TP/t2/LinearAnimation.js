/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, span = 0.0, trajectory = null) {
		super(scene, span);
		this.lastPiece = false;
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
			this.totalDistance = this.calculatePathDistance(trajectory);
			
			// Current Point variables
			this.indexPosition = 0;
			this.position = this.trajectory[0];
			this.move = {x: 0, y: 0, z: 0};			

			// Current Path variables
			this.currentPath = [
				this.trajectory[this.indexPosition],
				this.trajectory[++this.indexPosition]
			];
			this.currentPathDuration = this.calculatePathDuration(this.currentPath, this.span, this.totalDistance);
			this.currentPathDistance = this.calculatePathDistance(this.currentPath);

			// Increased variables
			this.actualDuration = this.currentPathDuration;
			this.actualDistance = 0;

			// Current Path variables list with coords
			this.currentCoordPathDistances = this.calculateCoordDistances(this.currentPath);
			this.currentCoordPathSpeeds = this.calculateCoordSpeeds(this.currentCoordPathDistances, this.currentPathDuration);
			
			// Angle
			this.angleXZ = this.calculatePathAngle(this.currentCoordPathDistances);

		} else {
			console.warn('Invalid trajectory.');
		}
	}

	/**
	 * Calculates the three dimensional euclidean distance of an array of points
	 * @param {Array} trajectory array of points
	 */
	calculatePathDistance(trajectory) {
		let distance = 0;
		let previousPoint = trajectory[0];
		let point = {};
		for(let i = 1; i < trajectory.length; i++) {
			point = trajectory[i];
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
	 * Calculates the coordinator (x,y,z) independently distances between an array of two points
	 * @param {Array} path array of two points
	 */
	calculateCoordDistances(currentPath) {
		var pathDistance = {x: 0, y: 0, z: 0};
		
		pathDistance.x = currentPath[1].x - currentPath[0].x;
		pathDistance.y = currentPath[1].y - currentPath[0].y;
		pathDistance.z = currentPath[1].z - currentPath[0].z;

		return pathDistance;
	}

	/**
	 * Calculates speed of each path
	 * @param {Array} path array of two points
	 */
	calculateCoordSpeeds(currentCoordPathDistances, currentPathDuration) {
		var pathSpeed = {x: 0, y: 0, z: 0};

		pathSpeed.x = currentCoordPathDistances.x / currentPathDuration;
		pathSpeed.y = currentCoordPathDistances.y / currentPathDuration;
		pathSpeed.z = currentCoordPathDistances.z / currentPathDuration;

		return pathSpeed;
	}

	/**
	 * Calculates the proporcional time spent in the given path according to the totalDuration and its pathDistance
	 * @param {Array} path array of two points
	 */
	calculatePathDuration(currentPath, span, totalDistance) {
		var pathDuration = 0;
		var totalPathDistance = this.calculatePathDistance(currentPath);

		pathDuration = totalPathDistance * span / totalDistance;
		
		return pathDuration;
	}

	/**
	 * Calculate the rotation angle of the current path
	 * NOTE: default direction in z+ and rotate only around y
	 * @param {List} distance Current Path distance in each coordinate
	 */
	calculatePathAngle(currentCoordPathDistances) {
		return Math.atan2(currentCoordPathDistances.x, currentCoordPathDistances.z);
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
			];
			this.currentPathDuration = this.calculatePathDuration(this.currentPath, this.span, this.totalDistance);
			this.currentPathDistance = this.calculatePathDistance(this.currentPath);

			// Increased variables
			this.actualDuration += this.currentPathDuration;

			// Current Path variables list with coords
			this.currentCoordPathDistances = this.calculateCoordDistances(this.currentPath);
			this.currentCoordPathSpeeds = this.calculateCoordSpeeds(this.currentCoordPathDistances, this.currentPathDuration);
			
			// Angle
			this.angleXZ = this.calculatePathAngle(this.currentCoordPathDistances);
		}
	}

	/**
	 * Override
	 */
	calculateTransformation() {
		
		if(this.timePassed >= this.actualDuration * 1000) {
			this.position = this.currentPath[1];
			this.updatePath();
		}

		if (!this.lastPiece) {
			this.move.x = this.currentCoordPathSpeeds.x * (this.currentTime - this.previousTime) / 1000.0;
			this.move.y = this.currentCoordPathSpeeds.y * (this.currentTime - this.previousTime) / 1000.0;
			this.move.z = this.currentCoordPathSpeeds.z * (this.currentTime - this.previousTime) / 1000.0;
	
			this.actualDistance += Math.sqrt(
				this.move.x * this.move.x + 
				this.move.y * this.move.y + 
				this.move.z * this.move.z
			);
	
			this.position.x += this.currentCoordPathSpeeds.x * (this.currentTime - this.previousTime) / 1000.0;
			this.position.y += this.currentCoordPathSpeeds.y * (this.currentTime - this.previousTime) / 1000.0;
			this.position.z += this.currentCoordPathSpeeds.z * (this.currentTime - this.previousTime) / 1000.0;
		} else {
			this.position = this.trajectory[this.numMoves];
			this.actualDistance = this.totalDistance;
			this.lastPiece = false;
		}
		// console.log(this.position);
	}

}
