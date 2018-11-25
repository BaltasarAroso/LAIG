/**
 * Cylinder2
 * @constructor
 */
class Cylinder2 extends CGFobject {
	constructor(scene, base, top, height, slices = 20, stacks = 20, length_s = 1, length_t = 1) {
		super(scene);

		this.length_s = length_s;
		this.length_t = length_t;
		this.texCoords = [];
        
		this.makeTube(base, top, height, slices, stacks);
		this.initBuffers();
	}
	
	initBuffers() {
		for (let z = 0; z <= this.stacks; z++) {
			for (let i = 0; i <= this.slices; i++) {
				this.texCoords.push(
					(i / this.slices) * this.length_s,
					(z / this.stacks) * this.length_t
				);
			}
		}
	}
    
    makeTube(base, top, height, slices, stacks) {
		var controlpoints = [
            // U = 0
            [ // V = radius 'base'
                [  0.0, -base, 0.0,     1],
                [-base, -base, 0.0, 0.707],
                [-base,   0.0, 0.0,     1],
                [-base,  base, 0.0, 0.707],
                [  0.0,  base, 0.0,     1],
                [ base,  base, 0.0, 0.707],
                [ base,   0.0, 0.0,     1],
                [ base, -base, 0.0, 0.707],
                [  0.0, -base, 0.0,     1]
            ],
            // U = height
            [ // V = radius 'top'
                [  0.0, -top, height,     1],
                [-top,  -top, height, 0.707],
                [-top,   0.0, height,     1],
                [-top,   top, height, 0.707],
                [  0.0,  top, height,     1],
                [ top,   top, height, 0.707],
                [ top,   0.0, height,     1],
                [ top,  -top, height, 0.707],
                [  0.0, -top, height,     1]
            ]
        ]

		var degreeU = controlpoints.length - 1;
		var degreeV = controlpoints[0].length - 1;
        
        var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlpoints);

        this.tube = new CGFnurbsObject(this.scene, stacks, slices, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }

	display() {
        this.scene.pushMatrix();
        
		this.tube.display();

		this.scene.popMatrix();
	}
}
