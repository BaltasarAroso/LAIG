/**
 * Patch
 * @constructor
 */
class Patch extends CGFobject {
	constructor(scene, npartsU = 20, npartsV = 20, degreeU, degreeV, controlpoints) {
		super(scene);
		
		var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlpoints);

		this.obj = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}
	
	display() {
		this.scene.pushMatrix();

		this.obj.display();

		this.scene.popMatrix();
	}
}
