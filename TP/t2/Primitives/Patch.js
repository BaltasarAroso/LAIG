/**
 * Patch
 * @constructor
 */
class Patch extends CGFobject {
	constructor(scene, npartsU = 20, npartsV = 20, degreeU, degreeV, controlvertexes) {
		super(scene);
		
		var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlvertexes);

		this.obj = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}
	
	display() {
		this.obj.display();
	}
}
