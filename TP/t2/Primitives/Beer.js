/**
 * Beer
 * @constructor
 */
class Beer extends CGFobject {
	constructor(scene, base = 1.5, top = 1.5, height = 5, slices = 20, stacks = 20, length_s = 1, length_t = 1) {
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;

		this.tubeBase = new MyTube(this.scene, base, top, slices, stacks, length_s, length_t);
        this.beerTail = this.beerTail();
		this.beerNeck = this.beerNeck();
        this.torus = new MyTorus(this.scene, 0.5, 1, slices, 30, length_s, length_t);
	}

	/**
     * Draw the beer tail.
     * @returns {Patch} Patch that represents the beer tail.
     */
	beerTail() {
		var nPointsU = 5;
		var nPointsV = 12;
		var k = 0.5;
		var controlPoints = [
			[
				[ 0, 0, -1, 1],
				[-1, 0, -1, 0.707],
				[-1, 0,  0, 1],
				[-1, 0,  1, 0.707],
				[ 0, 0,  1, 1],
				[ 1, 0,  1, 0.707],
				[ 1, 0,  0, 1],
				[ 1, 0, -1, 0.707],
				[ 0, 0, -1, 1]
				
			],
			[
				[ k * 0, 0, k * -1, 1],
				[ k *-1, 0, k * -1, 0.707],
				[ k *-1, 0, k *  0, 1],
				[ k *-1, 0, k *  1, 0.707],
				[ k * 0, 0, k *  1, 1],
				[ k * 1, 0, k *  1, 0.707],
				[ k * 1, 0, k *  0, 1],
				[ k * 1, 0, k * -1, 0.707],
				[ k * 0, 0, k * -1, 1]
				
			]
		];

		// var k = 0.5;
		// var controlPoints = [
		// 	[
		// 		[-Math.cos(-180 * DEGREE_TO_RAD), 0.0, Math.sin(-180 * DEGREE_TO_RAD), 0.5],
		// 		[-Math.cos(-120 * DEGREE_TO_RAD), 0.0, Math.sin(-120 * DEGREE_TO_RAD), 1],
		// 		[-Math.cos(-90 * DEGREE_TO_RAD), 0.0, Math.sin(-90 * DEGREE_TO_RAD), 1],
		// 		[-Math.cos(-60 * DEGREE_TO_RAD), 0.0, Math.sin(-60 * DEGREE_TO_RAD), 1],
		// 		[-Math.cos(-30 * DEGREE_TO_RAD), 0.0, Math.sin(-30 * DEGREE_TO_RAD), 2],
		// 		[-Math.cos(0 * DEGREE_TO_RAD), 0.0, Math.sin(0 * DEGREE_TO_RAD), 10],
		// 		[-Math.cos(30 * DEGREE_TO_RAD), 0.0, Math.sin(30 * DEGREE_TO_RAD), 2],
		// 		[-Math.cos(60 * DEGREE_TO_RAD), 0.0, Math.sin(60 * DEGREE_TO_RAD), 1],
		// 		[-Math.cos(90 * DEGREE_TO_RAD), 0.0, Math.sin(90 * DEGREE_TO_RAD), 1],
		// 		[-Math.cos(120 * DEGREE_TO_RAD), 0.0, Math.sin(120 * DEGREE_TO_RAD), 1],
		// 		[-Math.cos(180 * DEGREE_TO_RAD), 0.0, Math.sin(180 * DEGREE_TO_RAD), 0.5]
		// 	],
		// 	[
		// 		[-k * Math.cos(-180 * DEGREE_TO_RAD), 0.0, k * Math.sin(-180 * DEGREE_TO_RAD), 0.5],
		// 		[-k * Math.cos(-120 * DEGREE_TO_RAD), 0.0, k * Math.sin(-120 * DEGREE_TO_RAD), 1],
		// 		[-k * Math.cos(-90 * DEGREE_TO_RAD), 0.0, k * Math.sin(-90 * DEGREE_TO_RAD), 1],
		// 		[-k * Math.cos(-60 * DEGREE_TO_RAD), 0.0, k * Math.sin(-60 * DEGREE_TO_RAD), 1],
		// 		[-k * Math.cos(-30 * DEGREE_TO_RAD), 0.0, k * Math.sin(-30 * DEGREE_TO_RAD), 2],
		// 		[-k * Math.cos(0 * DEGREE_TO_RAD), 0.0, k * Math.sin(0 * DEGREE_TO_RAD), 10],
		// 		[-k * Math.cos(30 * DEGREE_TO_RAD), 0.0, k * Math.sin(30 * DEGREE_TO_RAD), 2],
		// 		[-k * Math.cos(60 * DEGREE_TO_RAD), 0.0, k * Math.sin(60 * DEGREE_TO_RAD), 1],
		// 		[-k * Math.cos(90 * DEGREE_TO_RAD), 0.0, k * Math.sin(90 * DEGREE_TO_RAD), 1],
		// 		[-k * Math.cos(120 * DEGREE_TO_RAD), 0.0, k * Math.sin(120 * DEGREE_TO_RAD), 1],
		// 		[-k * Math.cos(180 * DEGREE_TO_RAD), 0.0, k * Math.sin(180 * DEGREE_TO_RAD), 0.5]
		// 	]
		// ];

		// var controlPoints = [];
		// var p = 1;
		// var k = 1;
		// var w = 0;
	
		// // U = 0..5
		// for (var i = 0; i <= nPointsU; i++) {
		// 	if (i == 1) {
		// 		w = 0;
		// 	}
		// 	if (i == 2) {
		// 		k = 0.85;
		// 		w = -0.5;
		// 	}
		// 	if (i == 3) {
		// 		k = 0.4;
		// 		w = -0.25;
		// 	}
		// 	if (i == 4) {
		// 		k = 0.2;
		// 		w = 0;
		// 	}
		// 	if (i == 5) {
		// 		k = 0;
		// 		w = -0.1;
		// 	}
		// 	var controlPoint = [];
		// 	// V = 0..360;
		// 	p = 0.01;
		// 	for (var j = 0; j <= nPointsV; j++) {
		// 		// if (j % 2) {
		// 		// 	p = 0.707;
		// 		// } else {
		// 		// 	p = 1;
		// 		// }
		// 		// if (j == 0 || j == nPointsV) {
		// 		// 	p = 0.01;
		// 		// } else if (Math.cos((-180 + (360/nPointsV * j)) * DEGREE_TO_RAD) < 0) {
		// 		// 	p = 20 * (1 + Math.cos((-180 + (360/nPointsV * j)) * DEGREE_TO_RAD));
		// 		// } else {
		// 		// 	p = 20 * (1 + Math.cos((-180 + (360/nPointsV * j)) * DEGREE_TO_RAD));
		// 		// }
		// 		// p = Math.cos((-180 + (360/nPointsV * j)) * DEGREE_TO_RAD)
		// 		// if (j == 0) {
		// 		// 	p = 1;
		// 		// } else if (j <= nPointsV / 2) {
		// 		// 	p = 1 * (360/nPointsV * j);
		// 		// } else if (j < nPointsV){
		// 		// 	p = 1 * (360/nPointsV * (nPointsV - j));
		// 		// } else {
		// 		// 	p = 1;
		// 		// }
		// 		// if (j == nPointsV / 2) {
		// 		// 	p = 700;
		// 		// }
		// 		controlPoint.push([ -k * Math.cos((-180 + (360/nPointsV * j)) * DEGREE_TO_RAD) , 0.0 + w, k * Math.sin((-180 + (360/nPointsV * j)) * DEGREE_TO_RAD), p]);
		// 	}
		// 	controlPoints.push(controlPoint);
		// }
		console.log(controlPoints);

        return new Patch(this.scene, 5, 360, controlPoints.length - 1, controlPoints[0].length - 1, controlPoints);
	}
	
