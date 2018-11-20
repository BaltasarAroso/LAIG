/**
 * Patch
 * @constructor
 */
class Patch extends CGFobject {
	constructor(scene, npartsU, npartsV, npointsU, npointsV, controlpoints) {
		super(scene);
		
		var nurbsSurface = new CGFnurbsSurface(npointsU, npointsV, controlpoints);
		this.obj = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}
	
	display() {
		this.obj.display();
	}
}
