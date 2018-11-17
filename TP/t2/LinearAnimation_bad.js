/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(scene, span = 0.0, trajectory = null) {
		super(scene, span);
		this.firstCall = true;
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
			this.actualDistance = 0;
			this.finalDistance = 0;
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
			this.currentPathVersor = this.calculatePathVersor(this.currentPath);
			this.angleXZ = this.calculatePathAngle(this.currentPathSpeed);

			this.pathDistance = this.calculateDistance(this.currentPath);
			// this.finalDistance = this.calculateDistance(this.currentPath);

		} else {
			console.warn('Invalid trajectory.');
		}
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
	 * Calculate the versor of the current path
	 * @param {Array} path array of points
	 */
	calculatePathVersor(path) {
		var distance = {x: 0, y: 0, z: 0};
		var versor = {x: 1, y: 1, z: 1};

		distance.x = path[1].x - path[0].x;
		distance.y = path[1].y - path[0].y;
		distance.z = path[1].z - path[0].z;

		console.log(distance);

		if (distance.x > 0) {
			versor.x *= 1;		
		} else if (distance.x < 0) {
			versor.x *= (-1);
		} else {
			versor.x *= 0;
		}

		if (distance.y > 0) {
			versor.y *= 1;
		} else if (distance.y < 0) {
			versor.y *= (-1);
		} else {
			versor.y *= 0;
		}

		if (distance.z > 0) {
			versor.z *= 1;
		} else if (distance.z < 0) {
			versor.z *= (-1);
		} else {
			versor.z *= 0;
		}

		var aux = [];
		(Math.abs(distance.x) > 0) ? aux.push(Math.abs(distance.x)) : '';
		(Math.abs(distance.y) > 0) ? aux.push(Math.abs(distance.y)) : '';
		(Math.abs(distance.z) > 0) ? aux.push(Math.abs(distance.z)) : '';
		
		var minimum = Math.min(...aux);
		versor.x = distance.x / minimum;
		versor.y = distance.y / minimum;
		versor.z = distance.z / minimum;

		console.log(versor);
		return versor
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
	 * Calculate the rotation angle of the current path
	 * NOTE: default direction in z+ and rotate only around y
	 * @param {List} distance Current Path distance in each coordinate
	 */
	calculatePathAngle() {
		var distance = {x: 0, y: 0, z: 0};
		distance.x = this.currentPath[1].x - this.currentPath[0].x;
		distance.y = this.currentPath[1].y - this.currentPath[0].y;
		distance.z = this.currentPath[1].z - this.currentPath[0].z;

		return Math.atan2(distance.x, distance.z);
	}

	multiplyConstantInList(list, constant) {
		return {x: list.x * constant, y: list.y * constant, z: list.z * constant};
	}

	addLists(list1, list2) {
		return {x: list1.x + list2.x, y: list1.y + list2.y, z: list1.z + list2.z};
	}

	diffLists(list1, list2) {
		return {x: list1.x - list2.x, y: list1.y - list2.y, z: list1.z - list2.z};
	}
	
	compareLists(list1, list2) {
		return (list1.x > list2.x) || (list1.y > list2.y) || (list1.z > list2.z)
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
			// this.currentPathSpeed = this.calculateSpeed(this.currentPath);
			this.currentPathVersor = this.calculatePathVersor(this.currentPath);
			this.angleXZ = this.calculatePathAngle();
			this.currentPathDuration += this.calculatePathDurations(this.currentPath);
			// this.finalDistance += this.calculateDistance(this.currentPath);
			this.pathDistance += this.calculateDistance(this.currentPath);
			this.finalDistance += this.actualDistance;
			this.actualDistance = 0;
		}
	}

	/**
	 * Override
	 */
	calculateTransformation() {
		if(this.timePassed >= this.currentPathDuration * 1000 && this.actualDistance >= this.pathDistance) {
			this.updatePath();
		}
		// point = nextPoint - (finalDistance - actualDistance) * versor
		if (!this.lastPiece) {
			this.actualDistance += (this.totalDistance / this.span) * (this.currentTime - this.previousTime) / 1000.0;
			this.position = this.addLists(this.currentPath[0], this.multiplyConstantInList(this.currentPathVersor, this.actualDistance));
		} else if (this.lastPiece) {
			this.position = this.currentPath[1];
			this.finalDistance = this.totalDistance;
			this.lastPiece = false;
		}
		console.log(this.totalDistance);
		console.log(this.finalDistance);
		console.log(this.actualDistance);
		console.log(this.multiplyConstantInList(this.currentPathVersor, this.actualDistance));
	}

}