	/**
     * Draw the beer neck.
     * @returns {Patch} Patch that represents the beer neck.
     */
	beerNeck() {
		var nPointsU = 9;
		var nPointsV = 12;

		var controlPoints = [];
		var k = 1;
		var w = 0;
	
		// U = 0..9
		for (var i = 0; i <= nPointsU; i++) {
			if (i == 1) {
				w = 0.2;
			}
			if (i == 2) {
				w = 0.1;
			}
			if (i == 3) {
				k = 0.85;
				w = 0.5;
			}
			if (i == 4) {
				k = 0.7;
				w = 0.25;
			}
			if (i == 5) {
				k = 0.6;
				w = 0;
			}
			if (i == 6) {
				k = 0.5;
				w = 1;
			}
			if (i == 7) {
				k = 0.45;
				w = 1.5;
			}
			if (i == 8) {
				k = 0.4;
				w = 1.75;
			}
			if (i == 9) {
				k = 0.35;
				w = 2;
			}
			var controlPoint = [];
			// V = 0..360;
			for (var j = 0; j <= nPointsV; j++) {
				controlPoint.push([ -k * Math.cos(-180 + (360/nPointsV * j) * DEGREE_TO_RAD) , 0.0 + w, -k * Math.sin(-180 + (360/nPointsV * j) * DEGREE_TO_RAD), 1 ]);
			}
			controlPoints.push(controlPoint);
		}

        return new Patch(this.scene, 9, 360, controlPoints.length - 1, controlPoints[0].length - 1, controlPoints);
	}

	display() {

		//Display beerTail
		this.scene.pushMatrix();
		this.scene.translate(0, 0.5, 0);
		this.scene.scale(this.base, this.base, this.base);
		this.beerTail.display();
		this.scene.popMatrix();

		// Display tube
		this.scene.pushMatrix();
		this.scene.translate(0, 0.5, 0);
		this.scene.scale(1, this.height, 1);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.tubeBase.display();
		this.scene.popMatrix();
		
		//Display beerNeck
		this.scene.pushMatrix();
		this.scene.translate(0, this.height + 0.5, 0);
        this.scene.scale(this.base, this.base, this.base);
        this.beerNeck.display();
		this.scene.popMatrix();
		
		//Display torus
		this.scene.pushMatrix();
		this.scene.translate(0, this.height + 2 * this.base + 0.5, 0);
		this.scene.scale(this.base / 4, this.base / 4, this.base / 4);
		this.scene.rotate(- Math.PI / 2, 1, 0, 0);
        this.torus.display();
        this.scene.popMatrix();
	}
}